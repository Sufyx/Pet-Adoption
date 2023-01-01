/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 03/09/2022
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import {
    Button, Flex, Heading, Stack, Text,
    useBreakpointValue, Textarea
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import UsersContext from '../context/UsersContext';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

export default function UserProfile() {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const userId = query.get("userId");

    const { userLogged } = useContext(UsersContext);
    const [fullUser, setFullUser] = useState({});
    const [userBio, setUserBio] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [editVal, setEditVal] = useState('');


    useEffect(() => {
        if ((userId === userLogged._id) || (userLogged.isAdmin)) {
            fetchUser();
        } else {
            navigate("/home");
        }
    }, []);


    async function fetchUser() {
        try {
            const { token } = JSON.parse(localStorage.getItem('loggedUser'));
            const res = await axios.get(`${baseUrl}/users/${userId}`,
                { headers: { authorization: `Bearer ${token}` } });

            // console.log("UserProfile fetchUser res.data ", res.data.user);
            const user = res.data.user
            setFullUser(user);
            if (user.bio) {
                setUserBio(user.bio);
            } else {
                setUserBio(`${user.firstName}'s bio.`);
            }
        } catch (err) {
            console.error("Caught: " + err.message);
        }
    }


    async function saveBio() {
        const { token } = JSON.parse(localStorage.getItem('loggedUser'));
        const res = await axios.put(`${baseUrl}/users/${userId}`, { bio: editVal },
            { headers: { authorization: `Bearer ${token}` } });
        // console.log("userSettings saveBio updatedUser ", res.data.updatedUser);
        setUserBio(res.data.updatedUser.bio);
        closeEdit();
    }


    async function goToPets() {
        navigate(`/mypets?userId=${userId}&firstName=${fullUser.firstName}`);
    }


    async function goToSettings() {
        navigate(`/usersettings?userId=${userId}`);
    }


    async function closeEdit() {
        setEditVal('');
        setIsEdit(false);
    }


    async function toggleEdit() {
        setIsEdit(true);
        setEditVal(userBio);
    }


    const editIcon =
        <>
            <Text color="whitesmoke" as={'span'} fontSize="1.5vw" fontWeight='semibold' mr="5%" px="1%" pt="0.5%"
                onClick={toggleEdit} className="cursorPointer" bg="rgba(57, 164, 164, 0.8)" borderRadius="4px">
                <EditIcon />
                Edit bio
            </Text>
        </>


    const profileBio =
        <>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.800'} minH="10vw" p="1%"
                fontWeight='semibold' bg="rgba(200, 220, 220, 0.6)" borderRadius="5px">
                {userBio}
            </Text>
        </>

    const editBio =
        <>
            <Textarea fontSize={{ base: 'md', lg: 'lg' }} color={'gray.800'} minH="10vw" p="1%"
                type='text' value={editVal} onChange={(e) => setEditVal(e.target.value)}
                fontWeight='semibold' bg="rgba(200, 220, 220, 0.6)" borderRadius="5px" placeholder={userBio} />
            <Flex justify='space-between'>
                <Button onClick={saveBio} rounded={'full'} bg={'teal.500'} color={'white'}
                    _hover={{ bg: 'blue.400', }} w="15%" m="1%">
                    Save
                </Button>
                <Button onClick={closeEdit} rounded={'full'} bg={'teal.500'} color={'white'}
                    _hover={{ bg: 'blue.400', }} w="15%" m="1%">
                    Cancel
                </Button>
            </Flex>
        </>

    return (
        <div className='userProfileContainer'>
            <Stack minH='80%' direction={{ base: 'column', md: 'row' }} mt="5%" >
                <Flex flexDir='column' justify='space-between' align='center' pr="3%" pb="5%" w="48%"
                    borderRight="2px inset rgba(116, 185, 178, 0.4)">
                    <Flex flexDir='column' align='center' w={'full'} maxW={'lg'}>
                        <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} >
                            <Text as={'span'} position={'relative'}
                                _after={{
                                    content: "''", width: 'full', position: 'absolute',
                                    height: useBreakpointValue({ base: '20%', md: '30%' }),
                                    bottom: 1, left: 0, bg: 'teal.400', zIndex: -1,
                                }}>
                                {`${fullUser.firstName} ${fullUser.lastName}`}
                            </Text>
                            <br />{' '}
                        </Heading>
                        <Flex flexDir="column" mt="2%">
                            <Flex>
                                <Text fontSize={{ base: '2vw', lg: 'lg' }} color={'gray.800'} fontWeight='semibold'>
                                    Email: &nbsp;
                                </Text>
                                <Text fontSize={{ base: '2vw', lg: 'lg' }} color={'teal.800'} fontWeight='semibold'>
                                    {fullUser.email}
                                </Text>
                            </Flex>
                            <Flex>
                                <Text fontSize={{ base: '2vw', lg: 'lg' }} color={'gray.800'} fontWeight='semibold'>
                                    Phone: &nbsp;
                                </Text>
                                <Text fontSize={{ base: '2vw', lg: 'lg' }} color={'teal.800'} fontWeight='semibold'>
                                    {fullUser.phone}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Button rounded={'full'} bg={'teal.500'} color={'whitesmoke'} fontSize="2.2vw"
                        _hover={{ bg: 'whitesmoke', color: 'teal.500' }} py="8%" w="60%" 
                        border="2px outset teal" onClick={goToPets} >
                        {`${fullUser.firstName}'s pets`}
                    </Button>
                </Flex>
                <Flex flexDir='column' justify='space-between' align='center' pr="3%" pb="5%" w="48%">
                    <Flex flexDir='column' w="98%">
                        <Flex justify='space-between'>
                            <Text color={'teal.800'} as={'span'} fontSize="2vw" fontWeight='bold'>
                                &nbsp; Bio:
                            </Text>{' '}
                            {isEdit ? '' : editIcon}
                        </Flex>
                        {isEdit ? editBio : profileBio}
                    </Flex>
                    <Button rounded={'full'} color={'teal.800'} fontWeight='bold' fontSize="2vw"
                        _hover={{ bg: 'teal.600', color: 'whitesmoke' }} p="8%" 
                        border="2px outset teal" onClick={goToSettings} >
                        Edit settings
                    </Button>
                </Flex>
            </Stack>
        </div>
    )
}
