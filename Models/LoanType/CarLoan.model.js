import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const carLoanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralId: {
      type: String,
      required: true,
    },
    loanType: {
      type: String,
      required: true,
      default: "Car Loan",
    },
    loanId: {
      type: String,
      default: function () {
        const uuid = uuidv4().replace(/-/g, "");
        return `CR-${uuid.slice(0, 8)}`;
      },
    },
    date: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    duration: {
      value: { type: Number, required: true },
      unit: { type: String, required: true, enum: ["months", "years"] },
    },
    aadhaarImage: { type: String, required: true },
    panCardImage: { type: String, required: true },
    otherDocumentImage: { type: String },
    motherName: { type: String, required: true },
    fatherName: { type: String, required: true },
    spouseName: { type: String },
    maritalStatus: { type: String, required: true },
    residenceType: { type: String, required: true },
    currentAddress: { type: String, required: true },
    cityState: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    salary: { type: Number, required: true },
    companyName: { type: String, required: true },
    totalWorkExperience: { type: Number, required: true },
    yearsInPresentJob: { type: Number, required: true },
    officialEmail: { type: String, required: true },
    designation: { type: String, required: true },
    officeAddress: { type: String, required: true },
    officeLandmark: { type: String },
    officeCity: { type: String, required: true },
    officeState: { type: String, required: true },
    officePincode: { type: String, required: true },
    reference1Name: { type: String, required: true },
    reference1Phone: { type: String, required: true },
    reference1Address: { type: String, required: true },
    reference2Name: { type: String },
    reference2Phone: { type: String },
    reference2Address: { type: String },
    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    rejectMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

const CarLoan = mongoose.model("CarLoan", carLoanSchema);

export default CarLoan;
