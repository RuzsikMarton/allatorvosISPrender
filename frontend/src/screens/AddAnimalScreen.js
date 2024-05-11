import React, {useContext, useReducer, useState} from "react";
import {Helmet} from "react-helmet-async";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {DatePicker} from "antd";
import {Site} from "../Site";
import {getError} from "../utils";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import {useNavigate} from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default function AddAnimalScreen(){

    const navigate = useNavigate();

    const [{ loading}, dispatch] = useReducer(reducer, {
        loading: false,
    });

    const [nameA, setNameA] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [breed, setBreed] = useState('');
    const [subBreed, setSubBreed] = useState('');
    const [color, setColor] = useState('');

    const {state, dispatch: ctxDispatch} = useContext(Site);
    const {userInfo} = state;

    const addAnimalHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'CREATE_REQUEST' });

            const { data } = await axios.post(
                '/api/animals',
                {
                    name: nameA,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    breed: breed,
                    subBreed: subBreed,
                    color: color,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            dispatch({ type: 'CREATE_SUCCESS' });
            navigate(`/animal/${data.animals._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            alert(getError(err));
        }
    };

    function selectDate(value){
        setDateOfBirth(value.format('YYYY-MM-DD'))
    }

    return <div>
        <Helmet>
            <title>Állat regisztráció</title>
        </Helmet>
        <Container className="custom-container">
        <h1 className={"my-3"}>Állat regisztrálása</h1>
        <Card className={"mt-3 ps-3 pe-3"}>
            <Form onSubmit={addAnimalHandler}>
                <Row className={"mt-3"}>
                    <Col md={12}>
                        <Form.Group className={"mb-4"} controlId={"name"}>
                            <Form.Label>Állatod neve</Form.Label>
                            <Form.Control required onChange={(e) => setNameA(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group className={"mb-4"} controlId={"gender"}>
                            <Form.Label>Nem</Form.Label>
                            <Form.Select required onChange={(e) => setGender(e.target.value)}>
                                <option value="" hidden>Válassz...</option>
                                <option value={"Hím"}>Hím</option>
                                <option value={"Nőstény"}>Nőstény</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className={"mb-4"} controlId={"breed"}>
                            <Form.Label>Állatfaj</Form.Label>
                            <Form.Select required onChange={(e) => setBreed(e.target.value)}>
                                <option value="" hidden>Válassz...</option>
                                <option value={"Kutya"}>Kutya</option>
                                <option value={"Macska"}>Macska</option>
                                <option value={"Kisrágcsáló"}>Kisrágcsáló</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className={"mb-4"} controlId={"dateOfBirth"}>
                            <Form.Label>Születési dátum</Form.Label>
                            <br />
                            <DatePicker
                                id={'datepicker'}
                                name="date"
                                size={'large'}
                                format='YYYY-MM-DD'
                                required
                                placeholder={'Válassz dátumot'}
                                onChange={selectDate}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className={"mb-4"} controlId={"subBreed"}>
                            <Form.Label>Faj</Form.Label>
                            <Form.Control required onChange={(e) => setSubBreed(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className={"mb-4"} controlId={"color"}>
                            <Form.Label>Szín</Form.Label>
                            <Form.Control required onChange={(e) => setColor(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className={"mb-4"}>
                    <Col>
                        <Button type={"submit"} disabled={breed === '' || gender === ''}>Állatom regisztrálása</Button>
                    </Col>
                    {loading && <LoadingBox></LoadingBox>}
                </Row>
            </Form>
        </Card>
        </Container>
    </div>
}