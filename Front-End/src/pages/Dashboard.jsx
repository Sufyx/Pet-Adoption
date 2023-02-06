/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import { Box, Flex, Button, Divider, Spinner } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import PetSettings from "./PetSettings"
import UsersPage from '../components/UsersTable';
import PetsTable from '../components/PetsTable';
import axios from 'axios';
import UsersContext from '../context/UsersContext';

export default function Dashboard() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();

    const { userLogged } = useContext(UsersContext);
    const [activeTab, setActiveTab] = useState("users");
    const [spinnerUp, setSpinnerUp] = useState(false);

    useEffect(() => {
        if (!userLogged.isAdmin) {
            navigate("/home");
        } else {
            verifyAdmin();
        }
    }, []);


    async function verifyAdmin() {
        const { token } = JSON.parse(localStorage.getItem('loggedUser'));
        const res = await axios.get(`${baseUrl}/users/${userLogged._id}`,
            { headers: { authorization: `Bearer ${token}` } });
        const user = res.data.user;
        console.log("verifyAdmin user ", user);
        if (!user.isAdmin) {
            navigate("/home");
        }
    }

    function toggleSpinner(spinnerUp) {
        setSpinnerUp(spinnerUp);
    }


    const petsTab =
        <><PetsTable toggleSpinner={toggleSpinner} /></>

    const usersTab =
        <><UsersPage toggleSpinner={toggleSpinner} /></>

    const addPetTab =
        <><PetSettings newPet={true} /></>

    const spinner =
        <>
            <Spinner thickness='6px' speed='0.7s' emptyColor='teal.200' color='teal.800' size='md' />
        </>


    return (
        <div className="dashBoardContainer">
            <Flex flexDir="column">
                <Flex justify='center' >
                    <Button onClick={() => setActiveTab("pets")} bg='rgb(57, 164, 164)' w="10%"
                        color="whitesmoke" fontSize="1.8vw" m="1% 5%" border="1px outset teal"
                        _hover={{ bg: 'whitesmoke', color: 'teal.500' }} boxShadow='dark-lg'>
                            {spinnerUp ? spinner : "Pets"}
                    </ Button>
                    <Button onClick={() => setActiveTab("users")} bg='rgb(57, 164, 164)' w="10%"
                        color="whitesmoke" fontSize="1.8vw" m="1% 5%" border="1px outset teal"
                        _hover={{ bg: 'whitesmoke', color: 'teal.500' }} boxShadow='dark-lg'>
                        {spinnerUp ? spinner : "Users"}
                    </ Button>
                    <Button onClick={() => setActiveTab("addPet")} bg='rgb(57, 164, 164)' w="10%"
                        color="whitesmoke" fontSize="1.8vw" m="1% 5%" border="1px outset teal"
                        _hover={{ bg: 'whitesmoke', color: 'teal.500' }} boxShadow='dark-lg'>
                        {spinnerUp ? spinner : "Add Pet"}
                    </ Button>
                </Flex>
                <Divider />
                <Box>
                    {activeTab === "pets" ? petsTab : ""}
                    {activeTab === "users" ? usersTab : ""}
                    {activeTab === "addPet" ? addPetTab : ""}
                </Box>
            </Flex>
        </div>
    )
}
