import HttpError from "../utils/HttpError.js";
import QueryGenerator from "../utils/QueryGenerator.js";

// Base get all documents with params
const getAll =
  (
    // Create controller from Model
    Model,
    processResData = (data) => data
  ) =>
  async (req, res, next) => {
    try {
      const { mongoQuery, query } = new QueryGenerator(Model, req.query).find().sort().paginate().limitFields();

      const countQuery = new QueryGenerator(Model, req.query).count().mongoQuery;

      const docs = await mongoQuery;
      const count = await countQuery;

      res.status(200).json({
        status: "OK",
        results: docs.length,
        params: query,
        total: count,
        data: processResData(docs),
      });
    } catch (error) {
      next(error);
    }
  };

// Base create document
const create =
  (
    // Create controller from Model
    Model,
    processResData = (data) => data,
    processReqData = (data) => data
  ) =>
  async (req, res, next) => {
    try {
      const body = processReqData(req.body);

      const doc = await Model.create(body);

      res.status(201).json({
        status: "CREATED",
        data: processResData(doc),
      });
    } catch (error) {
      next(error);
    }
  };

// Base get document by id
const getById =
  (
    // Create controller from Model
    Model,
    processResData = (data) => data
  ) =>
  async (req, res, next) => {
    try {
      const { mongoQuery, query } = new QueryGenerator(Model.findById(req.params.id), req.query).limitFields();

      const doc = await mongoQuery;

      if (!doc) {
        const err = new HttpError(404, "No document found with that ID");
        return next(err, req, res, next);
      }

      res.status(200).json({
        status: "OK",
        params: query,
        data: processResData(doc),
      });
    } catch (error) {
      next(error);
    }
  };

// Base update document by id
const updateById =
  (
    // Create controller from Model
    Model,
    processResData = (data) => data,
    processReqData = (data) => data
  ) =>
  async (req, res, next) => {
    try {
      const body = processReqData(req.body);

      const doc = await Model.findByIdAndUpdate(req.params.id, body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        const err = new HttpError(404, "No document found with that ID");
        return next(err, req, res, next);
      }

      res.status(200).json({
        status: "OK",
        data: processResData(doc),
      });
    } catch (error) {
      next(error);
    }
  };

// Base delete document by id
const deleteById =
  (
    // Create controller from Model
    Model,
    processResData = (data) => data
  ) =>
  async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        const err = new HttpError(404, "No document found with that ID");
        return next(err, req, res, next);
      }

      res.status(200).json({
        status: "OK",
        data: processResData(doc),
      });
    } catch (error) {
      next(error);
    }
  };

export default {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
