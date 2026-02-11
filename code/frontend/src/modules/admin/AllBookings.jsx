import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
   Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, Paper, Typography
} from '@mui/material';

const AllBookings = () => {
   const [allBookings, setAllBookings] = useState([]);

   const getAllBooking = async () => {
      try {
         const response = await axios.get('http://localhost:8001/api/admin/getallbookings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

         if (response.data.success) {
            setAllBookings(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
         message.error("Failed to fetch bookings");
      }
   };

   useEffect(() => {
      getAllBooking();
   }, []);

   // Helper to style the status text
   const getStatusClass = (status) => {
      const s = status?.toLowerCase();
      if (s === 'pending') return 'status-pending';
      if (s === 'approved' || s === 'completed') return 'status-approved';
      return 'status-rejected';
   };

   return (
      <div className="table-wrapper">
         <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
            Booking Management
         </Typography>

         <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="bookings table">
               <TableHead>
                  <TableRow>
                     <TableCell className="table-header-cell">Booking ID</TableCell>
                     <TableCell align="center" className="table-header-cell">Property ID</TableCell>
                     <TableCell align="center" className="table-header-cell">Tenant Name</TableCell>
                     <TableCell align="center" className="table-header-cell">Contact</TableCell>
                     <TableCell align="center" className="table-header-cell">Status</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allBookings.length > 0 ? allBookings.map((booking) => (
                     <TableRow key={booking._id} className="table-row">
                        <TableCell className="id-text">{booking._id.slice(-8)}...</TableCell>
                        <TableCell align="center" className="id-text">{booking.propertyId.slice(-8)}...</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 500 }}>{booking.userName}</TableCell>
                        <TableCell align="center" sx={{ color: '#64748b' }}>{booking.phone}</TableCell>
                        <TableCell align="center">
                           <span className={`status-badge ${getStatusClass(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                           </span>
                        </TableCell>
                     </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#94a3b8' }}>
                           No bookings found.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   );
};

export default AllBookings;