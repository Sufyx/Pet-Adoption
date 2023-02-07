/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import {
    Button, Input, FormControl, FormLabel, Checkbox, Textarea,
    Flex, Text, Select, InputLeftAddon, InputRightAddon,
    InputGroup, Box, Spinner, ListItem, UnorderedList,
} from '@chakra-ui/react';
import UsersContext from '../context/UsersContext';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import uuid from 'react-uuid';

export default function PetSettings({ newPet }) {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const petId = query.get("petId");
    const navigate = useNavigate();

    const { userLogged } = useContext(UsersContext);
    const [typeList, setTypeList] = useState([]);
    const [dietaryItem, setDietaryItem] = useState('');
    const [petImage, setPetImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [spinnerUp, setSpinnerUp] = useState(false);
    const [formInputs, setFormInputs] = useState({
        type: '',
        name: '',
        adoptionStatus: '',
        height: '',
        weight: '',
        color: '',
        bio: '',
        hypoallergenic: false,
        dietary: [],
        breed: ''
    });


    useEffect(() => {
        if (!userLogged.isAdmin) {
            navigate("/home");
            return;
        }
        setTypeList(['Dog', 'Cat']);
        if (!newPet) {
            fillSettings();
        }
    }, []);

    useEffect(() => {
        setErrorMessage('');
    }, [formInputs.breed, formInputs.name,
    formInputs.adoptionStatus, formInputs.type]);


    async function fillSettings() {
        const { token } = JSON.parse(localStorage.getItem('loggedUser'));
        const res = await axios.get(`${baseUrl}/pet/${query.get("petId")}`,
            { headers: { authorization: `Bearer ${token}` } });
        if (res.data) {
            const pet = res.data;
            setFormInputs(prev => ({
                ...prev, ...pet
            }));
        }
    }


    function inputLimit(value, limit) {
        if (value.length > limit) {
            return value.slice(0, limit);
        } else return value;
    }

    function addDietaryItem() {
        if (!dietaryItem) return;
        setFormInputs(prev => ({ ...prev, dietary: [...formInputs.dietary, dietaryItem] }));
        setDietaryItem('');
    }

    function removeDietaryItem(index) {
        const dietaryList = [...formInputs.dietary];
        dietaryList.splice(index, 1);
        setFormInputs(prev => ({ ...prev, dietary: [...dietaryList] }));
    }


    function validatePet() {
        if (!formInputs.type) {
            setErrorMessage("Please enter a pet type");
            return false;
        } else if (!formInputs.adoptionStatus) {
            setErrorMessage("Please enter a pet status");
            return false;
        } else if (!formInputs.name) {
            setErrorMessage("Please enter a pet name");
            return false;
        } else if (!formInputs.breed) {
            setErrorMessage("Please enter a pet breed");
            return false;
        }
        return true;
    }


    async function saveClick(e) {
        e.preventDefault();

        if (newPet) {
            if (!validatePet()) return;
        }

        try {
            const petData = new FormData();
            for (let key in formInputs) {
                if (formInputs[key].length > 0) {
                    petData.append(key + "", formInputs[key]);
                }
            }
            petData.append("hypoallergenic", formInputs.hypoallergenic);
            if (petImage) {
                petData.append("picture", petImage);
            }
            setSpinnerUp(true);
            const { token } = JSON.parse(localStorage.getItem('loggedUser'));
            if (newPet) {
                const res = await axios.post(`${baseUrl}/pet`,
                    petData, { headers: { authorization: `Bearer ${token}` } });
                if (res.data) {
                    console.log("PetSettings 151 res.data ", res.data);
                    navigate(`/pet?petId=${res.data}`);
                }
            } else {
                const res = await axios.put(`${baseUrl}/pet/${petId}`,
                    petData, { headers: { authorization: `Bearer ${token}` } });
                if (res.data) {
                    console.log("pet edit response: ", res.data);
                    navigate(`/pet?petId=${petId}`);
                }
            }
            clearForm();
            setSpinnerUp(false);
        } catch (err) {
            console.error("Caught :", err);
        }
    }


    function clearForm() {
        setFormInputs({
            type: '',
            name: '',
            adoptionStatus: '',
            height: '',
            weight: '',
            color: '',
            bio: '',
            hypoallergenic: false,
            dietary: [],
            breed: ''
        });
        setDietaryItem('');
        setPetImage('');
        setErrorMessage('');
    }


    const spinner =
        <>
            <Spinner thickness='6px' speed='0.7s' emptyColor='teal.200' color='teal.800' size='md' />
        </>



    return (
        <div className="petSettingsContainer">
            <FormControl>

                <InputGroup alignItems="center" w="90%"
                    m="auto" my="1%" boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Type: ' w="15%" fontSize="1.2vw"
                        fontWeight='semibold' bg="rgb(57, 164, 164)" color="whitesmoke" />
                    <Select placeholder='Select pet type' maxW='90%' fontSize="1.1vw"
                        p="0" my="0" value={formInputs.type}
                        onChange={e => {
                            setFormInputs(prev => ({
                                ...prev, type: e.target.value
                            }))
                        }}>
                        {typeList.map(type =>
                            <option value={type} key={uuid()}>{type}</option>
                        )}
                    </Select>
                </InputGroup>
                <hr />

                <InputGroup alignItems="center" w="90%"
                    m="auto" my="1%" boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Status: ' w="15%" fontSize="1.2vw"
                        fontWeight='semibold' bg="rgb(57, 164, 164)" color="whitesmoke" />
                    <Select placeholder='Select adoption status' maxW='90%' fontSize="1.1vw"
                        p="0" my="0" value={formInputs.adoptionStatus}
                        onChange={e => {
                            setFormInputs(prev => ({
                                ...prev, adoptionStatus: e.target.value
                            }))
                        }}>
                        <option value='Adopted' >Adopted</option>
                        <option value='Fostered' >Fostered</option>
                        <option value='Available' >Available</option>
                    </Select>
                </InputGroup>
                <hr />

                <InputGroup alignItems="center" w="90%"
                    m="auto" my="1%" boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Name: ' w="15%" fontSize="1.2vw"
                        fontWeight='semibold' bg="rgb(57, 164, 164)" color="whitesmoke" />
                    <Input value={formInputs.name} type='text'
                        placeholder="Name" className="petFormLabel"
                        fontSize="1.2vw" p="0" my="0" pl="2%"
                        onChange={e => {
                            setFormInputs(prev => ({ ...prev, name: inputLimit(e.target.value, 40) }))
                        }} />
                </InputGroup>
                <hr />

                <InputGroup alignItems="center" w="90%"
                    m="auto" my="1%" boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Color: ' w="15%" fontSize="1.2vw"
                        fontWeight='semibold' bg="rgb(57, 164, 164)" color="whitesmoke" />
                    <Input value={formInputs.color} type='text' placeholder="Color"
                        className="petFormLabel" fontSize="1.2vw" p="0" my="0" pl="2%"
                        onChange={e => {
                            setFormInputs(prev => ({ ...prev, color: inputLimit(e.target.value, 20) }))
                        }} />
                </InputGroup>
                <hr />

                <InputGroup alignItems="center" w="90%"
                    m="auto" my="1%" boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Breed: ' w="15%" fontSize="1.2vw"
                        fontWeight='semibold' bg="rgb(57, 164, 164)" color="whitesmoke" />
                    <Input value={formInputs.breed} type='text' placeholder="Breed"
                        className="petFormLabel" fontSize="1.2vw" p="0" my="0" pl="2%"
                        onChange={e => {
                            setFormInputs(prev => ({ ...prev, breed: inputLimit(e.target.value, 20) }))
                        }} />
                </InputGroup>
                <hr />

                <InputGroup alignItems="center" w="90%"
                    m="auto" my="1%" boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Height: ' w="15%" fontSize="1.2vw"
                        fontWeight='semibold' bg="rgb(57, 164, 164)" color="whitesmoke" />
                    <Input value={formInputs.height} type='number' placeholder="Height"
                        min={1} max={500} className="petFormLabel" fontSize="1.2vw"
                        p="0" my="0" pl="2%" onChange={e => {
                            setFormInputs(prev => ({ ...prev, height: e.target.value }))
                        }} />
                </InputGroup>
                <hr />

                <InputGroup alignItems="center" w="90%"
                    m="auto" my="1%" boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Weight: ' w="15%" fontSize="1.2vw"
                        fontWeight='semibold' bg="rgb(57, 164, 164)" color="whitesmoke" />
                    <Input value={formInputs.weight} type='number' placeholder="Weight"
                        min={1} max={500} className="petFormLabel" fontSize="1.2vw"
                        p="0" my="0" pl="2%" onChange={e => {
                            setFormInputs(prev => ({ ...prev, weight: e.target.value }))
                        }} />
                </InputGroup>
                <hr />

                <Box boxShadow='dark-lg' border="1px solid whitesmoke"
                    ml="5%" my="1%" borderRadius="4px" w="25%">
                    <Checkbox fontWeight='semibold' isChecked={formInputs.hypoallergenic}
                        bg="rgb(57, 164, 164)" borderRadius="4px" w="100%" p="5%"
                        colorScheme='white' onChange={e => {
                            setFormInputs(prev => ({
                                ...prev, hypoallergenic: !formInputs.hypoallergenic
                            }));
                        }}>
                        <Text fontSize="1.2vw" color="whitesmoke" >Hypoallergenic</Text>
                    </Checkbox>
                </Box>
                <hr />

                <InputGroup alignItems="center" w="90%" m="auto" mt="1%"
                    boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Add Dietary: ' w="21%" color="whitesmoke"
                        fontSize="1.2vw" fontWeight='semibold' bg="rgb(57, 164, 164)" />
                    <Input value={dietaryItem} placeholder='Dietary item'
                        type='text' fontSize="1.1vw" p="0" my="0" pl="2%"
                        onChange={e => setDietaryItem(e.target.value)} />
                    <InputRightAddon children='+Add' fontSize="1.2vw" fontWeight='semibold'
                        bg="rgb(57, 164, 164)" color="whitesmoke" w="15%"
                        onClick={addDietaryItem} className="cursorPointer" />
                </InputGroup>
                <InputGroup alignItems="center" w="90%" m="auto" mb="1%"
                    boxShadow='dark-lg' borderRadius="5px">
                    <InputLeftAddon children='Dietary Items: ' w="21%" fontSize="1.2vw"
                        fontWeight='semibold' bg="rgb(57, 164, 164)" color="whitesmoke" />
                    <UnorderedList placeholder='Added dietary items' fontSize="1.2vw" w="90%">
                        {formInputs.dietary.map((item, index) =>
                            <ListItem key={uuid()} w="90%" ml="2%"
                                color="teal.800" fontWeight='semibold'>
                                <Flex align="center" justify="space-between" w="90%">
                                    <Text >{item}</Text>
                                    <Button onClick={() => removeDietaryItem(index)}
                                        w="1vw" h="1vw" fontSize="1vw" p="0" bg="none">
                                        [X]
                                    </Button>
                                </Flex>
                            </ListItem>
                        )}
                    </UnorderedList>
                </InputGroup>
                <hr />

                <Flex w="90%" m="auto" my="1%" boxShadow='dark-lg' borderRadius="4px">
                    <FormLabel className="petFormLabel" bg="rgb(57, 164, 164)"
                        color="whitesmoke" w="10%" fontSize="1.2vw" p="2%" fontWeight='semibold'
                        border="0.1px solid whitesmoke" borderRadius="4px" h="50%" m="0.5%" >
                        Bio
                    </FormLabel>
                    <Textarea value={formInputs.bio} type='text'
                        placeholder="Bio" fontSize="1vw" onChange={e => {
                            setFormInputs(prev => ({
                                ...prev, bio: inputLimit(e.target.value, 300)
                            }))
                        }} />
                </Flex>
                <hr />

                <InputGroup w="25%" my="1%" ml="5%" boxShadow='dark-lg' borderRadius="5px">
                    <FormLabel className="imgInputLabel cursorPointer" w="100%"
                        p="5%" m="0" htmlFor="imgInput" bg="rgb(57, 164, 164)"
                        border="1.5px solid whitesmoke" borderRadius="4px">
                        <Text w="100%" fontSize="1.2vw" fontWeight='semibold'
                            color="whitesmoke" textAlign="center">
                            Upload Image
                        </Text>
                        <input type="file" accept="image/*" id="imgInput"
                            onChange={e => setPetImage(e.target.files[0])} />
                    </ FormLabel>
                </InputGroup>
                <hr />

                <Flex flexDir="column" mt="5%">
                    <Text color="red" ml="1%" fontWeight='semibold'>
                        {errorMessage}
                    </Text>
                    <Flex justify="space-between" w="90%" mt="1%">
                        <Button onClick={saveClick} colorScheme='teal' fontSize="1.5vw" w="30%" >
                            {spinnerUp ? spinner : "Save"}
                        </Button>
                        <Button onClick={clearForm} colorScheme='teal' fontSize="1.3vw" w="20%" >
                            Clear
                        </Button>
                        <Button onClick={fillSettings} colorScheme='teal' fontSize="1.3vw" w="20%" >
                            Restore
                        </Button>

                    </Flex>
                </Flex>

            </FormControl>
        </div>
    )
}
