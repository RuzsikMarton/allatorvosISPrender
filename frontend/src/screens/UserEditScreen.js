import React, { useContext, useEffect, useReducer, useState } from 'react';
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


export default function UserEditScreen() {
    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { state } = useContext(Site);
    const { userInfo } = state;

    const params = useParams();
    const { id: userId } = params;
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [isEmployee, setIsEmployee] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [salary, setSalary] = useState(0);
    const [department, setDepartment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
                setAddress(data.address);
                setCity(data.city);
                setIsEmployee(data.isEmployee);
                setIsAdmin(data.isAdmin);
                if ('salary' in data) {
                    setSalary(data.salary);
                }
                if ('department' in data) {
                    setDepartment(data.department);
                }
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        fetchData();
    }, [userId, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `/api/users/${userId}`,
                { _id: userId, name, email, phone, address, city, isEmployee, isAdmin, salary, department },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            alert('User updated successfully');
            isEmployee ? navigate('/admin/employeeList') : navigate('/admin/userList')
        } catch (error) {
            alert(getError(error));
            dispatch({ type: 'UPDATE_FAIL' });
        }
    };
    return (
        <Container className="small-container mt-3">
            <Helmet>
                <title>Felhasználó szerkesztése ${userId}</title>
            </Helmet>
            <h1>Felhasználó szerkesztése {userId}</h1>

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
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Telefonszám</Form.Label>
                        <Form.Control
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Lakcím</Form.Label>
                        <Form.Control
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>Város</Form.Label>
                        <Form.Control
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Check
                        className="mb-3"
                        type="checkbox"
                        id="isEmployee"
                        label="Alkalmazott"
                        checked={isEmployee}
                        onChange={(e) => setIsEmployee(e.target.checked)}
                    />

                    <Form.Check
                        className="mb-3"
                        type="checkbox"
                        id="isAdmin"
                        label="Admin"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <Form.Group className="mb-3" controlId="salary">
                        <Form.Label>Fizetés</Form.Label>
                        <Form.Control
                            disabled={!isEmployee}
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="department">
                        <Form.Label>Állás</Form.Label>
                        <Form.Select   disabled={!isEmployee}  value={department} onChange={(e) => setDepartment(e.target.value)}>
                            <option value="" hidden>Válassz...</option>
                            <option value={"Doktor"}>Doktor</option>
                            <option value={"Nővér"}>Nővér</option>
                            <option value={"Aszisztens"}>Aszisztens</option>
                        </Form.Select>
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
    );

}