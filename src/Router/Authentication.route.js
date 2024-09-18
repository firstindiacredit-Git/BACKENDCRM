import express from "express";
import {
  forgotPass,
  resetPassword,
  userLogin,
} from "../Controller/user.controller.js";
import {
  agentLogin,
  agentLogout,
  agentSignup,
  userSignup,
  verifyOTP,
  allAgents,
  allAgentsRef,
  agentDetail,
  agentDelete,
  resendOTP,
} from "../Controller/agent.controller.js";
import { adminLogin, adminSignup } from "../Controller/admin.controller.js";
import verifyToken from "../Middlewares/UserAuth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
const router1 = express.Router();

router1.route("/user/login").post(userLogin);
router1.route("/user/forgetpassword").post(forgotPass);
router1.route("/user/resetpassword").post(resetPassword);
router1.route("/user/signup").post(userSignup);
router1.route("/user/verifyOTP").post(verifyOTP);
router1.route("/user/resendOTP").post(resendOTP);
router1.route("/agent/delete").delete(agentDelete);
router1.route("/agent/login").post(agentLogin);
router1.route("/agent/logout").post(agentLogout);
router1.route("/agent/signup").post(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
  ]),
  agentSignup
);
router1.route("/agent/allagents").get(allAgents);
router1.route("/agent/allagentsRef").get(allAgentsRef);
router1.route("/agent/agentdetail").get(agentDetail);
router1.route("/admin/signup").post(adminSignup);
router1.route("/admin/login").post(adminLogin);

router1.get("/user/dashboard", verifyToken, (req, res) => {
  res.json(req.user);
});
router1.get("/agent/dashboard", verifyToken, (req, res) => {
  res.json(req.user);
});
router1.get("/admin/dashboard", verifyToken, (req, res) => {
  res.json(req.user);
});

export default router1;
