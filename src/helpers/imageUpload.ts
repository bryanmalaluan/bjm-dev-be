import multer from "multer";

const FILE_TYPE_MAP: { [type: string]: string } = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

// for file/image uploads
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const isValidFile = FILE_TYPE_MAP[file.mimetype];
    let uploadError: Error | null = new Error("Invalid image type");

    if (isValidFile) {
      uploadError = null;
    }

    callback(uploadError, "public/uploads");
  },
  filename: (request, file, callback) => {
    const fileExtension = FILE_TYPE_MAP[file.mimetype];
    const fileName = file.originalname
      .split(" ")
      .join("-")
      .replace(`.${fileExtension}`, "");
    callback(null, `${fileName}-${Date.now()}.${fileExtension}`);
  },
});

export const imageUploadOptions = multer({ storage });
