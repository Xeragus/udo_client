import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TaskItem from "./TaskItem";
import Grid from "@material-ui/core/Grid";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { isYesterday, isTomorrow, isPast } from "date-fns";
import TodayIcon from "@material-ui/icons/Today";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    color: "#fff",
  },
  completed: {
    textDecoration: "line-through",
    color: "#808080",
  },
  task: {
    fontSize: "15px",
  },
  calendarButton: {
    height: "36px",
  },
}));

export default function TasksWrapper() {
  const classes = useStyles();
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false);
  const today = new Date();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentDate, handleDateChange] = useState(
    new Date(today.setHours(23, 59, 59, 999))
  );
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const fetchTasks = (date = null) => {
    date = date ? date : new Date();
    axios
      .get("http://localhost:3001/tasks", {
        params: {
          date: date.toISOString().slice(0, -14),
        },
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    axios
      .post(
        "http://localhost:3001/tasks",
        {
          name,
          deadline: selectedDate,
          description,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setShouldOpenCreateModal(false);
        setTimeout(() => {
          fetchTasks(currentDate);
        }, 400);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTaskCreateModalClose = () => {
    setShouldOpenCreateModal(false);
  };

  const toggleTaskCompleted = (task) => {
    axios
      .patch(
        `http://localhost:3001/tasks/${task.id}`,
        {
          is_completed: !task.is_completed,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        fetchTasks(currentDate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCurrentDateChange = (addOrDeductDay) => {
    currentDate.setDate(currentDate.getDate() + addOrDeductDay);
    handleDateChange(currentDate);

    fetchTasks(currentDate);
  };

  useEffect(fetchTasks, []);

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const differenceInDays = (date) => {
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${Math.abs(diffDays)} days ago`;
    }

    return `In ${Math.abs(diffDays)} days`;
  };

  const getDayDescription = (date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return differenceInDays(date);
    }
  };

  const setCurrentDateQuickPick = (date) => {
    handleDateChange(date);

    fetchTasks(date);
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:3001/tasks/${id}`, {
            headers: {
              Authorization: `Basic ${localStorage.getItem("token")}`,
            },
          })
         .then(res => {
          fetchTasks(currentDate)
         })
         .catch(err => {
          console.log(err)
         })
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            text="white"
            className={classes.button}
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              setShouldOpenCreateModal(true);
            }}
          >
            Add
          </Button>
        </Grid>
        <Grid
          item
          xs={10}
          id="date_section"
        >
            <Grid container spacing={2}>
              <Grid item>
                <IconButton 
                  className={`${classes.calendarButton} ${classes.button}`}
                  onClick={() => {
                    handleCurrentDateChange(-1);
                  }}>
                  <ChevronLeftIcon color="primary" />
                </IconButton>
                <div style={{ display: 'inline-block', textAlign: 'center', position: 'relative', width: '120px' }}>
                  <div style={{ position: 'absolute', width: '120px', top: '-25px' }}>
                    <span style={{ fontSize: "15px" }}>
                      {currentDate.toDateString()}
                    </span>
                    <br />
                    <span>
                      <i>{getDayDescription(currentDate)}</i>
                    </span>
                  </div>
                </div>
                <IconButton 
                  className={`${classes.calendarButton} ${classes.button}`}
                  onClick={() => {
                    handleCurrentDateChange(1);
                  }}>
                  <ChevronRightIcon color="primary" />
                </IconButton>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item style={{ width: '160px' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    autoOk
                    variant="inline"
                    value={currentDate}
                    onChange={(date) => setCurrentDateQuickPick(date)}
                    inputVariant="outlined"
                    label="Quick Date Pick"
                    showTodayButton
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item>
                
              </Grid>
            </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={shouldOpenCreateModal}
        onClose={handleTaskCreateModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              value={selectedDate}
              disablePast
              onChange={(date) => setSelectedDate(date)}
              label="Finish before"
              showTodayButton
              style={{ marginTop: "35px", marginBottom: "4px" }}
            />
          </MuiPickersUtilsProvider>
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows="2"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskCreateModalClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <List className={classes.root} style={{ paddingTop: "15px" }}>
        {tasks.map((task) => {
          const labelId = `checkbox-list-label-${task.id}`;

          return (
            <ListItem
              key={task.id}
              role={undefined}
              dense
              button
              onClick={() => {
                toggleTaskCompleted(task);
              }}
              style={{ background: `${task.is_completed ? '#e0fee0' : ''}` }}
              disabled={isPast(currentDate) ? true : false}
            > 
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={task.is_completed}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                          style={{ color: `${task.is_completed ? '#43a047' : ''}` }}
                        />
                      </ListItemIcon>
                    </Grid>
                    <Grid item>
                      <TaskItem id={labelId} task={task} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton aria-label="edit" className={classes.margin}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    className={classes.margin}
                    onClick={() => deleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
