import React, { useState } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Button, TextField, Grid, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { message } from 'antd'; // Using antd for better alerts

const ForgotPassword = () => {
   const navigate = useNavigate()
   const [data, setData] = useState({
      email: '',
      password: '',
      confirmPassword: ''
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!data.email || !data.password || !data.confirmPassword) {
         message.warning("Please fill all fields");
         return;
      }

      if (data.password !== data.confirmPassword) {
         message.error("Passwords do not match!");
         return;
      }

      try {
         const res = await axios.post("http://localhost:8001/api/user/forgotpassword", data);
         if (res.data.success) {
            message.success('Password changed successfully!');
            navigate('/login');
         } else {
            message.error(res.data.message);
         }
      } catch (err) {
         if (err.response && err.response.status === 401) {
            message.error("User doesn't exist");
            navigate("/register");
         } else {
            message.error("Something went wrong");
         }
      }
   };

   return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
         <Navbar expand="lg" className="auth-navbar">
            <Container>
               <Navbar.Brand>
                  <Link to={'/'} style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 800, fontSize: '1.5rem' }}>
                     HouseHunt
                  </Link>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="ms-auto">
                     <Link className="auth-nav-link" to={'/'}>Home</Link>
                     <Link className="auth-nav-link" to={'/login'}>Login</Link>
                     <Link className="auth-nav-link" to={'/register'}>Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         <Container component="main" maxWidth="xs">
            <Box className="auth-card">
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ m: 1, bgcolor: '#2563eb' }}>
                     <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mt: 1, color: '#1e293b' }}>
                     Reset Password
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', mb: 2 }}>
                     Enter your email and choose a new secure password.
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={data.email}
                        onChange={handleChange}
                        autoFocus
                     />
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        value={data.password}
                        onChange={handleChange}
                     />
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        id="confirmPassword"
                        value={data.confirmPassword}
                        onChange={handleChange}
                     />

                     <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="auth-btn"
                        sx={{ mt: 3, mb: 2 }}
                     >
                        Update Password
                     </Button>

                     <Grid container justifyContent="center">
                        <Grid item className="signup-text">
                           Remembered it?
                           <Link style={{ color: "#2563eb", fontWeight: 600, marginLeft: '5px' }} to={'/login'}>
                              Back to Login
                           </Link>
                        </Grid>
                     </Grid>
                  </Box>
               </Box>
            </Box>
         </Container>
      </Box>
   )
}

export default ForgotPassword;