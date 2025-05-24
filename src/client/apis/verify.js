import { makeApiFetch } from "../utils/api";

const verifyApi = {
  verifyCaptcha: (token) => makeApiFetch("verify/captcha", { method: "post", body: { token } }),
};

export default verifyApi;
