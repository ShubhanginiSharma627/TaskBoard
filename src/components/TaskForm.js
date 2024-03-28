import React, { useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Box, FormControl, InputLabel, Typography, IconButton, Menu } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { v4 as uuidv4 } from 'uuid'; 
const taskPriorities = [
  { value: 'P0', label: 'P0' },
  { value: 'P1', label: 'P1' },
  { value: 'P2', label: 'P2' },
];

const taskStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'deployed', label: 'Deployed' },
  { value: 'deferred', label: 'Deferred' },
];

const TaskForm = ({ open, onClose, onSubmit,onUpdateTask,initialTask }) => {
  const [updatedTask, setUpdatedTask] = useState();
  const handleStatusChange = (task, newStatus) => {
    setFormData({ ...formData, status: newStatus  });
};
    
    const anchorRef = useRef(null);
    const [openStatusMenu, setOpenStatusMenu] = useState(false); // Rename open to avoid confusion
   
    const handleClick = () => {
        setOpenStatusMenu(true);
    };

    const handleClose = (newStatus) => {
        if (newStatus) {
            
            handleStatusChange(initialTask, newStatus); // Update first task for now (assuming single task per card)
        }
        setOpenStatusMenu(false);
    };

  const [formData, setFormData] = useState(initialTask || {
    id: uuidv4(),
    title: '',
    description: '',
    startDate: new Date(), // Default to current dat
    status: 'Pending',
    team: '', // Add if you want to track team
    assignee: '',
    priority: 'P2',
  });
  const handleReset = () => {
    setFormData({
      id: uuidv4(),
      title: '',
      description: '',
      startDate: new Date(), // Default to current date
      status: 'pending',
      team: '', // Add if you want to track team
      assignee: '',
      priority: 'P2',
    });
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(initialTask){
      onUpdateTask(formData);
    }
    else{
      onSubmit(formData);
    }
    setFormData({
      id: uuidv4(),
      title: '',
      description: '',
      startDate: new Date(), // Default to current date
      status: 'pending',
      team: '', // Add if you want to track team
      assignee: '',
      priority: 'P2',
    });
    onClose(); // Close the dialog after submit
  };
 
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{initialTask ? "Edit Task" : "Create Task"}</Typography>
        <IconButton onClick={onClose}>
          <CancelOutlinedIcon fontSize="medium" />
        </IconButton>
      </DialogTitle>
      <DialogContent className='form'>
        <Box mt={2} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ marginRight: "1rem" }}>Title:</Typography>
          <TextField
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ width: "70%", backgroundColor: "#d5d5d5" }}
            size="small"
            disabled={initialTask ? true : false}
          />
        </Box>
        <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ marginRight: "1rem" }}>Description:</Typography>
          <TextField
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ width: "70%", backgroundColor: "#d5d5d5" }}
            size="small"
            disabled={initialTask ? true : false}
          />
        </Box>
        <Box mt={2} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ marginRight: "1rem" }}>Team:</Typography>
          <TextField
            name="team"
            value={formData.team}
            onChange={handleChange}
            sx={{ width: "70%", backgroundColor: "#d5d5d5" }}
            size="small"
            disabled={initialTask ? true : false}
          />
        </Box>
        <Box mt={2} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ marginRight: "1rem" }}>Assignee:</Typography>
          <TextField
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            sx={{ width: "70%", backgroundColor: "#d5d5d5" }}
            size="small"
            disabled={initialTask ? true : false}
          />
        </Box>
       <Box mt={2} display={initialTask ? "flex":"block"} alignItems="center" justifyContent={"space-around"}>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ marginRight: initialTask?"1rem":"7rem" }}>Priority:</Typography>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            sx={{ backgroundColor:initialTask? "whitesmoke": "#d5d5d5",height:initialTask?"42px":"auto" }}
          >
            <MenuItem value="P0">P0</MenuItem>
            <MenuItem value="P1">P1</MenuItem>
            <MenuItem value="P2">P2</MenuItem>
          </Select>
        </Box>
        {
          initialTask && (
            <Box  sx={{ display: "flex", alignItems: "center" }}>
              <Box  sx={{ display: "flex", alignItems: "center" }} >
              <Typography variant="subtitle1" sx={{ marginRight: "1rem" }}>Status:</Typography>
              <Button ref={anchorRef} variant="contained" onClick={handleClick}>
                {formData.status || "Status"}
              </Button>
              </Box>
              <Menu
                anchorEl={anchorRef.current}
                open={openStatusMenu} // Changed to openStatusMenu
                onClose={() => handleClose(formData.status)} // Pass the selected status to handleClose
                MenuListProps={{ "aria-labelledby": "simple-menu" }}
              >
                <MenuItem onClick={() => handleClose("Pending")}>Assign</MenuItem>
                <MenuItem onClick={() => handleClose("In Progress")}>In Progress</MenuItem>
                <MenuItem onClick={() => handleClose("Completed")}>Completed</MenuItem>
                <MenuItem onClick={() => handleClose("Deployed")}>Deployed</MenuItem>
                <MenuItem onClick={() => handleClose("Deferred")}>Deferred</MenuItem>
              </Menu>
            </Box>
          )
        }
        </Box>
      </DialogContent>
      <DialogActions>
       {!initialTask && (
         <Button onClick={handleReset} variant="contained">
         Reset
       </Button>
       )}
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
