import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import TaskColumn from "./TaskColumn";
import TaskFilter from "./TaskFilter";
import DroppableTaskColumn from "./DroppableTaskColumn";
import { Avatar, Button, Container, Grid, Paper } from "@mui/material";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import tasks from "../data/tasks";
import PersonIcon from '@mui/icons-material/Person';

const TaskBoard = () => {
  const [allTasks, setAllTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : tasks;
  });
  const[filters,setFilters]= useState({
    assignee: undefined,
    priority: "",
    startDate: "",
    endDate: "",
  });
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [taskColumns, setTaskColumns] = useState([
    { status: "Pending", tasks: [] },
    { status: "In Progress", tasks: [] },
    { status: "Completed", tasks: [] },
    { status: "Deployed", tasks: [] },
    { status: "Deferred", tasks: [] },
  ]);

  

  // Update filtered tasks whenever all tasks change
  useEffect(() => {
    filterTasks(filters);
  }, [allTasks]);

  useEffect(() => {
    
    const updateColumnsTasks = () => {
      
      setTaskColumns(prevColumns => {
        return prevColumns.map(column => ({
          ...column,
          tasks: filteredTasks.filter(task => task.status === column.status)
        }));
      });
    };
    updateColumnsTasks();
  }, [filteredTasks]); // Only listen for changes in filteredTasks

  const handleOpenTaskForm = () => {
    setOpenTaskForm(true);
  };

  const deleteTask = (taskId) => {
    const updatedAllTasks = allTasks.filter((task) => task.id !== taskId);
    const updatedFilteredTasks = filteredTasks.filter((task) => task.id !== taskId);
    setAllTasks(updatedAllTasks);
    setFilteredTasks(updatedFilteredTasks);
  };

  const addTask = (newTask) => {
    setAllTasks([...allTasks, newTask]);
    localStorage.setItem("tasks", JSON.stringify([...allTasks, newTask]));
  };

  const updateTask = (updatedTask) => {

    const updatedAllTasks = allTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    const updatedFilteredTasks = filteredTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setAllTasks(updatedAllTasks);
    setFilteredTasks(updatedFilteredTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedAllTasks));
  };

  const filterTasks = (filters) => {
    const {
      assignee,
      priority,
      startDate,
      endDate,
    } = filters;
    const filtered = allTasks.filter((task) => {
      const assigneeLowerCase = assignee ? assignee.toLowerCase().trim().replace(/\s/g, '') : '';
      const taskAssignee = task.assignee ? task.assignee.toLowerCase().trim().replace(/\s/g, '') : '';
      const isAssigneeMatch = !assignee || taskAssignee.includes(assigneeLowerCase);
      const isPriorityMatch = !priority || task.priority === priority;
      const taskStartDate = new Date(task.startDate);
      const filterStartDate = new Date(startDate);
      const isStartDateMatch =
        !startDate ||
        new Date(
          taskStartDate.getFullYear(),
          taskStartDate.getMonth(),
          taskStartDate.getDate()
        ) >=
          new Date(
            filterStartDate.getFullYear(),
            filterStartDate.getMonth(),
            filterStartDate.getDate()
          );
     
      const filterEndDate = new Date(endDate);
      const isEndDateMatch =
        !endDate ||
        new Date(
          taskStartDate.getFullYear(),
          taskStartDate.getMonth(),
          taskStartDate.getDate()
        ) <=
          new Date(
            filterEndDate.getFullYear(),
            filterEndDate.getMonth(),
            filterEndDate.getDate()
          );
      return isAssigneeMatch && isPriorityMatch && isStartDateMatch && isEndDateMatch;
    });
    setFilteredTasks(filtered);
    setFilters(filters);
  };

  const handleDrop = (item, columnStatus) => {
    const { id, sourceStatus } = item;
    if (sourceStatus !== columnStatus) {
      
      onUpdateTask(id, columnStatus);
    }
  };

  const onUpdateTask = (taskId, newStatus) => {
    setAllTasks(prevAllTasks => {
      const updatedAllTasks = prevAllTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        } else {
          return task;
        }
      });
      console.log("updatedAllTasks", updatedAllTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedAllTasks));
      return updatedAllTasks;
    });
  };
 //console.log("column tasks",taskColumns)
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ minHeight: "100vh", paddingTop: "2rem", marginLeft: "2rem", marginRight: "2rem",paddingBottom:"2rem" }}>
        <div style={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "space-between",marginBottom:"1rem" }}>
          <h1>Task Board</h1>
          <PersonIcon sx={{backgroundColor:"whitesmoke",padding:"1rem",borderRadius:"50px",fontSize:"40px"}} />
        </div>
        <Paper sx={{ backgroundColor: "#0000", boxShadow: "none", border: "1px solid #fff", paddingX: "2rem", paddingY: "2rem" }}>
          <div style={{ flexDirection: "row", display: "flex", alignItems: "flex-start", justifyContent: "space-between",flexWrap:"wrap" }}>
            <TaskFilter onFilter={filterTasks} />
            <Button variant="contained" onClick={handleOpenTaskForm} sx={{margin:"1rem"}}>
              Add New Task
            </Button>
          </div>
          <TaskForm open={openTaskForm} onClose={() => setOpenTaskForm(false)} onSubmit={addTask} />
          <Grid container spacing={2}>
            {taskColumns.map(({ status, tasks }) => (
              <Grid item xs={12} md={2.4} key={status}>
                <DroppableTaskColumn status={status} onDrop={handleDrop}>
                  <TaskColumn
                    status={status}
                    bgcolor={status === "Pending" ? "#D3D3D3" : status === "In Progress" ? "#fda63a" : status === "Completed" ? "#74c365" : status === "Deployed" ? "#000435" : "#f88379"}
                    tasks={tasks}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                  />
                </DroppableTaskColumn>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
