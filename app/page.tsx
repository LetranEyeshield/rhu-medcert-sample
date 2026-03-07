import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen wrapper bg-gradient-to-br from-yellow-600 via-green-600 to-cyan-500 flex flex-col px-6">
       <Header />

      <div className="mx-auto mt-25 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 max-w-xl w-full text-center text-white">
        
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          RHU MEDCERT SYSTEM
        </h1>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="flex-1 bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Register User
          </Link>

          <Link
            href="/login"
            className="flex-1 bg-indigo-900/70 border border-white/30 py-3 rounded-xl hover:bg-indigo-900 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
