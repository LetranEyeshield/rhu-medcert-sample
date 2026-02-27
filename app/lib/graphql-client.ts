import axios from "axios";

export const graphqlRequest = async (query: string, variables?: any) => {
  const res = await axios.post("/api/graphql", {
    query,
    variables,
  });

  return res.data.data;
};