import { connectDB } from "@/app/lib/mongodb";
import Medcert from "@/app/models/Medcert";
// import { NextResponse } from "next/server";

export const medcertResolvers = {
 
  Mutation: {
    createMedcert: async (_: any, { input }: any) => {
      try {
        await connectDB();

        const newMedcert = await Medcert.create(input);

        if (!newMedcert) {
          throw new Error("Adding new patient failed");
        }

        return newMedcert;
      } catch (error: any) {
        console.error("CREATING MEDCERT ERROR:", error);
        throw new Error(error.message || "Server error while creating medcert");
      }
    },

  },
};
