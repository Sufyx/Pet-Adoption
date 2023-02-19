/**
 * Pet Adoption Project
 * Asaf Gilboa
*/
const {
    getPetsBySearchParamsModel, addPetModel, deletePetModel, 
    getPetModel, getPetsByUserIdModel, editPetModel, savePetModel, 
    returnPetModel, deleteSavedPetModel, getPetsOwnersModel
} = require('../models/petsModel');



async function getPet(req, res) {
    try {
        const { petId } = req.params;
        const foundPet = await getPetModel(petId);
        res.send(foundPet);
    } catch (err) {
        console.error("Pets controller getPet: ", err.message);
        res.status(500).send(err);
    }
}


async function getPetsBySearchParams(req, res) {
    try {
        const params = JSON.parse(req.query.searchParams);
        const allPets = await getPetsBySearchParamsModel(params);
        res.send(allPets);
    } catch (err) {
        console.error("Pets controller getPetsBySearchParams: ", err.message);
        res.status(500).send(err);
    }
}

async function savePet(req, res) {
    try {
        const { petId } = req.params;
        const { petAction } = req.body;
        const { userId } = req.body;
        await savePetModel(petId, userId, petAction);
        res.send({ ok: true, petId: petId, message: `pet ${petAction}ed :)` });
    } catch (err) {
        console.error("Pets controller savePet: ", err.message);
        res.status(500).send(err);
    }
}

async function returnPet(req, res) {
    try {
        const { petId } = req.params;
        const { userId } = req.body;
        await returnPetModel(petId, userId);
        res.send({ ok: true, petId: petId, message: `pet returned :(` });
    } catch (err) {
        console.error("Pets controller returnPet: ", err.message);
        res.status(500).send(err);
    }
}

async function deleteSavedPet(req, res) {
    try {
        const { petId } = req.params;
        const { userId } = req.body;
        await deleteSavedPetModel(petId, userId);
        res.send({ ok: true, petId: petId, message: `pet unsaved` });
    } catch (err) {
        console.error("Pets controller deleteSavedPet: ", err.message);
        res.status(500).send(err);
    }
}


async function addPet(req, res) {
    try {
        const addedPetId = await addPetModel(req.body);
        res.send(addedPetId);
        return;
    } catch (err) {
        console.error("Pets controller addPet: ", err.message);
        res.status(500).send(err);
    }
}


async function editPet(req, res) {
    try {
        const { petId } = req.params;
        const petData = { ...req.body }
        const editedPet = await editPetModel(petId, petData);
        res.send(editedPet);
    } catch (err) {
        console.error("Pets controller editPet: ", err.message);
        res.status(500).send(err);
    }
}


async function deletePet(req, res) {
    try {
        const { petId } = req.params;
        const deletedPet = await deletePetModel(petId);
        if (deletedPet) {
            res.send({ ok: true, deletedPet: petId, message: 'Pet Deleted' });
            return;
        }
    } catch (err) {
        console.error("Pets controller deletePet: ", err.message);
        res.status(500).send(err);
    }
}


async function getPetsByUserId(req, res) {
    try {
        const { userId } = req.params;
        const petList = await getPetsByUserIdModel(userId);
        res.send({ ok: true, petList });
    } catch (err) {
        console.error("Pets controller getPetsByUserId: ", err.message);
        res.status(500).send(err);
    }
}


async function getPetsOwners(req, res) {
    try {
        const petList = await getPetsOwnersModel();
        res.send({ ok: true, petList });
    } catch (err) {
        console.error("Pets controller getPetsOwners: ", err.message);
        res.status(500).send(err);
    }
}



module.exports = {
    getPetsBySearchParams, getPet, savePet, returnPet,
    addPet, editPet, deletePet, deleteSavedPet, 
    getPetsByUserId, getPetsOwners
};
