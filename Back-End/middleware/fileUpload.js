/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const upload = multer({ dest: "./images" });
require("dotenv").config();
const PORT = process.env.PORT || 6060;


cloudinary.config({
    cloud_name: "drnapju6t",
    api_key: "221199873837396",
    api_secret: "VSD3ndIH479mVVr63RZ_l_-jYQA",
});

function uploadToCloudinary(req, res, next) {
    if (!req.file) {
        next();
        return;
    }

    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
            return
        }
        if (result) {
            req.body.picture = result.secure_url
            fs.unlinkSync(req.file.path)
            next()
        }
    });
}

module.exports = { upload, uploadToCloudinary };
