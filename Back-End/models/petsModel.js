/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


const Pet = require("../schemas/Pet");
const {
    addPetToUserModel, removePetFromUserModel,
    getUserByIdModel, removeSavedPetFromUserModel,
    removePetFromAllUsers, updateNewsFeed
} = require("./usersModel");
const ObjectId = require('mongodb').ObjectId;


async function getPetModel(petId) {
    try {
        const matchingPet = await Pet.findOne({ _id: ObjectId(petId) });
        return matchingPet;
    } catch (err) {
        console.error("Pets model getPetModel: ", err.message);
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
        const matchingPets = await Pet.find(searchBy);
        return matchingPets;
    } catch (err) {
        console.error("Pets model getPetsBySearchParamsModel: ", err.message);
    }
}


async function savePetModel(petId, userId, petAction) {
    try {
        let savedPet;
        if (petAction !== "Save") {
            savedPet = await Pet.updateOne(
                { _id: ObjectId(petId) },
                { $set: { adoptionStatus: petAction, owner: userId } }
            );

            const thisPet = await getPetModel(petId);
            await updateNewsFeed(petAction, thisPet, userId);
        } else {
            savedPet = await Pet.updateOne(
                { _id: ObjectId(petId) },
                { $push: { savedAtUsers: userId } });
        }
        const userUpdate = await addPetToUserModel(userId, petId, petAction);
        return { pet: savedPet, user: userUpdate };
    } catch (err) {
        console.error("Pets model savePetModel: ", err.message);
    }
}


async function returnPetModel(petId, userId) {
    try {
        const returnedPet = await Pet.updateOne(
            { _id: ObjectId(petId) },
            { $set: { adoptionStatus: "Available", owner: "" } });
        const userUpdate = await removePetFromUserModel(userId, petId);

        const thisPet = await getPetModel(petId);
        await updateNewsFeed("Returned", thisPet, userId);
        return { pet: returnedPet, user: userUpdate };
    } catch (err) {
        console.error("Pets model returnPetModel: ", err.message);
    }
}

async function deleteSavedPetModel(petId, userId) {
    try {
        const userUpdate = await removeSavedPetFromUserModel(userId, petId);
        Pet.updateOne({ _id: ObjectId(petId) }, { $pull: { savedAtUsers: userId } });
        return userUpdate;
    } catch (err) {
        console.error("Pets model deleteSavedPetModel: ", err.message);
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
        console.error("Pets model getPetsByUserIdModel: ", err.message);
    }
}


async function addPetModel(petToAdd) {
    try {
        const newPet = new Pet(petToAdd);
        await newPet.save();
        await updateNewsFeed("Added", newPet, "0");
        return newPet._id;
    } catch (err) {
        console.error("Pets model addPetModel: ", err.message);
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
        console.error("Pets model editPetModel: ", err.message);
    }
}


async function deletePetModel(petId) {
    try {
        const pet = await getPetModel(petId);
        const usersArr = [...pet.savedAtUsers];
        if (pet.owner) {
            usersArr.push(pet.owner);
        }
        if (usersArr.length > 0) {
            await removePetFromAllUsers(usersArr, petId);
        }
        await Pet.deleteOne({ _id: ObjectId(petId) });
        await updateNewsFeed("Deleted", pet, "0");
        return true;
    } catch (err) {
        console.error("Pets model deletePetModel: ", err.message);
    }
}


async function getPetsOwnersModel() {
    try {
        const allPets = await getPetsBySearchParamsModel({});
        const petsData = [];
        const promises = [];
        for (let i = 0; i < allPets.length; i++) {
            petsData[i] = {...allPets[i]._doc, ownerName: ''};
            if (petsData[i].owner) {
                promises.push(getUserByIdModel(petsData[i].owner));
            } else {
                promises.push('');
            }
        }
        const dataAll = await Promise.all(promises);
        for (let i = 0; i < dataAll.length; i++) {
            if (dataAll[i]) {
                petsData[i].ownerName = `${dataAll[i].firstName} ${dataAll[i].lastName}`;
            } else {
                petsData[i].ownerName = "";
            }
        }
        return petsData;
    } catch (err) {
        console.error("Pets model getPetsOwnersModel: ", err.message);
    }
}


module.exports = {
    getPetsBySearchParamsModel, getPetModel, addPetModel, returnPetModel,
    deletePetModel, deleteSavedPetModel, savePetModel,
    getPetsByUserIdModel, editPetModel, getPetsOwnersModel
};
