import React, { useRef, useState } from "react";
import { Card, CardContent, Typography, Button, Box, Paper, MenuItem, Select, InputLabel, FormControl, Menu, Divider, Popover } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TaskForm from "./TaskForm";
import DraggableComponent from "./DraggableComponent";
import DeleteTask from "./DeleteTask";


const TaskColumn = ({ status, tasks, onUpdateTask, bgcolor, onDeleteTask }) => {
    const handleStatusChange = (task, newStatus) => {
        const updatedTask = { ...task, status: newStatus };
        onUpdateTask(updatedTask);
    };
    const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = (taskId) => {
    onDeleteTask(taskId); // Pass the task ID to the onDeleteTask callback function
    setOpenDialog(false);
  };
    const [openTaskForm, setOpenTaskForm] = useState(false);

    const handleOpenTaskForm = () => {
        setOpenTaskForm(true);
    };
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const op = Boolean(anchorEl); // Moved from top

    const [selectedStatus, setSelectedStatus] = useState(status || "");
    const anchorRef = useRef(null);
    const [openStatusMenu, setOpenStatusMenu] = useState(false); // Rename open to avoid confusion

    const handleClick = () => {
        setOpenStatusMenu(true);
    };

    const handleClose = (newStatus) => {

        if (newStatus) {
            setSelectedStatus(newStatus);
            handleStatusChange(tasks[0], newStatus); // Update first task for now (assuming single task per card)
        }
        setOpenStatusMenu(false);
    };
   
    return (
        <div className="task-column">
            <Paper sx={{ paddingBottom: "1rem", borderRadius: "4px",minHeight:"30rem" }}>
                {/* Background with styling */}
                <h3  style={{ textAlign: "center", backgroundColor: bgcolor, paddingTop: "0.5rem", paddingBottom: "0.5rem", borderTopLeftRadius: "3px", borderTopRightRadius: "3px", color: "#fff" }}>{status}</h3>
                <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                {tasks.map((task) => (
                    <DraggableComponent key={task.id} id={task.id} type={status}>
                        <Card key={task.id} sx={{ borderRadius: "4px", mb: "1rem", backgroundColor: "#f5f5f5", zIndex:1000}}>
                            <CardContent>
                                {/* Other card content */}
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                    <Typography variant="body1" component="div">
                                        {task.title}
                                    </Typography>
                                    <Typography variant="body2" color="white" sx={{ backgroundColor: "#1976d2", padding: "0.5em", borderRadius: "2.5px" }}>
                                        {task.priority}
                                    </Typography>
                                </div>
                                <Divider sx={{ marginY: "1rem" }} />
                                <Typography variant="body2" color="textSecondary" sx={{ marginY: "1rem" }}>
                                    {task.description}
                                </Typography>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginY: "1rem" }}>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold" }}>
                                        @{task.assignee}
                                    </Typography>
                                    <Button variant="contained" sx={{ minWidth: "0px", padding: "0.1rem" }} onClick={handleMenuClick}>
                                        <MoreVertIcon />
                                    </Button>
                                </div>
                                <Popover
                                    id="menu-popover"
                                    open={op}
                                    anchorEl={anchorEl}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: 'center',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'right',
                                        horizontal: 'right',
                                    }}
                                    sx={{ marginTop: "0.3rem", marginLeft: "5.5rem" }}
                                >
                                    <MenuItem onClick={handleOpenTaskForm}>Edit</MenuItem>
                                    {status !== "Completed"  && <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>}
                                </Popover>
                                <DeleteTask openDialog={openDialog} handleCloseDialog={handleCloseDialog}  handleConfirmDelete={handleConfirmDelete} taskId={task.id} title={task.title}/>
                                <TaskForm open={openTaskForm} onClose={() => setOpenTaskForm(false)} onUpdateTask={onUpdateTask} initialTask={task} />
                                <Box sx={{ display: "flex", marginY: "1rem" }}>
                                    <Button ref={anchorRef} variant="contained" onClick={handleClick}>
                                        {selectedStatus || "Status"}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorRef.current}
                                        open={openStatusMenu} // Changed to openStatusMenu
                                        onClose={() => handleClose(selectedStatus)} // Pass the selected status to handleClose
                                        MenuListProps={{ "aria-labelledby": "simple-menu" }}
                                    >
                                        <MenuItem onClick={() => handleClose("Pending")}>Assign</MenuItem>
                                        <MenuItem onClick={() => handleClose("In Progress")}>In Progress</MenuItem>
                                        <MenuItem onClick={() => handleClose("Completed")}>Completed</MenuItem>
                                        <MenuItem onClick={() => handleClose("Deployed")}>Deployed</MenuItem>
                                        <MenuItem onClick={() => handleClose("Deferred")}>Deferred</MenuItem>
                                    </Menu>
                                </Box>
                            </CardContent>
                        </Card>
                        </DraggableComponent>
                    ))}
                </div>

            </Paper>
        </div>
    );
};

export default TaskColumn;
