/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import { Box, Grid, GridItem, Flex, Button, Text, Spinner } from '@chakra-ui/react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import UsersContext from '../context/UsersContext';
import PetCard from '../components/PetCard';


export default function UserPets() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const userId = query.get("userId");
    const firstName = query.get("firstName");

    const { userLogged } = useContext(UsersContext);
    const [petList, setPetList] = useState([]);
    const [listToDisplay, setListToDisplay] = useState('userPets');
    const [spinnerUp, setSpinnerUp] = useState(false);

    useEffect(() => {
        if ((query.get("userId") === userLogged._id) || (userLogged.isAdmin)) {
            fetchPets();
        } else {
            navigate("/home");
        }
    }, []);


    useEffect(() => {
        fetchPets();
    }, [listToDisplay]);


    async function fetchPets() {
        try {
            setSpinnerUp(true);
            const { token } = JSON.parse(localStorage.getItem('loggedUser'));
            const res = await axios.get(`${baseUrl}/pet/user/${userId}`,
                { headers: { authorization: `Bearer ${token}` } });
            if (listToDisplay === "userPets") {
                if (res.data.petList.userPets) {
                    setPetList(res.data.petList.userPets);
                }
            } else {
                if (res.data.petList.savedPets) {
                    setPetList(res.data.petList.savedPets);
                }
            }
            setSpinnerUp(false);
        } catch (err) {
            console.error("Caught: " + err.message);
        }
    }


    function toggleList() {
        if (listToDisplay === "userPets") {
            setListToDisplay("savedPets");
        } else {
            setListToDisplay("userPets");
        }
    }


    const spinner =
        <>
            <Spinner thickness='6px' speed='0.7s' emptyColor='teal.200' color='teal.800' size='md' />
        </>

    const petsDisplay =
        <>
            <Grid templateColumns='repeat(4, 1fr)' gap={5} className="userPetsGrid">
                {petList.map(pet =>
                    <GridItem key={pet._id}>
                        <PetCard pet={pet} />
                    </GridItem>
                )}
            </Grid>
        </>

    const noPetsMessage =
        <>
            <Text fontSize="2vw" m="5%">
                {listToDisplay === "userPets" ?
                    `${firstName} currently does not have pets adopted or fostered` :
                    `${firstName} currently does not have pets saved`}
            </Text>
        </>

    return (
        <div className="userPetsContainer homeFont">
            <Flex flexDir="column" align="center">
                <Text fontSize="2.2vw" my="1%" as='u' fontWeight='bold'
                    textShadow='-0.5px -0.5px rgb(67,155,173)' >
                    {firstName}'s Pets Page
                </Text>
                <Button onClick={toggleList} colorScheme='teal' w="fit-content" >
                    {spinnerUp ? spinner :
                        listToDisplay === "userPets" ? "Show saved pets" :
                            "Show adopted/fostered pets"}
                </Button>
            </Flex>
            <Box m="1%" rounded='md' w="98%">
                {spinnerUp ? "" : 
                petList.length === 0 ? noPetsMessage : petsDisplay}
            </Box>
        </div>
    )
}
