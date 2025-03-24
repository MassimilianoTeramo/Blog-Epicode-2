import { useEffect, useState } from 'react';
import PostCards from '../components/PostCards';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {Container, Row, Col, Button, Alert} from 'react-bootstrap'

const MyPosts= () =>{
    
    const [posts, setPosts]= useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const {user} = useAuth(); // utilizzo questo hook per riprendere il valore user

    const getMyPosts= async ()=>{
        
        try{
            setLoading(true)
            const response = await axios.get(`http://localhost:3001/posts?author=${user._id}`);
            setPosts(response.data.posts);

        } catch(err){
            setError('Something went wrong loading your posts');
            console.log('errore nel caricamento', err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(()=>{
        if(user){
            getMyPosts();
        }

    }, [user]);

    const deleteMyPost = async (postId)=> {
        try {
            await axios.delete(`http://localhost:3001/posts/${postId}`); //postId preso dal componente PostCards che passa {post} come prop
            getMyPosts(); // per ricaricare i post dopo l'eliminazione
        } catch (err){
            setError('Something went wrong deleting your post')
        }
    };

    if (loading) return <Container className='mt-4'><p>Loading...</p></Container>;
    if (error) return <Container className='mt-4'><Alert variant='danger'>{error}</Alert></Container>;

    return (

        <Container className='mt-4'>
            <h4 className='mb-4 form-label fw-bold' style={{fontSize:'20px'}} >My Posts</h4>
            <Row>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <Col key={post._id} md={4} className='mb-4'>
                            <PostCards
                                post={post}
                                showActions={true}
                                onDelete={()=> deleteMyPost(post._id)}/>
                                
                        </Col>
                    ))
                ):(
                    <Col>
                        <p>You haven't published any post yet!</p>
                    </Col>

                )}

            </Row>


        </Container>
    );

};

export default MyPosts
