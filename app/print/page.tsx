// "use client";

// import { useEffect } from "react";

// export default function Print() {
// //   useEffect(() => {
// //     window.print();
// //   }, []);

//   function handlePrint() {
//     window.print();
//   }

//   return (
//     <div className="certificate">
//       {/* HEADER */}
//       <div className="flex items-center gap-4 border-b pb-4">
//         <img src="/logo.png" className="w-16 h-16" />

//         <div>
//           <h1 className="text-xl font-bold">ABC Medical Clinic</h1>
//           <p className="text-sm">Manila, Philippines</p>
//         </div>
//       </div>

//       {/* TITLE */}
//       <h2 className="text-center text-2xl font-bold my-6">
//         MEDICAL CERTIFICATE
//       </h2>

//       {/* BODY */}
//       <div className="space-y-4 text-justify">
//         <p>
//           This is to certify that <strong>Juan Dela Cruz</strong> was examined
//           at our clinic on <strong>March 10, 2026</strong>.
//         </p>

//         <p>
//           The patient was diagnosed with mild fever and was advised to take
//           rest for <strong>3 days</strong>.
//         </p>

//         <p>
//           This certificate is issued upon the request of the patient for
//           whatever legal purpose it may serve.
//         </p>
//       </div>

//       {/* IMAGE (optional) */}
//       <div className="mt-6">
//         <img src="/xray-sample.jpg" className="w-64 border" />
//       </div>

//       {/* SIGNATURE */}
//       <div className="mt-16 flex justify-end">
//         <div className="text-center">
//           <div className="border-t w-56 mb-2"></div>
//           <p className="font-semibold">Dr. Maria Santos</p>
//           <p className="text-sm">Licensed Physician</p>
//         </div>
//       </div>
//       <button className="print-btn" onClick={handlePrint}>Print</button>
//     </div>
//   );
// }


"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function Example() {
  const ref = useRef(null);

  const handlePrint = useReactToPrint({
    // content: () => ref.current,
     contentRef: ref,
  });

  return (
    <div>
      <button onClick={handlePrint}>Print</button>

       <div ref={ref} className="certificate">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b pb-4">
        {/* <img src="/logo.png" className="w-16 h-16" /> */}

        <div>
          <h1 className="text-xl font-bold">ABC Medical Clinic</h1>
          <p className="text-sm">Manila, Philippines</p>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="text-center text-2xl font-bold my-6">
        MEDICAL CERTIFICATE
      </h2>

      {/* BODY */}
      <div className="space-y-4 text-justify">
        <p>
          This is to certify that <strong>Juan Dela Cruz</strong> was examined
          at our clinic on <strong>March 10, 2026</strong>.
        </p>

        <p>
          The patient was diagnosed with mild fever and was advised to take
          rest for <strong>3 days</strong>.
        </p>

        <p>
          This certificate is issued upon the request of the patient for
          whatever legal purpose it may serve.
        </p>
      </div>

      {/* IMAGE (optional) */}
      <div className="mt-6">
        {/* <img src="/xray-sample.jpg" className="w-64 border" /> */}
      </div>

      {/* SIGNATURE */}
      <div className="mt-16 flex justify-end">
        <div className="text-center">
          <div className="border-t w-56 mb-2"></div>
          <p className="font-semibold">Dr. Maria Santos</p>
          <p className="text-sm">Licensed Physician</p>
        </div>
      </div>
      </div>
    </div>
  );
}



