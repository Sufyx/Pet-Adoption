/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import PetSearchResults from '../components/PetSearchResults';
import { React, useState } from 'react';
import {
    Input, VStack, Heading, Select, Button, FormLabel, Checkbox, Spinner,
    InputLeftAddon, InputRightAddon, InputGroup, Flex, Text, useToast
} from '@chakra-ui/react';
import uuid from 'react-uuid';


export default function Search({ dashboard }) {
    const toast = useToast();

    const [spinnerUp, setSpinnerUp] = useState(false);
    const typeList = ['Dog', 'Cat'];
    const [advancedSearch, setAdvancedSearch] = useState(dashboard);
    const [searchedName, setSearchedName] = useState('');
    const [typeSelected, setTypeSelected] = useState('');
    const [statusSelected, setStatusSelected] = useState('');
    const [minHeight, setMinHeight] = useState('');
    const [maxHeight, setMaxHeight] = useState('');
    const [minWeight, setMinWeight] = useState('');
    const [maxWeight, setMaxWeight] = useState('');
    const [searchParams, setSearchParams] = useState({
        petName: '',
        type: '',
        status: '',
        minHeight: '',
        maxHeight: '',
        minWeight: '',
        maxWeight: ''
    });


    function validateSearch() {
        if (minHeight && maxHeight) {
            if (minHeight > maxHeight) {
                return false;
            }
        }
        if (minWeight && maxWeight) {
            if (minWeight > maxWeight) {
                return false;
            }
        }
        if (searchedName && searchedName.length > 40) {
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
        setSearchParams({
            petName: searchedName,
            type: typeSelected,
            status: statusSelected,
            minHeight: minHeight,
            maxHeight: maxHeight,
            minWeight: minWeight,
            maxWeight: maxWeight
        });
    }


    function toggleAdvancedSearch(e) {
        if (e.target.checked) {
            setAdvancedSearch(true);
        } else {
            setAdvancedSearch(false);
        }
    }


    function clearSearch() {
        setSearchedName('');
        setTypeSelected('');
        setStatusSelected('');
        setMinHeight('');
        setMaxHeight('');
        setMinWeight('');
        setMaxWeight('');
    }

    function toggleSpinner(spinnerUp) {
        setSpinnerUp(spinnerUp);
    }


    const advancedSearchOptions =
        <>
            <Select placeholder='Adoption status' borderBottom="1px inset rgb(116, 185, 178)"
                maxW='90%' value={statusSelected} bg="rgba(240, 240, 240, 0.6)"
                fontSize="1.3vw" onChange={e => setStatusSelected(e.target.value)} >
                <option value='Adopted' >Adopted</option>
                <option value='Fostered' >Fostered</option>
                <option value='Available' >Available</option>
            </Select>

            <Input placeholder='Search pet by name' value={searchedName} maxW='90%'
                fontSize="1.3vw" borderBottom="1px inset rgb(116, 185, 178)" mt="2%"
                type='text' bg="rgba(240, 240, 240, 0.6)"
                onChange={e => setSearchedName(e.target.value)} />

            <VStack >
                <FormLabel fontWeight='bold' w="90%" mb="0" mt="5%" >
                    Height range: </FormLabel>
                <InputGroup w="90%" >
                    <InputLeftAddon children='Min: ' fontSize="1.2vw" p="5%" h="2.5vw" />
                    <Input type='number' placeholder=' - - - ' value={minHeight}
                        h="2.5vw" min={0} bg="rgba(240, 240, 240, 0.6)"
                        onChange={e => setMinHeight(e.target.value)} />
                    <InputRightAddon children='cm' fontSize="1.2vw" p="5%" h="2.5vw" />
                </InputGroup>
                <InputGroup w="90%" borderBottom="1px inset rgb(116, 185, 178)">
                    <InputLeftAddon children='Max: ' fontSize="1.2vw" p="5%" h="2.5vw" />
                    <Input type='number' placeholder=' - - - ' value={maxHeight}
                        h="2.5vw" min={0} max={200} bg="rgba(240, 240, 240, 0.6)"
                        onChange={e => setMaxHeight(e.target.value)} />
                    <InputRightAddon children='cm' fontSize="1.2vw" p="5%" h="2.5vw" />
                </InputGroup>
            </VStack>

            <VStack >
                <FormLabel fontWeight='bold' w="90%" mb="0" mt="5%" >
                    Weight range: </FormLabel>
                <InputGroup w="90%" >
                    <InputLeftAddon children='Min: ' fontSize="1.3vw" p="5%" h="2.5vw" />
                    <Input type='number' placeholder=' - - - ' bg="rgba(240, 240, 240, 0.6)" min={0}
                        value={minWeight} onChange={e => setMinWeight(e.target.value)} h="2.5vw" />
                    <InputRightAddon children='kg' fontSize="1.3vw" p="5%" h="2.5vw" />
                </InputGroup>
                <InputGroup w="90%" borderBottom="1px inset rgb(116, 185, 178)">
                    <InputLeftAddon children='Max: ' fontSize="1.3vw" p="5%" h="2.5vw" />
                    <Input type='number' placeholder=' - - - ' bg="rgba(240, 240, 240, 0.6)"
                        value={maxWeight} h="2.5vw" min={0} max={200}
                        onChange={e => setMaxWeight(e.target.value)} />
                    <InputRightAddon children='kg' fontSize="1.3vw" p="5%" h="2.5vw" />
                </InputGroup>
            </VStack>
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
                    value={typeSelected} onChange={e => setTypeSelected(e.target.value)}>
                    {typeList.map(type =>
                        <option value={type} key={uuid()}>{type}</option>
                    )}
                </Select>

                <Checkbox fontWeight='semibold' my="1%" isChecked={advancedSearch}
                    onChange={toggleAdvancedSearch}>
                    <Text fontSize="1.2vw" >Advanced search</Text>
                </Checkbox>

                {advancedSearch ? advancedSearchOptions : ""}

                <Flex justify="space-between" mt="8%" w="90%">
                    <Button onClick={searchClick} colorScheme='teal' fontSize="1.5vw" w="50%" >
                        {spinnerUp ? spinner : "Search"}
                    </Button>
                    <Button colorScheme='teal' fontSize="1.3vw" w="40%"
                        onClick={() => { clearSearch(); searchClick(); }} >
                        Clear
                    </Button>
                </Flex>

            </Flex>
            <PetSearchResults searchParams={searchParams} toggleSpinner={toggleSpinner}/>
        </div>
    )
}



