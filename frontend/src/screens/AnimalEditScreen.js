import React, {useContext, useEffect, useReducer, useState} from "react";
import {Site} from "../Site";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {getError} from "../utils";
import {Button, Container, Form} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
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
export default function AnimalEditScreen() {
    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { state } = useContext(Site);
    const { userInfo } = state;

    const params = useParams();
    const { id: animalId } = params;
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [breed, setBreed] = useState('');
    const [subBreed, setSubBreed] = useState('');
    const [color, setColor] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/animals/${animalId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setName(data.name);
                setDateOfBirth(data.dateOfBirth)
                setGender(data.gender);
                setBreed(data.breed)
                setSubBreed(data.subBreed);
                setColor(data.color);
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        fetchData();
    }, [animalId, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `/api/animals/${animalId}`,
                { _id: animalId, name, dateOfBirth, gender, breed, subBreed, color},
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            alert('Animal updated successfully');
            navigate('/employee/animalList')
        } catch (error) {
            alert(getError(error));
            dispatch({ type: 'UPDATE_FAIL' });
        }
    };
    return <Container className="small-container mt-3">
        <Helmet>
            <title>Állat szerkesztése ${animalId}</title>
        </Helmet>
        <h1>Állat szerkesztése {animalId}</h1>
        {loading ? (
            <LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Név</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className={"mb-4"} controlId={"gender"}>
                    <Form.Label>Nem</Form.Label>
                    <Form.Select required onChange={(e) => setGender(e.target.value)} value={gender}>
                        <option value={"Hím"}>Hím</option>
                        <option value={"Nőstény"}>Nőstény</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className={"mb-4"} controlId={"breed"}>
                    <Form.Label>Állatfaj</Form.Label>
                    <Form.Select required onChange={(e) => setBreed(e.target.value)} value={breed}>
                        <option value={"Kutya"}>Kutya</option>
                        <option value={"Macska"}>Macska</option>
                        <option value={"Nyúl"}>Nyúl</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className={"mb-4"} controlId={"subBreed"}>
                    <Form.Label>Faj</Form.Label>
                    <Form.Control required onChange={(e) => setSubBreed(e.target.value)} value={subBreed}></Form.Control>
                </Form.Group>
                <Form.Group className={"mb-4"} controlId={"color"}>
                    <Form.Label>Szín</Form.Label>
                    <Form.Control required onChange={(e) => setColor(e.target.value)} value={color}></Form.Control>
                </Form.Group>
                <div className="mb-3">
                    <Button disabled={loadingUpdate} type="submit">
                        Frissítés
                    </Button>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                </div>
            </Form>
        )}
    </Container>
}