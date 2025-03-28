import React from "react";
import CustomNavbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/footer/Footer";
import PostCards from "./components/PostCards";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import CreatePost  from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import MyPosts from './pages/MyPosts';
import Profile from './pages/Profile';
import Comments from "./components/Comments";



function App() {
  return (
    <Router>
      <AuthProvider>
        <CustomNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/register" element={<Register />} />
            <Route path="/postCard" element={<PostCards />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/myposts" element={<MyPosts />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
