/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 20/08/2022
 * Asaf Gilboa
*/

const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/usersController");

const {
    confirmPasswordsMatch, isUserNew, encryptPassword,
     isUserInDB, verifyPassword, checkAuth, 
     updateUserMiddleware, checkAdmin, verifyUserAccess
} = require("../middleware/usersMiddleware");
const { validateBody } = require("../middleware/validateBody");
const { signUpSchema, loginSchema, updateSchema } = require("../schemas/allSchemas");


router.get("/", checkAuth, checkAdmin, UsersController.getAllUsers);
router.get("/logged", checkAuth, UsersController.stayLoggedIn);
router.get("/:userId", checkAuth, UsersController.getUserById);
router.get("/:userId/full", checkAuth, UsersController.getFullUserById);

router.post("/signup", validateBody(signUpSchema), confirmPasswordsMatch, isUserNew, encryptPassword, UsersController.signUp);
router.post("/login", validateBody(loginSchema), isUserInDB, verifyPassword, UsersController.login);

router.put("/admin/:userId", checkAuth, checkAdmin, UsersController.changeAdminStatus);
router.put("/:userId", checkAuth, verifyUserAccess, validateBody(updateSchema), updateUserMiddleware, UsersController.updateUser);

// (req, res, next)=>{console.log("???");next();},

module.exports = router;
