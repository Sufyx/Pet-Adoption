/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 23/08/2022
 * Asaf Gilboa
*/

const { getPetModel } = require("../models/petsModel");
const { getUserByEmailModel } = require("../models/usersModel");


async function isPetAvailable(req, res, next) {
    const { petId } = req.params;
    const petToCheck = await getPetModel(petId);
    if ((petToCheck.adoptionStatus === "Adopted") || (petToCheck.adoptionStatus === "Fostered")
        || (!petToCheck)) {
        res.status(400).send("Pet not available for adoption/foster");
        return;
    }
    // if (userToCheck.userPets.includes(petId)) {
    //     res.status(400).send(`Pet is already adopted/fostered by user (${userToCheck.email})`);
    //     return;
    // }
    next();
}


async function doesUserHavePet(req, res, next) {
    const { petId } = req.params;
    // const userEmail = (req.query.userEmail);
    const { userEmail } = req.body;
    // const petToCheck = await getPetModel(petId);
    const userToCheck = await getUserByEmailModel(userEmail);
    // console.log("petsMiddleware doesUserHavePet: petId ", petId);
    // console.log("petsMiddleware doesUserHavePet: userToCheck.userPets ", userToCheck.userPets);
    if (!userToCheck.userPets.includes(petId)) {
        res.status(400).send(`Pet is not owned by user (${userToCheck.email})`);
        return;
    }
    next();
}


async function editPetMiddleware(req, res, next) {
    const { picture } = req.body;

    console.log("editPetMiddleware picture ", picture);
    next();
}


module.exports = { isPetAvailable, doesUserHavePet, editPetMiddleware };
