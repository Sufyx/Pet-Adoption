/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 03/09/2022
 * Asaf Gilboa
*/

import { React, useState, useEffect, useContext } from 'react';
import {
    Button, Table, Thead, Tbody, Tfoot,
    Tr, Th, Td, TableCaption, TableContainer
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import UsersContext from '../context/UsersContext';
import axios from 'axios';


export default function PetsTable() {
    const baseUrl = "http://localhost:6060";
    const navigate = useNavigate();

    const [allPets, setAllPets] = useState([]);
    const { userLogged } = useContext(UsersContext);

    useEffect(() => {
        if (!userLogged.isAdmin) {
            navigate("/home");
        } else {
            fetchPets();
        }
    }, []);

    async function fetchPets() {
        try {
            const res = await axios.get(`${baseUrl}/pet`,
                { params: { searchParams: {} } });

            const petsData = [...res.data];
            for (let i = 0; i < petsData.length; i++) {
                petsData[i].ownerName = "";
                if (petsData[i].owner) {
                    const { token } = JSON.parse(localStorage.getItem('loggedUser'));
                    const res = await axios.get(`${baseUrl}/users/${petsData[i].owner}`,
                        { headers: { authorization: `Bearer ${token}` } });
                    const ownerUser = res.data.user;
                    petsData[i].ownerName = `${ownerUser.firstName} ${ownerUser.lastName}`;
                }
            }
            setAllPets([...res.data]);
        } catch (err) {
            console.error("Caught: " + err.message);
        }
    }

    async function seePetProfile(pet) {
        navigate(`/pet?petId=${pet._id}`);
    }

    return (
        <div className='usersPageContainer'>
            <TableContainer>
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption>Pets Database</TableCaption>
                    <Thead>
                        <Tr fontWeight='bold'>
                            <Th>Name</Th>
                            <Th>Type</Th>
                            <Th>Breed</Th>
                            <Th>Height</Th>
                            <Th>Weight</Th>
                            <Th>Status</Th>
                            <Th>Owner</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {allPets.map(pet =>
                            <Tr key={pet._id} className="cursorPointer" fontWeight='semibold'>
                                <Td onClick={() => seePetProfile(pet)}>{`${pet.name}`}</Td>
                                <Td onClick={() => seePetProfile(pet)}>{`${pet.type}`}</Td>
                                <Td onClick={() => seePetProfile(pet)}>{`${pet.breed}`}</Td>
                                <Td onClick={() => seePetProfile(pet)}>{`${pet.height}`}</Td>
                                <Td onClick={() => seePetProfile(pet)}>{`${pet.height}`}</Td>
                                <Td onClick={() => seePetProfile(pet)}
                                    fontWeight='semibold' textShadow='-0.4px -0.4px black'
                                    color={(pet.adoptionStatus === "Available") ? "green.500" : "purple.600"} >
                                    {`${pet.adoptionStatus}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>{`${pet.ownerName}`}</Td>
                            </Tr>
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Type</Th>
                            <Th>Breed</Th>
                            <Th>Height</Th>
                            <Th>Weight</Th>
                            <Th>Status</Th>
                            <Th>Owner</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </div>
    )

}
