"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/app/lib/graphql-client";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

type Medcert = {
  fullname: string;
  age: string;
  address: string;
  dateSigned: string;
  diagnosis: string;
  remarks: string;
  dateDone: string;
};

export default function MedcertPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Preselect today's date in YYYY-MM-DD format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayString = `${yyyy}-${mm}-${dd}`;

  // Convert dateSigned to "February 27, 2026" format
  const formattedDate = new Date(todayString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [form, setForm] = useState<Medcert>({
    fullname: "",
    age: "",
    address: "",
    dateSigned: "",
    diagnosis: "",
    remarks: "",
    dateDone: "",
  });

    //for printing stuff
  const ref = useRef(null);

  const handlePrint = useReactToPrint({
    // content: () => ref.current,
    contentRef: ref,
    documentTitle: "Medical Certificate - "+form.fullname, // 👈 custom filename
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
        age: data.patient.age.toString(),
        address: data.patient.address,
        dateSigned: formattedDate,
        diagnosis: data.patient.diagnosis,
        remarks: data.patient.remarks,
        dateDone: formattedDate,
      });
    }
  }, [data]);


  // ================= MUTATION =================
  const createMutation = useMutation({
    mutationFn: (input: Medcert) =>
      graphqlRequest(
        `
        mutation CreateMedcert($input:MedcertInput!){
          createMedcert(input:$input){
            _id
            fullname
            age
            address
            dateSigned
            diagnosis
            remarks
            dateDone
          }
        }
        `,
        { input },
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medcerts"] });
      toast.success("New Medcert created Successfully", {
        duration: 3000,
        style: {
          padding: "4px",
          fontSize: "16px",
        },
      });
      //router.push("/dashboard");
    },

    // onError: (error: any) => {
    //   console.error(error);
    //   alert(error.message || "Something went wrong");
    // },
    onError: (error: any) => {
      const message =
        error?.response?.errors?.[0]?.message ||
        error.message ||
        "Error creating medcert";
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
          : // : name === "age"
            //   ? Number(value)
            value,
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
    createMutation.mutate({ ...form, dateSigned: formattedDate });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="wrapper">
      <h1 className="text-5xl font-bold mb-6 text-center">
        Issue Medical Certificate
      </h1>

      <form onSubmit={handleSubmit} className="">
        <div ref={ref} className="certificate mx-auto">
          <div className="flex justify-center items-center w-full">
            <img src="/images/manaoag.png" className="w-21 h-21 mr-12" />
            <div className="header-p">
              <p className="text-center">Republic of the Philippines</p>
              <p className="text-center">Province of Pangasinan</p>
              <p className="text-center">Municipality of Manaoag</p>
              <p className="text-center">RURAL HEALTH UNIT</p>
            </div>
            <img src="/images/new-rhu.png" className="w-21 h-21 ml-12" />
          </div>
          <h2 className="h2">MEDICAL CERTIFICATE</h2>
          <hr />
          <hr />
          <p className="to-whom mt-12 ml-2">To whom it may concern:</p>
          {/* FULLNAME */}
          <p className="ml-13 mt-10 mb-3">
            This is to certify that{" "}
            <span className="font-bold">MR./MRS/MS.______</span>
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              required
              className="form-name absolute font-bold w-4/12 underline"
            />
            <span>__________________________________________</span>
          </p>
          {/* AGE */}
          <p className="ml-2 mb-3">
            <input
              name="age"
              type="text"
              value={form.age}
              onChange={handleChange}
              required
              className="age-input underline font-bold"
            />
            years old, male/female, married/single, widow/widower, Filipino and
            a resident of
          </p>

          {/* ADDRESS */}
          <div className="address-div flex ml-2 mb-3">
            <p>Barangay</p>
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              required
              className="address-input ml-2 font-bold underline"
              // style={{
              //   width:
              //     form.address.length <= 3
              //       ? "40px"
              //       : form.address.length <= 5
              //         ? "75px"
              //         : "115px",
              // }}
              // style={{ width: addressInputWidth }}
              style={{
                width: `${Math.min(form.address.length + 5, 15)}ch`,
              }}
            />
            <p className="">
              Manaoag, Pangasinan was being check-up, seen, examined and treated
              by
            </p>
          </div>
          <div className="undersigned-div mb-1 flex justify-start items-start w-full">
            <p className="">the undersigned for the period of ____ </p>
            {/* DATE SIGNED */}
            <input
              name="dateSigned"
              type="text"
              value={form.dateSigned}
              onChange={handleChange}
              required
              className="form-dateSigned underline font-bold"
              style={{
                width: `${Math.min(form.dateSigned.length + 0, 20)}ch`,
              }}
            />
            <span className="date-signed-span">
              {" "}
              _____ and was diagnosed to have suffered from
            </span>
          </div>

          {/* DIAGNOSIS */}
          <div className="relative ml-2">
            <textarea
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              required
              className="form-diagnosis no-scrollbar overflow-auto resize-none w-full font-bold underline"
            />
          </div>

          <p className="mt-10 ml-13">
            This certification is being issued to{" "}
            <span className="font-bold">above mentioned name</span> as per
            request and for whatever legal
          </p>
          <p className="ml-2 mt-3">purpose it may serve.</p>

          {/* REMARKS */}
          <div className="flex ml-2 mt-11">
            <p className="">REMARKS: </p>
            <input
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              required
              className="w-11/12 ml-3 underline"
            />
          </div>
          <div className="done-div ml-2 mt-10 flex">
            <p>Done at Poblacion, Manaoag, Pangasinan on</p>
            <input
              name="dateDone"
              value={form.dateDone}
              onChange={handleChange}
              required
              className="form-date-done ml-2 underline font-bold"
            />
          </div>
          <div className="signature-div flex justify-between">
            <p className="ml-10 mt-25">ILLNESS CERTIFICATE</p>
            <div className="doc-div mt-20 mr-8 text-center">
              <span className="font-bold">_________________________</span>
              <p className="font-bold">Dr. Encarnacion E. Cordova</p>
              <p>Medical Officer III</p>
              <p>Manaoag, Pangasinan</p>
              <p>Lic. No. 0133211</p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-buttons flex justify-center align-center gap-3 pt-2 pt-10 pb-10 border-t border-black">
          {/* <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50"
          >
            {createMutation.isPending ? "Saving..." : "Create"}
          </button> */}
          <button
            type="submit"
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50"
          >
            Print
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
