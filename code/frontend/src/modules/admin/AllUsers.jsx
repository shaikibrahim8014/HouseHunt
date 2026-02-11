import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
   Table, TableBody, TableCell, TableContainer,
   TableHead, TableRow, Paper, Button, Typography, Box
} from '@mui/material';

const AllUsers = () => {
   const [allUser, setAllUser] = useState([]);

   useEffect(() => {
      getAllUser();
   }, []);

   const getAllUser = async () => {
      try {
         const response = await axios.get('http://localhost:8001/api/admin/getallusers', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

         if (response.data.success) {
            setAllUser(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
         message.error("Failed to load users");
      }
   };

   const handleStatus = async (userid, status) => {
      try {
         const res = await axios.post('http://localhost:8001/api/admin/handlestatus', { userid, status }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });
         if (res.data.success) {
            message.success(`Status updated to ${status}`);
            getAllUser();
         }
      } catch (error) {
         console.log(error);
         message.error("Update failed");
      }
   };

   return (
      <Box>
         <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
            User Management
         </Typography>

         <TableContainer component={Paper} className="property-table-container">
            <Table sx={{ minWidth: 650 }} aria-label="user table">
               <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                     <TableCell className="table-header-cell">User ID</TableCell>
                     <TableCell align="center" className="table-header-cell">Name</TableCell>
                     <TableCell align="center" className="table-header-cell">Email</TableCell>
                     <TableCell align="center" className="table-header-cell">Role</TableCell>
                     <TableCell align="center" className="table-header-cell">Permission</TableCell>
                     <TableCell align="center" className="table-header-cell">Actions</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allUser.map((user) => (
                     <TableRow key={user._id} className="table-row">
                        <TableCell className="id-text">
                           {user._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                           {user.name}
                        </TableCell>
                        <TableCell align="center" sx={{ color: '#64748b' }}>
                           {user.email}
                        </TableCell>
                        <TableCell align="center">
                           <span className={user.type === 'Owner' ? 'user-type-owner' : 'user-type-renter'}>
                              {user.type}
                           </span>
                        </TableCell>
                        <TableCell align="center">
                           {user.type === 'Owner' ? (
                              <span className={user.granted === 'granted' ? 'status-granted' : 'status-ungranted'}>
                                 {user.granted}
                              </span>
                           ) : (
                              <span style={{ color: '#cbd5e1' }}>—</span>
                           )}
                        </TableCell>
                        <TableCell align="center">
                           {user.type === 'Owner' && (
                              user.granted === 'ungranted' ? (
                                 <Button
                                    className="action-btn"
                                    onClick={() => handleStatus(user._id, 'granted')}
                                    size='small'
                                    variant="contained"
                                    color="success"
                                 >
                                    Grant Access
                                 </Button>
                              ) : (
                                 <Button
                                    className="action-btn"
                                    onClick={() => handleStatus(user._id, 'ungranted')}
                                    size='small'
                                    variant="outlined"
                                    color="error"
                                 >
                                    Revoke
                                 </Button>
                              )
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Box>
   );
};

export default AllUsers;