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

  type Query {
    patients(page: Int!, limit: Int!, search: String): PatientPagination!
    patient(id: ID!): Patient
    medcerts(page: Int!, limit: Int!, search: String): MedcertPagination!
    medcert(id: ID!): Medcert
  }

  type Mutation {
    createPatient(input: PatientInput!): Patient!
    createMedcert(input: MedcertInput!): Medcert!
    updatePatient(id: ID!, input: PatientInput!): Patient!
    deletePatient(id: ID!): Boolean!
  }
`;
