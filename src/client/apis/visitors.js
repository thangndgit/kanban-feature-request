import { makeApiFetch } from "../utils/api";

const visitorsApi = {
  create: (body) => makeApiFetch("visitors", { method: "post", body }),
};

export default visitorsApi;
