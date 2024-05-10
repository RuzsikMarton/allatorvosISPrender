import React, {useEffect} from 'react';
import {Button, Card, Container, Form} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useContext, useState} from "react";
import {Site} from "../Site";

function SigninScreen(){
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Site);
    const {userInfo} = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/signin', {
                email,
                password,
            });
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            console.log(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            alert('Invalid email or password')
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    return (
        <Container className={"small-container"}>
            <Helmet>
                <title>Bejelenkezes</title>
            </Helmet>
            <Card className={"mt-3 ps-3 pe-3"}>
                <h1 className={"my-3"}>Bejelentkezés</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className={"mb-4"} controlId={"email"}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type={"email"} required onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className={"mb-4"} controlId={"password"}>
                        <Form.Label>Jelszó</Form.Label>
                        <Form.Control type={"password"} required onChange={(e) => setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <div className={"mb-3 d-grid"}>
                        <Button type="submit">Bejelentkezés</Button>
                    </div>
                    <div className={"mb-3"}>
                        Új felhasználó?{' '} <Link to={`/signup`}>Regisztrálj itt</Link>
                    </div>
                </Form>
            </Card>
        </Container>
    )
}

export default SigninScreen;