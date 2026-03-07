"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/app/lib/graphql-client";
import toast from "react-hot-toast";


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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Patient</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border shadow rounded-xl p-6 space-y-4"
      >

         {/* PATIENT ID */}
        {/* <div>
          <label className="text-sm text-gray-600">Patient ID</label>
          <input
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div> */}

        {/* FULLNAME */}
        <div>
          <label className="text-sm text-gray-600">Full name</label>
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* AGE */}
        <div>
          <label className="text-sm text-gray-600">Age</label>
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm text-gray-600">Address</label>
          <select
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 mt-1"
          >
            <option value="">Select Address</option>
            {addressList.map((address) => (
              <option key={address} value={address}>
                {address}
              </option>
            ))}
          </select>
        </div>

        {/* DATE SIGNED */}
        <div>
          <label className="text-sm text-gray-600">Date Signed</label>
          <input
            name="dateSigned"
            type="date"
            value={form.dateSigned}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* DIAGNOSIS */}
        <div>
          <label className="text-sm text-gray-600">Diagnosis</label>
          <textarea
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* REMARKS */}
        <div>
          <label className="text-sm text-gray-600">Remarks</label>
          <input
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 mt-1"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50"
          >
            {createMutation.isPending ? "Saving..." : "Create"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
