const Joi = require("joi");
const Cache = require("../models/Cache");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asynchandler.utils");

const maxCacheSize = process.env.MAX_CACHE_SIZE;

const storeCache = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    key: Joi.string().required(),
    value: Joi.string().required(),
  });
  const { error, value:reqJson } = schema.validate(req.body);
  if (error) {
    throw new ApiError(400,error)
  }

  const{key,value}=reqJson;

  const cachesSize = await Cache.countDocuments({});
  if (cachesSize >= Number(maxCacheSize))
    throw new ApiError(
      400,
      "Maximum limit reached,You can store only 10 items"
    );

  const keyExist = await Cache.findOne({ key });
  if (keyExist) throw new ApiError(400, `${key} key already exists`);
  const newCacheEntry = await Cache.create({ key, value });
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newCacheEntry,
        `cache created successfully for key ${key}`
      )
    );
});

const getCache = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const requiredCache = await Cache.findOne({ key });
  if (!requiredCache)
    throw new ApiError(400, `cache not found with key ${key}`);
  return res
    .status(200)
    .json(new ApiResponse(200, requiredCache, "cache found"));
});

const deleteCache = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const requiredCache = await Cache.findOne({ key });
  if (!requiredCache)
    throw new ApiError(400, `cache not found with key ${key}`);
  await Cache.deleteOne({ key });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, `${key} cache deleted successfully`));
});

module.exports = { storeCache, getCache, deleteCache };
