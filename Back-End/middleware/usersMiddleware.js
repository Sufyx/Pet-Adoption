/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


const { getUserByEmailModel, getUserByIdModel } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();


function confirmPasswordsMatch(req, res, next) {
  if (req.body.password !== req.body.passwordConfirm) {
    res.status(400).send("Passwords don't match");
    return;
  }
  next();
}

async function isUserNew(req, res, next) {
  const user = await getUserByEmailModel(req.body.email);
  if (user) {
    res.status(400).send("A user with this email already exists");
    return;
  }
  next();
}

function encryptPassword(req, res, next) {
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    req.body.password = hash;
    next();
  });
}

async function isUserInDB(req, res, next) {
  const user = await getUserByEmailModel(req.body.email);
  if (user) {
    req.body.user = user;
    next();
    return;
  }
  res.status(400).send("No user found with this email");
}

async function verifyPassword(req, res, next) {
  const { user } = req.body;

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) {
      console.log("bcrypt error > ", err.message);
      res.status(500).send(err);
      return;
    }
    if (result) {
      next();
      return;
    } else {
      res.status(400).send("Incorrect Password");
    }
  });
}

async function checkAuth(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization headers required");
    return;
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send("Unauthorized");
      return;
    }
    if (decoded) {
      req.body.userId = decoded.id;
      next();
      return;
    }
  });
}


async function verifyUserAccess(req, res, next) {
  const tokenId = req.body.userId;
  const reqId = req.params.userId;
  if (tokenId !== reqId) {
    const user = await getUserByIdModel(tokenId);
    if (!user.isAdmin) {
      console.log("Access denied (verify user access)");
      res.status(403).send("Non admins may only access their own pages");
      return;
    }
  }
  next();
}


async function updateUserMiddleware(req, res, next) {
  const { email, password, passwordConfirm } = req.body;
  const { userId } = req.params;
  if (email) {
    const newMail = await getUserByEmailModel(email);
    const userMail = await getUserByIdModel(userId);
    if (newMail) {
      if (newMail.email !== userMail.email) {
        res.status(400).send("This email is taken");
        return;
      }
    }
  }
  if (password || passwordConfirm) {
    if (password !== passwordConfirm) {
      res.status(400).send("Passwords don't match");
      return;
    } else {
      encryptPassword(req, res, next);
      return;
    }
  }
  next();
}


async function checkAdmin(req, res, next) {
  const { userId } = req.body;
  const user = await getUserByIdModel(userId);
  if (!user.isAdmin) {
    console.log("Access denied (check admin)");
    res.status(403).send("Access denied. Admin only action.");
    return;
  }
  next();
}



module.exports = {
  confirmPasswordsMatch, isUserNew, encryptPassword,
  isUserInDB, verifyPassword, checkAuth,
  updateUserMiddleware, checkAdmin, verifyUserAccess
};
