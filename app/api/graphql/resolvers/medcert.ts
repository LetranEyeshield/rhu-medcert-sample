import { connectDB } from "@/app/lib/mongodb";
import Medcert from "@/app/models/Medcert";
// import { NextResponse } from "next/server";

export const medcertResolvers = {

    Query: {
      medcerts: async (_: any, { page, limit, search }: any) => {
        await connectDB();
  
        const skip = (page - 1) * limit;
  
        //best of both worlds: use text index for longer searches and regex for short ones to avoid irrelevant results
        const filter = search
          ? search.length < 3
            ? { fullname: { $regex: search, $options: "i" } }
            : { $text: { $search: search } }
          : {};
  
        const medcerts = await Medcert.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });
  
        const totalCount = await Medcert.countDocuments(filter);
  
        return {
          medcerts,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        };
      },
  
      medcert: async (_: any, { id }: any) => {
        await connectDB();
        return Medcert.findById(id);
      },
    },
 
  Mutation: {
    createMedcert: async (_: any, { input }: any) => {
      try {
        await connectDB();

        const newMedcert = await Medcert.create(input);

        if (!newMedcert) {
          throw new Error("Creating Med Cert failed");
        }

        return newMedcert;
      } catch (error: any) {
        console.error("CREATING MEDCERT ERROR:", error);
        throw new Error(error.message || "Server error while creating medcert");
      }
    },

  },
};
