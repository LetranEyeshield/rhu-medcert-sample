import { connectDB } from "@/app/lib/mongodb";
import Patient from "@/app/models/Patient";
import Medcert from "@/app/models/Medcert";
import { generatePatientId } from "@/app/lib/generatePatientId";
import Fittowork from "@/app/models/FitToWork";

export const patientResolvers = {
  Query: {
    patients: async (_: any, { page, limit, search }: any) => {
      await connectDB();

      const skip = (page - 1) * limit;

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

  // ✅ NESTED RESOLVER
  Patient: {
    medcerts: async (parent: any) => {
      await connectDB();

      return await Medcert.find({ patientId: parent.patientId }).sort({
        createdAt: -1,
      });
      // .limit(1);
    },
    fittoworks: async (parent: any) => {
      await connectDB();

      return await Fittowork.find({ patientId: parent.patientId }).sort({
        createdAt: -1,
      });
      // .limit(1);
    },
  },

  Mutation: {
    createPatient: async (_: any, { input }: any) => {
      try {
        await connectDB();

        // const newPatient = await Patient.create(input);
        const patientId = await generatePatientId();

        const newPatient = await Patient.create({
          ...input,
          patientId,
        });

        if (!newPatient) {
          throw new Error("Adding new patient failed");
        }

        return newPatient;
      } catch (error: any) {
        console.error("CREATE PATIENT ERROR:", error);
        throw new Error(error.message || "Server error while adding patient");
      }
    },

    // createPatient: async (_: any, { input }: any) => {
    //   try {
    //     await connectDB();

    //     const newPatient = await Patient.create(input);

    //     if (!newPatient) {
    //       throw new Error("Adding new patient failed");
    //     }

    //     return newPatient;
    //   } catch (error: any) {
    //     console.error("CREATE PATIENT ERROR:", error);
    //     throw new Error(error.message || "Server error while adding patient");
    //   }
    // },

    updatePatient: async (_: any, { id, input }: any) => {
      try {
        await connectDB();

        const updatedPatient = await Patient.findByIdAndUpdate(id, input, {
          new: true,
        });

        if (!updatedPatient) {
          throw new Error("Patient not found");
        }

        return updatedPatient;
      } catch (error: any) {
        console.error("UPDATE PATIENT ERROR:", error);
        throw new Error(error.message || "Server error while updating patient");
      }
    },

    deletePatient: async (_: any, { id }: any) => {
      try {
        await connectDB();

        const deleted = await Patient.findByIdAndDelete(id);

        if (!deleted) {
          throw new Error("Patient not found");
        }

        return true;
      } catch (error: any) {
        console.error("DELETE PATIENT ERROR:", error);
        throw new Error(error.message || "Server error while deleting patient");
      }
    },
  },
};
