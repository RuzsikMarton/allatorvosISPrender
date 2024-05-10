import React, {useContext, useEffect, useReducer} from "react";
import {Helmet} from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import {Site} from "../Site";
import LoadingBox from "../components/LoadingBox";
import {useNavigate} from "react-router-dom";
import {getError} from "../utils";
import {Button, Container} from "react-bootstrap";
import axios from "axios";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true };
        case 'FETCH_SUCCESS':
            return {...state, animals: action.payload, loading: false };
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function OwnedAnimalsScreen() {
    const { state } = useContext(Site);
    const { userInfo } = state;
    const navigate = useNavigate();
    const [{ loading, error, animals }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(
                    `/api/animals/mine`,
                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error),
                });
            }
        };
        fetchData();
    }, [userInfo]);

    return (
        <Container>
            <Helmet>
                <title>Állataid</title>
            </Helmet>

            <h1 className={"mt-3"}>Állataid</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant={"danger"}>{error}</MessageBox>
            ) : (
                <table className={"table"}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NÉV</th>
                        <th>ÁLLATFAJ</th>
                        <th>SZÍN</th>
                        <th>ACTIONS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {animals.map((animal) => (
                        <tr key={animal._id}>
                            <td>{animal._id}</td>
                            <td>{animal.name}</td>
                            <td>{animal.breed}</td>
                            <td>{animal.color}</td>
                            <td>
                                <Button type={"button"} variant={"dark"} onClick={() => {
                                    navigate(`/animal/${animal._id}`);
                                }}>Adatok</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </Container>
    )
}