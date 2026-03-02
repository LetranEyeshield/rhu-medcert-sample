"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPatients } from "@/app/lib/queries/patient";
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
    <div className="p-6 max-w-6xl mx-auto">
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

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Age</th>
              <th className="p-4">Address</th>
              <th className="p-4 w-32">Diagnosis</th>
              {/* <th className="p-4">Date Signed</th> */}
              <th className="p-4 w-32">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td className="p-6 text-center" colSpan={4}>
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && patients.length === 0 && (
              <tr>
                <td className="p-6 text-center" colSpan={4}>
                  No patients found
                </td>
              </tr>
            )}

            {patients.map((patient: any) => (
              <tr
                key={patient._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{patient.fullname}</td>
                <td className="p-4">{patient.age}</td>
                <td className="p-4">{patient.address}</td>
                <td className="p-4 w-32">{patient.diagnosis}</td>
                {/* <td className="p-4">{patient.dateSigned}</td> */}
                {/* <td className="p-4">{formatDate(patient.dateSigned)}</td> */}
                {/* <td className="p-4">
  {
  patient.dateSigned
    ? new Date(patient.dateSigned).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "-"}
</td> */}
                <td className="p-4 flex gap-2">
                  {/* <button
                    className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() =>
                      alert("Navigate to edit page later")
                    }
                  >
                    Edit
                  </button> */}

                   <Link
                    href={`/dashboard/medcert/${patient._id}`}
                    className="text-sm px-3 py-1 rounded bg-green-500 text-white"
                  >
                    Issue Med Cert
                  </Link>

                  <Link
                    href={`/dashboard/patients/${patient._id}`}
                    className="text-sm px-3 py-1 rounded bg-blue-500 text-white"
                  >
                    Edit
                  </Link>

                  <button
                    className="text-sm px-3 py-1 rounded bg-red-500 text-white cursor-pointer"
                    onClick={() => handleDelete(patient)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
