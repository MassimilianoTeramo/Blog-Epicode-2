import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import { useEffect } from 'react';


const CustomNavbar = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();



  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  //immagine di default
  const defaultImageProfile = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.firstName}+${user?.lastName}`;

  useEffect(() => {
    // Effettua un aggiornamento del componente quando lo stato dell'utente cambia
  }, [user]);


  return (
    <Navbar className="custom-navbar" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-text">
          EpiBlog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/posts/create" className="nav-link-custom">New Post</Nav.Link>
                <Nav.Link as={Link} to="/myposts" className="nav-link-custom">My Posts</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile" className="nav-link-custom">
                  
                  {user.firstName}
                </Nav.Link>
                <Button 
                  variant="outline-light" 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
    

export default CustomNavbar;