import {useEffect, useState} from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
    const {id} = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [coverImage, setCoverImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


    const [formData, setFormData] = useState({
        title: '',
        category: '',
        cover: '',
        content: '',
        readTime: {
            value: '',
            unit: 'minuti'
        }
    });

       
    useEffect(()=>{
        const fetchEdit = async () => {
        
        setLoading(true)
         try    {
            const response = await axios.get(process.env.REACT_APP_API_BASE_URL+`/posts/${id}`);
            const post = response.data

            setFormData({
                title: post.title,
                category: post.category,
                cover: post.cover,
                content: post.content,
                readTime: post.readTime
            })
                setPreviewUrl(post.cover)
    } catch (err) {
        setError ('error in uploading the post')
    }   finally {
        setLoading(false)
    }
};
fetchEdit();
    }, [id, user._id, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

        const handleEdit = async (e) =>{
            e.preventDefault()
            try {
            const editedFormToSend = new FormData();
            editedFormToSend.append('title', formData.title);
            editedFormToSend.append('category', formData.category);
            editedFormToSend.append('content', formData.content);
            editedFormToSend.append('readTime', JSON.stringify({
                value: parseInt(formData.readTime.value),
                unit: formData.readTime.unit
            }));

            if (coverImage) {
                editedFormToSend.append('cover', coverImage);
            }

            await axios.put(
                process.env.REACT_APP_API_BASE_URL+`/posts/${id}`, 
                editedFormToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert("Changes completed")
            navigate('/')

        } catch (err) {
            console.error('Errore:', err);
            setError(err.response?.data?.message || 'Errore durante la creazione del post');
        }
    };
        return (
            <>
      <Button variant="primary" onClick={handleShow}>
        Edit Post
      </Button>

      <Modal show={show} onHide={handleClose} className="modal-dark">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="form-title">Modifica il tuo post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="form-container">
          <Form onSubmit={handleEdit}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Titolo</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required    
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Categoria</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Immagine</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="mt-2" 
                  style={{maxWidth: '200px'}} 
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Contenuto</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Tempo di lettura</Form.Label>
              <Row>
                <Col xs={8}>
                  <Form.Control
                    type="number"
                    value={formData.readTime.value}
                    onChange={(e) => setFormData({ ...formData, readTime: { ...formData.readTime, value: e.target.value } })}
                    required
                  />
                </Col>
                <Col xs={4}>
                  <Form.Control
                    as="select"
                    value={formData.readTime.unit}
                    onChange={(e) => setFormData({ ...formData, readTime: { ...formData.readTime, unit: e.target.value } })}
                    required
                  >
                    <option value="minuti">Minuti</option>
                    <option value="ore">Ore</option>
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            <div className="d-flex gap-3">
              <Button className="submit-button" type="submit">
                Salva modifiche
              </Button>
              <Button className="submit-button" onClick={handleClose} style={{ background: 'transparent', border: '2px solid #2eff60' }}>
                Chiudi
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
          );
        }
        export default EditPost


