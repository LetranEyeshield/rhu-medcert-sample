import { patientResolvers } from "./patient";
import { medcertResolvers } from "./medcert";
import { fittoworkResolvers } from "./fittowork";

export const resolvers = {
  Query: {
    ...patientResolvers.Query,
    ...medcertResolvers.Query,
    ...fittoworkResolvers.Query,
  },
  Mutation: {
    ...patientResolvers.Mutation,
    ...medcertResolvers.Mutation,
    ...fittoworkResolvers.Mutation,
  },
   Patient: {
    ...patientResolvers.Patient,
  },
};
