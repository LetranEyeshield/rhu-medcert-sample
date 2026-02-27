import { connectDB } from "@/app/lib/mongodb";
import Patient from "@/app/models/Patient";


export const patientResolvers = {
  Query: {
    patients: async (_: any, { page, limit, search }: any) => {
      await connectDB();

      const skip = (page - 1) * limit;

      //best of both worlds: use text index for longer searches and regex for short ones to avoid irrelevant results
      const filter = search
  ? search.length < 3
    ? { fullname: { $regex: search, $options: "i" } }
    : { $text: { $search: search } }
  : {};

      const patients = await Patient.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const totalCount = await Patient.countDocuments(filter);

      return {
        patients,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
    },

    patient: async (_: any, { id }: any) => {
      await connectDB();
      return Patient.findById(id);
    },
  },

  Mutation: {
    //old resolver without date parsing
    createPatient: async (_: any, { input }: any) => {
      await connectDB();
      console.log("Check date "+input.dateSigned, typeof input.dateSigned);
      return Patient.create(input);
    },

    updatePatient: async (_: any, { id, input }: any) => {
      await connectDB();
      return Patient.findByIdAndUpdate(id, input, { new: true });
    },

    deletePatient: async (_: any, { id }: any) => {
      await connectDB();
      await Patient.findByIdAndDelete(id);
      return true;
    },
  },
};