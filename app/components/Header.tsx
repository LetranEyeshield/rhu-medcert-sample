"use client";

export default function Header() {
  return (
    <header className="mb-8 flex items-center justify-center gap-6 pt-8">
      
      <img
        src="/images/manaoag.png"
        className="w-16 h-16 md:w-20 md:h-20"
        alt="Manaoag Logo"
      />

      <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-blue-800 text-center">
        MED CERT SYSTEM V.1.0
      </h1>

      <img
        src="/images/new-rhu.png"
        className="w-16 h-16 md:w-20 md:h-20"
        alt="RHU Logo"
      />

    </header>
  );
}