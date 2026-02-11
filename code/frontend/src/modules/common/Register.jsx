import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Avatar, Button, TextField, Grid, Box, Typography, InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { message } from 'antd';

const Register = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    type: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!data?.name || !data?.email || !data?.password || !data?.type) {
      return message.warning("Please fill all fields");
    }

    axios.post('http://localhost:8001/api/user/register', data)
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
          navigate('/login')
        } else {
          message.error(response.data.message)
        }
      })
      .catch((error) => {
        console.log("Error", error);
        message.error("Registration failed. Please try again.");
      });
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar expand="lg" className="auth-navbar">
        <Container>
          <Navbar.Brand>
            <h2 style={{ color: '#2563eb', fontWeight: 800, margin: 0 }}>HouseHunt</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto">
              <Link className="nav-link-custom" to={'/'}>Home</Link>
              <Link className="nav-link-custom" to={'/login'}>Login</Link>
              <Link className="nav-link-custom" to={'/register'}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="centered-content">
        <Box className="register-card">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2563eb', mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h4" className="auth-title">
              Create Account
            </Typography>
            <Typography variant="body1" className="auth-subtitle">
              Join HouseHunt to find or list properties.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Full Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                autoFocus
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                name="email"
                value={data.email}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={data.password}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="user-type-label">User Type</InputLabel>
                <Select
                  labelId="user-type-label"
                  name='type'
                  value={data.type}
                  label="User Type"
                  onChange={handleChange}
                  className="auth-select"
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value={'Renter'}>Renter (Looking for a home)</MenuItem>
                  <MenuItem value={"Owner"}>Owner (Listing a property)</MenuItem>

                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="auth-btn"
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
              >
                Sign Up
              </Button>

              <Grid container justifyContent="center">
                <Grid item className="signup-text">
                  Already have an account?
                  <Link style={{ color: "#2563eb", fontWeight: 600, marginLeft: '5px' }} to={'/login'} className="auth-link">
                    Sign In
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  )
}

export default Register;
