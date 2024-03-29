import mongoose from "mongoose";
import { assertError } from "../helpers/dataFormat";
import { User } from "../models/user";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { imageUploadOptions } from "../helpers/imageUpload";

const router = Router();

// get list of users
router.get("/", async (request, response) => {
  try {
    const userList = await User.find();

    if (!userList) {
      return response.status(400).json({ success: false, data: [] });
    }
    response.status(200).json({ success: true, data: userList });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// get user by id
router.get("/:id", async (request, response) => {
  try {
    // validates object id
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response
        .status(400)
        .json({ success: false, error: "User id is invalid" });
    }

    const user = await User.findById(request.params.id)
      .populate("professionalSkills", "title rating")
      .populate("educations", "school course specialization startDate endDate")
      .populate(
        "experiences",
        "image jobTitle company summary startDate endDate isCurrent",
      );

    if (!user) {
      return response
        .status(400)
        .json({ success: false, error: "User not found" });
    }
    response.status(200).json({ success: true, data: user });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

// create new user
router.post(
  "/",
  imageUploadOptions.single("avatar"),
  async (request, response) => {
    try {
      const imageFile = request.file;
      let avatar = "";

      if (imageFile) {
        const imageFileName = request.file?.filename;
        const basePath = `${request.protocol}://${request.get("host")}/public/uploads/`;
        avatar = `${basePath}${imageFileName}`;
      }

      let user = new User({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        phone: request.body.phone,
        email: request.body.email,
        location: request.body.location,
        headline: request.body.headline,
        introText: request.body.introText,
        summary: request.body.summary,
        avatar,
        cv: request.body.cv,
        linkedIn: request.body.linkedIn,
        github: request.body.github,
        instagram: request.body.instagram,
        getInTouchText: request.body.getInTouchText,
        professionalSkills: request.body.professionalSkills,
        educations: request.body.educations,
        experiences: request.body.experiences,
        dateCreated: Date.now(),
      });

      const result = await user.save();

      if (!result) {
        return response
          .status(400)
          .json({ success: false, error: "User cannot be created" });
      }
      response.status(200).json({ success: true, data: result });
    } catch (error) {
      const errorMessage = assertError(error);
      response.status(500).json({ success: false, error: errorMessage });
    }
  },
);

// update user
router.put(
  "/:id",
  imageUploadOptions.single("avatar"),
  async (request, response) => {
    try {
      // validates object id
      if (!mongoose.isValidObjectId(request.params.id)) {
        return response
          .status(400)
          .json({ success: false, error: "User id is invalid" });
      }

      const user = await User.findById(request.params.id);

      if (!user) {
        return response
          .status(400)
          .json({ success: false, error: "User not found" });
      }

      const imageFile = request.file;
      let avatar = user.avatar;

      if (imageFile) {
        const imageFileName = request.file?.filename;
        const basePath = `${request.protocol}://${request.get("host")}/public/uploads/`;
        avatar = `${basePath}${imageFileName}`;
      }

      const result = await User.findByIdAndUpdate(
        request.params.id,
        {
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          phone: request.body.phone,
          email: request.body.email,
          location: request.body.location,
          headline: request.body.headline,
          introText: request.body.introText,
          summary: request.body.summary,
          avatar,
          cv: request.body.cv,
          linkedIn: request.body.linkedIn,
          github: request.body.github,
          instagram: request.body.instagram,
          getInTouchText: request.body.getInTouchText,
          professionalSkills: request.body.professionalSkills,
          educations: request.body.educations,
          experiences: request.body.experiences,
          dateModified: Date.now(),
        },
        {
          new: true,
        },
      );

      if (!result) {
        return response
          .status(400)
          .json({ success: false, error: "User cannot be updated!" });
      }
      response.status(200).json({ success: true, data: result });
    } catch (error) {
      const errorMessage = assertError(error);
      response.status(500).json({ success: false, error: errorMessage });
    }
  },
);

// upload cv
router.put(
  "/upload/cv/:id",
  imageUploadOptions.single("cv"),
  async (request, response) => {
    try {
      // validates object id
      if (!mongoose.isValidObjectId(request.params.id)) {
        return response
          .status(400)
          .json({ success: false, error: "User id is invalid" });
      }

      const user = await User.findById(request.params.id);

      if (!user) {
        return response
          .status(400)
          .json({ success: false, error: "User not found" });
      }

      const imageFile = request.file;
      let cv = user.cv;

      if (imageFile) {
        const imageFileName = request.file?.filename;
        const basePath = `${request.protocol}://${request.get("host")}/public/uploads/`;
        cv = `${basePath}${imageFileName}`;
      }

      const result = await User.findByIdAndUpdate(
        request.params.id,
        {
          cv,
          dateModified: Date.now(),
        },
        {
          new: true,
        },
      );

      if (!result) {
        return response
          .status(400)
          .json({ success: false, error: "CV cannot be updated!" });
      }
      response.status(200).json({ success: true, data: result });
    } catch (error) {
      const errorMessage = assertError(error);
      response.status(500).json({ success: false, error: errorMessage });
    }
  },
);

// delete professional skill
router.delete("/:id", async (request, response) => {
  try {
    const result = await User.findByIdAndDelete(request.params.id);

    if (!result) {
      return response
        .status(400)
        .json({ success: false, error: "User not found!" });
    }
    response
      .status(200)
      .json({ success: true, message: "User has been deleted" });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

/**
 * generate jwt token
 * @params password
 */
router.post("/token", async (request, response) => {
  try {
    if (
      !request.body.password ||
      request.body.password !== process.env.TOKEN_PASSWORD
    ) {
      return response.status(400).json({
        success: false,
        error: "You don't have access to generate a token",
      });
    }

    const token = jwt.sign(
      {
        tokenPassword: request.body.password, // payload to sign
      },
      process.env.JWT_SECRET ?? "", // secret key
      {
        expiresIn: "1d", // token expiration
      },
    );

    return response
      .status(200)
      .json({ success: true, data: { token }, message: "Token generated" });
  } catch (error) {
    const errorMessage = assertError(error);
    response.status(500).json({ success: false, error: errorMessage });
  }
});

export default router;
