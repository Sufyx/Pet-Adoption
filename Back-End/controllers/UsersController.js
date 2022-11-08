/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 21/08/2022
 * Asaf Gilboa
*/

const {
    signUpModel, getUserByEmailModel, getUserByIdModel,
    updateUserModel, getAllUsersModel, changeAdminStatusModel
} = require("../models/usersModel");
const { getPetsByUserIdModel } = require("../models/petsModel");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();


async function signUp(req, res) {
    try {
        console.log("contoller signup req.body: ", req.body);
        const { email, password, firstName, lastName, phone } = req.body;
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phone: phone,
            isAdmin: false,
            userPets: [],
            savedPets: []
        };
        const userId = await signUpModel(newUser);
        newUser["userId"] = userId;
        const token = jwt.sign({ id: userId }, process.env.TOKEN_KEY, { expiresIn: "5h" });
        res.send({ token: token, user: newUser });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function login(req, res) {
    try {
        const { email } = req.body.user;
        const user = await getUserByEmailModel(email);
        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "5h" });
        res.send({ token: token, user: user });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function logout(req, res) {
    try {
        res.send({ ok: true, message: 'Backend logged out' });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function getUserById(req, res) {
    try {
        const { userId } = req.params;
        const user = await getUserByIdModel(userId);
        res.send({ ok: true, user: user });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function getFullUserById(req, res) {
    try {
        const { userId } = req.params;
        const user = await getUserByIdModel(userId);
        const petList = await getPetsByUserIdModel(userId);
        user.userPets = [...petList.userPets];
        user.savedPets = [...petList.savedPets];
        res.send({ ok: true, user: user });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}


async function updateUser(req, res) {
    try {
        const settings = req.body;
        const { userId } = req.params;
        const updatedUser = await updateUserModel(settings, userId);
        res.send({ ok: true, updatedUser });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await getAllUsersModel();
        res.send({ ok: true, users });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function stayLoggedIn(req, res) {
    try {
        const { userId } = req.body;
        const user = await getUserByIdModel(userId);
        res.send({ ok: true, user });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}


async function changeAdminStatus(req, res) {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const resp = await changeAdminStatusModel(userId, status);
        res.send({ ok: true, resp });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}


module.exports = {
    signUp, login, logout, getUserById, changeAdminStatus,
    updateUser, getAllUsers, getFullUserById, stayLoggedIn
};
