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
         const response = await axios.get('http://localhost:8001/api/admin/getallproperties', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

         if (response.data.success) {
            setAllProperties(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
         message.error("Error loading properties");
      }
   };

   useEffect(() => {
      getAllProperty();
   }, []);

   return (
      <Box>
         <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
            Property Inventory
         </Typography>

         <TableContainer component={Paper} className="property-table-container">
            <Table sx={{ minWidth: 650 }} aria-label="property table">
               <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                     <TableCell className="table-header-cell">Property ID</TableCell>
                     <TableCell align="center" className="table-header-cell">Type</TableCell>
                     <TableCell align="center" className="table-header-cell">Ad Type</TableCell>
                     <TableCell align="left" className="table-header-cell">Address</TableCell>
                     <TableCell align="center" className="table-header-cell">Owner Contact</TableCell>
                     <TableCell align="center" className="table-header-cell">Amount</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allProperties.length > 0 ? allProperties.map((property) => (
                     <TableRow key={property._id} className="table-row">
                        <TableCell className="id-text">
                           {property._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell align="center">
                           <span className="type-badge">{property.propertyType}</span>
                        </TableCell>
                        <TableCell align="center" sx={{ color: '#64748b' }}>
                           {property.propertyAdType || 'N/A'}
                        </TableCell>
                        <TableCell align="left" className="address-cell">
                           {property.propertyAddress}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 500 }}>
                           {property.ownerContact}
                        </TableCell>
                        <TableCell align="center" className="price-text">
                           ₹{Number(property.propertyAmt).toLocaleString('en-IN')}
                        </TableCell>
                     </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                           No properties available.
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