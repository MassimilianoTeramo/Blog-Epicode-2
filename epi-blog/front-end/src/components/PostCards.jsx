import {Card, Button, CardBody, Badge} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';



const PostCards = ({post}) => {
const authorName = post.author? `${post.author.firstName} ${post.author.lastName}`: "Unknown";
const navigate = useNavigate();



    return (
        <Card className="mx-3 h-100 shadow-sm movie-poster-card" >
            <div className="poster-image-container">
            <Card.Img className="poster-image" variant="top" src={post.cover} alt={post.title} style={{maxHeight:'250px', objectFit:'cover'}} />
            </div>
            <CardBody  className="poster-body">
                <div>
                    <Badge bg='secondary'>{post.category}</Badge>
                </div>
            <Card.Title className="movie-title mt-3">{post.title}</Card.Title>
            <Card.Text className="movie-description">{post.content.substring(0,150)}...</Card.Text>
            
            <Button className='submit-button' variant="primary" onClick={() => navigate(`/posts/${post._id}`)}>Read More</Button>
            <div className="movie-metadata">
   <small className="text-muted">
    Di {post.author?.firstName || 'Anonimo'}
  </small>
  <small className="text-muted">
    {new Date(post.createdAt).toLocaleDateString()}
   </small>
</div>
        </CardBody>
        </Card>
        );
};

export default PostCards;