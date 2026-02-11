import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Navbar, Nav, Button, Carousel } from 'react-bootstrap';
import p1 from '../../images/imp2.jpg'
import p2 from '../../images/p2.jpg'
import p3 from '../../images/p3.jpg'
import p4 from '../../images/imp22.jpg'
import AllPropertiesCards from '../user/AllPropertiesCards';
import Box from '@mui/material/Box';

const Home = () => {
   const [index, setIndex] = useState(0);

   const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
   };

   return (
      <>
         {/* Modern Transparent Navbar */}
         <Navbar expand="lg" className="home-navbar">
            <Container>
               <Navbar.Brand>
                  <h2 style={{ color: '#2563eb', fontWeight: 800, margin: 0 }}>HouseHunt</h2>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="ms-auto align-items-center">
                     <Link className="nav-link-custom" to={'/'}>Home</Link>
                     <Link className="nav-link-custom" to={'/login'}>Login</Link>
                     <Link className="nav-link-custom" to={'/register'}>
                        <Button variant="primary" style={{ borderRadius: '8px', fontWeight: 600 }}>Get Started</Button>
                     </Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <div className='home-body'>
            <Carousel activeIndex={index} onSelect={handleSelect} fade>
               <Carousel.Item>
                  <img src={p1} alt="Luxury Villa" />
                  <Carousel.Caption>
                     <h3>Modern Living Spaces</h3>
                     <p>Discover the most comfortable homes in the city.</p>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
                  <img src={p2} alt="Cozy Apartment" />
                  <Carousel.Caption>
                     <h3>Find Your Perfect Stay</h3>
                     <p>Affordable rentals with premium amenities.</p>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
                  <img src={p3} alt="Office Space" />
                  <Carousel.Caption>
                     <h3>Strategic Locations</h3>
                     <p>Homes located near major hubs and transport.</p>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
                  <img src={p4} alt="Minimalist Interior" />
                  <Carousel.Caption>
                     <h3>Trusted by Thousands</h3>
                     <p>Your safety and comfort are our top priorities.</p>
                  </Carousel.Caption>
               </Carousel.Item>
            </Carousel>
         </div>

         <div className='property-content'>
            <Container className='text-center'>
               <h1 className='home-hero-text'>Explore Dream Properties</h1>
               <div className='owner-prompt mt-3'>
                  <span style={{ color: '#64748b' }}>Want to post your Property? </span>
                  <Link to={'/register'} style={{ textDecoration: 'none' }}>
                     <Button variant='link' style={{ fontWeight: 800, color: '#2563eb' }}>Register as Owner →</Button>
                  </Link>
               </div>

               {/* Property Listing Section */}
               <Box sx={{ mt: 5 }}>
                  <AllPropertiesCards />
               </Box>
            </Container>
         </div>
      </>
   )
}

export default Home;