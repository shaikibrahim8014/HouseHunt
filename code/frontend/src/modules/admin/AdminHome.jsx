import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import { UserContext } from '../../App';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AllUsers from './AllUsers';
import AllProperty from './AllProperty';
import AllBookings from './AllBookings';

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminHome = () => {
  const { userData} = useContext(UserContext);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => setValue(newValue);

  const handleLogOut = () => {
    localStorage.clear();
    window.location.href = "/"; // Proper way to redirect and clear state
  };

  if (!userData) {
    navigate('/login');
    return null;
  }

  return (
    <div className="admin-dashboard">
      {/* Navbar */}
      <Navbar expand="lg" className="admin-navbar">
        <Container fluid>
          <Navbar.Brand><h2 className="brand-text">HouseHunt.</h2></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto"></Nav>
            <Nav className="align-items-center">
              <span className="user-greeting mx-3">Hi, <b>{userData.name}</b></span>
              <Nav.Link onClick={handleLogOut} className="logout-link">
                Log Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Tabs Section */}
      <Container className="admin-tab-container px-0 mt-4">
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
              <Tab label="👥 All Users" id="tab-0" />
              <Tab label="🏠 All Properties" id="tab-1" />
              <Tab label="📅 All Bookings" id="tab-2" />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <AllUsers />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <AllProperty />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <AllBookings />
          </CustomTabPanel>
        </Box>
      </Container>
    </div>
  );
};

export default AdminHome;