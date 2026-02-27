"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/app/lib/graphql-client";

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

  const [form, setForm] = useState<Patient>({
    fullname: "",
    age: "",
    address: "",
    dateSigned: "",
    diagnosis: "",
    remarks: "FOR FINANCIAL ASSISTANCE / MEDICAL ASSISTANCE",
  });

  // ================= MUTATION =================
  const createMutation = useMutation({
    mutationFn: () =>
      graphqlRequest(
        `
        mutation CreatePatient($input:PatientInput!){
          createPatient(input:$input){
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
        { input: form },
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      router.push("/dashboard");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      fullname:
        e.target.name === "fullname"
          ? e.target.value.toUpperCase()
          : form.fullname,
      age: e.target.name === "age" ? Number(e.target.value) : form.age,
    });
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Patient</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border shadow rounded-xl p-6 space-y-4"
      >
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
          {addressList.length > 0 ? (
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
          ) : (
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 mt-1"
            />
          )}
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
