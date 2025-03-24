import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <Container>
        <Row className="py-4">
          <Col md={4} className="footer-section">
            <h5 className="footer-title">EpicBlog</h5>
            <p className="footer-text">
           
            </p>
          </Col>
          <Col md={4} className="footer-section">
            <h5 className="footer-title">Link Utili</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/posts/create">Nuovo Post</Link></li>
              <li><Link to="/myposts">I Miei Post</Link></li>
            </ul>
          </Col>
          <Col md={4} className="footer-section">
            <h5 className="footer-title">Contatti</h5>
            <p className="footer-text">
              <i className="fas fa-envelope me-2"></i> maxtera87@gmail.com
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3 footer-bottom">
            <p className="mb-0"> © Strive School | Developed for homework projects.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
