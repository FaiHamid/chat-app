import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "./queriesKey";
import { companiesService } from "../services/companiesService";

export const companiesQuery = queryOptions({
  queryKey: [queryKeys.getAllCompanies],
  queryFn: async () => {
    try {
      const resp = await companiesService.getCompanies();

      console.log(resp);

      return resp;
    } catch (error) {
      console.log("somethig went wrong", error);
      return null;
    }
  },
});
