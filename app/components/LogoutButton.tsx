"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";


export default function LogoutButton() {
    const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
