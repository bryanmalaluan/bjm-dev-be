import { Schema, model } from "mongoose";

const experienceSchema = new Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  isCurrent: {
    type: Boolean,
    default: false,
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

experienceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

experienceSchema.set("toJSON", {
  virtuals: true,
});

export const Experience = model("Experience", experienceSchema);
