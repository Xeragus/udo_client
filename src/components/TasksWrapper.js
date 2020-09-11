import React, { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import DateFnsUtils from "@date-io/date-fns"
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import axios from "axios"
import Checkbox from "@material-ui/core/Checkbox"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import TaskItem from "./TaskItem"
import Grid from "@material-ui/core/Grid"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import { isYesterday, isTomorrow, isBefore, getDayOfYear } from "date-fns"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import { useConfirm } from "material-ui-confirm"
import useKeypress from "react-use-keypress"
import Tooltip from "@material-ui/core/Tooltip"
import determineTaskCompletionSentiment from "../util/determine-sentiment"
import taskWrapperStyler from '../stylers/task-wrapper'
import authHeader from '../util//auth-header'
import TaskCreateDialog from '../components/dialogs/TaskCreate'
import TaskUpdateDialog from '../components/dialogs/TaskUpdate'

const useStyles = taskWrapperStyler

export default function TasksWrapper() {
  const classes = useStyles()
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false)
  const [shouldOpenUpdateModal, setShouldOpenUpdateModal] = useState(false)
  const [updatingTask, setUpdatingTask] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [updateName, setUpdateName] = useState("")
  const [updateDescription, setUpdateDescription] = useState("")
  const [updateCurrentDate, setUpdateCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [currentDate, handleDateChange] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [completionPercentage, setCompletionPercentage] = useState(null)
  const [tasksFetched, setTasksFetched] = useState(false)
  const confirm = useConfirm()

  useKeypress("ArrowLeft", () => {
    handleCurrentDateChange(-1)
  })

  useKeypress("ArrowRight", () => {
    handleCurrentDateChange(1)
  })

  useKeypress("Enter", () => {
    setShouldOpenCreateModal(true)
  })

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
        setTasks(res.data.tasks);
        setCompletionPercentage(res.data.completion_percentage);
        setTasksFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleSubmit = () => {
    axios
      .post(
        "http://localhost:3001/tasks", {
          name,
          deadline: selectedDate,
          description,
        },
        authHeader
      )
      .then((res) => {
        setShouldOpenCreateModal(false)
        setTimeout(() => {
          fetchTasks(currentDate)
        }, 300)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleUpdate = () => {
    axios
      .put(
        `http://localhost:3001/tasks/${updatingTask.id}`,
        {
          name: updateName,
          deadline: updateCurrentDate,
          description: updateDescription,
        },
        authHeader
      )
      .then((res) => {
        setShouldOpenUpdateModal(false)
        setTimeout(() => {
          fetchTasks(currentDate)
        }, 400)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSetUpdatingTask = (task, e) => {
    e.stopPropagation()
    setUpdatingTask(task)
    setUpdateName(task.name)
    setUpdateDescription(task.description)
    setUpdateCurrentDate(currentDate)
    setShouldOpenUpdateModal(true)
  }

  const handleTaskCreateModalClose = () => {
    setShouldOpenCreateModal(false);
  };

  const handleTaskUpdateModalClose = () => {
    setShouldOpenUpdateModal(false);
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

  const isPast = (date) => {
    return getDayOfYear(date) < getDayOfYear(new Date());
  };

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
    setSelectedDate(date);
    fetchTasks(date);
  };

  const deleteTask = (e, task) => {
    if (e.stopPropagation()) e.stopPropagation();
    confirm({
      description: "Deleting a task is a permanent action.",
    })
      .then(() => {
        axios
          .delete(`http://localhost:3001/tasks/${task.id}`, {
            headers: {
              Authorization: `Basic ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            fetchTasks(currentDate);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch(() => {});
  };

  return (
    <div>
      <Grid container spacing={3} justify="space-end" alignItems="center">
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
          xs={2}
          style={{
            color: determineTaskCompletionSentiment(completionPercentage)[0],
            position: "relative",
          }}
        >
          <div
            style={{ maxWidth: "121px", padding: "7px" }}
            className={tasks.length > 0 ? classes.hasTasks : null}
          >
            <div
              style={{
                display: "inline-block",
                position: "absolute",
                top: "22px",
              }}
            >
              {completionPercentage != null
                ? determineTaskCompletionSentiment(completionPercentage)[1]
                : ""}
            </div>
            <div
              style={{
                display: "inline-block",
                textAlign: "center",
                marginLeft: "35px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "19px",
                  marginBottom: "-11px",
                }}
              >
                {completionPercentage != null ? `${completionPercentage}%` : ""}
              </div>
              <div>
                <i style={{ fontSize: "14px", left: "89px" }}>
                  {completionPercentage != null ? `completed` : ""}
                </i>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={8} id="date_section">
          <Grid container spacing={2} justify="flex-end">
            <Grid item>
              <IconButton
                className={`${classes.calendarButton} ${classes.button}`}
                onClick={() => {
                  handleCurrentDateChange(-1);
                }}
              >
                <ChevronLeftIcon color="primary" />
              </IconButton>
            </Grid>
            <Grid item>
              <div
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  position: "relative",
                  width: "140px",
                }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    autoOk
                    value={currentDate}
                    onChange={(date) => setCurrentDateQuickPick(date)}
                    showTodayButton
                    format="E MMM d Y"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    inputProps={{ style: { textAlign: "center" } }}
                    labelFunc={(date) => {
                      return date.toDateString();
                    }}
                    id="central_date_picker"
                  />
                </MuiPickersUtilsProvider>
                <span>
                  <i>{getDayDescription(currentDate)}</i>
                </span>
              </div>
            </Grid>
            <Grid item>
              <IconButton
                className={`${classes.calendarButton} ${classes.button}`}
                onClick={() => {
                  handleCurrentDateChange(1);
                }}
              >
                <ChevronRightIcon color="primary" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <TaskCreateDialog shouldOpenCreateModal={shouldOpenCreateModal}
                        handleTaskCreateModalClose={handleTaskCreateModalClose}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        setName={setName}
                        setDescription={setDescription}
                        handleSubmit={handleSubmit} />
      <TaskUpdateDialog shouldOpenUpdateModal={shouldOpenUpdateModal}
                        handleTaskUpdateModalClose={handleTaskUpdateModalClose}
                        updateName={updateName}
                        updateDescription={updateDescription}
                        currentDate={currentDate}
                        updateCurrentDate={updateCurrentDate}
                        setUpdateCurrentDate={setUpdateCurrentDate}
                        setUpdateName={setUpdateName}
                        setUpdateDescription={setUpdateDescription}
                        handleUpdate={handleUpdate} />
      <List className={classes.root} style={{ paddingTop: "15px" }}>
        {tasks.map((task) => {
          const labelId = `checkbox-list-label-${task.id}`;

          return (
            <ListItem
              key={task.id}
              role={undefined}
              dense
              button
              disabled={isPast(currentDate) ? true : false}
              onClick={() => {
                toggleTaskCompleted(task);
              }}
            >
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item button>
                  <Grid container direction="row" alignItems="center">
                    <Grid item>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={task.is_completed}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                          style={{
                            color: `${task.is_completed ? "#43a047" : ""}`,
                          }}
                        />
                      </ListItemIcon>
                    </Grid>
                    <Grid item>
                      <TaskItem id={labelId} task={task} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label="edit"
                      className={classes.margin}
                      onClick={(e) => handleSetUpdatingTask(task, e)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      className={classes.margin}
                      onClick={(e) => deleteTask(e, task)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
