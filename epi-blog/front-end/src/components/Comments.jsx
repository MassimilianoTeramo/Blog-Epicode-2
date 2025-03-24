import { useState, useEffect } from 'react';
import { Form, Button, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const fetchComments = async () => {
        if (!postId) {
            console.error("postId is not defined");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/comments/post/${postId}`);
            setComments(response.data);
        } catch (err) {
            setError('Errore nel caricamento dei commenti');
            console.error("Error fetching comments:", err);
        }
    };

    useEffect(() => {
       
            fetchComments();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Devi essere autenticato per commentare');
            return;
        }

        if (!postId) {
            setError('ID del post non valido');
            return;
        }

        try {
           
            const response = await axios.post('http://localhost:3001/comments', {
                content: newComment,
                author: user._id,
                post: postId
            });

            console.log('Risposta commento:', response.data);
            await fetchComments();

            setComments([response.data, ...comments]);
            setNewComment('');
            setError('');
        } catch (err) {
            console.error('Errore completo:', err.response || err);
            setError(err.response?.data?.message || 'Errore durante l\'invio del commento');
        }
    };

    const handleDelete = async (commentId) => {
    
        try {

            const response = await axios.delete(`http://localhost:3001/comments/${commentId}`);
            
            if (response.status === 200) {
                setComments(comments.filter(c => c._id !== commentId));
                setError('');
                console.log('Commento eliminato con successo');
            }
        } catch (err) {
            console.error('Errore completo:', err.response || err);
            if (err.response?.status === 401) {

            } else if (err.response?.status === 403) {
                setError('Non sei autorizzato a eliminare questo commento');
            } else {
                setError('Errore durante l\'eliminazione del commento');
            }
        }
    };

    return (
        <div className="comments-section">
            <h2 className='mt-4 mb-4 form-label' style={{fontSize:"20px"}}>Comments</h2>
            {comments.length === 0 && <Alert variant="info">No comments yet</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            {user ? (
                <Form onSubmit={handleCommentSubmit} className="comment-form form-container mb-4">
                    <Form.Group controlId="comment">
                        <Form.Label className='form-label'>Add Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Scrivi un commento..."
                            required
                            className="form-control"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-2 submit-button">
                        Submit
                    </Button>
                </Form>
            ) : (
                <Alert variant="info">
                    Log In to leave a comment
                </Alert>
            )}

            <ListGroup className='mt-4' style={{borderRadius:'15px'}}>
                {comments.map((comment) => (
                    <ListGroup.Item key={comment._id} className="comment-item form-container">
                        <div style={{fontStyle:'italic'}} className="form-label" >
                            {comment.author?.firstName || 'Utente Eliminato'} {comment.author?.lastName || ''}
                        </div>
                        <div className="comment-text" style={{color:'white'}}>{comment.content}
                            <div className='text-muted small pt-2 pb-2'>{new Date(comment.createdAt).toLocaleString()}</div>
                        </div>
                        {user && comment.author && user._id === comment.author._id && (
                            <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleDelete(comment._id)} 
                                className="mt-2"
                            >
                                Elimina
                            </Button>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default Comments;