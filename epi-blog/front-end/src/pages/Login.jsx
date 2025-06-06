import {useEffect, useState} from 'react';
import {Form, Button, Alert, Col, Row, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Tentativo di login con:', { email });
            const response = await api.post('/auth/login/local', { email, password });
            console.log('Risposta dal server:', response.data);
            
            const { user, token } = response.data;
            await login(user, token);
            navigate('/');
        } catch (err) {
            console.error('Errore dettagliato:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            setError(err.response?.data?.message || 'Errore durante il login');
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            try {
                api.get('auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(response => {
                    login(response.data.user, token);
                    navigate('/');
                }).catch(error => {
                    setError(error.response?.data?.message || 'Errore di autenticazione con Google');
                });
            } catch (error) {
                setError('Errore di autenticazione con Google');
            }
        }
    }, [login, navigate]);

    const handleGoogleLogin = () => {
        window.location.href = process.env.REACT_APP_API_BASE_URL+'/auth/google';
    }

    return (
        <Container className='mt-5'>
            <Row className="justify-content-center">
                <Col md={6} xs={12}>
                    <h2 className="form-title">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit} className="form-container">
                        <Form.Group className="mb-4" controlId='email'>  
                            <Form.Label className='form-label'>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                value={email} 
                                placeholder='Inserisci la tua email' 
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-5" controlId='password'>
                            <Form.Label className='form-label'>Password</Form.Label>
                            <Form.Control 
                                type="password"
                                value={password} 
                                placeholder='Inserisci la tua password' 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </Form.Group>
                        <div className='d-flex flex-column gap-3 mt-4'>
                            <Button 
                                type="submit" 
                                style={{ 
                                    background: 'linear-gradient(to right, blue, red)', 
                                    border: 'none', 
                                    borderRadius: '10px', 
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
                                    width: '100%' 
                                }}
                                className='mb-3'
                            >
                                Login
                            </Button>
                            
                            <Button 
                                onClick={handleGoogleLogin} 
                                className="submit-button"
                                style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                }}
                            >
                                <FaGoogle />
                                Accedi con Google
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;

