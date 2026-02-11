import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { Avatar, Button, TextField, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { message } from 'antd';
import { UserContext } from '../../App';

const Login = () => {
  const navigate = useNavigate();
  const { setUserData, setUserLoggedIn } = useContext(UserContext);
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.email.trim() || !data.password.trim()) {
      return message.error("Please fill all fields");
    }

    axios.post("http://localhost:8001/api/user/login", data)
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          // update context immediately
          setUserData(res.data.user);
          setUserLoggedIn(true);

          const user = res.data.user;
          if (user.type === "Admin") navigate("/adminhome");
          else if (user.type === "Renter") navigate("/renterhome");
          else if (user.type === "Owner") {
            user.granted === "ungranted"
              ? message.error("Account pending admin approval")
              : navigate("/ownerhome");
          }
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="auth-page-wrapper">
      {/* Navbar */}
      <Navbar expand="lg" className="auth-navbar">
        <Navbar.Brand>
          <h2 style={{ color: '#2563eb', fontWeight: 800, margin: 0 }}>HouseHunt</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto">
            <Link className="nav-link-custom" to="/">Home</Link>
            <Link className="nav-link-custom" to="/login">Login</Link>
            <Link className="nav-link-custom" to="/register">Register</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Login Form */}
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box className="login-card">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#2563eb', mb: 2, width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" className="auth-title">
              Welcome Back
            </Typography>
            <Typography variant="body1" className="auth-subtitle">
              Please enter your details to sign in.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={data.email}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={data.password}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="auth-btn"
                sx={{ mt: 4, mb: 3, py: 1.5, fontSize: '1rem' }}
              >
                Sign In
              </Button>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Forgot password?
                    <Link to="/forgotpassword" style={{ marginLeft: '5px' }} className="auth-link auth-link-red">
                      Reset
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    New here?
                    <Link to="/register" style={{ marginLeft: '5px' }} className="auth-link auth-link-blue">
                      Sign Up
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;