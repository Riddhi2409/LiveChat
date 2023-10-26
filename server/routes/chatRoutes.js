const express = require("express");

const router = express.Router();

const {
  accessChat,
  fetchChats,
  createGroupChat,
  groupExit,
  fetchGroups,
  addSelfToGroups,
  deleteChat
} = require("../controller/chatController");

const {protect} = require('../middlewares/authProtect')

router.route("/access").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/createGroup").post(protect, createGroupChat);
router.route("/fetchGroups").get(protect, fetchGroups);
router.route("/groupExit").put(protect, groupExit)
router.route('/addSelfToGroup').put(protect , addSelfToGroups)
router.route('/deleteChat').post(protect,deleteChat)
module.exports = router;

module.exports = router;
