import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "../components/LogoutButton";
import Patient from "../components/Patient";
import Header from "../components/Header";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  

  return (
    <div className="wrapper min-h-screen flex flex-col items-center mx-auto">
      <Header />
      <div className="user-div flex items-center justify-end w-full mb-4 gap-10">
        <h3 className="text-xl font-semibold">
          Welcome, {session?.user?.fullName}
        </h3>
          <LogoutButton />
      </div>
      <Patient />
    
    </div>
  );
}
