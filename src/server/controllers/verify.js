import axios from "axios";
import HttpError from "../utils/HttpError.js";

export default {
  verifyCaptcha: async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      throw new HttpError(400, "Token is required");
    }

    try {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SITE_SECRET}&response=${token}`
      );
      const { success } = response.data;

      res.status(200).json({
        status: "OK",
        data: { success },
      });
    } catch (error) {
      next(error);
    }
  },
};
