import React, {useContext, useReducer, useState} from "react";
import {Site} from "../Site";
import axios from "axios";
import {Button, Container, Form} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {getError} from "../utils";

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };

        default:
            return state;
    }
};


export default function UserProfileScreen() {
    const { state, dispatch: ctxDispatch } = useContext(Site);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(userInfo.phone);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState(userInfo.address);
    const [city, setCity] = useState(userInfo.city);

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    });

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password,
                    phone,
                    address,
                    city,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('User updated successfully');
        } catch (err) {
            dispatch({
                type: 'FETCH_FAIL',
            });
            alert(getError(err));
        }
    };

    return (
        <Container className={"small-container"}>
            <Helmet>
                <title>Felhasználó profil</title>
            </Helmet>
            <h1 className={"my-3"}>Felhasználó profil</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Név</Form.Label>
                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control type="password" onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Jelszó megerősitése</Form.Label>
                    <Form.Control type="password" onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Telefonszám</Form.Label>
                    <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Lakcím</Form.Label>
                    <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} required></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="city">
                    <Form.Label>Város</Form.Label>
                    <Form.Control value={city} onChange={(e) => setCity(e.target.value)} required></Form.Control>
                </Form.Group>
                <div className={"mb-3"}>
                    <Button type={"submit"}>Adatok frisítese</Button>
                </div>
            </Form>
        </Container>
    )
}