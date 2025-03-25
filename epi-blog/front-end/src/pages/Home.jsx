import { useState, useEffect } from "react";    
import { Container, Row, Col, Pagination } from "react-bootstrap";  
import axios from "axios";
import PostCards from "../components/PostCards";
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { user } = useAuth();

    //modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(ProcessingInstruction.env.REACT_APP_API_BASE_URL+`/posts?page=${currentPage}`);
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (error) {
        setError(error);
        setPosts([]);
        console.error('Error fetching posts:', error);
      } finally {
        setLoading (false);
      }
      
    };
  
    fetchPosts();

 }, [user, currentPage]);




    return (
     
        <Container className="mt-5 max_container">
              {loading && <p>Loading posts...</p>}
              {error && <p>An error occurred: {error.message}</p>}
              <Row>
                {!loading && !error && posts.length > 0 ? (
                  posts.map(post => (
                    <Col key={post._id} md={4} className="mb-4">
                      <PostCards post={post} />
                    </Col>
                  ))
                ) : (
                  <p>No posts available</p>
                )}
              </Row>
              {totalPages > 1 && (
                <div>
                  <Pagination className="justify-content-center">
                    <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                  </Pagination>
                </div>
              )}
        </Container>
    );
}

export default Home;