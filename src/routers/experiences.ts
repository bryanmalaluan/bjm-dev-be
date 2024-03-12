import mongoose from "mongoose";
import { assertError } from "../helpers/dataFormat";
import { Experience } from "../models/experience";
import { Router } from "express";

const router = Router();

// get list of experiences
router.get("/", async (request, response) => {
  try {
    const experienceList = await Experience.find();

    if (!experienceList) {
      return response.status(400).json({ success: false, data: [] });
    }
    response.status(200).json({ success: true, data: experienceList });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// get experience by id
router.get("/:id", async (request, response) => {
  try {
    const experience = await Experience.findById(request.params.id);

    if (!experience) {
      return response
        .status(400)
        .json({ success: false, error: "Experience not found" });
    }
    response.status(200).json({ success: true, data: experience });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// create new experience
router.post("/", async (request, response) => {
  try {
    let experience = new Experience({
      jobTitle: request.body.jobTitle,
      company: request.body.company,
      summary: request.body.summary,
      startDate: request.body.startDate,
      endDate: request.body.endDate,
      isCurrent: request.body.isCurrent,
      dateCreated: Date.now(),
    });

    const result = await experience.save();

    if (!result) {
      return response
        .status(400)
        .json({ success: false, error: "Experience cannot be created!" });
    }
    response.status(200).json({ success: true, data: result });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// update experience
router.put("/:id", async (request, response) => {
  try {
    // validates object id
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response
        .status(400)
        .json({ success: false, error: "Experience id is invalid" });
    }

    const result = await Experience.findByIdAndUpdate(
      request.params.id,
      {
        jobTitle: request.body.jobTitle,
        company: request.body.company,
        summary: request.body.summary,
        startDate: request.body.startDate,
        endDate: request.body.endDate,
        isCurrent: request.body.isCurrent,
        dateModified: Date.now(),
      },
      {
        new: true,
      },
    );

    if (!result) {
      return response
        .status(400)
        .json({ success: false, error: "Experience cannot be updated!" });
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
    const result = await Experience.findByIdAndDelete(request.params.id);

    if (!result) {
      return response
        .status(400)
        .json({ success: false, error: "Experience not found!" });
    }
    response
      .status(200)
      .json({ success: true, message: "Experience has been deleted" });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
