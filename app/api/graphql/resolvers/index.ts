import { patientResolvers } from "./patient";
import { medcertResolvers } from "./medcert";

export const resolvers = {
  Query: {
    ...patientResolvers.Query,
    ...medcertResolvers.Query,
  },
  Mutation: {
    ...patientResolvers.Mutation,
    ...medcertResolvers.Mutation,
  },
};
