import {Link, useNavigate} from "react-router-dom";
import {Site} from "../Site";
import {useContext, useEffect, useState} from "react";
import {Button, Card, Container, Form} from "react-bootstrap";
import {Helmet} from "react-helmet-async";
import {getError} from "../utils";
import axios from "axios";

export default function SignupScreen() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Site);
    const { userInfo } = state;
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("A jelszavak nem egyeznek!")
            return;
        }
        try {
            const { data } = await axios.post('/api/users/signup', {
                name,
                email,
                phone,
                password,
                address,
                city,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            alert(getError(err));
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    return (
        <Container className="small-container">
            <Helmet>
                <title>Regisztráció</title>
            </Helmet>
            <Card className={" mt-3 ps-3 pe-3"}>
            <h1 className="my-3">Regisztráció</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Név</Form.Label>
                    <Form.Control onChange={(e) => setName(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Jelszó megerősítése</Form.Label>
                        <Form.Control
                            type="password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Telefonszám</Form.Label>
                <Form.Control onChange={(e) => setPhone(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Lakcím</Form.Label>
                    <Form.Control
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="city">
                    <Form.Label>Város</Form.Label>
                    <Form.Control
                        required
                        onChange={(e) => setCity(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Regisztrálj</Button>
                </div>
                <div className="mb-3">
                    Már van fiókod?{' '}
                    <Link to={'/signin'}>Jelentkezz be.</Link>
                </div>
            </Form>
            </Card>
        </Container>
    );
}