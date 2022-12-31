/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 18/08/2022
 * Asaf Gilboa
*/


const Pet = require("../schemas/Pet");
const {
    addPetToUserModel, removePetFromUserModel,
    getUserByIdModel, removeSavedPetFromUserModel,
    removePetFromAllUsers
} = require("./usersModel");
const ObjectId = require('mongodb').ObjectId;


async function getPetModel(petId) {
    try {
        const matchingPet = await Pet.findOne({ _id: ObjectId(petId) });
        return matchingPet;
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}


async function getPetsBySearchParamsModel(searchParams) {
    let searchBy = {};
    if (searchParams.petName) {
        searchBy['name'] = searchParams.petName;
    }
    if (searchParams.type) {
        searchBy['type'] = searchParams.type;
    }
    if (searchParams.status) {
        searchBy['adoptionStatus'] = searchParams.status;
    }
    const minHeight = Number(searchParams.minHeight);
    const maxHeight = Number(searchParams.maxHeight);
    if (minHeight || maxHeight) {
        if (minHeight && maxHeight) {
            searchBy['height'] = { $gte: minHeight, $lte: maxHeight };
        } else if (!minHeight && maxHeight) {
            searchBy['height'] = { $lte: maxHeight };
        } else if (minHeight && !maxHeight) {
            searchBy['height'] = { $gte: minHeight };
        }
    }
    const minWeight = Number(searchParams.minWeight);
    const maxWeight = Number(searchParams.maxWeight);
    if (minWeight || maxWeight) {
        if (minWeight && maxWeight) {
            searchBy['weight'] = { $gte: minWeight, $lte: maxWeight };
        } else if (!minWeight && maxWeight) {
            searchBy['weight'] = { $lte: maxWeight };
        } else if (minWeight && !maxWeight) {
            searchBy['weight'] = { $gte: minWeight };
        }
    }
    try {
        const matchingPets = await Pet.find(searchBy).limit(48);
        return matchingPets;
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}


async function savePetModel(petId, userId, petAction) {
    try {
        let savedPet;
        if (petAction !== "Save") {
            savedPet = await Pet.updateOne(
                { _id: ObjectId(petId) }, { $set: { adoptionStatus: petAction, owner: userId } }
            );
        } else {
            savedPet = await Pet.updateOne({ _id: ObjectId(petId) }, { $push: { savedAtUsers: userId } });
        }
        const userUpdate = await addPetToUserModel(userId, petId, petAction);
        return { pet: savedPet, user: userUpdate };
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}


async function returnPetModel(petId, userEmail) {
    try {
        const returnedPet = await Pet.updateOne(
            { _id: ObjectId(petId) },
            { $set: { adoptionStatus: "Available", owner: "" } });
        const userUpdate = await removePetFromUserModel(userEmail, petId);
        return { pet: returnedPet, user: userUpdate };
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}

async function deleteSavedPetModel(petId, userId) {

    try {
        const userUpdate = await removeSavedPetFromUserModel(userId, petId);
        Pet.updateOne({ _id: ObjectId(petId) }, { $pull: { savedAtUsers: userId } });
        return userUpdate;
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}


async function getPetsByUserIdModel(userId) {
    try {
        const user = await getUserByIdModel(userId);
        const userPets = [];
        if (user.userPets) {
            for (let i = 0; i < user.userPets.length; i++) {
                if (user.userPets[i]) {
                    const pet = await Pet.findOne({ _id: ObjectId(user.userPets[i]) });
                    userPets.push(pet);
                }
            }
        }
        const savedPets = [];
        if (user.savedPets) {
            for (let i = 0; i < user.savedPets.length; i++) {
                if (user.savedPets[i]) {
                    const pet = await Pet.findOne({ _id: ObjectId(user.savedPets[i]) });
                    savedPets.push(pet);
                }
            }
        }
        const petList = {
            userPets: [...userPets], savedPets: [...savedPets]
        };
        return petList;
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}


function addPetModel(petToAdd) {
    try {
        const newPet = new Pet(petToAdd);
        newPet.save();
        return newPet._id;
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}

async function editPetModel(petId, editParams) {
    try {
        let petEditRes;
        let dietArr = [];
        if (editParams.dietary) {
            dietArr = editParams.dietary.split(",");
        }
        editParams.dietary = [...dietArr];
        if (editParams) {
            petEditRes = await Pet.updateOne({ _id: ObjectId(petId) }, editParams);
        }
        return petEditRes;
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}


async function deletePetModel(petId) {
    try {
        const pet = await getPetModel(petId);
        const usersArr = [...pet.savedAtUsers, pet.owner];
        if (usersArr.length > 0) {
            await removePetFromAllUsers(usersArr, petId);
        }
        await Pet.deleteOne({ _id: ObjectId(petId) });
        return true;
    } catch (err) {
        console.error("Caught: ", err.message);
    }
}

module.exports = {
    getPetsBySearchParamsModel, getPetModel, addPetModel, returnPetModel,
    deletePetModel, editPetModel, deleteSavedPetModel, savePetModel, getPetsByUserIdModel
};
