import { fileURLToPath } from "url";
import { Visitor } from "../models/index.js";
import { sendMail } from "../services/mail.js";
import HttpError from "../utils/HttpError.js";
import base from "./base.js";
import fs from "fs";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  getAll: base.getAll(Visitor),
  create: async (req, res, next) => {
    try {
      const { visitor, report, url } = req.body;
      const email = visitor.email;

      let doc;
      const docExisted = await Visitor.findOne({ email });
      const currentTime = new Date();

      if (!docExisted) {
        visitor.checkedUrls = [{ url, count: 1, lastCheck: currentTime }];
        doc = await Visitor.create(visitor);
      } else {
        const checkedUrls = docExisted.checkedUrls || [];

        const urlIndex = checkedUrls.findIndex((e) => e.url === url);
        if (urlIndex !== -1) {
          checkedUrls[urlIndex].count += 1;
          checkedUrls[urlIndex].lastCheck = currentTime;
        } else {
          checkedUrls.push({ url, count: 1, lastCheck: currentTime });
        }
        visitor.checkedUrls = checkedUrls;
        delete visitor.email;
        doc = await Visitor.findOneAndUpdate({ email }, visitor, { new: true });
      }

      const reportMailPath = path.join(__dirname, "..", "templates", "report-mail.html");
      let reportMailTemplate = fs.readFileSync(reportMailPath, "utf-8");
      reportMailTemplate = reportMailTemplate.replace("<website_url>", url);
      const mailInfo = await sendMail(email, `Tapita SEO Report for ${url}`, reportMailTemplate, [report]);

      if (mailInfo?.accepted?.length === 0) {
        const error = new HttpError(400, "Failed to send email. Please try again.");
        return next(error, req, res, next);
      }

      res.status(201).json({
        status: "CREATED",
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  },
  getById: base.getById(Visitor),
  updateById: base.updateById(Visitor),
  deleteById: base.deleteById(Visitor),
};
