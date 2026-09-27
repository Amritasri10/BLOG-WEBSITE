/**
 * Generic CRUD factory — generates standard paginated controllers
 * for simple master/lookup models (name + isActive pattern).
 *
 * Usage:
 *   import { createCRUD } from "../../utils/crudFactory.js";
 *   const { getAll, getById, create, update, remove } = createCRUD(Model, "ModelName");
 */

import mongoose from "mongoose";
import { apiResponse } from "./apiResponse.js";
import { asyncHandler } from "./asyncHandler.js";

export const createCRUD = (Model, label = "Record") => {
  // ─── CREATE ────────────────────────────────────────────────────────────────
  const create = asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    return res
      .status(201)
      .json(new apiResponse(201, doc, `${label} created successfully`));
  });

  // ─── GET ALL (paginated + search) ──────────────────────────────────────────
  const getAll = asyncHandler(async (req, res) => {
    const {
      isPagination = "true",
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = "recent",
    } = req.query;

    const match = {};
    if (isActive !== undefined) match.isActive = isActive === "true";

    let pipeline = [{ $match: match }];

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      pipeline.push({ $match: { name: { $regex: regex } } });
    }

    if (sortBy === "recent") {
      pipeline.push({ $sort: { createdAt: -1, _id: -1 } });
    } else if (sortBy === "oldest") {
      pipeline.push({ $sort: { createdAt: 1, _id: 1 } });
    } else {
      pipeline.push({ $sort: { _id: -1 } });
    }

    const totalArr = await Model.aggregate([...pipeline, { $count: "count" }]);
    const total = totalArr[0]?.count || 0;

    if (isPagination === "true") {
      pipeline.push(
        { $skip: (Number(page) - 1) * parseInt(limit) },
        { $limit: parseInt(limit) }
      );
    }

    const docs = await Model.aggregate(pipeline);

    return res.status(200).json(
      new apiResponse(
        200,
        {
          data: docs,
          total,
          totalPages:
            isPagination === "true" ? Math.ceil(total / parseInt(limit)) : 1,
          currentPage: isPagination === "true" ? Number(page) : null,
        },
        `${label}s fetched successfully`
      )
    );
  });

  // ─── GET BY ID ─────────────────────────────────────────────────────────────
  const getById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json(new apiResponse(400, null, `Invalid ${label} ID`));
    }

    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json(new apiResponse(404, null, `${label} not found`));
    }

    return res
      .status(200)
      .json(new apiResponse(200, doc, `${label} fetched successfully`));
  });

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  const update = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json(new apiResponse(400, null, `Invalid ${label} ID`));
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res
        .status(404)
        .json(new apiResponse(404, null, `${label} not found`));
    }

    return res
      .status(200)
      .json(new apiResponse(200, doc, `${label} updated successfully`));
  });

  // ─── DELETE ────────────────────────────────────────────────────────────────
  const remove = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json(new apiResponse(400, null, `Invalid ${label} ID`));
    }

    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json(new apiResponse(404, null, `${label} not found`));
    }

    return res
      .status(200)
      .json(new apiResponse(200, doc, `${label} deleted successfully`));
  });

  return { create, getAll, getById, update, remove };
};
