import express from "express";
import {
  getLoanStatus,
  submitCarLoan,
  submitPersonalLoan,
  getLoanList,
  detailLoan,
  approveLoan,
  rejectLoan,
  getLoanHistory,
  getAllLoanList,
  getAllCheckedLoanList,
  getAllPendingLoanList,
  getNotifications,
  submitHomeLoan,
  submitBusinessLoan,
} from "../Controller/loan.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";

const loanRouter = express.Router();

// -------------CAR LOAN-------------------------------

loanRouter.route("/loan/car").post(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "otherDocumentImage", maxCount: 1 },
  ]),
  submitCarLoan
);

//--------------PERSONAL LOAN---------------------------

loanRouter.route("/loan/personal").post(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "otherDocumentImage", maxCount: 1 },
  ]),
  submitPersonalLoan
);

//------------------HOME LOAN-------------------------

loanRouter.route("/loan/home").post(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "otherDocumentImage", maxCount: 1 },
  ]),
  submitHomeLoan
);

//------------------BUSINESS LOAN-------------------------

loanRouter.route("/loan/business").post(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "otherDocumentImage", maxCount: 1 },
  ]),
  submitBusinessLoan
);

//--------------LOAN STATUS---------------------------

loanRouter.route("/loan/status").get(getLoanStatus);
loanRouter.route("/agent/loanlist").get(getLoanList);
loanRouter.route("/admin/allloanlist").get(getAllLoanList);
loanRouter.route("/agent/loanhistory").get(getLoanHistory);
loanRouter.route("/agent/detailloan").get(detailLoan);
loanRouter.route("/agent/getallchecklist").get(getAllCheckedLoanList);
loanRouter.route("/agent/getallpendinglist").get(getAllPendingLoanList);
loanRouter.route("/notifications").get(getNotifications);

// -----------LOAN APPROVE/REJECT---------------------
loanRouter.route("/agent/approveloan").put(approveLoan);
loanRouter.route("/agent/rejectloan").put(rejectLoan);

export default loanRouter;
