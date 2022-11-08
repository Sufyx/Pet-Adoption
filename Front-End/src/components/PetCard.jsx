/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 14/08/2022
 * Asaf Gilboa
*/

import { React } from 'react';
import { Image, Flex, Button, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function PetCard({ pet }) {

  const seeMore =
    JSON.parse(localStorage.getItem('loggedUser')) ?
      <NavLink className="petCardLink" to={`/pet?petId=${pet._id}`}>
        <Button colorScheme='teal' variant='solid' mt="5%" py="3%" fontSize="1.1vw"
          w="80%" h="fit-content" name={pet.name} border="1px outset teal">
          See More
        </Button>
      </NavLink>
      : <Text bg='teal' color="whitesmoke" mt="5%" py="3%" fontSize="1.1vw" textAlign="center"
        w="80%" h="fit-content" name={pet.name} border="1px outset teal" borderRadius="6px">
        Login to see more
      </Text>;

  return (
    <div>
      <Flex flexDir='column' align="center" boxShadow='dark-lg' rounded='md' px="2%" py="5%"
        bg="rgba(57, 164, 164, 0.2)"
        // bgImage="https://cdn.wallpapersafari.com/57/69/X0s3Dm.jpg" bgSize="cover"
        // bgImage="https://i.pinimg.com/originals/6b/c0/0a/6bc00a2607f58287c4c348e0ce4dcdcd.jpg" 
        bgPosition="center" bgRepeat="no-repeat" >
        <Image borderRadius='5px' height="10vw" alt='pet image' m="2%" border="2px outset teal" src={pet.picture}
          fallbackSrc='http://posfacturar.com/pos_organicnails/public/upload/default_image/default_pet.jpg' />
        <Text fontSize="1.4vw" as='u' m="1%" fontWeight='bold'>{pet.name}</Text>
        <Text fontSize="1.2vw" mb="1%" fontWeight='semibold'>{pet.adoptionStatus}</Text>
        {seeMore}
      </Flex>
    </div>
  )
}
