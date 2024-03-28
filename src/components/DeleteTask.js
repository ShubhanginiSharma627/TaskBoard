import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
function DeleteTask({ openDialog, handleCloseDialog, handleConfirmDelete,taskId,title }) {
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Delete Task</Typography>
        <IconButton onClick={handleCloseDialog}>
          <CancelOutlinedIcon fontSize="medium" />
        </IconButton>
      </DialogTitle>
      <Box className='form'>
      <DialogContent >
      <Typography variant="body2">Are you sure you want to delete this task?</Typography>
      </DialogContent>
      <Box sx={{display:"flex",justifyContent: 'space-between',alignItems:"center",paddingLeft:"1.6rem"}}>
      <Typography variant="body2" sx={{fontWeight:"bold"}}>{title}</Typography>
      <DialogActions >
      <Button onClick={()=>handleConfirmDelete(taskId)} color="error">
          Yes
        </Button>
        <Button onClick={handleCloseDialog} color="primary">
          No
        </Button>
      </DialogActions>
      </Box>
      </Box>
    </Dialog>
  );
}

export default DeleteTask;
