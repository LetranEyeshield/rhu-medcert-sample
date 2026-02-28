export const typeDefs = /* GraphQL */ `
  type Patient {
    _id: ID!
    fullname: String!
    age: Int!
    address: String!
    dateSigned: String!
    diagnosis: String!
    remarks: String!
    createdAt: String
    updatedAt: String
  }

    type Medcert {
    _id: ID!
    fullname: String!
    age: Int!
    address: String!
    dateSigned: String!
    diagnosis: String!
    remarks: String!
    createdAt: String
    updatedAt: String
  }

  type PatientPagination {
    patients: [Patient!]!
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
    fullname: String!
    age: Int!
    address: String!
    dateSigned: String!
    diagnosis: String!
    remarks: String!
  }

  type Query {
    patients(page: Int!, limit: Int!, search: String): PatientPagination!
    patient(id: ID!): Patient
  }

  type Mutation {
    createPatient(input: PatientInput!): Patient!
    createMedcert(input: MedcertInput!): Medcert!
    updatePatient(id: ID!, input: PatientInput!): Patient!
    deletePatient(id: ID!): Boolean!
  }
`;