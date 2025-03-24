import { useState, useEffect } from "react";
import { Col, Container, Row, Button, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditPost from '../pages/EditPost';
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from "react-router-dom";
import Comments from "../components/Comments";


const PostDetails = () => {
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {id} = useParams();
    const { user } = useAuth();
    const userName = user? `${user.firstName} ${user.lastName}`:"unknown"
    const authorName = post.author? `${post.author.firstName} ${post.author.lastName}`: "Unknown";
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3001/posts/${id}`);
                if (response.status === 200) {
                    setPost(response.data);
                    setError(null);
                } else {
                    setError(new Error('Post not found'));
                }
            } catch (error) {
                setError(error);
                setPost({});
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }
    , [id]);

    const deletePost = async () => {
        try {
          const response = await axios.delete(`http://localhost:3001/posts/${id}`);
          console.log(`Post with ID ${id} deleted successfully`);
          navigate('/')

          if (response.status === 200) {
            alert('Post eliminated!');
          } else {
            throw new Error('Not Eliminated');
          }
       

        } catch (error) {
          alert(error.message);
          console.log(`Post with ID ${id} not deleted`);
          
        }
      };
    

    return (
        <Container className="mt-5">
            {loading && <p>Loading post...</p>}
            {error && <p>An error occurred: {error.message}</p>}
            {!loading && !error && (
                <Row>
                    <Col md={4} className="d-flex align-items-center">
                        <img src={post.cover} alt={post.title} style={{ width: '100%' }} />
                    </Col>
                    <Col md={8} style={{ textAlign: 'justify', color: 'white' }}>
                        <h1 className="form-title">{post.title}</h1>
                        <div className="post-content">
                            {post.content?.split('\n').map((paragraph, index) => (
                                <p key={index} className="content-paragraph">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        <div className="d-flex justify-content-start gap-3 ">
                        {userName === authorName && (
                            <div className="mt-3 d-flex justify-content-start gap-3">
                                <EditPost 
                                style={{cursor:'pointer'}} 
                                />
                                <Button 
                                    variant="danger"
                                    onClick={() => deletePost(id)}    
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                    </Col>

                </Row>
            )}
            <Row>
                <Col md={8}>
                    {post._id && <Comments postId={post._id} />}
                </Col>
            </Row>
        </Container>
    );
};

export default PostDetails;