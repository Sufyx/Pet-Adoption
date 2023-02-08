/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import PetSearchResults from '../components/PetSearchResults';
import { React, useEffect, useState, useContext } from 'react';
import UsersContext from '../context/UsersContext';
import uuid from 'react-uuid';
import {
    Input, VStack, Heading, Select, Button, FormLabel, Checkbox, Spinner,
    InputLeftAddon, InputRightAddon, InputGroup, Flex, Text, useToast
} from '@chakra-ui/react';


export default function Search() {
    const {
        userLogged, loginHook, updateSearch, lastSearch
    } = useContext(UsersContext);

    const toast = useToast();

    const [spinnerUp, setSpinnerUp] = useState(false);
    const typeList = ['Dog', 'Cat'];
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [searchForm, setSearchForm] = useState({
        petName: '',
        type: '',
        status: '',
        minHeight: '',
        maxHeight: '',
        minWeight: '',
        maxWeight: ''
    });


    useEffect(() => {
        if (userLogged) {
            setAdvancedSearch(true);
            setSearchForm({ ...lastSearch });
        }
    }, []);


    function validateSearch() {
        if (searchForm.minHeight && searchForm.maxHeight) {
            if (searchForm.minHeight > searchForm.maxHeight) {
                return false;
            }
        }
        if (searchForm.minWeight && searchForm.maxWeight) {
            if (searchForm.minWeight > searchForm.maxWeight) {
                return false;
            }
        }
        if (searchForm.petName &&
            searchForm.petName.length > 40) {
            return false;
        }
        return true;
    }


    function searchClick() {
        if (!validateSearch()) {
            clearSearch();
            toast({
                title: "Invalid search parameters",
                status: 'warning',
                duration: 5000,
                position: 'left',
                isClosable: true,
            });
            return;
        }
        updateSearch({ ...searchForm });
    }


    function toggleAdvancedSearch(e) {
        if (e.target.checked) {
            setAdvancedSearch(true);
        } else {
            setAdvancedSearch(false);
        }
    }


    function triggerLogin() {
        loginHook();
    }


    function clearSearch() {
        setSearchForm({
            petName: '',
            type: '',
            status: '',
            minHeight: '',
            maxHeight: '',
            minWeight: '',
            maxWeight: ''
        });
        updateSearch({
            petName: '',
            type: '',
            status: '',
            minHeight: '',
            maxHeight: '',
            minWeight: '',
            maxWeight: ''
        });
    }


    function toggleSpinner(spinnerUp) {
        setSpinnerUp(spinnerUp);
    }


    const advancedSearchOptions =
        <>
            <Select placeholder='Adoption status' borderBottom="1px inset rgb(116, 185, 178)"
                maxW='90%' value={searchForm.status} bg="rgba(240, 240, 240, 0.6)"
                fontSize="1.3vw"
                onChange={e => {
                    setSearchForm(prev => ({
                        ...prev, status: e.target.value
                    }))
                }} >
                <option value='Adopted' >Adopted</option>
                <option value='Fostered' >Fostered</option>
                <option value='Available' >Available</option>
            </Select>

            <Input placeholder='Search pet by name' value={searchForm.petName} maxW='90%'
                fontSize="1.3vw" borderBottom="1px inset rgb(116, 185, 178)" mt="2%"
                type='text' bg="rgba(240, 240, 240, 0.6)"
                onChange={e => {
                    setSearchForm(prev => ({
                        ...prev, petName: e.target.value
                    }))
                }} />

            <VStack >
                <FormLabel fontWeight='bold' w="90%" mb="0" mt="5%" >
                    Height range: </FormLabel>
                <InputGroup w="90%" >
                    <InputLeftAddon children='Min: ' fontSize="1.2vw" p="5%" h="2.5vw" />
                    <Input type='number' placeholder=' - - - ' value={searchForm.minHeight}
                        h="2.5vw" min={0} bg="rgba(240, 240, 240, 0.6)"
                        onChange={e => {
                            setSearchForm(prev => ({
                                ...prev, minHeight: e.target.value
                            }))
                        }} />
                    <InputRightAddon children='cm' fontSize="1.2vw" p="5%" h="2.5vw" />
                </InputGroup>
                <InputGroup w="90%" borderBottom="1px inset rgb(116, 185, 178)">
                    <InputLeftAddon children='Max: ' fontSize="1.2vw" p="5%" h="2.5vw" />
                    <Input type='number' placeholder=' - - - ' value={searchForm.maxHeight}
                        h="2.5vw" min={0} max={200} bg="rgba(240, 240, 240, 0.6)"
                        onChange={e => {
                            setSearchForm(prev => ({
                                ...prev, maxHeight: e.target.value
                            }))
                        }} />
                    <InputRightAddon children='cm' fontSize="1.2vw" p="5%" h="2.5vw" />
                </InputGroup>
            </VStack>

            <VStack >
                <FormLabel fontWeight='bold' w="90%" mb="0" mt="5%" >
                    Weight range: </FormLabel>
                <InputGroup w="90%" >
                    <InputLeftAddon children='Min: ' fontSize="1.3vw" p="5%" h="2.5vw" />
                    <Input type='number' placeholder=' - - - ' bg="rgba(240, 240, 240, 0.6)" min={0}
                        h="2.5vw" value={searchForm.minWeight}
                        onChange={e => {
                            setSearchForm(prev => ({
                                ...prev, minWeight: e.target.value
                            }))
                        }} />
                    <InputRightAddon children='kg' fontSize="1.3vw" p="5%" h="2.5vw" />
                </InputGroup>
                <InputGroup w="90%" borderBottom="1px inset rgb(116, 185, 178)">
                    <InputLeftAddon children='Max: ' fontSize="1.3vw" p="5%" h="2.5vw" />
                    <Input type='number' placeholder=' - - - ' bg="rgba(240, 240, 240, 0.6)"
                        value={searchForm.maxWeight} h="2.5vw" min={0} max={200}
                        onChange={e => {
                            setSearchForm(prev => ({
                                ...prev, maxWeight: e.target.value
                            }))
                        }} />
                    <InputRightAddon children='kg' fontSize="1.3vw" p="5%" h="2.5vw" />
                </InputGroup>
            </VStack>
        </>

    const searchCheckBox =
        <>
            <Checkbox fontWeight='semibold' my="1%" isChecked={advancedSearch}
                onChange={toggleAdvancedSearch} isDisabled={!userLogged}>
                <Text fontSize="1.2vw" >Advanced search</Text>
            </Checkbox>
        </>
    const loginForAdvanced =
        <>
            <Button colorScheme='teal' variant='solid' mt="5%" p="3%" fontSize="1.1vw"
                w="auto" h="fit-content" border="1px groove rgb(59, 141, 146)"
                onClick={triggerLogin}>
                Login for advanced search
            </Button>
        </>

    const spinner =
        <>
            <Spinner thickness='6px' speed='0.7s' emptyColor='teal.200' color='teal.800' size='md' />
        </>

    return (
        <div className="searchPageContainer homeFont">
            <Flex flexDirection="column" m="1%" p="1%" bg="rgba(180, 200, 200, 0.4)"
                boxShadow='dark-lg' rounded='md' w="25%" h="fit-content" align="center">

                <Heading fontSize="1.6vw" >Search for a pet</Heading>

                <Select placeholder='Select pet type' maxW='90%' fontSize="1.3vw" mb="2%" mt="5%"
                    bg="rgba(240, 240, 240, 0.6)"
                    value={searchForm.type}
                    onChange={e => {
                        setSearchForm(prev => ({
                            ...prev, type: e.target.value
                        }))
                    }}>
                    {typeList.map(type =>
                        <option value={type} key={uuid()}>{type}</option>
                    )}
                </Select>

                {userLogged ? searchCheckBox : loginForAdvanced}

                {advancedSearch ? advancedSearchOptions : ""}

                <Flex justify="space-between" mt="8%" w="90%">
                    <Button onClick={searchClick} colorScheme='teal' fontSize="1.5vw" w="50%" >
                        {spinnerUp ? spinner : "Search"}
                    </Button>
                    <Button colorScheme='teal' fontSize="1.3vw" w="40%"
                        onClick={clearSearch} >
                        Clear
                    </Button>
                </Flex>

            </Flex>
            <PetSearchResults searchParams={lastSearch} toggleSpinner={toggleSpinner} />
        </div>
    )
}
