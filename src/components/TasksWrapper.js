import React, { useState, useEffect } from "react"
import axios from "axios"
import List from "@material-ui/core/List"
import Grid from "@material-ui/core/Grid"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import IconButton from "@material-ui/core/IconButton"
import useKeypress from "react-use-keypress"
import determineTaskCompletionSentiment from "../util/determine-sentiment"
import taskWrapperStyler from '../stylers/task-wrapper'
import authHeader from '../util/auth-header'
import TaskCreateDialog from '../components/dialogs/TaskCreate'
import TaskUpdateDialog from '../components/dialogs/TaskUpdate'
import TaskListItemWrapper from '../components/partials/TaskListItemWrapper'
import AddItem from '../components/buttons/AddItem'
import TaskHeader from './partials/TaskHeader'
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

  const setCurrentDateQuickPick = (date) => {
    handleDateChange(date);
    setSelectedDate(date);
    fetchTasks(date);
  };

  return (
    <div>
      <Grid container spacing={3} justify="space-end" alignItems="center">
        <Grid item xs={2}>
          <AddItem classes={classes} setShouldOpenCreateModal={setShouldOpenCreateModal} />
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
              <TaskHeader
                setCurrentDateQuickPick={setCurrentDateQuickPick}
                currentDate={currentDate}
              />
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
      <TaskCreateDialog 
        shouldOpenCreateModal={shouldOpenCreateModal}
        handleTaskCreateModalClose={handleTaskCreateModalClose}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setName={setName}
        setDescription={setDescription}
        handleSubmit={handleSubmit} />
      <TaskUpdateDialog 
        shouldOpenUpdateModal={shouldOpenUpdateModal}
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

          return <TaskListItemWrapper 
                    labelId={labelId}
                    task={task}
                    classes={classes}
                    currentDate={currentDate} 
                    toggleTaskCompleted={toggleTaskCompleted} 
                    handleSetUpdatingTask={handleSetUpdatingTask} 
                    fetchTasks={fetchTasks} />
        })}
      </List>
    </div>
  );
}
