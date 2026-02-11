import React, { useState, useEffect } from 'react';
import { Container, Button, Col, Form,  Row } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

function AddProperty() {
   const [image, setImage] = useState(null);
   const [propertyDetails, setPropertyDetails] = useState({
      propertyType: 'residential',
      propertyAdType: 'rent',
      propertyAddress: '',
      ownerContact: '',
      propertyAmt: 0,
      additionalInfo: ''
   });

   const handleImageChange = (e) => {
      const files = e.target.files;
      setImage(files);
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setPropertyDetails((prevDetails) => ({
         ...prevDetails,
         [name]: value,
      }));
   };

   useEffect(() => {
      setPropertyDetails((prevDetails) => ({
         ...prevDetails,
         propertyImages: image,
      }));
   }, [image]);

   const handleSubmit = (e) => {
      e.preventDefault()
      const formData = new FormData();
      formData.append('propertyType', propertyDetails.propertyType);
      formData.append('propertyAdType', propertyDetails.propertyAdType);
      formData.append('propertyAddress', propertyDetails.propertyAddress);
      formData.append('ownerContact', propertyDetails.ownerContact);
      formData.append('propertyAmt', propertyDetails.propertyAmt);
      formData.append('additionalInfo', propertyDetails.additionalInfo);

      if (image) {
         for (let i = 0; i < image.length; i++) {
            formData.append('propertyImages', image[i]);
         }
      }

      axios.post('http://localhost:8001/api/owner/postproperty', formData, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
         }
      })
         .then((res) => {
            if (res.data.success) {
               message.success(res.data.message);
               // Optional: Reset form here
            } else {
               message.error(res.data.message);
            }
         })
         .catch((error) => {
            console.error('Error adding property:', error);
            message.error("Failed to add property");
         });
   };

   return (
      <Container className="property-form-container">
         <div className="mb-4">
            <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Post New Property</h3>
            <p style={{ color: '#64748b' }}>Fill in the details below to list your property on HouseHunt.</p>
         </div>

         <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
               <Form.Group as={Col} md="4" className="mb-3 mb-md-0">
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select name='propertyType' value={propertyDetails.propertyType} onChange={handleChange}>
                     <option value="residential">Residential</option>
                     <option value="commercial">Commercial</option>
                     <option value="land/plot">Land/Plot</option>
                  </Form.Select>
               </Form.Group>

               <Form.Group as={Col} md="4" className="mb-3 mb-md-0">
                  <Form.Label>Listing Type</Form.Label>
                  <Form.Select name='propertyAdType' value={propertyDetails.propertyAdType} onChange={handleChange}>
                     <option value="rent">For Rent</option>
                     <option value="sale">For Sale</option>
                  </Form.Select>
               </Form.Group>

               <Form.Group as={Col} md="4">
                  <Form.Label>Full Address</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="e.g. 123 Street, City"
                     required
                     name='propertyAddress'
                     value={propertyDetails.propertyAddress}
                     onChange={handleChange}
                  />
               </Form.Group>
            </Row>

            <Row className="mb-4">
               <Form.Group as={Col} md="6" className="mb-3 mb-md-0">
                  <Form.Label>Upload Images (Multiple)</Form.Label>
                  <Form.Control
                     type="file"
                     required
                     accept="image/*"
                     name="images"
                     multiple
                     onChange={handleImageChange}
                  />
               </Form.Group>

               <Form.Group as={Col} md="3" className="mb-3 mb-md-0">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                     type="tel"
                     placeholder="Phone number"
                     required
                     name='ownerContact'
                     value={propertyDetails.ownerContact}
                     onChange={handleChange}
                  />
               </Form.Group>

               <Form.Group as={Col} md="3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                     type="number"
                     placeholder="Amount"
                     required
                     name='propertyAmt'
                     value={propertyDetails.propertyAmt}
                     onChange={handleChange}
                  />
               </Form.Group>
            </Row>

            <Row className="mb-4">
               <Col>
                  <Form.Label>Additional Information</Form.Label>
                  <Form.Control
                     name='additionalInfo'
                     value={propertyDetails.additionalInfo}
                     onChange={handleChange}
                     as="textarea"
                     rows={4}
                     placeholder="Describe features like BHK, parking, amenities..."
                  />
               </Col>
            </Row>

            <div className="d-flex justify-content-end">
               <Button className='btn-submit-property' type="submit">
                  Publish Property Listing
               </Button>
            </div>
         </Form>
      </Container>
   );
}

export default AddProperty;