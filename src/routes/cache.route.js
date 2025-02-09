const express= require('express');
const { storeCache, getCache, deleteCache } = require('../controllers/cache.controller');
const router=express.Router();

router.route("/").post(storeCache)
router.route("/:key").get(getCache)
router.route("/:key").delete(deleteCache)

module.exports=router