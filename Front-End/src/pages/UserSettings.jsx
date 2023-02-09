/**
 * Pet Adoption Project
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import {
  Button, Input, FormControl, FormLabel, InputGroup,
  InputLeftAddon, Flex, useToast, Spinner
} from '@chakra-ui/react';
import UsersContext from '../context/UsersContext';
import { useNavigate, useLocation } from "react-router-dom";
import localforage from 'localforage';
import axios from 'axios';


export default function UserSettings() {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const toast = useToast();

  const [spinnerUp, setSpinnerUp] = useState(false);
  const { userLogged, updateUser } = useContext(UsersContext);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [formInputs, setFormInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: ''
  });


  useEffect(() => {
    if ((query.get("userId") === userLogged._id) || (userLogged.isAdmin)) {
      fetchUser();
    } else {
      navigate("/home");
    }
  }, []);

  async function fetchUser() {
    const userId = query.get("userId");
    if (userLogged._id === userId) {
      updateForm(userLogged);
      return;
    }
    try {
      const { token } = await localforage.getItem('loggedUser');
      const res = await axios.get(`${baseUrl}/users/${userId}`,
        { headers: { authorization: `Bearer ${token}` } });
      updateForm(res.data.user);
    } catch (err) {
      console.error("User settings fetch error: " + err.message);
    }
  }

  function updateForm(userDetails) {
    const tempObj = { ...formInputs };
    for (const key in tempObj) {
      if (userDetails.hasOwnProperty(key)) {
        tempObj[key] = userDetails[key];
      }
    }
    setFormInputs({ ...tempObj });
  }


  function isEmailValid(email) {
    const emailValid = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    return emailValid.test(email);
  }
  function isPhoneValid(phone) {
    const phoneValid = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/);
    return phoneValid.test(phone);
  }

  function clearForm() {
    setFormInputs({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      phone: ''
    });
  }


  async function saveClick() {
    if (formInputs.email) {
      if (!isEmailValid(formInputs.email)) {
        setEmailError("Invalid email");
        return;
      }
    }
    if (formInputs.password || formInputs.passwordConfirm) {
      if (formInputs.password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
        return;
      }
      if (formInputs.password !== formInputs.passwordConfirm) {
        setPasswordError("Confirmation password not matching");
        return;
      }
    }
    if (formInputs.phone) {
      if (!isPhoneValid(formInputs.phone)) {
        setPhoneError("Invalid phone number");
        return;
      }
    }
    setSpinnerUp(true);
    try {
      const { token } = await localforage.getItem('loggedUser');
      const userId = query.get("userId");
      const res = await axios.put(`${baseUrl}/users/${userId}`, formInputs,
        { headers: { authorization: `Bearer ${token}` } });
      if (userLogged._id === userId) {
        updateUser(res.data.updatedUser);
      }
      editSuccessful();
    } catch (err) {
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      console.error("Settings update error: ", err);
    }
    setSpinnerUp(false);
  }


  function editSuccessful() {
    toast({
      title: 'Profile edited successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setSpinnerUp(false);
    navigate(`/userprofile?userId=${query.get("userId")}`);
  }


  const spinner =
    <>
      <Spinner thickness='6px' emptyColor='teal.200'
        speed='0.7s' color='teal.800' size='md' />
    </>


  return (
    <div className='userSettingsContainer'>
      <FormControl bg="rgba(210, 220, 220, 0.6)" p="3%"
        boxShadow='dark-lg' borderRadius="6px">
        <Flex justify="space-between" align="center">
          <FormLabel className="formLabel" mb="0"> Email Address </FormLabel>
          <span className="loginErrorMessage">{emailError}</span>
        </Flex>
        <Input value={formInputs.email} type='email'
          placeholder="email" boxShadow='dark-lg'
          autoComplete="off" onChange={e => {
            setFormInputs(prev => ({ ...prev, email: e.target.value }));
            setEmailError('');
          }} />
        <hr />
        <Flex justify="space-between" align="center" mt="2%">
          <FormLabel className="formLabel" mb="0"> Password </FormLabel>
          <span className="loginErrorMessage">{passwordError}</span>
        </Flex>
        <Input value={formInputs.password} type='password'
          placeholder="New password" boxShadow='dark-lg'
          autoComplete="off" onChange={e => {
            setFormInputs(prev => ({ ...prev, password: e.target.value }));
            setPasswordError('');
          }} />
        <Input value={formInputs.passwordConfirm} type='password'
          placeholder="Confirm password" boxShadow='dark-lg'
          onChange={e => {
            setFormInputs(prev => ({ ...prev, passwordConfirm: e.target.value }));
            setPasswordError('');
          }} />
        <hr />
        <Flex justify="space-between" align="center" mt="2%">
          <FormLabel className="formLabel" mb="0">Full Name</FormLabel>
          <span className="loginErrorMessage">{nameError}</span>
        </Flex>
        <Input value={formInputs.firstName} placeholder="First name"
          type='text' boxShadow='dark-lg' onChange={e => {
            setFormInputs(prev => ({ ...prev, firstName: e.target.value }));
            setNameError('');
          }} />
        <Input value={formInputs.lastName} placeholder="Last name"
          type='text' boxShadow='dark-lg' onChange={e => {
            setFormInputs(prev => ({ ...prev, lastName: e.target.value }));
            setNameError('');
          }} />
        <hr />
        <Flex justify="space-between" align="center" mt="2%">
          <FormLabel className="formLabel" mb="0">Phone Number</FormLabel>
          <span className="loginErrorMessage">{phoneError}</span>
        </Flex>
        <InputGroup boxShadow='dark-lg'>
          <InputLeftAddon children='+972' />
          <Input value={formInputs.phone} placeholder="Phone number"
            type='tel' onChange={e => {
              setFormInputs(prev => ({ ...prev, phone: e.target.value }));
              setPhoneError('');
            }} />
        </InputGroup>
        <Flex justify="space-between">
          <Button onClick={saveClick} bg='rgb(96, 199, 202)' color="whitesmoke"
            border="1px inset teal" boxShadow='dark-lg' variant='ghost'
            marginRight={"1%"} mt="5%" fontWeight="bold"
            _hover={{ bg: 'whitesmoke', color: 'rgb(96, 199, 202)' }}>
            {spinnerUp ? spinner : "Save"}
          </Button>
          <Button onClick={clearForm} color='rgb(96, 199, 202)' bg="whitesmoke"
            border="1px outset teal" boxShadow='dark-lg' variant='ghost'
            marginRight={"1%"} mt="5%" fontWeight="bold"
            _hover={{ bg: 'rgb(96, 199, 202)', color: 'whitesmoke' }}>
            Clear
          </Button>
          <Button onClick={fetchUser} color='rgb(96, 199, 202)' bg="whitesmoke"
            border="1px outset teal" boxShadow='dark-lg' variant='ghost'
            marginRight={"1%"} mt="5%" fontWeight="bold"
            _hover={{ bg: 'rgb(96, 199, 202)', color: 'whitesmoke' }}>
            Restore
          </Button>
        </Flex>
      </FormControl>
    </div>
  )
}
