/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 15/08/2022
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import { Image, Flex, Box, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import PetActionBtn from '../components/PetActionBtn';
import AdminActionBtn from '../components/AdminActionBtn';
import UsersContext from '../context/UsersContext';


export default function PetPage() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);

    const { userLogged } = useContext(UsersContext);
    const [petId, setPetId] = useState('');
    const [isOwnedByUser, setIsOwnedByUser] = useState(false);
    const [isSavedByUser, setIsSavedByUser] = useState(false);
    const [pet, setPet] = useState({
        name: "",
        adoptionStatus: "",
        type: "",
        picture: "",
        height: "",
        weight: "",
        color: "",
        bio: "",
        hypoallergenic: "",
        dietary: "",
        breed: ""
    });


    useEffect(() => {
        if (userLogged) {
            getPet();
            isPetOwnedByUser();
        } else {
            navigate("/home");
        }
    }, []);


    async function isPetOwnedByUser() {
        const { token } = JSON.parse(localStorage.getItem('loggedUser'));
        const res = await axios.get(`${baseUrl}/pet/user/${userLogged._id}`,
            { headers: { authorization: `Bearer ${token}` } });
        if (!res.data.petList) {
            setIsOwnedByUser(false);
            setIsSavedByUser(false);
            return;
        }
        let petFound = false;
        if (res.data.petList.userPets) {
            console.log("userPets ", res.data.petList.userPets);
            res.data.petList.userPets.forEach(pet => {
                if (pet._id === query.get("petId")) {
                    console.log("pet owned");
                    petFound = true;
                }
            });
        }
        setIsOwnedByUser(petFound);

        petFound = false;
        if (res.data.petList.savedPets) {
            console.log("savedPets ", res.data.petList.savedPets);
            res.data.petList.savedPets.forEach(pet => {
                if (pet._id === query.get("petId")) {
                    console.log("pet saved");
                    petFound = true;
                }
            });
        }
        setIsSavedByUser(petFound);
    }


    async function getPet() {
        try {
            setPetId(query.get("petId"));
            const { token } = JSON.parse(localStorage.getItem('loggedUser'));
            const res = await axios.get(`${baseUrl}/pet/${query.get("petId")}`,
                { headers: { authorization: `Bearer ${token}` } });
            if (!res.data) {
                throw new Error("Pet not found");
            }
            setPet({ ...res.data });
        } catch (err) {
            navigate("/search");
            console.error("Caught: " + err);
        }

    }


    function updateIsOwnedByUser(ownedVal) {
        setIsOwnedByUser(ownedVal);
    }
    function updateIsSavedByUser(ownedVal) {
        setIsSavedByUser(ownedVal);
    }


    const returnPetBtns =
        <>
            <PetActionBtn petAction={"Return"} petName={pet.name} petId={petId}
                updateIsOwnedByUser={updateIsOwnedByUser} updateIsSavedByUser={updateIsSavedByUser} />
        </>;
    const ownPetBtns =
        <>
            <PetActionBtn petAction={"Adopt"} petName={pet.name} petId={petId}
                updateIsOwnedByUser={updateIsOwnedByUser} updateIsSavedByUser={updateIsSavedByUser} />
            <PetActionBtn petAction={"Foster"} petName={pet.name} petId={petId}
                updateIsOwnedByUser={updateIsOwnedByUser} updateIsSavedByUser={updateIsSavedByUser} />
        </>;
    const savePetBtns =
        <>
            <PetActionBtn petAction={"Save"} petName={pet.name} petId={petId}
                updateIsOwnedByUser={updateIsOwnedByUser} updateIsSavedByUser={updateIsSavedByUser} />
        </>

    const unsavePetBtns =
        <>
            <PetActionBtn petAction={"Unsave"} petName={pet.name} petId={petId}
                updateIsOwnedByUser={updateIsOwnedByUser} updateIsSavedByUser={updateIsSavedByUser} />
        </>

    const adminBtns =
        <>
            <AdminActionBtn adminAction={"Edit"} petName={pet.name} petId={petId} updateIsOwnedByUser={updateIsOwnedByUser} />
            <AdminActionBtn adminAction={"Delete"} petName={pet.name} petId={petId} updateIsOwnedByUser={updateIsOwnedByUser} />
        </>


    return (
        // {user.admin ? adminBtn : ""}
        <div className="petPageContainer">
            <Box className="petDisplay" boxShadow='dark-lg'>
                <Flex flexDir="column" m="3%">
                    <Image borderRadius='6px' src={pet.picture} alt='pet picture'
                        fallbackSrc='http://posfacturar.com/pos_organicnails/public/upload/default_image/default_pet.jpg'
                        maxH="70vh" fit="contain" border="2px outset teal" />
                    <Box mt="5%" bg="rgba(99, 203, 203, 0.1)" w="fit-content" p="2%" borderRadius="4px">
                        <Text fontSize="2vw" fontWeight="bold" as='u'
                            textShadow='1px 1px rgb(62, 137, 130)'>{pet.name}</Text>
                        <Text fontSize="1.5vw" mt="0.5%" fontWeight="semibold">Status: {pet.adoptionStatus}</Text>
                    </Box>
                </Flex>
                <Flex flexDir="column" m="1%" pl="1%" w="40%" borderLeft="1px solid rgba(19, 123, 123, 0.2)">
                    <span className="petPageDetails"><b>Type:</b> {pet.type}</span>
                    <span className="petPageDetails"><b>Breed:</b> {pet.breed}</span>
                    <span className="petPageDetails"><b>Color:</b> {pet.color}</span>
                    <span className="petPageDetails"><b>Height:</b> {pet.height}</span>
                    <span className="petPageDetails"><b>Weight:</b> {pet.weight}</span>
                    <span className="petPageDetails"><b>Dietary:</b><br />&nbsp; {pet.dietary.length > 0 ? pet.dietary.join(" , \n") : "None"}</span>
                    <span className="petPageDetails"><b>Hypoallergenic:</b> {pet.hypoallergenic ? "Yes" : "No"}</span>
                </Flex>
                <Flex flexDir="column" w="40%" m="3%" pl="1%" borderLeft="1px solid rgba(19, 123, 123, 0.2)">
                    <Text fontSize="1.4vw" fontWeight='semibold' color='darkslategray'>
                        <b>Bio:</b><br /><br /> {pet.bio}
                    </Text>
                </Flex>
            </Box>
            <Flex flexDir="column" justify="center" align="space-evenly" m="auto">
                {isOwnedByUser ? returnPetBtns :
                    ((pet.adoptionStatus === "Adopted" || pet.adoptionStatus === "Fostered") ? "" : ownPetBtns)}
                {isSavedByUser ? unsavePetBtns : savePetBtns}
                {userLogged.isAdmin ? adminBtns : ""}
            </Flex>
        </div>
    )
}
