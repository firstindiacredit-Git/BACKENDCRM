import CarLoan from "../Models/LoanType/CarLoan.model.js";
import HomeLoan from "../Models/LoanType/HomeLoan.model.js";
import PersonalLoan from "../Models/LoanType/PersonalLoan.model.js";
import User from "../Models/UserData/User.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import Agent from "../Models/EmployeeData/Employee.model.js";
import BusinessLoan from "../Models/LoanType/BusinessLoan.model.js";
import nodemailer from "nodemailer";

const agentExists = async (referralId) => {
  const agent = await Agent.findOne({ referralId });
  return !!agent;
};
// ---------------------SUBMIT LOAN-----------------------------
export const submitCarLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      amount,
      duration,
      referralId,
      phone,
      motherName,
      fatherName,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      city,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    } = req.body;

    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const otherDocumentImage = req.files?.otherDocumentImage?.[0];

    if (!aadhaarImage) {
      console.log("Adhaar files not found");
      throw new Error("Adhaar files not found");
    }
    if (!panCardImage) {
      console.log("panCardImage files not found");
      throw new Error("panCardImage files not found");
    }
    if (!otherDocumentImage) {
      console.log("otherDocumentImage files not found");
      throw new Error("otherDocumentImage files not found");
    }

    if (!(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    console.log("Uploading Aadhaar image...");
    const uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
    console.log("Aadhaar image uploaded:", uploadedAadhaar.url);

    console.log("Uploading Pan Card image...");
    const uploadedPanCard = await uploadOnCloudinary(panCardImage);
    console.log("Pan Card image uploaded:", uploadedPanCard.url);

    console.log("Uploading Other Document image...");
    const uploadedOtherDocument = await uploadOnCloudinary(otherDocumentImage);
    console.log("Other Document image uploaded:", uploadedOtherDocument.url);

    const user = await User.findById(userId);

    console.log("Creating car loan record in the database...");
    const carLoan = await CarLoan.create({
      name,
      email,
      phone,
      userId,
      referralId,
      loanType: "Car Loan",
      amount,
      duration,
      aadhaarImage: uploadedAadhaar.url,
      panCardImage: uploadedPanCard.url,
      otherDocumentImage: uploadedOtherDocument.url || "",
      motherName,
      fatherName,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      city,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    });
    console.log("Car loan record created successfully.");

    res.status(200).json({
      message: "Car loan application submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting car loan:", error.message);
    res.status(500).json({
      message: "Error uploading data",
      error: error.message,
    });
  }
};
export const submitPersonalLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      amount,
      duration,
      referralId,
      phone,
      motherName,
      fatherName,
      city,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    } = req.body;

    let parsedDuration;
    if (typeof duration === "string") {
      try {
        parsedDuration = JSON.parse(duration);
      } catch (e) {
        console.error("Error parsing duration:", e);
        return res.status(400).json({
          message: "Invalid duration format",
          error: e.message,
        });
      }
    } else if (typeof duration === "object") {
      parsedDuration = duration;
    } else {
      return res.status(400).json({
        message: "Invalid duration format",
      });
    }

    if (!parsedDuration || !parsedDuration.value || !parsedDuration.unit) {
      return res.status(400).json({
        message: "Duration must include both value and unit",
      });
    }

    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const otherDocumentImage = req.files?.otherDocumentImage?.[0];

    if (!aadhaarImage) {
      console.log("Adhaar files not found");
      throw new Error("Adhaar files not found");
    }
    if (!panCardImage) {
      console.log("panCardImage files not found");
      throw new Error("panCardImage files not found");
    }
    if (!otherDocumentImage) {
      console.log("otherDocumentImage files not found");
      throw new Error("otherDocumentImage files not found");
    }

    if (!(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    console.log("Uploading Aadhaar image...");
    const uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
    console.log("Aadhaar image uploaded:", uploadedAadhaar.url);

    console.log("Uploading Pan Card image...");
    const uploadedPanCard = await uploadOnCloudinary(panCardImage);
    console.log("Pan Card image uploaded:", uploadedPanCard.url);

    console.log("Uploading Other Document image...");
    const uploadedOtherDocument = await uploadOnCloudinary(otherDocumentImage);
    console.log("Other Document image uploaded:", uploadedOtherDocument.url);

    const user = await User.findById(userId);

    console.log("Creating car loan record in the database...");
    const personalLoan = await PersonalLoan.create({
      name,
      email,
      phone,
      userId,
      referralId,
      loanType: "Personal Loan",
      amount,
      duration: {
        value: parseInt(parsedDuration.value),
        unit: parsedDuration.unit,
      },
      aadhaarImage: uploadedAadhaar.url,
      panCardImage: uploadedPanCard.url,
      otherDocumentImage: uploadedOtherDocument.url || "",
      motherName,
      fatherName,
      city,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    });
    console.log("Personal loan record created successfully.");

    res.status(200).json({
      message: "Personal loan application submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting personal loan:", error.message);
    res.status(500).json({
      message: "Error uploading data",
      error: error.message,
    });
  }
};
export const submitHomeLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      amount,
      duration,
      referralId,
      phone,
      motherName,
      fatherName,
      spouseName,
      maritalStatus,
      residenceType,
      city,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    } = req.body;

    let parsedDuration;
    if (typeof duration === "string") {
      try {
        parsedDuration = JSON.parse(duration);
      } catch (e) {
        console.error("Error parsing duration:", e);
        return res.status(400).json({
          message: "Invalid duration format",
          error: e.message,
        });
      }
    } else if (typeof duration === "object") {
      parsedDuration = duration;
    } else {
      return res.status(400).json({
        message: "Invalid duration format",
      });
    }

    if (!parsedDuration || !parsedDuration.value || !parsedDuration.unit) {
      return res.status(400).json({
        message: "Duration must include both value and unit",
      });
    }

    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const otherDocumentImage = req.files?.otherDocumentImage?.[0];

    if (!aadhaarImage) {
      console.log("Adhaar files not found");
      throw new Error("Adhaar files not found");
    }
    if (!panCardImage) {
      console.log("panCardImage files not found");
      throw new Error("panCardImage files not found");
    }
    if (!otherDocumentImage) {
      console.log("otherDocumentImage files not found");
      throw new Error("otherDocumentImage files not found");
    }

    if (!(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    console.log("Uploading Aadhaar image...");
    const uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
    console.log("Aadhaar image uploaded:", uploadedAadhaar.url);

    console.log("Uploading Pan Card image...");
    const uploadedPanCard = await uploadOnCloudinary(panCardImage);
    console.log("Pan Card image uploaded:", uploadedPanCard.url);

    console.log("Uploading Other Document image...");
    const uploadedOtherDocument = await uploadOnCloudinary(otherDocumentImage);
    console.log("Other Document image uploaded:", uploadedOtherDocument.url);

    const user = await User.findById(userId);

    console.log("Creating Home loan record in the database...");
    const homeLoan = await HomeLoan.create({
      name,
      email,
      phone,
      userId,
      referralId,
      loanType: "Home Loan",
      amount,
      duration: {
        value: parseInt(parsedDuration.value),
        unit: parsedDuration.unit,
      },
      aadhaarImage: uploadedAadhaar.url,
      panCardImage: uploadedPanCard.url,
      otherDocumentImage: uploadedOtherDocument.url || "",
      motherName,
      fatherName,
      spouseName,
      city,
      maritalStatus,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    });
    console.log("Home loan record created successfully.");

    res.status(200).json({
      message: "Home loan application submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting Home loan:", error.message);
    res.status(500).json({
      message: "Error uploading data",
      error: error.message,
    });
  }
};
export const submitBusinessLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      amount,
      duration,
      referralId,
      phone,
      motherName,
      fatherName,
      city,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    } = req.body;

    let parsedDuration;
    if (typeof duration === "string") {
      try {
        parsedDuration = JSON.parse(duration);
      } catch (e) {
        console.error("Error parsing duration:", e);
        return res.status(400).json({
          message: "Invalid duration format",
          error: e.message,
        });
      }
    } else if (typeof duration === "object") {
      parsedDuration = duration;
    } else {
      return res.status(400).json({
        message: "Invalid duration format",
      });
    }

    if (!parsedDuration || !parsedDuration.value || !parsedDuration.unit) {
      return res.status(400).json({
        message: "Duration must include both value and unit",
      });
    }

    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const otherDocumentImage = req.files?.otherDocumentImage?.[0];

    if (!aadhaarImage) {
      console.log("Adhaar files not found");
      throw new Error("Adhaar files not found");
    }
    if (!panCardImage) {
      console.log("panCardImage files not found");
      throw new Error("panCardImage files not found");
    }
    if (!otherDocumentImage) {
      console.log("otherDocumentImage files not found");
      throw new Error("otherDocumentImage files not found");
    }

    if (!(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    console.log("Uploading Aadhaar image...");
    const uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
    console.log("Aadhaar image uploaded:", uploadedAadhaar.url);

    console.log("Uploading Pan Card image...");
    const uploadedPanCard = await uploadOnCloudinary(panCardImage);
    console.log("Pan Card image uploaded:", uploadedPanCard.url);

    console.log("Uploading Other Document image...");
    const uploadedOtherDocument = await uploadOnCloudinary(otherDocumentImage);
    console.log("Other Document image uploaded:", uploadedOtherDocument.url);

    const user = await User.findById(userId);

    console.log("Creating Home loan record in the database...");
    const businessLoan = await BusinessLoan.create({
      name,
      email,
      phone,
      userId,
      referralId,
      loanType: "Business Loan",
      amount,
      duration: {
        value: parseInt(parsedDuration.value),
        unit: parsedDuration.unit,
      },
      aadhaarImage: uploadedAadhaar.url,
      panCardImage: uploadedPanCard.url,
      otherDocumentImage: uploadedOtherDocument.url || "",
      motherName,
      fatherName,
      spouseName,
      maritalStatus,
      city,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    });
    console.log("Business loan record created successfully.");

    res.status(200).json({
      message: "Business loan application submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting Business loan:", error.message);
    res.status(500).json({
      message: "Error uploading data",
      error: error.message,
    });
  }
};

// ------------------------------UPDATE LOAN-----------------------------

export const updatePersonalLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      amount,
      duration,
      referralId,
      phone,
      motherName,
      fatherName,
      city,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    } = req.body;

    // Handle duration parsing if present
    let parsedDuration;
    if (duration) {
      if (typeof duration === "string") {
        try {
          parsedDuration = JSON.parse(duration);
        } catch (e) {
          console.error("Error parsing duration:", e);
          return res.status(400).json({
            message: "Invalid duration format",
            error: e.message,
          });
        }
      } else if (typeof duration === "object") {
        parsedDuration = duration;
      }
    }

    if (parsedDuration && (!parsedDuration.value || !parsedDuration.unit)) {
      return res.status(400).json({
        message: "Duration must include both value and unit",
      });
    }

    // Handle file uploads (Aadhaar, PAN, Other Documents)
    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const otherDocumentImage = req.files?.otherDocumentImage?.[0];

    let uploadedAadhaar, uploadedPanCard, uploadedOtherDocument;

    if (aadhaarImage) {
      uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
      console.log("Aadhaar image uploaded:", uploadedAadhaar.url);
    }

    if (panCardImage) {
      uploadedPanCard = await uploadOnCloudinary(panCardImage);
      console.log("Pan Card image uploaded:", uploadedPanCard.url);
    }

    if (otherDocumentImage) {
      uploadedOtherDocument = await uploadOnCloudinary(otherDocumentImage);
      console.log("Other Document image uploaded:", uploadedOtherDocument.url);
    }

    // Check if referral ID exists
    if (referralId && !(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    // Find and update the personal loan record with fields that are present
    const personalLoan = await PersonalLoan.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(referralId && { referralId }),
        ...(amount && { amount }),
        ...(parsedDuration && { duration: parsedDuration }),
        ...(uploadedAadhaar && { aadhaarImage: uploadedAadhaar?.url }),
        ...(uploadedPanCard && { panCardImage: uploadedPanCard?.url }),
        ...(uploadedOtherDocument && {
          otherDocumentImage: uploadedOtherDocument?.url,
        }),
        ...(motherName && { motherName }),
        ...(fatherName && { fatherName }),
        ...(city && { city }),
        ...(spouseName && { spouseName }),
        ...(maritalStatus && { maritalStatus }),
        ...(residenceType && { residenceType }),
        ...(currentAddress && { currentAddress }),
        ...(cityState && { cityState }),
        ...(pincode && { pincode }),
        ...(salary && { salary }),
        ...(companyName && { companyName }),
        ...(totalWorkExperience && { totalWorkExperience }),
        ...(yearsInPresentJob && { yearsInPresentJob }),
        ...(officialEmail && { officialEmail }),
        ...(designation && { designation }),
        ...(officeAddress && { officeAddress }),
        ...(officeLandmark && { officeLandmark }),
        ...(officeCity && { officeCity }),
        ...(officeState && { officeState }),
        ...(officePincode && { officePincode }),
        ...(reference1Name && { reference1Name }),
        ...(reference1Phone && { reference1Phone }),
        ...(reference1Address && { reference1Address }),
        ...(reference2Name && { reference2Name }),
        ...(reference2Phone && { reference2Phone }),
        ...(reference2Address && { reference2Address }),
      },
      { new: true }
    );

    if (!personalLoan) {
      return res.status(404).json({
        message: "Personal loan not found",
      });
    }

    console.log("Personal loan record updated successfully.");

    res.status(200).json({
      message: "Personal loan application updated successfully",
      personalLoan,
    });
  } catch (error) {
    console.error("Error updating personal loan:", error.message);
    res.status(500).json({
      message: "Error updating data",
      error: error.message,
    });
  }
};

export const updateCarLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      amount,
      duration,
      referralId,
      phone,
      motherName,
      fatherName,
      city,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    } = req.body;

    // Handle duration parsing if it's present
    let parsedDuration;
    if (duration) {
      if (typeof duration === "string") {
        try {
          parsedDuration = JSON.parse(duration);
        } catch (e) {
          console.error("Error parsing duration:", e);
          return res.status(400).json({
            message: "Invalid duration format",
            error: e.message,
          });
        }
      } else if (typeof duration === "object") {
        parsedDuration = duration;
      }
    }

    if (parsedDuration && (!parsedDuration.value || !parsedDuration.unit)) {
      return res.status(400).json({
        message: "Duration must include both value and unit",
      });
    }

    // Handle optional file uploads (Aadhaar, PAN, Other Documents)
    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const otherDocumentImage = req.files?.otherDocumentImage?.[0];

    let uploadedAadhaar, uploadedPanCard, uploadedOtherDocument;

    if (aadhaarImage) {
      console.log("Uploading Aadhaar image...");
      uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
      console.log("Aadhaar image uploaded:", uploadedAadhaar.url);
    }

    if (panCardImage) {
      console.log("Uploading Pan Card image...");
      uploadedPanCard = await uploadOnCloudinary(panCardImage);
      console.log("Pan Card image uploaded:", uploadedPanCard.url);
    }

    if (otherDocumentImage) {
      console.log("Uploading Other Document image...");
      uploadedOtherDocument = await uploadOnCloudinary(otherDocumentImage);
      console.log("Other Document image uploaded:", uploadedOtherDocument.url);
    }

    // Check if referral ID exists
    if (referralId && !(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    // Find the user and update the loan record only with fields that are present
    const carLoan = await CarLoan.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(referralId && { referralId }),
        ...(amount && { amount }),
        ...(parsedDuration && { duration: parsedDuration }),
        ...(aadhaarImage && { aadhaarImage: uploadedAadhaar?.url }),
        ...(panCardImage && { panCardImage: uploadedPanCard?.url }),
        ...(otherDocumentImage && {
          otherDocumentImage: uploadedOtherDocument?.url,
        }),
        ...(motherName && { motherName }),
        ...(fatherName && { fatherName }),
        ...(city && { city }),
        ...(spouseName && { spouseName }),
        ...(maritalStatus && { maritalStatus }),
        ...(residenceType && { residenceType }),
        ...(currentAddress && { currentAddress }),
        ...(cityState && { cityState }),
        ...(pincode && { pincode }),
        ...(salary && { salary }),
        ...(companyName && { companyName }),
        ...(totalWorkExperience && { totalWorkExperience }),
        ...(yearsInPresentJob && { yearsInPresentJob }),
        ...(officialEmail && { officialEmail }),
        ...(designation && { designation }),
        ...(officeAddress && { officeAddress }),
        ...(officeLandmark && { officeLandmark }),
        ...(officeCity && { officeCity }),
        ...(officeState && { officeState }),
        ...(officePincode && { officePincode }),
        ...(reference1Name && { reference1Name }),
        ...(reference1Phone && { reference1Phone }),
        ...(reference1Address && { reference1Address }),
        ...(reference2Name && { reference2Name }),
        ...(reference2Phone && { reference2Phone }),
        ...(reference2Address && { reference2Address }),
      },
      { new: true }
    );

    console.log("Car loan record updated successfully.");

    res.status(200).json({
      message: "Car loan application updated successfully",
      carLoan,
    });
  } catch (error) {
    console.error("Error updating Car loan:", error.message);
    res.status(500).json({
      message: "Error updating data",
      error: error.message,
    });
  }
};

export const updateHomeLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      amount,
      duration,
      referralId,
      phone,
      motherName,
      fatherName,
      city,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeCity,
      officeState,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    } = req.body;

    // Handle duration parsing if it's present
    let parsedDuration;
    if (duration) {
      if (typeof duration === "string") {
        try {
          parsedDuration = JSON.parse(duration);
        } catch (e) {
          console.error("Error parsing duration:", e);
          return res.status(400).json({
            message: "Invalid duration format",
            error: e.message,
          });
        }
      } else if (typeof duration === "object") {
        parsedDuration = duration;
      }
    }

    if (parsedDuration && (!parsedDuration.value || !parsedDuration.unit)) {
      return res.status(400).json({
        message: "Duration must include both value and unit",
      });
    }

    // Handle optional file uploads (Aadhaar, PAN, Other Documents)
    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const otherDocumentImage = req.files?.otherDocumentImage?.[0];

    let uploadedAadhaar, uploadedPanCard, uploadedOtherDocument;

    if (aadhaarImage) {
      console.log("Uploading Aadhaar image...");
      uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
      console.log("Aadhaar image uploaded:", uploadedAadhaar.url);
    }

    if (panCardImage) {
      console.log("Uploading Pan Card image...");
      uploadedPanCard = await uploadOnCloudinary(panCardImage);
      console.log("Pan Card image uploaded:", uploadedPanCard.url);
    }

    if (otherDocumentImage) {
      console.log("Uploading Other Document image...");
      uploadedOtherDocument = await uploadOnCloudinary(otherDocumentImage);
      console.log("Other Document image uploaded:", uploadedOtherDocument.url);
    }

    // Check if referral ID exists
    if (referralId && !(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    // Find the user and update the loan record only with fields that are present
    const homeLoan = await HomeLoan.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(referralId && { referralId }),
        ...(amount && { amount }),
        ...(parsedDuration && { duration: parsedDuration }),
        ...(aadhaarImage && { aadhaarImage: uploadedAadhaar?.url }),
        ...(panCardImage && { panCardImage: uploadedPanCard?.url }),
        ...(otherDocumentImage && {
          otherDocumentImage: uploadedOtherDocument?.url,
        }),
        ...(motherName && { motherName }),
        ...(fatherName && { fatherName }),
        ...(city && { city }),
        ...(spouseName && { spouseName }),
        ...(maritalStatus && { maritalStatus }),
        ...(residenceType && { residenceType }),
        ...(currentAddress && { currentAddress }),
        ...(cityState && { cityState }),
        ...(pincode && { pincode }),
        ...(salary && { salary }),
        ...(companyName && { companyName }),
        ...(totalWorkExperience && { totalWorkExperience }),
        ...(yearsInPresentJob && { yearsInPresentJob }),
        ...(officialEmail && { officialEmail }),
        ...(designation && { designation }),
        ...(officeAddress && { officeAddress }),
        ...(officeLandmark && { officeLandmark }),
        ...(officeCity && { officeCity }),
        ...(officeState && { officeState }),
        ...(officePincode && { officePincode }),
        ...(reference1Name && { reference1Name }),
        ...(reference1Phone && { reference1Phone }),
        ...(reference1Address && { reference1Address }),
        ...(reference2Name && { reference2Name }),
        ...(reference2Phone && { reference2Phone }),
        ...(reference2Address && { reference2Address }),
      },
      { new: true }
    );

    console.log("Home loan record updated successfully.");

    res.status(200).json({
      message: "Home loan application updated successfully",
      homeLoan,
    });
  } catch (error) {
    console.error("Error updating Home loan:", error.message);
    res.status(500).json({
      message: "Error updating data",
      error: error.message,
    });
  }
};
export const updateBusinessLoan = async (req, res) => {
  try {
    const {
      name,
      email,
      userId,
      amount,
      duration,
      referralId,
      phone,
      motherName,
      fatherName,
      city,
      spouseName,
      maritalStatus,
      residenceType,
      currentAddress,
      cityState,
      pincode,
      salary,
      companyName,
      totalWorkExperience,
      yearsInPresentJob,
      officialEmail,
      designation,
      officeAddress,
      officeLandmark,
      officeState,
      officeCity,
      officePincode,
      reference1Name,
      reference1Phone,
      reference1Address,
      reference2Name,
      reference2Phone,
      reference2Address,
    } = req.body;

    // Handle duration parsing if it's present
    let parsedDuration;
    if (duration) {
      if (typeof duration === "string") {
        try {
          parsedDuration = JSON.parse(duration);
        } catch (e) {
          console.error("Error parsing duration:", e);
          return res.status(400).json({
            message: "Invalid duration format",
            error: e.message,
          });
        }
      } else if (typeof duration === "object") {
        parsedDuration = duration;
      }
    }

    if (parsedDuration && (!parsedDuration.value || !parsedDuration.unit)) {
      return res.status(400).json({
        message: "Duration must include both value and unit",
      });
    }

    // Handle optional file uploads (Aadhaar, PAN, Other Documents)
    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const otherDocumentImage = req.files?.otherDocumentImage?.[0];

    let uploadedAadhaar, uploadedPanCard, uploadedOtherDocument;

    if (aadhaarImage) {
      console.log("Uploading Aadhaar image...");
      uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
      console.log("Aadhaar image uploaded:", uploadedAadhaar.url);
    }

    if (panCardImage) {
      console.log("Uploading Pan Card image...");
      uploadedPanCard = await uploadOnCloudinary(panCardImage);
      console.log("Pan Card image uploaded:", uploadedPanCard.url);
    }

    if (otherDocumentImage) {
      console.log("Uploading Other Document image...");
      uploadedOtherDocument = await uploadOnCloudinary(otherDocumentImage);
      console.log("Other Document image uploaded:", uploadedOtherDocument.url);
    }

    // Check if referral ID exists
    if (referralId && !(await agentExists(referralId))) {
      return res.status(400).json({
        message: "Referral ID does not exist. Please check referral ID.",
      });
    }

    // Find the user and update the loan record only with fields that are present
    const BusinessLoan = await BusinessLoan.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(referralId && { referralId }),
        ...(amount && { amount }),
        ...(parsedDuration && { duration: parsedDuration }),
        ...(aadhaarImage && { aadhaarImage: uploadedAadhaar?.url }),
        ...(panCardImage && { panCardImage: uploadedPanCard?.url }),
        ...(otherDocumentImage && {
          otherDocumentImage: uploadedOtherDocument?.url,
        }),
        ...(motherName && { motherName }),
        ...(fatherName && { fatherName }),
        ...(city && { city }),
        ...(spouseName && { spouseName }),
        ...(maritalStatus && { maritalStatus }),
        ...(residenceType && { residenceType }),
        ...(currentAddress && { currentAddress }),
        ...(cityState && { cityState }),
        ...(pincode && { pincode }),
        ...(salary && { salary }),
        ...(companyName && { companyName }),
        ...(totalWorkExperience && { totalWorkExperience }),
        ...(yearsInPresentJob && { yearsInPresentJob }),
        ...(officialEmail && { officialEmail }),
        ...(designation && { designation }),
        ...(officeAddress && { officeAddress }),
        ...(officeLandmark && { officeLandmark }),
        ...(officeCity && { officeCity }),
        ...(officeState && { officeState }),
        ...(officePincode && { officePincode }),
        ...(reference1Name && { reference1Name }),
        ...(reference1Phone && { reference1Phone }),
        ...(reference1Address && { reference1Address }),
        ...(reference2Name && { reference2Name }),
        ...(reference2Phone && { reference2Phone }),
        ...(reference2Address && { reference2Address }),
      },
      { new: true }
    );

    console.log("Business loan record updated successfully.");

    res.status(200).json({
      message: "Business loan application updated successfully",
      homeLoan,
    });
  } catch (error) {
    console.error("Error updating Business loan:", error.message);
    res.status(500).json({
      message: "Error updating data",
      error: error.message,
    });
  }
};

// ----------------------------OTHER LOAN THINGS----------------------------

export const getLoanStatus = async (req, res) => {
  const { userId } = req.query;
  try {
    const carLoans = await CarLoan.find({ userId: userId });
    const homeLoans = await HomeLoan.find({ userId: userId });
    const personalLoans = await PersonalLoan.find({ userId: userId });
    const businessLoans = await BusinessLoan.find({ userId: userId });

    const allLoans = [];

    carLoans.forEach((loan) =>
      allLoans.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      allLoans.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      allLoans.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );
    businessLoans.forEach((loan) =>
      allLoans.push({ ...loan.toObject(), loanType: "BusinessLoan" })
    );

    // console.log("All Loans: ", allLoans);

    res.status(200).json({ allLoans });
  } catch (error) {
    console.error("Error fetching loans", error);
    res.status(500).json({
      message: "Error fetching LoanData",
      error: error.message,
    });
  }
};

export const getAllLoanList = async (req, res) => {
  try {
    // console.log(`Fetching loans for all loans`);
    const carLoans = await CarLoan.find({});
    const homeLoans = await HomeLoan.find({});
    const personalLoans = await PersonalLoan.find({});
    const businessLoans = await BusinessLoan.find({});

    const allLoanList = [];
    carLoans.forEach((loan) =>
      allLoanList.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      allLoanList.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      allLoanList.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );
    businessLoans.forEach((loan) =>
      allLoanList.push({ ...loan.toObject(), loanType: "BusinessLoan" })
    );

    return res.status(200).json({ allLoanList });
  } catch (error) {
    console.error("Error fetching loans", error);
    res.status(500).json({
      message: "Error fetching LoanData",
      error: error.message,
    });
  }
};
export const getAllCheckedLoanList = async (req, res) => {
  try {
    // console.log(`Fetching loans for all loans`);
    const carLoans = await CarLoan.find({
      $or: [{ isApproved: true }, { isRejected: true }],
    });
    const homeLoans = await HomeLoan.find({
      $or: [{ isApproved: true }, { isRejected: true }],
    });
    const personalLoans = await PersonalLoan.find({
      $or: [{ isApproved: true }, { isRejected: true }],
    });
    const businessLoans = await BusinessLoan.find({
      $or: [{ isApproved: true }, { isRejected: true }],
    });

    const allLoanList = [];
    carLoans.forEach((loan) =>
      allLoanList.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      allLoanList.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      allLoanList.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );
    businessLoans.forEach((loan) =>
      allLoanList.push({ ...loan.toObject(), loanType: "BusinessLoan" })
    );

    return res.status(200).json({ allLoanList });
  } catch (error) {
    console.error("Error fetching loans", error);
    res.status(500).json({
      message: "Error fetching LoanData",
      error: error.message,
    });
  }
};

export const getAllPendingLoanList = async (req, res) => {
  try {
    // console.log(`Fetching all Pending loans`);
    const carLoans = await CarLoan.find({
      isApproved: false,
      isRejected: false,
    });
    const homeLoans = await HomeLoan.find({
      isApproved: false,
      isRejected: false,
    });
    const personalLoans = await PersonalLoan.find({
      isApproved: false,
      isRejected: false,
    });
    const businessLoans = await BusinessLoan.find({
      isApproved: false,
      isRejected: false,
    });

    const pendingLoanList = [];
    carLoans.forEach((loan) =>
      pendingLoanList.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      pendingLoanList.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      pendingLoanList.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );
    businessLoans.forEach((loan) =>
      pendingLoanList.push({ ...loan.toObject(), loanType: "BusinessLoan" })
    );
    return res.status(200).json({ pendingLoanList });
  } catch (error) {
    console.error("Error fetching pending loans", error);
    res.status(500).json({
      message: "Error fetching Pending Loan Data",
      error: error.message,
    });
  }
};

export const getLoanList = async (req, res) => {
  const { referralId } = req.query;
  try {
    console.log(`Fetching loans for refID: ${referralId}`);
    const carLoans = await CarLoan.find({
      referralId: referralId,
      isApproved: false,
      isRejected: false,
    });
    const businessLoans = await BusinessLoan.find({
      referralId: referralId,
      isApproved: false,
      isRejected: false,
    });
    const homeLoans = await HomeLoan.find({
      referralId: referralId,
      isApproved: false,
      isRejected: false,
    });
    const personalLoans = await PersonalLoan.find({
      referralId: referralId,
      isApproved: false,
      isRejected: false,
    });

    const LoanList = [];
    carLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );
    businessLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "BusinessLoan" })
    );

    return res.status(200).json({ LoanList });
  } catch (error) {
    console.error("Error fetching loans", error);
    res.status(500).json({
      message: "Error fetching LoanData",
      error: error.message,
    });
  }
};
export const getLoanHistory = async (req, res) => {
  const { referralId } = req.query;
  try {
    console.log(`Fetching loans for refID: ${referralId}`);
    const carLoans = await CarLoan.find({
      referralId: referralId,
      $or: [
        { isApproved: false, isRejected: true },
        { isApproved: true, isRejected: false },
      ],
    });
    const homeLoans = await HomeLoan.find({
      referralId: referralId,
      $or: [
        { isApproved: false, isRejected: true },
        { isApproved: true, isRejected: false },
      ],
    });
    const personalLoans = await PersonalLoan.find({
      referralId: referralId,
      $or: [
        { isApproved: false, isRejected: true },
        { isApproved: true, isRejected: false },
      ],
    });
    const businessLoans = await BusinessLoan.find({
      referralId: referralId,
      $or: [
        { isApproved: false, isRejected: true },
        { isApproved: true, isRejected: false },
      ],
    });

    const LoanList = [];
    carLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "CarLoan" })
    );
    homeLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "HomeLoan" })
    );
    personalLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "PersonalLoan" })
    );
    businessLoans.forEach((loan) =>
      LoanList.push({ ...loan.toObject(), loanType: "BusinessLoan" })
    );

    return res.status(200).json({ LoanList });
  } catch (error) {
    console.error("Error fetching loans", error);
    res.status(500).json({
      message: "Error fetching LoanData",
      error: error.message,
    });
  }
};

export const detailLoan = async (req, res) => {
  try {
    const { _id } = req.query;
    let car = await CarLoan.findOne({ _id });
    let home = await HomeLoan.findOne({ _id });
    let personal = await PersonalLoan.findOne({ _id });
    let business = await BusinessLoan.findOne({ _id });

    if (!car && !home && !personal && !business) {
      return res.status(404).json({
        message: "No loans found for the specified user",
      });
    }

    res.status(200).json({
      car,
      home,
      personal,
      business,
    });
  } catch (error) {
    console.error("error getting user details", error);
    return res.status(401).json({
      message: "Error fetching data of user",
      error: error.message,
    });
  }
};

export const getNotifications = async (req, res) => {
  const { _id } = req.query;

  try {
    const loanTypes = [
      { model: CarLoan, name: "Car Loan" },
      { model: HomeLoan, name: "Home Loan" },
      { model: PersonalLoan, name: "Personal Loan" },
      { model: BusinessLoan, name: "Business Loan" },
    ];

    let notifications = [];

    for (const loanType of loanTypes) {
      const loans = await loanType.model.find({
        userId: _id,
        $or: [
          { isApproved: true, isRejected: false },
          { isApproved: false, isRejected: true },
        ],
      });

      for (const loan of loans) {
        if (loan.isApproved && !loan.isRejected) {
          notifications.push(
            `**Your ${loanType.name} of ID: ${loan.loanId} has been Approved.**`
          );
        } else if (!loan.isApproved && loan.isRejected) {
          notifications.push(
            `**Your ${loanType.name} of ID: ${loan.loanId} has been Rejected.**`
          );
        }
      }
    }

    if (notifications.length === 0) {
      return res
        .status(200)
        .json({ message: "No loan status updates available." });
    }

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendApprovedNotification = async (email, loanId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Loan has been approved",
    html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FIC</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing FIC. Your loan has been approved</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Loan ID: ${loanId}</h2>
          <p style="font-size:0.9em;">Regards,<br />First India Credit</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>FIC Inc</p>
            <p>NEW DELHI</p>
            <p>INDIA</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendRejectedNotification = async (email, loanId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Loan has been rejected",
    html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FIC</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing FIC. Your loan has been rejected</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Loan ID: ${loanId}</h2>
          <p style="font-size:0.9em;">Regards,<br />First India Credit</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>FIC Inc</p>
            <p>NEW DELHI</p>
            <p>INDIA</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const approveLoan = async (req, res) => {
  const { _id, email, loanId } = req.body;
  console.log(email);
  try {
    let carUpdate = await CarLoan.updateOne(
      { _id },
      { $set: { isApproved: true, isRejected: false } }
    );
    let homeUpdate = await HomeLoan.updateOne(
      { _id },
      { $set: { isApproved: true, isRejected: false } }
    );
    let personalUpdate = await PersonalLoan.updateOne(
      { _id },
      { $set: { isApproved: true, isRejected: false } }
    );
    let businessUpdate = await BusinessLoan.updateOne(
      { _id },
      { $set: { isApproved: true, isRejected: false } }
    );

    if (
      !carUpdate.nModified ||
      !homeUpdate.nModified ||
      !personalUpdate.nModified ||
      !businessUpdate.nModified
    ) {
      await sendApprovedNotification(email, loanId);
      return res.status(200).json({ message: "Loan approved successfully" });
    } else {
      return res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while approving the loan" });
  }
};

export const rejectLoan = async (req, res) => {
  const { _id, email, loanId, message } = req.body;
  try {
    let carUpdate = await CarLoan.updateOne(
      { _id },
      { $set: { isRejected: true, isApproved: false, rejectMessage: message } }
    );
    let homeUpdate = await HomeLoan.updateOne(
      { _id },
      { $set: { isRejected: true, isApproved: false, rejectMessage: message } }
    );
    let personalUpdate = await PersonalLoan.updateOne(
      { _id },
      { $set: { isRejected: true, isApproved: false, rejectMessage: message } }
    );
    let businessUpdate = await BusinessLoan.updateOne(
      { _id },
      { $set: { isRejected: true, isApproved: false, rejectMessage: message } }
    );

    if (
      !carUpdate.nModified ||
      !homeUpdate.nModified ||
      !personalUpdate.nModified ||
      !businessUpdate.nModified
    ) {
      await sendRejectedNotification(email, loanId);
      return res.status(200).json({
        message: "Loan rejected successfully",
        data: message,
      });
    } else {
      return res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while rejecting the loan" });
  }
};
