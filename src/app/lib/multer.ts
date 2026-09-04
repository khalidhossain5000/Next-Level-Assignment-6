import multer from "multer";
// Set up Multer for handling file uploads

const storage = multer.memoryStorage();

export const upload = multer({
    storage, limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    }, fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, DOC and DOCX files are allowed"));
        }
    },
});