import express from "express";
import {
  forgotPass,
  resetPassword,
  userLogin,
  allUsers,
  userProfile,
  AgentresetUserPassword,
  fetchUser,
  AgentUsers,
} from "../Controller/user.controller.js";

import {
  agentLogin,
  agentLogout,
  agentSignup,
  // agentProfile,
  userSignup,
  verifyOTP,
  allAgents,
  allAgentsRef,
  agentDetail,
  agentDelete,
  resendOTP,
  agentKYC,
  agentKYCStatus,
} from "../Controller/agent.controller.js";
import { adminLogin } from "../Controller/admin.controller.js";
import {
  adminSignup,
  allAdmins,
  superAdminLogin,
  superAdminSignup,
} from "../Controller/superAdmin.controller.js";
import verifyToken from "../Middlewares/UserAuth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import {
  backendLogin,
  backendLogout,
  backendSignup,
} from "../Controller/backend.controller.js";

const router1 = express.Router();

router1.route("/user/login").post(userLogin);
router1.route("/user/profile").get(fetchUser);
router1.route("/user/forgetpassword").post(forgotPass);
router1.route("/user/resetpassword").post(resetPassword);
router1.route("/user/signup").post(userSignup);
router1.route("/user/verifyOTP").post(verifyOTP);
router1.route("/user/resendOTP").post(resendOTP);
router1.route("/user/profileImage/:id").post(
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  userProfile
);
router1.route("/agent/delete").delete(agentDelete);
router1.route("/agent/login").post(agentLogin);
router1.route("/agent/logout").post(agentLogout);

router1.route("/agent/user").post(AgentUsers);
router1.route("/agent/kycstatus/:id").get(agentKYCStatus);
router1.route("/agent/kyc/:id").post(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "resumeImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "otherImage", maxCount: 1 },
  ]),
  agentKYC
);
router1.route("/agent/signup").post(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
  ]),
  agentSignup
);
router1.route("/agent/allagents").get(allAgents);
router1.route("/agent/userPassReset").post(AgentresetUserPassword);
// router1.route("/agent/:agentId").patch(agentProfile);
router1.route("/agent/allagentsRef").get(allAgentsRef);
router1.route("/agent/agentdetail").get(agentDetail);

router1.route("/backend/login").post(backendLogin);
router1.route("/backend/logout").post(backendLogout);
router1.route("/backend/signup").post(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
  ]),
  backendSignup
);

router1.route("/admin/login").post(adminLogin);

router1.route("/admin/user").get(allUsers);

router1.route("/superadmin/admin").get(allAdmins);
router1.route("/superadmin/user").post(allUsers);
router1.route("/superAdmin/Adminsignup").post(adminSignup);
router1.route("/superadmin/Login").post(superAdminLogin);
router1.route("/superadmin/Signup").post(superAdminSignup);

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
