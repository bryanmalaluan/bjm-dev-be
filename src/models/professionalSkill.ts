import { Schema, model } from "mongoose";

const professionalSkillSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: null,
  },
  dateModified: {
    type: Date,
    default: null,
  },
});

professionalSkillSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

professionalSkillSchema.set("toJSON", {
  virtuals: true,
});

export const ProfessionalSkill = model(
  "ProfessionalSkill",
  professionalSkillSchema,
);
