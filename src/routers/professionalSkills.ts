import mongoose from "mongoose";
import { assertError } from "../helpers/dataFormat";
import { ProfessionalSkill } from "../models/professionalSkill";
import { Router } from "express";

const router = Router();

// get list of professional skills
router.get("/", async (request, response) => {
  try {
    const professionalSkillList = await ProfessionalSkill.find();

    if (!professionalSkillList) {
      return response.status(400).json({ success: false, data: [] });
    }
    response.status(200).json({ success: true, data: professionalSkillList });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// get professional skill by id
router.get("/:id", async (request, response) => {
  try {
    const education = await ProfessionalSkill.findById(request.params.id);

    if (!education) {
      return response
        .status(400)
        .json({ success: false, error: "Professional skill not found" });
    }
    response.status(200).json({ success: true, data: education });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// create new professional skill
router.post("/", async (request, response) => {
  try {
    let professionalSkill = new ProfessionalSkill({
      title: request.body.title,
      rating: request.body.rating,
      dateCreated: Date.now(),
    });

    const result = await professionalSkill.save();

    if (!result) {
      return response.status(400).json({
        success: false,
        error: "Professional skill cannot be created!",
      });
    }
    response.status(200).json({ success: true, data: result });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// update professional skill
router.put("/:id", async (request, response) => {
  try {
    // validates object id
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response
        .status(400)
        .json({ success: false, error: "Professional skill id is invalid" });
    }

    const result = await ProfessionalSkill.findByIdAndUpdate(
      request.params.id,
      {
        title: request.body.title,
        rating: request.body.rating,
        dateModified: Date.now(),
      },
      {
        new: true,
      },
    );

    if (!result) {
      return response.status(400).json({
        success: false,
        error: "Professional skill cannot be updated!",
      });
    }
    response.status(200).json({ success: true, data: result });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// delete professional skill
router.delete("/:id", async (request, response) => {
  try {
    const result = await ProfessionalSkill.findByIdAndDelete(request.params.id);

    if (!result) {
      return response
        .status(400)
        .json({ success: false, error: "Professional skill not found!" });
    }
    response
      .status(200)
      .json({ success: true, message: "Professional skill has been deleted" });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
