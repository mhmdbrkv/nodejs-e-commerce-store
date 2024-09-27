import asyncHandler from "express-async-handler";
import ApiError from "../Utils/apiError.js";
import ApiFeatures from "../Utils/apiFeatures.js";

export const getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOpt) query = query.populate(populateOpt);

    const doc = await query;

    if (!doc)
      next(new ApiError(`No document found with id: ${req.params.id}`, 404));

    res.status(200).json({ status: "success", data: doc });
  });

export const getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    const numOfDocument = await Model.countDocuments();

    // build the query
    const apiFeatures = new ApiFeatures(
      Model.find(req.filterObj || {}),
      req.query
    );
    apiFeatures
      .paginate(numOfDocument)
      .filter()
      .search(modelName)
      .sort()
      .limitFields();

    const { mongooseQuery, paginationResult } = apiFeatures;

    // excute the query
    const docs = await mongooseQuery.lean();

    res.status(200).json({
      status: "success",
      results: docs.length,
      paginationResult,
      data: docs,
    });
  });

export const createOne = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res
      .status(201)
      .json({ status: "success", message: "Created successfully", data: doc });
  });

export const updateOne = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    if (!doc) {
      next(new ApiError(`No document found with id: ${req.params.id}`, 404));
    }
    res
      .status(200)
      .json({ status: "success", message: "Updated successfully", data: doc });
  });

export const deleteOne = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findOneAndDelete({ _id: req.params.id });

    res.status(204).json({ status: "success" });
  });
