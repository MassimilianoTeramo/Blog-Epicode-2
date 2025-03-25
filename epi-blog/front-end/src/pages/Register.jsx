import {useState} from 'react';
import {Form, Button, Alert, Col, Row, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';



const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

               // Validazione
               if (formData.password !== formData.confirmPassword) {
                setError('Le password non coincidono');
                return;
            }
            
        try {
            const response = await api.post(process.env.REACT_APP_API_BASE_URL+'/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            const { user, token } = response.data;
            login(user, token);
            navigate('/');
        }
        catch (err) {
            setError(err.response ? err.response.data.message : 'Server error');
        }
    }   

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            
        });
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6} xs={12}>
                    <h2 className="text-center form-label mt-4" style={{fontSize:"20px"}} >Register</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-3'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name= "firstName" value={formData.firstName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group  className='mb-3'>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name= "lastName" value={formData.lastName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email"  name= "email"value={formData.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group  className='mb-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name= "password" value={formData.password} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group  className='mb-3'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" name= "confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" className='submit-button'>Register</Button>
                    </Form>
                </Col>
            </Row> 
        </Container>
    );
}   
export default Register;