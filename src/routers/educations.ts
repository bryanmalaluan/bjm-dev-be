import mongoose from "mongoose";
import { assertError } from "../helpers/dataFormat";
import { Education } from "../models/education";
import { Router } from "express";

const router = Router();

// get list of educations
router.get("/", async (request, response) => {
  try {
    const educationList = await Education.find();

    if (!educationList) {
      return response.status(400).json({ success: false, data: [] });
    }
    response.status(200).json({ success: true, data: educationList });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// get education by id
router.get("/:id", async (request, response) => {
  try {
    const education = await Education.findById(request.params.id);

    if (!education) {
      return response
        .status(400)
        .json({ success: false, error: "Education not found" });
    }
    response.status(200).json({ success: true, data: education });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// create new education
router.post("/", async (request, response) => {
  try {
    let education = new Education({
      school: request.body.school,
      course: request.body.course,
      specialization: request.body.specialization,
      startDate: request.body.startDate,
      endDate: request.body.endDate,
      dateCreated: Date.now(),
    });

    const result = await education.save();

    if (!result) {
      return response
        .status(400)
        .json({ success: false, error: "Education cannot be created!" });
    }
    response.status(200).json({ success: true, data: result });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// update education
router.put("/:id", async (request, response) => {
  try {
    // validates object id
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response
        .status(400)
        .json({ success: false, error: "Education id is invalid" });
    }

    const result = await Education.findByIdAndUpdate(
      request.params.id,
      {
        school: request.body.school,
        course: request.body.course,
        specialization: request.body.specialization,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
        dateModified: Date.now(),
      },
      {
        new: true,
      },
    );

    if (!result) {
      return response
        .status(400)
        .json({ success: false, error: "Education cannot be updated!" });
    }
    response.status(200).json({ success: true, data: result });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// delete education
router.delete("/:id", async (request, response) => {
  try {
    const result = await Education.findByIdAndDelete(request.params.id);

    if (!result) {
      return response
        .status(400)
        .json({ success: false, error: "Education not found!" });
    }
    response
      .status(200)
      .json({ success: true, message: "Education has been deleted" });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
