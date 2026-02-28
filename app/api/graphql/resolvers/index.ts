import { patientResolvers } from "./patient";
import { medcertResolvers } from "./medcert";

export const resolvers = {
  Query: {
    ...patientResolvers.Query,
  },
  Mutation: {
    ...patientResolvers.Mutation,
    ...medcertResolvers.Mutation,
  },
};