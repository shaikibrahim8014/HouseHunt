import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import { UserContext } from '../../../App';
//import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';
import AddProperty from './AddProperty';
import AllProperties from './AllProperties';
import AllBookings from './AllBookings';

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

const OwnerHome = () => {
  const user = useContext(UserContext);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.href = "/"; // Proper way to redirect and clear state
  };

  if (!user || !user.userData) return null;

  return (
    <div className="admin-dashboard"> {/* Reusing the dashboard class for background */}
      {/* Attractive Owner Navbar */}
      <Navbar expand="lg" className="admin-navbar">
        <Container fluid>
          <Navbar.Brand>
            <h2 className="brand-text">HouseHunt<span style={{ color: '#64748b', fontSize: '1rem' }}> Owner</span></h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto"></Nav>
            <Nav className="align-items-center">
              <span className="user-greeting mx-3">Welcome, <b>{user.userData.name}</b></span>
              <Link onClick={handleLogOut} to={'/'} className="logout-link">Log Out</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Content Container */}
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
              <Tab label="➕ Add Property" />
              <Tab label="🏠 My Properties" />
              <Tab label="📅 Tenant Bookings" />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <AddProperty />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <AllProperties />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <AllBookings />
          </CustomTabPanel>
        </Box>
      </Container>
    </div>
  )
}

export default OwnerHome;