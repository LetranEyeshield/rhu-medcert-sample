"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/app/lib/graphql-client";
import toast from "react-hot-toast";
import Header from "@/app/components/Header";

type Patient = {
  fullname: string;
  age: number | string;
  address: string;
  dateSigned: string;
  diagnosis: string;
  remarks: string;
};

const addressList: string[] = [
  "BABASIT",
  "BAGUINAY",
  "BARITAO",
  "BISAL",
  "BUCAO",
  "CABANBANAN",
  "CALAOCAN",
  "INAMOTAN",
  "LELEMAAN",
  "LICSI",
  "LIPIT NORTE",
  "LIPIT SUR",
  "MATULONG",
  "MERMER",
  "NALSIAN",
  "ORAAN EAST",
  "ORAAN WEST",
  "PANTAL",
  "PAO",
  "PARIAN",
  "POBLACION",
  "PUGARO",
  "SAN RAMON",
  "SAPANG",
  "STA. INES",
  "TEBUEL",
];

export default function NewPatient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Preselect today's date in YYYY-MM-DD format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayString = `${yyyy}-${mm}-${dd}`;

  const fetchTotalPatients = () =>
    graphqlRequest(
      `
    query {
      patients(page:1, limit:1){
        totalCount
      }
    }
    `,
    );

  const { data } = useQuery({
    queryKey: ["totalPatients"],
    queryFn: fetchTotalPatients,
  });

  const [form, setForm] = useState<Patient>({
    fullname: "",
    age: "",
    address: "",
    dateSigned: todayString,
    diagnosis: "",
    remarks: "FOR FINANCIAL ASSISTANCE / MEDICAL ASSISTANCE",
  });

  // ================= MUTATION =================
  const createMutation = useMutation({
    mutationFn: (input: Patient) =>
      graphqlRequest(
        `
      mutation CreatePatient($input:PatientInput!){
        createPatient(input:$input){
          _id
          patientId
          fullname
          age
          address
          dateSigned
          diagnosis
          remarks
        }
      }
      `,
        { input },
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("New Patient Added Successfully", {
        duration: 3000,
        style: {
          padding: "4px",
          fontSize: "16px",
        },
      });
      router.push("/dashboard");
    },

    // onError: (error: any) => {
    //   console.error(error);
    //   alert(error.message || "Something went wrong");
    // },
    onError: (error: any) => {
      const message =
        error?.response?.errors?.[0]?.message ||
        error.message ||
        "Error creating patient";
      toast.error(message, {
        duration: 3000,
        style: {
          padding: "4px",
          fontSize: "16px",
        },
      });
    },
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "fullname"
          ? value.toUpperCase()
          : name === "age"
            ? Number(value)
            : value,
    }));
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    // Convert dateSigned to "February 27, 2026" format
    const formattedDate = new Date(form.dateSigned).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    // Send mutation
    createMutation.mutate({ ...form, dateSigned: formattedDate });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Header />

        {/* TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Create Patient</h1>
          <p className="text-sm text-gray-500">
            Register a new patient in the system
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 space-y-6"
        >
          {/* PATIENT ID INFO */}
          <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">Patient ID</p>
            <p className="text-cyan-700 font-semibold">
              Auto-generated after creation
            </p>
          </div>

          {/* GRID FORM */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* FULLNAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            </div>

            {/* AGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <select
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              >
                <option value="">Select Address</option>
                {addressList.map((address) => (
                  <option key={address} value={address}>
                    {address}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Date
              </label>
              <input
                name="dateSigned"
                type="date"
                value={form.dateSigned}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* DIAGNOSIS */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <textarea
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              rows={3}
              required
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          {/* REMARKS */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={2}
              className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-5 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
            >
              {createMutation.isPending ? "Saving..." : "Create Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
