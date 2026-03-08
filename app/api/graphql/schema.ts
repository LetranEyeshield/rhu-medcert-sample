export const typeDefs = /* GraphQL */ `
  type Patient {
    _id: ID!
    patientId: String!
    fullname: String!
    age: Int!
    address: String!
    dateSigned: String!
    diagnosis: String!
    remarks: String!
    createdAt: String
    updatedAt: String
    medcerts: [Medcert]
    fittoworks: [Fittowork]
  }

  type Medcert {
    _id: ID!
    patientId: String!
    fullname: String!
    age: String!
    address: String!
    dateSigned: String!
    diagnosis: String!
    remarks: String!
    dateDone: String!
    createdAt: String
    updatedAt: String
  }

  type Fittowork {
    _id: ID!
    patientId: String!
    fullname: String!
    age: String!
    address: String!
    dateSigned: String!
    remarks: String!
    dateDone: String!
    createdAt: String
    updatedAt: String
  }

  type PatientPagination {
    patients: [Patient!]!
    totalCount: Int!
    totalPages: Int!
  }

  type MedcertPagination {
    medcerts: [Medcert!]!
    totalCount: Int!
    totalPages: Int!
  }

  type FittoworkPagination {
    medcerts: [Medcert!]!
    totalCount: Int!
    totalPages: Int!
  }

  input PatientInput {
    fullname: String!
    age: Int!
    address: String!
    dateSigned: String!
    diagnosis: String!
    remarks: String!
  }

  input MedcertInput {
    patientId: String!
    fullname: String!
    age: String!
    address: String!
    dateSigned: String!
    diagnosis: String!
    remarks: String!
    dateDone: String!
  }

  input FittoworkInput {
    patientId: String!
    fullname: String!
    age: String!
    address: String!
    dateSigned: String!
    remarks: String!
    dateDone: String!
  }

  type Query {
    patients(page: Int!, limit: Int!, search: String): PatientPagination!
    patient(id: ID!): Patient
    medcerts(page: Int!, limit: Int!, search: String): MedcertPagination!
    medcert(id: ID!): Medcert
    fittoworks(page: Int!, limit: Int!, search: String): FittoworkPagination!
    fittowork(id: ID!): Fittowork
  }

  type Mutation {
    createPatient(input: PatientInput!): Patient!
    createMedcert(input: MedcertInput!): Medcert!
    createFittowork(input: FittoworkInput!): Fittowork!
    updatePatient(id: ID!, input: PatientInput!): Patient!
    deletePatient(id: ID!): Boolean!
  }
`;
