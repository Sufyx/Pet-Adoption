/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 12/08/2022
 * Asaf Gilboa
*/


import { React, useEffect, useContext } from 'react';
import {
   Image, Box, Flex, Spacer, Heading, Text
} from '@chakra-ui/react';
import UsersContext from '../context/UsersContext';
import axios from 'axios';

export default function Home() {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const { updateUser } = useContext(UsersContext);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('loggedUser'));
    if (data) {
      reLogUser(data.token);
    }
  }, []);

  async function reLogUser(token) {
    const res = await axios.get(`${baseUrl}/users/logged`,
      { headers: { authorization: `Bearer ${token}` } });
    if (res.data) {
      updateUser(res.data.user);
    }
  }


  return (
    <div className='homePageContainer'>
      <Flex className="homeDisplayDiv" m="auto" marginTop="3%" bg="rgba(57, 164, 164, 0.2)" w="90%"
            borderRadius="30px" py="2%" boxShadow='dark-lg' >
        <Image src='https://i.imgur.com/RnTb6Em.jpg' alt='Hyper Dog' className='homePageImage'
          boxSize='25vw' objectFit='cover' borderRadius='full' roundedRight="md" marginLeft="5%" />
        < Spacer />
        <Box marginX={3} flexDirection='column' align='center' justify='space-evenly' className='homeFont'>
          < Heading className='homeFont' fontSize="3vw" color="teal.900">
              Welcome to A.G Pet Adoption agency
          </ Heading >
          <Text marginTop='15%' fontSize="1.3vw" fontWeight="semibold" color="teal.900">
            Hey there pet person. <br />
            Thank you for visiting. <br />
            This is a prestige digital database of various precious animals. <br />
            These animals deserve a loving home, and together we can give it to them. 
            Take your time to browse our various pets. <br />
            Should you choose to, we would love to have you sign up and join us.
          </ Text >
        </Box>
        < Spacer />
        <Image src='https://i.imgur.com/E2uVXFh.jpg' alt='Hyper Dog' className='homePageImage'
          boxSize='25vw' objectFit='cover' borderRadius='full' roundedLeft="md" marginRight="5%" />
      </Flex>
    </div>
  )
}
