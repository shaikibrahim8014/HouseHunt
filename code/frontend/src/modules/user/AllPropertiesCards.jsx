import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Carousel, Col, Form, Row, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { message } from 'antd';

const AllPropertiesCards = ({ loggedIn }) => {
   const [show, setShow] = useState(false);
   const [allProperties, setAllProperties] = useState([]);
   const [filterPropertyType, setPropertyType] = useState('');
   const [filterPropertyAdType, setPropertyAdType] = useState('');
   const [filterPropertyAddress, setPropertyAddress] = useState('');
   const [selectedProperty, setSelectedProperty] = useState(null);
   const [userDetails, setUserDetails] = useState({ fullName: '', phone: '' });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserDetails({ ...userDetails, [name]: value });
   };

   const handleClose = () => {
      setShow(false);
      setSelectedProperty(null);
   };

   const handleShow = (property) => {
      setSelectedProperty(property);
      setShow(true);
   };

   const getAllProperties = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/user/getAllProperties');
         setAllProperties(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   const handleBooking = async (status, propertyId, ownerId) => {
      if (!ownerId) {
         return message.error("Owner information missing for this property");
      }
      try {
         const res = await axios.post(
            `http://localhost:8001/api/user/bookinghandle/${propertyId}`,
            { userDetails, status, ownerId },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
         );
         if (res.data.success) {
            message.success(res.data.message);
            handleClose();
         } else {
            message.error(res.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => { getAllProperties(); }, []);

   const filteredProperties = allProperties.filter(p =>
      (filterPropertyAddress === '' || (p.propertyAddress && p.propertyAddress.toLowerCase().includes(filterPropertyAddress.toLowerCase()))) &&
      (filterPropertyAdType === '' || (p.propertyAdType && p.propertyAdType.toLowerCase() === filterPropertyAdType.toLowerCase())) &&
      (filterPropertyType === '' || (p.propertyType && p.propertyType.toLowerCase() === filterPropertyType.toLowerCase()))
   );

   return (
      <>
         {/* Search/Filter Bar */}
         <div className="filter-container mt-4">
            <span style={{ fontWeight: 700, color: '#475569' }}>🔍 Find Your Home:</span>
            <input
               type="text"
               placeholder="Search Location..."
               value={filterPropertyAddress}
               onChange={(e) => setPropertyAddress(e.target.value)}
            />
            <select value={filterPropertyAdType} onChange={(e) => setPropertyAdType(e.target.value)}>
               <option value="">Any Purpose</option>
               <option value="sale">For Sale</option>
               <option value="rent">For Rent</option>
            </select>
            <select value={filterPropertyType} onChange={(e) => setPropertyType(e.target.value)}>
               <option value="">All Types</option>
               <option value="residential">Residential</option>
               <option value="commercial">Commercial</option>
               <option value="land/plot">Land/Plot</option>
            </select>
         </div>

         {/* Property Grid */}
         <div className="property-grid mt-5">
            {filteredProperties.length > 0 ? (
               filteredProperties.map((property) => (
                  <Card key={property._id} className="property-card">
                     <div className="card-img-container">
                        <img
                           src={property.propertyImage?.[0] ? `http://localhost:8001${property.propertyImage[0].path}` : "/fallback.jpg"}
                           alt="property"
                        />
                        <div className="price-badge">₹{property.propertyAmt?.toLocaleString('en-IN')}</div>
                        <div className="ad-type-badge">{property.propertyAdType}</div>
                     </div>

                     <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                           <Badge bg="info" className="text-capitalize">{property.propertyType}</Badge>
                           <small className={property.isAvailable === "Available" ? "text-success fw-bold" : "text-danger fw-bold"}>
                              ● {property.isAvailable}
                           </small>
                        </div>

                        <Card.Title style={{ fontSize: '1.1rem', fontWeight: 700 }} className="mb-2">
                           {property.propertyAddress}
                        </Card.Title>

                        <div className="d-grid mt-3">
                           {!loggedIn ? (
                              <Link to={'/login'} className="d-grid text-decoration-none">
                                 <Button variant="outline-primary">Login to View Details</Button>
                              </Link>
                           ) : (
                              <Button
                                 variant="primary"
                                 disabled={property.isAvailable !== "Available"}
                                 onClick={() => handleShow(property)}
                              >
                                 {property.isAvailable === "Available" ? "Get More Info" : "Sold Out"}
                              </Button>
                           )}
                        </div>
                     </Card.Body>
                  </Card>
               ))
            ) : (
               <div className="text-center w-100 py-5">
                  <h4 className="text-muted">No properties match your search.</h4>
               </div>
            )}
         </div>

         {/* Info Modal */}
         <Modal show={show} onHide={handleClose} size="lg" centered>
            {selectedProperty && (
               <>
                  <Modal.Header closeButton>
                     <Modal.Title className="fw-bold">Property Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Carousel className="rounded-3 overflow-hidden mb-4">
                        {selectedProperty.propertyImage?.map((image, idx) => (
                           <Carousel.Item key={idx}>
                              <img
                                 src={`http://localhost:8001${image.path}`}
                                 className="d-block w-100"
                                 style={{ height: '350px', objectFit: 'cover' }}
                                 alt="House"
                              />
                           </Carousel.Item>
                        ))}
                     </Carousel>

                     <Row>
                        <Col md={7}>
                           <h4 className="fw-bold">₹{selectedProperty.propertyAmt?.toLocaleString('en-IN')}</h4>
                           <p className="text-muted"><i className="bi bi-geo-alt"></i> {selectedProperty.propertyAddress}</p>
                           <hr />
                           <h6 className="fw-bold">Description</h6>
                           <p>{selectedProperty.additionalInfo || "No additional description provided."}</p>
                        </Col>
                        <Col md={5} className="bg-light p-3 rounded-3">
                           <h6 className="fw-bold mb-3">Interested? Book Now</h6>
                           <Form onSubmit={(e) => {
                              e.preventDefault();
                              handleBooking('pending', selectedProperty._id, selectedProperty.ownerId);
                           }}>
                              <Form.Control
                                 className="mb-2"
                                 placeholder="Your Full Name"
                                 name="fullName"
                                 required
                                 onChange={handleChange}
                              />
                              <Form.Control
                                 className="mb-3"
                                 type="number"
                                 placeholder="Contact Number"
                                 name="phone"
                                 required
                                 onChange={handleChange}
                              />
                              <Button type='submit' variant="primary" className="w-100">Confirm Booking Request</Button>
                           </Form>
                        </Col>
                     </Row>
                  </Modal.Body>
               </>
            )}
         </Modal>
      </>
   );
};

export default AllPropertiesCards;