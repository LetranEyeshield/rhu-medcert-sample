"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPatients,
  fetchPatientInfoAndMedcertDateSigned,
} from "@/app/lib/queries/patient";
import { graphqlRequest } from "@/app/lib/graphql-client";
import Link from "next/link";
import { useDebounce } from "@/app/hooks/useDebounce";
// import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";

export default function PatientsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // DEBOUNCE SEARCH
  const debouncedSearch = useDebounce(search, 500);

  // ================= FETCH =================
  const { data, isLoading } = useQuery({
    queryKey: ["patients", page, debouncedSearch],
    queryFn: () => fetchPatients(page, debouncedSearch),
    //queryFn: () => fetchPatientInfoAndMedcertDateSigned(page, debouncedSearch),
    // ⭐ CACHE SEARCH RESULTS SEPARATELY
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const patients = data?.patients?.patients ?? [];
  const totalPages = data?.patients?.totalPages ?? 1;

  const handleDelete = (patient: any) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?",
    );
    if (confirmDelete) {
      deleteMutation.mutate(patient._id);
    }
  };

  //==============NEW DELETE MUTATION WITH REST API ==============
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      graphqlRequest(
        `
      mutation DeletePatient($id:ID!){
        deletePatient(id:$id)
      }
      `,
        { id },
      ),

    // ⭐ OPTIMISTIC UPDATE
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["patients", page, search],
      });

      const previous = queryClient.getQueryData<any>([
        "patients",
        page,
        search,
      ]);

      queryClient.setQueryData(["patients", page, search], (old: any) => {
        if (!old) return old;

        return {
          patients: {
            ...old.patients,
            patients: old.patients.patients.filter((p: any) => p._id !== id),
          },
        };
      });

      return { previous };
    },

    // ⭐ ROLLBACK
    onError: (error: any, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["patients", page, search], context.previous);
      }

      const message =
        error?.response?.errors?.[0]?.message ||
        error.message ||
        "Delete failed";

      toast.error(message, {
        duration: 3000,
        style: { padding: "4px", fontSize: "16px" },
      });
    },
    // ⭐ SUCCESS
    onSuccess: () => {
      toast.success("Patient deleted successfully", {
        duration: 3000,
        style: { padding: "4px", fontSize: "16px" },
      });
    },
    // ⭐ SUCCESS + REFRESH
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto wrapper">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>

        <input
          placeholder="Search patient..."
          className="border rounded-lg px-4 py-2 w-full md:w-64"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Link
          href="/dashboard/new-patient"
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Add Patient
        </Link>
      </div>

      {/* CARD */}
      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading && <p>Loading...</p>}

        {!isLoading && patients.length === 0 && (
          <p className="text-gray-500">No patients found</p>
        )}

        {patients.map((patient: any) => (
          <div
            key={patient._id}
            className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition"
          >
            {/* PATIENT ID */}
            <div className="flex justify-between items-start mb-3">
              <p>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                  Patient ID No: {patient.patientId}
                </span>
              </p>
            </div>

            {/* NAME */}
            <h2 className="text-lg font-bold text-blue-900">
              {patient.fullname}
            </h2>

            {/* INFO */}
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <p>
                <span className="font-semibold">Age:</span> {patient.age}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {patient.address}
              </p>
            </div>

            {/* DIAGNOSIS */}
            <p className="mt-3 text-sm text-gray-700 line-clamp-2">
               <span className="font-semibold">Diagnosis:</span> {patient.diagnosis}
            </p>

            {/* ACTIONS */}
            <div className="mt-5 flex gap-2">
              <Link
                href={`/dashboard/medcert/${patient._id}`}
                className="text-sm px-3 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Med Cert
              </Link>

              <Link
                href={`/dashboard/patients/${patient._id}`}
                className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(patient)}
                className="text-sm px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} / {totalPages}
        </span>

        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
