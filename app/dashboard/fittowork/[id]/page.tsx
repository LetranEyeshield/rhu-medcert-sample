"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/app/lib/graphql-client";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Header from "@/app/components/Header";

type Fittowork = {
  patientId: string;
  fullname: string;
  age: string;
  address: string;
  dateSigned: string;
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

  const [form, setForm] = useState<Fittowork>({
    patientId: "",
    fullname: "",
    age: "",
    address: "",
    dateSigned: "",
    remarks: "",
    dateDone: "",
  });

  //for printing stuff
  const ref = useRef(null);

  const handlePrint = useReactToPrint({
    // content: () => ref.current,
    contentRef: ref,
    documentTitle: "Fit To Work - " + form.fullname, // 👈 custom filename
  });

  // ================= FETCH SINGLE =================
  // const { data, isLoading } = useQuery({
  //   queryKey: ["patient", id],
  //   queryFn: () =>
  //     graphqlRequest(
  //       `
  //       query Patient($id:ID!){
  //         patient(id:$id){
  //           _id
  //           patientId
  //         fullname
  //         age
  //         address
  //         dateSigned
  //         diagnosis
  //         remarks
  //         }
  //       }
  //     `,
  //       { id },
  //     ),
  //   enabled: !!id,
  // });
  //
  //
  //==========FETCH WITH MEDCERT========
  const { data, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () =>
      graphqlRequest(
        `
      query Patient($id:ID!){
        patient(id:$id){
          _id
          patientId
          fullname
          age
          address
          dateSigned
          remarks

          fittoworks {
            _id
            dateDone
          }
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
        patientId: data.patient.patientId,
        fullname: data.patient.fullname,
        age: data.patient.age.toString(),
        address: data.patient.address,
        dateSigned: formattedDate,
        remarks: "",
        dateDone: formattedDate,
      });
    }
  }, [data]);

  // ================= MUTATION =================
  const createMutation = useMutation({
    mutationFn: (input: Fittowork) =>
      graphqlRequest(
        `
        mutation CreateMedcert($input:FittoworkInput!){
          createFittowork(input:$input){
            _id
            patientId
            fullname
            age
            address
            dateSigned
            remarks
            dateDone
          }
        }
        `,
        { input },
      ),

    onSuccess: () => {
      (queryClient.invalidateQueries({ queryKey: ["patient", id] }),
        queryClient.invalidateQueries({ queryKey: ["fittoworks"] }),
        // toast.success("New Medcert created Successfully", {
        //   duration: 3000,
        //   style: {
        //     padding: "4px",
        //     fontSize: "16px",
        //   },
        // });
        console.log("New Fit To Work Added"));
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
        "Error creating fit to work certificate";
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
    <div className="wrapper px-6 pb-10">
      <Header />

      <h1 className="text-4xl font-bold text-center mb-10">
        Issue Medical Certificate
      </h1>

      <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* LEFT - HISTORY */}
        <div className="col-span-4">
          <div className="bg-white shadow-md rounded-xl p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-4">
              Fit To Work Certificate History
            </h2>

            {data?.patient?.fittoworks?.length === 0 && (
              <p className="text-gray-500">No history yet</p>
            )}

            <ul className="space-y-2 max-h-[500px] overflow-auto pr-2">
              {data?.patient?.fittoworks?.map((cert: any) => (
                <li
                  key={cert._id}
                  className="flex justify-between items-center border rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                  <span className="font-medium">{cert.dateDone}</span>
                  <span className="text-xs text-gray-500">Issued</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CENTER - CERTIFICATE */}
        <div className="col-span-8">
          <form onSubmit={handleSubmit} className="">
            {/* display none to hide from the medical certificate */}
            <input
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
              className="form-patientId"
            />
            
            <div
              ref={ref}
              className="certificate bg-white shadow-xl rounded-xl p-12"
            >
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
                <span className="font-bold">&nbsp; MR./MRS/MS.______</span>
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
                years &nbsp; old, &nbsp; male/female, &nbsp; married/single, &nbsp; widow/widower, &nbsp;  Filipino
                and &nbsp; a &nbsp; resident &nbsp; of
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
                  Manaoag, Pangasinan was being check-up, seen, examined and
                  treated by
                </p>
              </div>
              <div className="undersigned-div mb-1 flex justify-start items-start w-full">
                <p className="ml-2">the undersigned for the period of ____  &nbsp;</p>
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
                  _____ was &nbsp; assessed &nbsp; diagnosed &nbsp; to &nbsp; be   
                </span>
              </div>

              <p className="font-bold ml-2 mt-4">PHYSICALLY AND MENTALLY FIT.</p>

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
                  placeholder="Enter Remarks Here"
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
              <div className="signature-div flex justify-end items-end">
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
            <div className="flex justify-center gap-4 mt-8">
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
                className="px-6 py-2 rounded-lg bg-black text-white hover:opacity-90"
              >
                Print
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg border hover:bg-gray-100"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
