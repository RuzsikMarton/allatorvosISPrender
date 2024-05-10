import React, {useContext, useEffect, useReducer} from "react";
import {Site} from "../Site";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {getError} from "../utils";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {Helmet} from "react-helmet-async";

function reducer(state, action) {

    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}
export default function OrderScreen() {
    const {state} = useContext(Site);
    const {userInfo} = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();
    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
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
        if (!order._id || (order._id && order._id !== orderId)){
            fetchAnimal();
        }
    }, [order, userInfo, orderId, navigate])

    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (<Container>
        <Helmet>
            <title>Számla {orderId}</title>
        </Helmet>
        <h1 className={"my-3"}>Számla {orderId}</h1>
        <Row>
            <Col md={7}>
                <Row>
                    <Card className={"mt-3 ps-3 pe-3"}>
                        <Card.Title className={"mt-3 mb-3"}><strong>Állat</strong></Card.Title>
                        <ListGroup variant={"flush"}>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Név: </strong></Col>
                                    <Col>{order.animal.name}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Születési dátum: </strong></Col>
                                    <Col>{order.animal.dateOfBirth ? order.animal.dateOfBirth.slice(0, -14) : 'N/A'}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Nem: </strong></Col>
                                    <Col>{order.animal.gender}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Állatfaj: </strong></Col>
                                    <Col>{order.animal.breed} {order.animal.subBreed}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Szín: </strong></Col>
                                    <Col>{order.animal.color}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Regisztrálva: </strong></Col>
                                    <Col>{order.animal.createdAt ? order.animal.createdAt.slice(0, -5) : 'N/A'}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Row>
                <Row>
                    <Card className={"mt-3 ps-3 pe-3"}>
                        <Card.Title className={"mt-3 mb-3"}><strong>Gazdi</strong></Card.Title>
                        <ListGroup variant={"flush"}>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Név: </strong></Col>
                                    <Col>{order.animal.owner.name}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Email: </strong></Col>
                                    <Col>{order.animal.owner.email}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Telefonszám: </strong></Col>
                                    <Col>{order.animal.owner.phone}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Lakcím: </strong></Col>
                                    <Col>{order.animal.owner.address} {order.animal.owner.city}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Row>
            </Col>
            <Col md={5}>
                    <Card className={"mt-3 ps-3 pe-3"}>
                        <Card.Title className={"mt-3 mb-3"}><strong>Számla</strong></Card.Title>
                        <ListGroup variant={"flush"}>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>ID: </strong></Col>
                                    <Col>{order._id}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Kiállítva: </strong></Col>
                                    <Col>{order.createdAt ? order.createdAt.slice(0, -5) : 'N/A'}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Kiállította: </strong></Col>
                                    <Col>{order.employee.name} - {order.employee.department}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Eljárás: </strong></Col>
                                    <Col>{order.procedure}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Ár: </strong></Col>
                                    <Col>{order.price.toFixed(2)} €</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>További infó: </strong></Col>
                                    <Col>{order.description ? order.description : "N/A"}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
            </Col>

        </Row>
    </Container>)

}