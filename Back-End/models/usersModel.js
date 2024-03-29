/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


const User = require("../schemas/User");
const ObjectId = require('mongodb').ObjectId;


async function getUserByEmailModel(email) {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    console.error("Users model getUserByEmailModel: ", err.message);
  }
}

async function getUserByIdModel(userId) {
  try {
    const user = await User.findOne({ _id: ObjectId(userId) });
    user.password = undefined;
    return user;
  } catch (err) {
    console.error("Users model getUserByIdModel: ", err.message);
  }
}


async function signUpModel(userToAdd) {
  try {
    const newUser = new User(userToAdd);
    newUser.save();
    const userId = newUser._id;
    return userId;
  } catch (err) {
    console.error("Users model signUpModel: ", err.message);
  }
}

async function addPetToUserModel(userId, petId, petAction) {
  try {
    let updatedUser;
    if (petAction === "Save") {
      updatedUser = User.updateOne(
        { _id: ObjectId(userId) },
        { $push: { savedPets: petId } });
    } else {
      updatedUser = User.updateOne(
        { _id: ObjectId(userId) },
        { $push: { userPets: petId } });
    }
    return (updatedUser);
  } catch (err) {
    console.error("Users model addPetToUserModel: ", err.message);
  }
}


async function removeSavedPetFromUserModel(userId, petId) {
  try {
    let updatedUser = "user failed to update";
    updatedUser = User.updateOne(
      { _id: ObjectId(userId) },
      { $pull: { savedPets: petId } });
    return updatedUser;
  } catch (err) {
    console.error("Users model removeSavedPetFromUserModel: ", err.message);
  }
}


async function removePetFromUserModel(userId, petId) {
  try {
    let updatedUser = "user failed to update";
    updatedUser = User.updateOne(
      { _id: ObjectId(userId) },
      { $pull: { userPets: petId } });
    return updatedUser;
  } catch (err) {
    console.error("Users model removePetFromUserModel: ", err.message);
  }
}

async function updateUserModel(settings, userId) {
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
    console.error("Users model updateUserModel: ", err.message);
  }
}

async function changeAdminStatusModel(userId, status) {
  try {
    const res = await User.updateOne(
      { _id: ObjectId(userId) },
      { isAdmin: status });
    return res;
  } catch (err) {
    console.error("Users model changeAdminStatusModel: ", err.message);
  }
}


async function getAllUsersModel() {
  try {
    const res = await User.find();
    const users = [];
    res.forEach(user => {
      if (user.email != "newsfeed@news.feed") {
        user.password = undefined;
        users.push(user);
      }
    });
    return users;
  } catch (err) {
    console.error("Users model getAllUsersModel: ", err.message);
  }
}


async function removePetFromAllUsers(usersArr, petId) {
  try {
    usersArr.forEach(async userId => {
      await User.updateOne(
        { _id: ObjectId(userId) },
        { $pull: { userPets: petId } });
      await User.updateOne(
        { _id: ObjectId(userId) },
        { $pull: { savedPets: petId } });
    });
  } catch (err) {
    console.error("Users model removePetFromAllUsers: ", err.message);
  }
}


async function updateNewsFeed(type, pet, userId) {
  try {
    let timeStamp = new Date(Date.now());
    let hours = timeStamp.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    let minutes = timeStamp.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    timeStamp = `${timeStamp.toLocaleDateString()} ${hours}:${minutes} [#]`;

    let item = timeStamp;
    const action = type.toLowerCase();
    if (type === "Adopted" || type === "Fostered" || type === "Returned") {
      const user = await getUserByIdModel(userId);
      item += `${user.firstName} ${user.lastName} has 
        ${action} ${pet.name} the ${pet.type.toLowerCase()}`;
    } else if (type === "Added" || type === "Deleted") {
      item += `Pet ${action}: ${pet.name} the ${pet.type.toLowerCase()}`;
    }

    await User.updateOne(
      { _id: ObjectId('63b3f5e291d5878d0beb5600') },
      { $push: { userPets: item } });

    const log = await getUserByIdModel('63b3f5e291d5878d0beb5600');
    if (log.userPets.length > 10) {
      await User.updateOne(
        { _id: ObjectId('63b3f5e291d5878d0beb5600') },
        { $pop: { userPets: -1 } });
    }
  } catch (err) {
    console.error("Users model updateNewsFeed: ", err.message);
  }
}

async function getNewsFeedModel() {
  try {
    const user = await getUserByIdModel('63b3f5e291d5878d0beb5600');
    const news = [...user.userPets];
    return news;
  } catch (err) {
    console.error("Users model getNewsFeedModel: ", err.message);
  }
}


module.exports = {
  getUserByEmailModel, signUpModel, removeSavedPetFromUserModel,
  removePetFromUserModel, getUserByIdModel, addPetToUserModel,
  updateUserModel, getAllUsersModel, changeAdminStatusModel,
  removePetFromAllUsers, updateNewsFeed, getNewsFeedModel
};
