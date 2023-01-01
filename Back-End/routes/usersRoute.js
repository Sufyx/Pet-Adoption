/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 20/08/2022
 * Asaf Gilboa
*/

const express = require("express");
const router = express.Router();
// const UsersController = require("../controllers/usersController.js");
const {
    signUp, login, getUserById, changeAdminStatus,
    updateUser, getAllUsers, getFullUserById, stayLoggedIn
} = require("../controllers/UsersController");

const {
    confirmPasswordsMatch, isUserNew, encryptPassword,
     isUserInDB, verifyPassword, checkAuth, 
     updateUserMiddleware, checkAdmin, verifyUserAccess
} = require("../middleware/usersMiddleware");
const { validateBody } = require("../middleware/validateBody");
const { signUpSchema, loginSchema, updateSchema } = require("../schemas/allSchemas");


router.get("/", checkAuth, checkAdmin, getAllUsers);
router.get("/logged", checkAuth, stayLoggedIn);
router.get("/:userId", checkAuth, getUserById);
router.get("/:userId/full", checkAuth, getFullUserById);

router.post("/signup", validateBody(signUpSchema), confirmPasswordsMatch, isUserNew, encryptPassword, signUp);
router.post("/login", validateBody(loginSchema), isUserInDB, verifyPassword, login);

router.put("/admin/:userId", checkAuth, checkAdmin, changeAdminStatus);
router.put("/:userId", checkAuth, verifyUserAccess, validateBody(updateSchema), updateUserMiddleware, updateUser);


module.exports = router;
