import { graphqlRequest } from "../graphql-client";


export const fetchPatients = (page:number, search:string) =>
  graphqlRequest(
    `
    query Patients($page:Int!, $limit:Int!, $search:String){
      patients(page:$page, limit:$limit, search:$search){
        patients{
          _id
          fullname
          age
          address
          dateSigned
          diagnosis
          remarks
        }
        totalCount
        totalPages
      }
    }
  `,
    { page, limit: 10, search }
  );