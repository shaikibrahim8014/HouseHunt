import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import { UserContext } from '../../../App';
//import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';
import AllPropertiesCards from '../AllPropertiesCards';
import AllProperty from './AllProperties';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RenterHome = () => {
  const user = useContext(UserContext);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.href = "/"; // Forces state reset and redirect
  };

  if (!user || !user.userData) return null;

  return (
    <div className="admin-dashboard">
      {/* Sleek Renter Navbar */}
      <Navbar expand="lg" className="admin-navbar">
        <Container fluid>
          <Navbar.Brand>
            <h2 className="brand-text">HouseHunt<span style={{ color: '#64748b', fontSize: '1rem' }}> Renter</span></h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto"></Nav>
            <Nav className="align-items-center">
              <span className="user-greeting mx-3">Hi, <b>{user.userData.name}</b></span>
              <Link onClick={handleLogOut} to={'/'} className="logout-link">Log Out</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content Area */}
      <Container className="admin-tab-container mt-4 mb-5">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '1rem' },
                '& .Mui-selected': { color: '#2563eb !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#2563eb', height: '3px' }
              }}
            >
              <Tab label="🔍 Browse Homes" />
              <Tab label="📜 My Booking History" />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            {/* Centered Property Card Grid */}
            <Box sx={{ py: 2 }}>
              <AllPropertiesCards loggedIn={user.userLoggedIn} />
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <AllProperty />
          </CustomTabPanel>
        </Box>
      </Container>
    </div>
  )
}

export default RenterHome;