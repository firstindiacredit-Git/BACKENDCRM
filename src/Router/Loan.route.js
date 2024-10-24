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
  updateBusinessLoan,
  updateHomeLoan,
  updatePersonalLoan,
  updateCarLoan,
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
loanRouter.route("/loan/updatecar").put(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "otherDocumentImage", maxCount: 1 },
  ]),
  updateCarLoan
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
loanRouter.route("/loan/updatepersonal").patch(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "otherDocumentImage", maxCount: 1 },
  ]),
  updatePersonalLoan
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
loanRouter.route("/loan/updatehome").put(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "otherDocumentImage", maxCount: 1 },
  ]),
  updateHomeLoan
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
loanRouter.route("/loan/updatebusiness").put(
  upload.fields([
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panCardImage", maxCount: 1 },
    { name: "otherDocumentImage", maxCount: 1 },
  ]),
  updateBusinessLoan
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
