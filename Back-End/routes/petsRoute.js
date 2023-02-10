/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

const express = require("express");
const router = express.Router();
const PetsController = require("../controllers/petsController");

const { newPetSchema, updatePetSchema } = require("../schemas/allSchemas");
const { validateBody } = require("../middleware/validateBody");
const {
    checkAuth, checkAdmin, verifyUserAccess
} = require("../middleware/usersMiddleware");
const { isPetAvailable, doesUserHavePet } = require("../middleware/petsMiddleware");
const { upload, uploadToCloudinary } = require("../middleware/fileUpload");

//guest routes
router.get("/", PetsController.getPetsBySearchParams);

//user routes
router.get("/user/:userId", checkAuth, verifyUserAccess, PetsController.getPetsByUserId);
router.get("/:petId", checkAuth, PetsController.getPet);
router.post("/:petId/adopt", checkAuth, isPetAvailable, PetsController.savePet);
router.post("/:petId/foster", checkAuth, isPetAvailable, PetsController.savePet);
router.post("/:petId/return", checkAuth, doesUserHavePet, PetsController.returnPet);
router.post("/:petId/save", checkAuth, PetsController.savePet);
router.delete("/:petId/save", checkAuth, PetsController.deleteSavedPet);

//admin routes
router.put("/:petId", checkAuth, checkAdmin, validateBody(updatePetSchema),
    upload.single("picture"), uploadToCloudinary, PetsController.editPet);
router.post("/", checkAuth, checkAdmin, validateBody(newPetSchema),
    upload.single("picture"), uploadToCloudinary, PetsController.addPet);
router.delete("/:petId", checkAuth, checkAdmin, PetsController.deletePet);

module.exports = router;
