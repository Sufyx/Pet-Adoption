/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 18/08/2022
 * Asaf Gilboa
*/
const {
    getPetsBySearchParamsModel, addPetModel,
    deletePetModel, getPetModel, getPetsByUserIdModel,
    editPetModel, savePetModel, returnPetModel, deleteSavedPetModel
} = require('../models/petsModel');



async function getPet(req, res) {
    try {
        const { petId } = req.params;
        const foundPet = await getPetModel(petId);
        res.send(foundPet);
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}


async function getPetsBySearchParams(req, res) {
    try {
        const params = JSON.parse(req.query.searchParams);
        const allPets = await getPetsBySearchParamsModel(params);
        res.send(allPets);
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function savePet(req, res) {
    try {
        const { petId } = req.params;
        const { petAction } = req.body;
        const { userId } = req.body;
        const modelRes = await savePetModel(petId, userId, petAction);
        res.send({ ok: true, petId: petId, message: `pet ${petAction}ed :)` });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function returnPet(req, res) {
    try {
        const { petId } = req.params;
        const { userEmail } = req.body;
        const modelRes = await returnPetModel(petId, userEmail);
        res.send({ ok: true, petId: petId, message: `pet returned :(` });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}

async function deleteSavedPet(req, res) {
    try {
        const { petId } = req.params;
        const { userId } = req.body;
        const modelRes = await deleteSavedPetModel(petId, userId);
        res.send({ ok: true, petId: petId, message: `pet unsaved` });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}


function addPet(req, res) {
    try {
        const petData = { ...req.body }
        console.log("addPet petData ", petData);
        const newPet = {
            type: petData.type,
            name: petData.name,
            adoptionStatus: petData.adoptionStatus,
            picture: (petData.picture ? petData.picture : ''),
            height: (petData.height ? Number(petData.height) : ''),
            weight: (petData.weight ? Number(petData.weight) : ''),
            color: (petData.color ? petData.color : ''),
            bio: (petData.bio ? petData.bio : ''),
            hypoallergenic: (petData.hypoallergenic ? petData.hypoallergenic : false),
            dietary: (petData.dietary ? petData.dietary : []),
            breed: petData.breed,
            owner: '',
            savedAtUsers: []
        };
        const addedPetId = addPetModel(newPet);
        res.send(addedPetId);
        return;
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}


async function editPet(req, res) {
    try {
        const { petId } = req.params;
        const petData = { ...req.body }
        //if pet was changed to available, update owners
        const editedPet = await editPetModel(petId, petData);
        res.send(editedPet);
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}


async function deletePet(req, res) {
    try {
        const { petId } = req.params;
        const deletedPet = deletePetModel(petId);
        if (deletedPet) {
            res.send({ ok: true, deletedPet: petId, message: 'Pet Deleted' });
            return;
        }
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}


async function getPetsByUserId(req, res) {
    try {
        const { userId } = req.params;
        const petList = await getPetsByUserIdModel(userId);
        res.send({ ok: true, petList });
    } catch (err) {
        console.error("Caught: ", err.message);
        res.status(500).send(err);
    }
}



module.exports = {
    getPetsBySearchParams, getPet, savePet, returnPet,
    addPet, editPet, deletePet, deleteSavedPet, getPetsByUserId
};
