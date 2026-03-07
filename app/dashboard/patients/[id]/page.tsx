"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/app/lib/graphql-client";
import toast from "react-hot-toast";
import { generatePatientId } from "@/app/lib/generatePatientId";
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

export default function EditPatientPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<Patient>({
    fullname: "",
    age: "",
    address: "",
    dateSigned: "",
    diagnosis: "",
    remarks: "",
  });

  // ================= FETCH SINGLE =================
  const { data, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () =>
      graphqlRequest(
        `
        query Patient($id:ID!){
          patient(id:$id){
            _id
          fullname
          age
          address
          dateSigned
          diagnosis
          remarks
          }
        }
      `,
        { id },
      ),
    enabled: !!id,
  });

  // PREFILL FORM
  useEffect(() => {
    if (data?.patient) {
      setForm({
        fullname: data.patient.fullname,
        age: data.patient.age,
        address: data.patient.address,
        dateSigned: data.patient.dateSigned,
        diagnosis: data.patient.diagnosis,
        remarks: data.patient.remarks,
      });
    }
  }, [data]);

  // ================= UPDATE =================
  const updateMutation = useMutation({
    mutationFn: (input: Patient) =>
      graphqlRequest(
        `
        mutation UpdatePatient($id:ID!, $input:PatientInput!){
          updatePatient(id:$id, input:$input){
            _id
          }
        }
      `,
        { id, input },
      ),

    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["patient"] });
    //   queryClient.invalidateQueries({ queryKey: ["patient", id] });
    //   router.push("/dashboard");
    // },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", id] });

      toast.success("Updated Successfully", {
        duration: 3000,
        style: {
          padding: "4px",
          fontSize: "16px",
        },
      });
      queryClient.setQueryData(["patient", id], (old: any) => ({
        ...old,
        patient: { ...old.patient, ...form },
      }));
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
        "Error updating patient";
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
    updateMutation.mutate({ ...form, dateSigned: formattedDate });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="wrapper min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Header />
        {/* PAGE TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-900 text-center">
            Edit Patient
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Update patient information
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 space-y-6"
        >
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

            {/* REGISTRATION DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Date
              </label>
              <input
                name="dateSigned"
                type="text"
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
              disabled={updateMutation.isPending}
              className="px-5 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? "Saving..." : "Update Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
