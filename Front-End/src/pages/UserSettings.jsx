/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 25/08/2022
 * Asaf Gilboa
*/


import { React, useState, useEffect, useContext } from 'react';
import {
  Button, Input, FormControl, FormLabel, InputGroup,
  InputLeftAddon, Flex, useToast
} from '@chakra-ui/react';
import UsersContext from '../context/UsersContext';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';


export default function UserSettings() {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const toast = useToast();

  const { userLogged, updateUser } = useContext(UsersContext);
  const [editedUser, setEditedUser] = useState({ ...userLogged });
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
    try {
      const userId = query.get("userId");
      if (userLogged._id === userId) return;

      const { token } = JSON.parse(localStorage.getItem('loggedUser'));
      const res = await axios.get(`${baseUrl}/users/${userId}`,
        { headers: { authorization: `Bearer ${token}` } });

      setEditedUser(res.data.user);
    } catch (err) {
      console.error("Caught: " + err.message);
    }
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
    try {
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
      const { token } = JSON.parse(localStorage.getItem('loggedUser'));
      const userId = query.get("userId");
      let res;
      if (userLogged._id === userId) {
        res = await axios.put(`${baseUrl}/users/${userLogged._id}`, formInputs,
          { headers: { authorization: `Bearer ${token}` } });
        updateUser(res.data.updatedUser);
      } else {
        res = await axios.put(`${baseUrl}/users/${userId}`, formInputs,
          { headers: { authorization: `Bearer ${token}` } });
      }
      setEditedUser(res.data.updatedUser);
      editSuccessful();
    } catch (err) {
      console.error("Settings update error: ", err);
    }
  }


  function editSuccessful() {
    toast({
      title: 'Profile edited successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }


  return (
    <div className='userSettingsContainer'>
      <FormControl bg="rgba(210, 220, 220, 0.6)" p="3%" boxShadow='dark-lg' borderRadius="6px">
        <Flex justify="space-between" align="center">
          <FormLabel className="formLabel" mb="0"> Email Address </FormLabel>
          <span className="loginErrorMessage">{emailError}</span>
        </Flex>
        <Input value={formInputs.email} type='email' placeholder={userLogged ? editedUser.email : "email"} boxShadow='dark-lg'
          onChange={e => { setFormInputs(prev => ({ ...prev, email: e.target.value })); setEmailError(''); }} />
        <hr />
        <Flex justify="space-between" align="center" mt="2%">
          <FormLabel className="formLabel" mb="0"> Password </FormLabel>
          <span className="loginErrorMessage">{passwordError}</span>
        </Flex>
        <Input value={formInputs.password} type='password' placeholder="New password" boxShadow='dark-lg'
          onChange={e => { setFormInputs(prev => ({ ...prev, password: e.target.value })); setPasswordError(''); }} />
        <Input value={formInputs.passwordConfirm} type='password' placeholder="Confirm password" boxShadow='dark-lg'
          onChange={e => { setFormInputs(prev => ({ ...prev, passwordConfirm: e.target.value })); setPasswordError(''); }} />
        <hr />
        <Flex justify="space-between" align="center" mt="2%">
          <FormLabel className="formLabel" mb="0">Full Name</FormLabel>
          <span className="loginErrorMessage">{nameError}</span>
        </Flex>
        <Input type='text' placeholder={userLogged ? editedUser.firstName : "First name"} boxShadow='dark-lg'
          onChange={e => { setFormInputs(prev => ({ ...prev, firstName: e.target.value })); setNameError(''); }} />
        <Input type='text' placeholder={userLogged ? editedUser.lastName : "Last name"} boxShadow='dark-lg'
          onChange={e => { setFormInputs(prev => ({ ...prev, lastName: e.target.value })); setNameError(''); }} />
        <hr />
        <Flex justify="space-between" align="center" mt="2%">
          <FormLabel className="formLabel" mb="0">Phone Number</FormLabel>
          <span className="loginErrorMessage">{phoneError}</span>
        </Flex>
        <InputGroup boxShadow='dark-lg'>
          <InputLeftAddon children='+972' />
          <Input type='tel' placeholder={userLogged ? editedUser.phone : "Phone number"}
            onChange={e => { setFormInputs(prev => ({ ...prev, phone: e.target.value })); setPhoneError(''); }} />
        </InputGroup>
        <Flex justify="space-between">
          <Button onClick={saveClick} bg='rgb(96, 199, 202)' color="whitesmoke" border="1px inset teal"
            boxShadow='dark-lg' variant='ghost' marginRight={"1%"} mt="5%" fontWeight="bold"
            _hover={{ bg: 'whitesmoke', color: 'rgb(96, 199, 202)' }}>
            Save
          </Button>
          <Button onClick={clearForm} color='rgb(96, 199, 202)' bg="whitesmoke" border="1px outset teal"
            boxShadow='dark-lg' variant='ghost' marginRight={"1%"} mt="5%" fontWeight="bold"
            _hover={{ bg: 'rgb(96, 199, 202)', color: 'whitesmoke' }}>
            Clear
          </Button>
        </Flex>
      </FormControl>
    </div>
  )
}
