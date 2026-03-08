import { connectDB } from "@/app/lib/mongodb";
import Fittowork from "@/app/models/FitToWork";
// import { NextResponse } from "next/server";

export const fittoworkResolvers = {

    Query: {
      fittoworks: async (_: any, { page, limit, search }: any) => {
        await connectDB();
  
        const skip = (page - 1) * limit;
  
        //best of both worlds: use text index for longer searches and regex for short ones to avoid irrelevant results
        const filter = search
          ? search.length < 3
            ? { fullname: { $regex: search, $options: "i" } }
            : { $text: { $search: search } }
          : {};
  
        const fittoworks = await Fittowork.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });
  
        const totalCount = await Fittowork.countDocuments(filter);
  
        return {
          fittoworks,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        };
      },
  
      medcert: async (_: any, { id }: any) => {
        await connectDB();
        return Fittowork.findById(id);
      },
    },
 
  Mutation: {
    createFittowork: async (_: any, { input }: any) => {
      try {
        await connectDB();

        const newFittowork = await Fittowork.create(input);

        if (!newFittowork) {
          throw new Error("Creating Fit To Work Cert failed");
        }

        return newFittowork;
      } catch (error: any) {
        console.error("CREATING FIT TO WORK CERT ERROR:", error);
        throw new Error(error.message || "Server error while creating fit to work cert");
      }
    },

  },
};
