import React, { useEffect, useState } from "react";
import ReviewService from "../../Services/ReviewService";
import { ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";

function Review() {
  const [reviews, setReviews] = useState(null);
  const [orderBy, setOrderBy] = useState("Rating");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState({});

  useEffect(() => {
    retrieveReviews();
  }, [pageNumber]);

  const retrieveReviews = () => {
    ReviewService.getReviews(pageNumber, pageSize, sortOrder, orderBy)
      .then(response => {
        console.log(response.data.data);
        setReviews(response.data.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const nextPage = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };
  
  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(prevPageNumber => prevPageNumber - 1);
    }
  };

  const openUpdateModal = review => {
    setCurrentReview(review);
    setIsModalOpen(true);
  };

  const handleInputChange = event => {
    setCurrentReview({ ...currentReview, [event.target.name]: event.target.value });
  };

  const updateReview = () => {
    ReviewService.updateReview(currentReview.id, currentReview)
      .then(response => {
        retrieveReviews(); // Refresh reviews after update
        setIsModalOpen(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteReview = (id) => {
    ReviewService.removeReview(id)
      .then(response => {
        retrieveReviews(); // Refresh reviews after deletion
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      <ListGroup className="text-center">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <ListGroupItem key={review.id} className="square border border-2">
              {`User: ${review.userName}  Rating: ${review.rating}`}
              <p> {review.content}</p>
              <Button onClick={() => openUpdateModal(review)}>Update</Button>
              <Button color="danger" onClick={() => deleteReview(review.id)}>Delete</Button>
            </ListGroupItem>
          ))
        ) : (
          <ListGroupItem>No reviews available</ListGroupItem>
        )}
      </ListGroup>
      <button onClick={previousPage}>Previous Page</button>
      <button onClick={nextPage}>Next Page</button>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Update Review</ModalHeader>
        <ModalBody>
          <Input type="textarea" name="content" value={currentReview.content} onChange={handleInputChange} placeholder="Content" />
          <Input type="number" name="rating" value={currentReview.rating} onChange={handleInputChange} placeholder="Rating" min={1} max={5} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={updateReview}>Update Review</Button>{' '}
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Review;
