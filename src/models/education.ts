import { Schema, model } from "mongoose";

const educationSchema = new Schema({
  school: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
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

educationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

educationSchema.set("toJSON", {
  virtuals: true,
});

export const Education = model("Education", educationSchema);
