/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 21/08/2022
 * Asaf Gilboa
*/


const User = require("../schemas/User");
const ObjectId = require('mongodb').ObjectId;


async function getUserByEmailModel(email) {
  try {
    const user = await User.findOne({ email: email });
    // const user = {...res};
    // delete user.password;
    return user;
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}

async function getUserByIdModel(userId) {
  try {
    const user = await User.findOne({ _id: ObjectId(userId)});
    user.password= undefined;
    return user;
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}


async function signUpModel(userToAdd) {
  try {
    // console.log('signUpModel user to add ', userToAdd);
    const newUser = new User(userToAdd);
    newUser.save();
    const userId = newUser._id;
    // console.log('signUpModel userId ', userId);
    return userId;
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}

async function addPetToUserModel(userId, petId, petAction) {
  try {
    let updatedUser;
    if (petAction === "Save") {
      updatedUser = User.updateOne({ _id: ObjectId(userId)}, {$push: {savedPets: petId}});
    } else {
      updatedUser = User.updateOne({ _id: ObjectId(userId)}, {$push: {userPets: petId}});
    }
    return (updatedUser);
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}


async function removeSavedPetFromUserModel(userId, petId) {
  try {
    let updatedUser = "user failed to update";
    updatedUser = User.updateOne({ _id: ObjectId(userId) }, {$pull: {savedPets: petId}});
    // ObjectId(userId) }
    return updatedUser;
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}


async function removePetFromUserModel(userEmail, petId) {
  try {
    let updatedUser = "user failed to update";
    updatedUser = User.updateOne({ email: userEmail}, {$pull: {userPets: petId}});
    return updatedUser;
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}

async function updateUserModel(settings, userId) {
  console.log("updateUserModel params ", settings);
  try {
    const newSettings = {};
    for (const key in settings) {
      if (settings[key] && (key !== "passwordConfirm") && (key !== "userId")) {
        newSettings[key] = settings[key];
      }
    }
    if (newSettings) {
      await User.updateOne({ _id: ObjectId(userId) }, newSettings);
    }
    const updatedUser = await getUserByIdModel(userId);
    return updatedUser;
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}

async function changeAdminStatusModel(userId, status) {
  // console.log("un/make admin model params: ", userId, " ", status);
  try {
    const res = await User.updateOne({ _id: ObjectId(userId) }, {isAdmin: status});
    return res;
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}


async function getAllUsersModel() {
  try {
    const res = await User.find();
    const users = [...res];
    users.forEach(user => {
      user.password = undefined;
    });
    return users;
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}

async function removePetFromAllUsers(usersArr, petId) {
  console.log("removePetFromAllUsers petId ", petId);
  try {
    usersArr.forEach(async userId => {
      console.log("removePetFromAllUsers forEach userId ", userId);
      await User.updateOne({ _id: ObjectId(userId)}, {$pull: {userPets: petId}});
      await User.updateOne({ _id: ObjectId(userId)}, {$pull: {savedPets: petId}});
    });
  } catch (err) {
    console.error("Caught: ", err.message);
  }
}


module.exports = {
  getUserByEmailModel, signUpModel, addPetToUserModel,
  removePetFromUserModel, getUserByIdModel, 
  updateUserModel, getAllUsersModel, changeAdminStatusModel, 
  removePetFromAllUsers, removeSavedPetFromUserModel
};
