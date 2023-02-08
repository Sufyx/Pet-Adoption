/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useState, useEffect, useContext } from 'react';
import {
    Table, Thead, Tbody, Tfoot,
    Tr, Th, Td, TableCaption, TableContainer
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import localforage from 'localforage';
import UsersContext from '../context/UsersContext';
import axios from 'axios';


export default function PetsTable({ toggleSpinner }) {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
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
            toggleSpinner(true);
            const res = await axios.get(`${baseUrl}/pet`,
                { params: { searchParams: {} } });
            const petsData = [...res.data];
            const { token } = await localforage.getItem('loggedUser');
            const promises = [];
            for (let i = 0; i < petsData.length; i++) {
                if (petsData[i].owner) {
                    promises.push(axios.get(`${baseUrl}/users/${petsData[i].owner}`,
                        { headers: { authorization: `Bearer ${token}` } }));
                } else {
                    promises.push(' ');
                }
            }
            const resAll = await Promise.all(promises);
            const dataAll = resAll.map((res) => res.data);
            for (let i = 0; i < dataAll.length; i++) {
                if (dataAll[i]) {
                    const ownerUser = dataAll[i].user;
                    petsData[i].ownerName = `${ownerUser.firstName} ${ownerUser.lastName}`;
                } else {
                    petsData[i].ownerName = "";
                }
            }
            setAllPets([...petsData]);
            toggleSpinner(false);
        } catch (err) {
            console.error("Caught: " + err.message);
        }
    }

    function sortTable(param) {
        console.log("sorting by ", param);
        const sorted = allPets.sort((a, b) => {
            const x = a[param];
            const y = b[param];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        setAllPets([...sorted]);
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
                        <Tr fontWeight='bold' className="cursorPointer">
                            <Th onClick={() => sortTable('name')}>Name</Th>
                            <Th onClick={() => sortTable('type')}>Type</Th>
                            <Th onClick={() => sortTable('breed')}>Breed</Th>
                            <Th onClick={() => sortTable('height')}>Height</Th>
                            <Th onClick={() => sortTable('weight')}>Weight</Th>
                            <Th onClick={() => sortTable('adoptionStatus')}>Status</Th>
                            <Th onClick={() => sortTable('ownerName')}>Owner</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {allPets.map(pet =>
                            <Tr key={pet._id} className="cursorPointer" fontWeight='semibold'>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {`${pet.name}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {`${pet.type}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {`${pet.breed}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {pet.height ? `${pet.height}` : ''}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {pet.weight ? `${pet.weight}` : ''}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}
                                    fontWeight='semibold' textShadow='-0.4px -0.4px black'
                                    color={(pet.adoptionStatus === "Available") ?
                                        "green.500" : "purple.600"} >
                                    {`${pet.adoptionStatus}`}
                                </Td>
                                <Td onClick={() => seePetProfile(pet)}>
                                    {`${pet.ownerName}`}
                                </Td>
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
