import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  linkedIn: {
    type: String,
  },
  github: {
    type: String,
  },
  instagram: {
    type: String,
  },
  getInTouchText: {
    type: String,
  },
  professionalSkills: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProfessionalSkill",
    },
  ],
  educations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Education",
    },
  ],
  experiences: [
    {
      type: Schema.Types.ObjectId,
      ref: "Experience",
    },
  ],
  dateCreated: {
    type: Date,
    default: null,
  },
  dateModified: {
    type: Date,
    default: null,
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

export const User = model("User", userSchema);
