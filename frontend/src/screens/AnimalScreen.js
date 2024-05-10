import React, {useContext, useEffect, useReducer} from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {useNavigate, useParams} from "react-router-dom";
import {Site} from "../Site";
import axios from "axios";
import {getError} from "../utils";
import {Helmet} from "react-helmet-async";
import {Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";

function reducer(state, action) {

    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, animal: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'FETCH_REQUEST_ORDERS':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS_ORDERS':
            return { ...state, loading: false, orders: action.payload, error: '' };
        case 'FETCH_FAIL_ORDERS':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_ORDERS':
            return {
                ...state,
                orders: state.orders.filter(order => order._id !== action.payload),
            };

        default:
            return state;
    }
}

export default function AnimalScreen() {
    const {state} = useContext(Site);
    const {userInfo} = state;

    const params = useParams();
    const { id: animalId } = params;
    const navigate = useNavigate();
    const [{ loading, error, animal, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        animal: {},
        orders: [],
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
                console.log(data);
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };

        const fetchOrders = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST_ORDERS' });
                const { data } = await axios.get(`/api/orders/animalorder/${animalId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS_ORDERS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL_ORDERS', payload: getError(err) });
            }
        };

        if(!userInfo) {
            return navigate('/signin')
        }
        if (!animal._id || (animal._id && animal._id !== animalId)){
            fetchAnimal();
        }
        fetchOrders();
    }, [animal.owner, userInfo, animalId, navigate])

    const deleteHandler = async (order) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/orders/${order._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                alert('order deleted successfully');
                dispatch({ type: 'DELETE_SUCCESS' });
                dispatch({ type: 'UPDATE_ORDERS', payload: order._id });
            } catch (error) {
                alert(getError(error));
                dispatch({
                    type: 'DELETE_FAIL',
                });
            }
        }
    };

    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <Container>
            <Helmet>
                <title>Állat {animalId}</title>
            </Helmet>
            <h1 className={"my-3"}>Állat {animalId}</h1>
            <Row>
                <Col md={7}>
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
                <Col md={5}>
                    <Row>
                    {animal.owner && (
                        <Card className={"mt-3 ps-3 pe-3"}>
                            <Card.Title className={"mt-3 mb-3"}><strong>Gazdi</strong></Card.Title>
                            <ListGroup variant={"flush"}>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Név: </strong></Col>
                                        <Col>{animal.owner.name}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Email: </strong></Col>
                                        <Col>{animal.owner.email}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Telefonszám: </strong></Col>
                                        <Col>{animal.owner.phone}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Lakcím: </strong></Col>
                                        <Col>{animal.owner.address} {animal.owner.city}</Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    )}
                        <Row>
                            {userInfo.isEmployee ? <Button  variant={"dark"} className={"mt-3"} onClick={() => navigate(`/employee/createorder/${animal._id}`)}>
                                Számla létrehozása
                            </Button> : <div></div>}
                        </Row>
                    </Row>
                </Col>

            </Row>
            <Row>
                <table className="table mt-3">
                    <thead>
                    <tr>
                        <th>LÉTREHOZVA</th>
                        <th>ELJÁRÁS</th>
                        <th>FELJEGYEZTE</th>
                        <th>ÁR</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.createdAt ? order.createdAt.slice(0, -5) : 'N/A'}</td>
                            <td>{order.procedure}</td>
                            <td>{order.employee.name}</td>
                            <td>{order.price.toFixed(2)} EUR</td>
                            <td><Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="secondary"
                                        onClick={() => navigate(`/order/${order._id}`)}
                            >
                                Adatok
                            </Button>
                                <Button className={"m-lg-1 mb-1"}
                                        type="button"
                                        variant="danger"
                                        onClick={() => deleteHandler(order)}
                                >
                                    Törles
                                </Button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Row>
        </Container>)
}