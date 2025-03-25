import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Profile = ()=>{
    const {user, login} = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError]=useState('');
    const [success, setSuccess]=useState('');
    const navigate = useNavigate();
    const handleChange = (e)=>{
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleProfileUpdate = async (e)=>{
        e.preventDefault()
        try {
            if (formData.newPassword && formData.newPassword !== formData.confirmPassword){
                setError('the passwords are different!')
                return
            }
            const response = await axios.put(process.env.REACT_APP_API_BASE_URL+`/users/${user._id}`,{
                firstName: formData.firstName,
                lastName: formData.lastName,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            login(response.data);
            setSuccess('Profile updated!')
            setError('')

            //reset psw fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setTimeout(() => {
                navigate('/');
            }, 3000); // waits for 2 seconds before navigating
        } catch (err) {
            setError(err.response?.data?.message || 'something went wrong while updating the profile')
            setSuccess('')
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4 form-title">Manage your Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Form onSubmit={handleProfileUpdate} className="form-container">

                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        onChange={handleChange}
                                        value={formData.firstName}
                                        />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Surname</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        onChange={handleChange}
                                        value={formData.lastName}
                                        />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={formData.email}
                                        />
                            </Form.Group>

                            <h4 className="form-label mt-5 mb-4" style={{fontSize:"20px"}}>Change Password</h4>

                            <Form.Group className="mb-3">
                                <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="currentPassword"
                                        onChange={handleChange}
                                        value={formData.currentPassword}
                                        />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        onChange={handleChange}
                                        value={formData.newPassword}
                                        />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        onChange={handleChange}
                                        value={formData.confirmPassword}
                                        />
                            </Form.Group>

                            <Button
                                className="submit-button"
                                variant='primary'
                                type="submit"
                                >Submit
                            </Button>

                        </Form>
                    </Col>
                </Row>
        </Container>
         )
}

export default Profile;
