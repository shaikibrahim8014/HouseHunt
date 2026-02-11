import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
   Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';

const AllProperty = () => {
   const [allProperties, setAllProperties] = useState([]);

   const getAllProperty = async () => {
      try {
         const response = await axios.get(`http://localhost:8001/api/user/getallbookings`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

         if (response.data.success) {
            setAllProperties(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
         message.error("Failed to load your bookings");
      }
   };

   useEffect(() => {
      getAllProperty();
   }, []);

   // Helper function to assign badge colors
   const getStatusClass = (status) => {
      const s = status?.toLowerCase();
      if (s === 'pending') return 'status-pending';
      if (s === 'booked' || s === 'success') return 'status-booked';
      return 'status-rejected';
   };

   return (
      <Box>
         <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
               My Bookings
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
               Track the status of your property applications below.
            </Typography>
         </Box>

         <TableContainer component={Paper} className="tenant-table-container">
            <Table sx={{ minWidth: 650 }} aria-label="tenant booking history">
               <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                     <TableCell className="table-header-cell">Booking Ref</TableCell>
                     <TableCell className="table-header-cell">Property Ref</TableCell>
                     <TableCell align="center" className="table-header-cell">Your Name</TableCell>
                     <TableCell align="center" className="table-header-cell">Phone</TableCell>
                     <TableCell align="center" className="table-header-cell">Status</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allProperties.length > 0 ? allProperties.map((booking) => (
                     <TableRow key={booking._id} className="table-row">
                        <TableCell className="id-text">
                           #{booking._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell className="id-text">
                           PRP-{booking.propertyId.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: '#334155' }}>
                           {booking.userName}
                        </TableCell>
                        <TableCell align="center" className="phone-text">
                           {booking.phone}
                        </TableCell>
                        <TableCell align="center">
                           <span className={`status-badge ${getStatusClass(booking.bookingStatus)}`}>
                              {booking.bookingStatus || 'Unknown'}
                           </span>
                        </TableCell>
                     </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                           <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                              You haven't made any bookings yet.
                           </Typography>
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