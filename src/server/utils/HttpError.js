import httpStatus from "../constants/httpStatus.js";

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = httpStatus[statusCode] || "INTERNAL_SERVER_ERROR";
    this.message = message || "An error occurred";
  }
}

export default HttpError;
