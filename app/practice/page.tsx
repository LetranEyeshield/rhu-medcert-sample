'use client';

import { useState } from "react";

export default function Practice() {
  const [form, setForm] = useState({
    dateSigned: "",
  });
  

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: value // keep YYYY-MM-DD for input
    });
  };

  // Convert to "February 27, 2026" for display
  const formattedDate = form.dateSigned
    ? new Date(form.dateSigned).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="p-4">
      <input
        name="dateSigned"
        type="date"
        value={form.dateSigned}
        onChange={handleDateChange}
        required
        className="w-full border rounded-lg px-4 py-2 mt-1"
      />

      {/* Display formatted date */}
      <p className="mt-2">Formatted: {formattedDate}</p>
    </div>
  );
}