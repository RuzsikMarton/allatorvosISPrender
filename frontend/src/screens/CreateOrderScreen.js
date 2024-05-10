import React, {useContext, useEffect, useReducer, useState} from "react";
import {Button, Card, Col, Container, Form, ListGroup, Row} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {useNavigate, useParams} from "react-router-dom";
import {Site} from "../Site";
import axios from "axios";
import {getError} from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

function reducer(state, action) {

    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, animal: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };

        default:
            return state;
    }
}

export default function CreateOrderScreen() {

    const { state } = useContext(Site);
    const { userInfo } = state;

    const params = useParams();
    const { id: animalId } = params;
    const navigate = useNavigate();

    const [procedure, setProcedure] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');

    const [{ loading, error, animal }, dispatch] = useReducer(reducer, {
        loading: true,
        animal: {},
        error: '',
    });

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/animals/${animalId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if(!userInfo) {
            return navigate('/signin')
        }
        if (!animal._id || (animal._id && animal._id !== animalId)){
            fetchAnimal();
        }
    }, [animal, userInfo, animalId, navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'CREATE_REQUEST' });

            const { data } = await axios.post(
                '/api/orders',
                {
                    animal: animalId,
                    price: price,
                    procedure: procedure,
                    description: description,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            dispatch({ type: 'CREATE_SUCCESS' });
            navigate(`/animal/${animalId}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            alert(getError(err));
        }
    };

    return (
        <Container>
            <Helmet>
                <title>Számla létrehozása</title>
            </Helmet>
            <h1 className={"my-3"}>Számla létrehozása</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
            <Row>
            <Col md={5}>
            <Card className={"mt-3 ps-3 pe-3"}>
                <Card.Title className={"mt-3 mb-3"}><strong>Állat</strong></Card.Title>
                <ListGroup variant={"flush"}>
                    <ListGroup.Item>
                        <Row>
                            <Col><strong>Név: </strong></Col>
                            <Col>{animal.name}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col><strong>Születési dátum: </strong></Col>
                            <Col>{animal.dateOfBirth ? animal.dateOfBirth.slice(0, -14) : 'N/A'}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col><strong>Nem: </strong></Col>
                            <Col>{animal.gender}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col><strong>Állatfaj: </strong></Col>
                            <Col>{animal.breed} {animal.subBreed}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col><strong>Szín: </strong></Col>
                            <Col>{animal.color}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col><strong>Regisztrálva: </strong></Col>
                            <Col>{animal.createdAt ? animal.createdAt.slice(0, -5) : 'N/A'}</Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
            </Col>
            <Col md={7}>
                <Card className={"mt-3 ps-3 pe-3"}>
                    <Card.Title className={"mt-3 mb-3"}><strong>Számla</strong></Card.Title>
                    <Form onSubmit={submitHandler}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="procedure">
                                    <Form.Label>Eljárás</Form.Label>
                                    <Form.Select onChange={(e) => setProcedure(e.target.value)}>
                                        <option value="" hidden>Válassz...</option>
                                        <option value={"Vizsgálat"}>Vizsgálat</option>
                                        <option value={"Olytás"}>Olytás</option>
                                        <option value={"Operáció"}>Operáció</option>
                                        <option value={"Chip"}>Chip</option>
                                        <option value={"Egyéb"}>Egyéb</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="price">
                                    <Form.Label>Ár</Form.Label>
                                    <Form.Control onChange={(e) => setPrice(parseFloat(e.target.value))}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Leiras</Form.Label>
                                    <Form.Control as="textarea" rows={2} style={{ resize: 'none' }} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={4}></Col>
                            <Col md={4}>
                                <Button type="submit">Számla létrehozása</Button>
                            </Col>
                            <Col md={4}></Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
            </Row>)}
        </Container>
    )
};