/**
 * ITC Full-Stack Bootcamp
 * Pet Adoption Project
 * 12/08/2022
 * Asaf Gilboa
*/

import { React, useState, useContext } from 'react';
import axios from 'axios';
// import localForage from 'localforage';
import { useNavigate } from 'react-router-dom';
import UsersContext from '../context/UsersContext';
import {
    Menu, MenuButton, Button, Modal, ModalOverlay,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    useDisclosure, Input, FormControl, ModalContent,
    FormLabel, InputGroup, InputLeftAddon, Flex, useToast
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

export default function LogModal() {
    const baseUrl = "http://localhost:6060";
    const navigate = useNavigate();
    const toast = useToast();

    const { userLogged, updateUser } = useContext(UsersContext);
    const { isOpen, onOpen, onClose } = useDisclosure(false);
    const [isSignUp, setIsSignUp] = useState();
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


    function loginClick() {
        setIsSignUp(false);
        setPasswordError('');
        setEmailError('');
        setNameError('');
        setPhoneError('');
        onOpen();
    }


    async function saveClick() {

        if (!isEmailValid(formInputs.email)) {
            setEmailError("Invalid email");
            return;
        }
        if (formInputs.password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        if (!isSignUp) {
            try {
                const res = await axios.post(`${baseUrl}/users/login`, {
                    email: formInputs.email,
                    password: formInputs.password
                });
                if (res.data) {
                    logUser(res.data);
                    toast({
                        title: `Welcome back ${res.data.user.firstName} `,
                        description: "We missed you :)",
                        status: 'success',
                        duration: 5000,
                        position: 'top',
                        isClosable: true,
                    });
                }
            } catch (err) {
                console.error("Login error: ", err);
            }
            return;
        }

        if (formInputs.password !== formInputs.passwordConfirm) {
            setPasswordError("Confirmation password not matching");
            return;
        }

        if (!formInputs.firstName || !formInputs.lastName) {
            setNameError("Please enter a first and last name");
            return;
        }

        if (!isPhoneValid(formInputs.phone)) {
            setPhoneError("Invalid phone number");
            return;
        }

        try {
            const res = await axios.post(`${baseUrl}/users/signup`, formInputs);
            if (res.data) {
                logUser(res.data);
                toast({
                    title: `Welcome ${formInputs.firstName} `,
                    description: "Your account has been created",
                    status: 'success',
                    position: 'top',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
        } catch (err) {
            console.error("Signup error: ", err);
        }
    }

    function logUser(data) {
        localStorage.setItem("loggedUser", JSON.stringify({
            token: data.token
        }));
        updateUser(data.user);
        onClose();
        navigate("/home");
    }


    function logOut() {
        localStorage.clear();
        updateUser(false);
        setFormInputs({
            email: '',
            password: '',
            passwordConfirm: '',
            firstName: '',
            lastName: '',
            phone: ''
        });
        navigate("/home");
        console.log("logged out");
    }

    function isEmailValid(email) {
        const emailValid = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        return emailValid.test(email);
    }
    function isPhoneValid(phone) {
        const phoneValid = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/);
        return phoneValid.test(phone);
    }

    const loginButton =
        <Menu>
            <MenuButton onClick={() => loginClick()} as={Button} rightIcon={<ChevronDownIcon />}
                marginX={3} boxShadow='dark-lg'>
                Log-in / Sign-up
            </MenuButton>
        </Menu>

    const logOutButton =
        <Button onClick={logOut} marginX={3} _hover={{ bg: 'gray.600', color: 'whitesmoke' }}
            boxShadow='dark-lg'>
            Logout
        </Button>

    const extendModalBtn =
        <Button onClick={extendModal} mt="3%" bg="whitesmoke" color="teal"
            _hover={{ bg: 'teal.500', color: 'whitesmoke' }} border="1px outset teal" >
            I don't have a user yet
        </Button>

    function extendModal(e) {
        e.preventDefault();
        setFormInputs({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirm: '',
            phone: ''
        });
        setIsSignUp(true);
    }


    let signUpModal =
        <>
            <Input value={formInputs.passwordConfirm} type='password' placeholder='confirm password'
                onChange={e => { setFormInputs(prev => ({ ...prev, passwordConfirm: e.target.value })); setPasswordError(''); }} />
            <hr />
            <Flex justify="space-between" align="center">
                <FormLabel className="formLabel">Full Name</FormLabel>
                <span className="loginErrorMessage">{nameError}</span>
            </Flex>
            <Input type='text' placeholder='First Name'
                onChange={e => { setFormInputs(prev => ({ ...prev, firstName: e.target.value })); setNameError(''); }} />
            <Input type='text' placeholder='Last Name'
                onChange={e => { setFormInputs(prev => ({ ...prev, lastName: e.target.value })); setNameError(''); }} />
            <hr />
            <Flex justify="space-between" align="center">
                <FormLabel className="formLabel">Phone Number</FormLabel>
                <span className="loginErrorMessage">{phoneError}</span>
            </Flex>
            <InputGroup>
                <InputLeftAddon children='+972' />
                <Input type='tel' placeholder='phone number'
                    onChange={e => { setFormInputs(prev => ({ ...prev, phone: e.target.value })); setPhoneError(''); }} />
            </InputGroup>
        </>;


    let modalBody =
        <FormControl>
            <Flex justify="space-between" align="center">
                <FormLabel className="formLabel"> Email Address </FormLabel>
                <span className="loginErrorMessage">{emailError}</span>
            </Flex>
            <Input value={formInputs.email} type='email' placeholder='email' autoComplete='off'
                onChange={e => { setFormInputs(prev => ({ ...prev, email: e.target.value })); setEmailError(''); }} />
            <hr />
            <Flex justify="space-between" align="center">
                <FormLabel className="formLabel"> Password </FormLabel>
                <span className="loginErrorMessage">{passwordError}</span>
            </Flex>
            <Input value={formInputs.password} type='password' placeholder='password'
                onChange={e => { setFormInputs(prev => ({ ...prev, password: e.target.value })); setPasswordError(''); }} />

            {isSignUp ? signUpModal : extendModalBtn}
        </FormControl>

    const modal =
        <Modal isOpen={isOpen} onClose={onClose} className='modalContainer'>
            <ModalOverlay />
            <ModalContent marginTop="2%" marginBottom="0">
                <ModalHeader textAlign="center">Enter Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {modalBody}
                </ModalBody>

                <ModalFooter>
                    <Button onClick={saveClick} backgroundColor='rgb(116, 219, 222)' variant='ghost' marginRight={"1%"}>
                        {isSignUp ? "Save" : "Login"}
                    </Button>
                    <Button mr={3} onClick={onClose} backgroundColor='rgb(223, 206, 237)'>  Cancel </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>


    return (
        <div >
            {userLogged ? logOutButton : loginButton}
            {modal}
        </div>
    )
}
