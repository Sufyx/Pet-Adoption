/**
 * Pet Adoption Project
 * Asaf Gilboa
*/

import { React, useContext } from 'react';
import UsersContext from '../context/UsersContext';
import { Image, Flex, Button, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';


export default function PetCard({ pet }) {

  const { userLogged, loginHook } = useContext(UsersContext);  
  function triggerLogin() {
    loginHook();
  }

  const seeMore =
      <NavLink to={userLogged ? `/pet?petId=${pet._id}` : ''}
        onClick={userLogged ? '' : triggerLogin}
        className="petCardLink">
        <Button colorScheme='teal' variant='solid' mt="5%" p="3%" fontSize="1.1vw"
          w="auto" h="fit-content" name={pet.name} border="1px outset teal">
          {userLogged ? 'See More' : 'Login to see more'}
        </Button>
      </NavLink>
      

  return (
    <div>
      <Flex flexDir='column' align="center" boxShadow='dark-lg' rounded='md' px="2%" py="5%"
        bg="rgba(57, 164, 164, 0.2)"
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
