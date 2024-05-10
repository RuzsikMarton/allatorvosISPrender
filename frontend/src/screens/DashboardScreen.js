import React, {useContext, useEffect, useReducer} from "react";
import {Helmet} from "react-helmet-async";
import {Card, Col, Container, Row} from "react-bootstrap";
import {Site} from "../Site";
import axios from "axios";
import {getError} from "../utils";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                summary: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function DashboardScreen() {
    const [{loading,summary, error}, dispatch] = useReducer(reducer, {
        loading: false,
        summary: '',
        error: '',
    });
    const {state} = useContext(Site);
    const {userInfo} = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/animals/summary', {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        fetchData();
    }, [userInfo]);

    return (
        <Container>
            <h1 className={'mt-3'}>Dashboard</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                    <>
                        <Container>
                            <Row>
                                <Col md={4}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                {summary.userCounts && summary.animals[0] ? summary.userCounts.regularUsers : 0}
                                            </Card.Title>
                                            <Card.Text>Felhasználók</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                {summary.userCounts && summary.animals[0] ? summary.userCounts.employees : 0}
                                            </Card.Title>
                                            <Card.Text>Alkalmazottak</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>
                                                {summary.animals && summary.animals[0] ? summary.animals[0].numAnimals : 0}
                                            </Card.Title>
                                            <Card.Text>Regisztrált állatok</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <h1 className={"mt-5"}>
                                    Other functions work in progress...
                                </h1>
                            </Row>
                        </Container>
                    </>
                )}
        </Container>
    )
}
