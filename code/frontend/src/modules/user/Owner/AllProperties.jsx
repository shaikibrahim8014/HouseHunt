import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
   Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';
import { Button } from 'react-bootstrap';

const AllProperty = () => {
   const [allBookings, setAllBookings] = useState([]);

   const getAllProperty = async () => {
      try {
         const response = await axios.get('http://localhost:8001/api/owner/getallbookings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });
         if (response.data.success) {
            setAllBookings(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
         message.error("Error fetching bookings");
      }
   };

   useEffect(() => {
      getAllProperty();
   }, []);

   const handleStatus = async (bookingId, propertyId, status) => {
      try {
         const res = await axios.post('http://localhost:8001/api/owner/handlebookingstatus',
            { bookingId, propertyId, status },
            { headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` } }
         );
         if (res.data.success) {
            message.success(`Booking marked as ${status}`);
            getAllProperty();
         } else {
            message.error('Something went wrong');
         }
      } catch (error) {
         console.log(error);
         message.error("Connection error");
      }
   };

   // Helper for status styling
   const getStatusStyle = (status) => {
      if (status === 'pending') return 'status-pending';
      if (status === 'booked') return 'status-approved';
      return 'status-rejected';
   };

   return (
      <Box sx={{ p: 1 }}>
         <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
            Recent Booking Requests
         </Typography>

         <TableContainer component={Paper} className="booking-table-card">
            <Table sx={{ minWidth: 650 }} aria-label="owner bookings table">
               <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                     <TableCell className="table-header-cell">Booking ID</TableCell>
                     <TableCell align="center" className="table-header-cell">Property ID</TableCell>
                     <TableCell align="center" className="table-header-cell">Tenant Name</TableCell>
                     <TableCell align="center" className="table-header-cell">Tenant Phone</TableCell>
                     <TableCell align="center" className="table-header-cell">Current Status</TableCell>
                     <TableCell align="center" className="table-header-cell">Actions</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allBookings.length > 0 ? allBookings.map((booking) => (
                     <TableRow key={booking._id} className="table-row">
                        <TableCell className="id-text">
                           #{booking._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell align="center" className="id-text">
                           {booking.propertyId.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell align="center" className="tenant-name">
                           {booking.userName}
                        </TableCell>
                        <TableCell align="center">
                           <a href={`tel:${booking.phone}`} className="phone-link">
                              {booking.phone}
                           </a>
                        </TableCell>
                        <TableCell align="center">
                           <span className={`status-badge ${getStatusStyle(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                           </span>
                        </TableCell>
                        <TableCell align="center">
                           {booking?.bookingStatus === "pending" ? (
                              <Button
                                 onClick={() => handleStatus(booking._id, booking.propertyId, 'booked')}
                                 variant='success'
                                 className="owner-action-btn"
                              >
                                 Approve
                              </Button>
                           ) : (
                              <Button
                                 onClick={() => handleStatus(booking._id, booking.propertyId, 'pending')}
                                 variant='outline-danger'
                                 className="owner-action-btn"
                              >
                                 Set Pending
                              </Button>
                           )}
                        </TableCell>
                     </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                           No booking requests yet.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>
      </Box>
   );
};

export default AllProperty;