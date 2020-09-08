import React, { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import { makeStyles } from "@material-ui/core/styles"
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
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import Skeleton from '@material-ui/lab/Skeleton';

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
}))

export default function TasksWrapper() {
  const classes = useStyles()
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false)
  const [shouldOpenUpdateModal, setShouldOpenUpdateModal] = useState(false)
  const [updatingTask, setUpdatingTask] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [updateName, setUpdateName] = useState("")
  const [updateDescription, setUpdateDescription] = useState('')
  const [updateCurrentDate, setUpdateCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [currentDate, handleDateChange] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [completionPercentage, setCompletionPercentage] = useState(null)
  const [tasksFetched, setTasksFetched] = useState(false)

  const fetchTasks = (date = null) => {
    date = date ? date : new Date()
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
        setTasks(res.data.tasks)
        console.log(res.data)
        setCompletionPercentage(res.data.completion_percentage)
        setTasksFetched(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }

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
        setShouldOpenCreateModal(false)
        setTimeout(() => {
          fetchTasks(currentDate)
        }, 400)
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
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
          },
        }
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
    e.cancelBubble = true;
    if(e.stopPropagation) e.stopPropagation();  
    setUpdatingTask(task)
    setUpdateName(task.name)
    setUpdateDescription(task.description)
    setUpdateCurrentDate(task.deadline)
    setShouldOpenUpdateModal(true)
  }

  const handleTaskCreateModalClose = () => {
    setShouldOpenCreateModal(false)
  }

  const handleTaskUpdateModalClose = () => {
    setShouldOpenUpdateModal(false)
  }

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
        fetchTasks(currentDate)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleCurrentDateChange = (addOrDeductDay) => {
    currentDate.setDate(currentDate.getDate() + addOrDeductDay)
    handleDateChange(currentDate)

    fetchTasks(currentDate)
  }

  useEffect(fetchTasks, [])

  const isPast = (date) => {
    return getDayOfYear(date) < getDayOfYear(new Date())
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const differenceInDays = (date) => {
    const today = new Date()
    const diffTime = today - date
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return `${Math.abs(diffDays)} days ago`
    }

    return `In ${Math.abs(diffDays)} days`
  }

  const getDayDescription = (date) => {
    if (isToday(date)) {
      return "Today"
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else if (isTomorrow(date)) {
      return "Tomorrow"
    } else {
      return differenceInDays(date)
    }
  }

  const setCurrentDateQuickPick = (date) => {
    handleDateChange(date)
    setSelectedDate(date)
    fetchTasks(date)
  }

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

  const determineTaskCompletionSentiment = () => {
    if (!completionPercentage) return ['#cc0000', <SentimentVeryDissatisfiedIcon style={{ fontSize: "50px" }} />,  "rgba(204, 0, 0, 0.1)"]

    if (completionPercentage < 25) {
      return ['#cc0000', <SentimentVeryDissatisfiedIcon style={{ fontSize: "50px" }}/>, "rgba(204, 0, 0, 0.1)"]
    } else if (completionPercentage <= 50) {
      return ['#cc6500', <SentimentDissatisfiedIcon style={{ fontSize: "50px" }}/>, "rgba(204, 101, 0, 0.1)"]
    } else if (completionPercentage < 75) {
      return ['#CBCC00', <SentimentSatisfiedIcon style={{ fontSize: "50px" }}/>, "rgba(203, 204, 0, 0.1)"]
    } else if (completionPercentage < 90) {
      return ['#7fcc00', <SentimentSatisfiedAltIcon style={{ fontSize: "50px" }}/>, "rgba(127, 204, 0, 0.1)"]
    }

    return ['#33cc00', <SentimentVerySatisfiedIcon style={{ fontSize: "50px" }}/>, "rgba(51, 204, 0, 0.1)"]
  }

  if (!tasksFetched) {
    return (
      <div style={{ margin: '-12px' }}>
        <Skeleton variant="rect" width={976} height={76} />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    )
  }

  return (
    <div>
      <Grid container spacing={3} justify="space-between" alignItems="center" 
            style={{ background: `${completionPercentage != null ? determineTaskCompletionSentiment()[2] : ''}`}}>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            text="white"
            className={classes.button}
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              setShouldOpenCreateModal(true)
            }}
          >
            Add
          </Button>
        </Grid>
        <Grid item xs={4} style={{ color: determineTaskCompletionSentiment()[0], position: 'relative' }}>
          <div style={{ display: 'inline-block', position: 'absolute', top: '11px'}}>
            {completionPercentage != null ? determineTaskCompletionSentiment()[1] : ''}
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center', marginLeft: '75px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '28px', marginBottom: '-14px' }}>{completionPercentage != null ? `${completionPercentage}%` : ''}</div>
            <div><i style={{ fontSize: '14px', left: '89px' }}>{completionPercentage != null ? `completed` : ''}</i></div>
          </div>
          
        </Grid>
        <Grid
          item
          xs={4}
          id="date_section"
        >
            <Grid container spacing={2}>
              <Grid item>
                <IconButton 
                  className={`${classes.calendarButton} ${classes.button}`}
                  onClick={() => {
                    handleCurrentDateChange(-1)
                  }}>
                  <ChevronLeftIcon color="primary" />
                </IconButton>
              </Grid>
              <Grid item>
                <div style={{ display: 'inline-block', textAlign: 'center', position: 'relative', width: '140px' }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      autoOk
                      value={currentDate}
                      onChange={(date) => setCurrentDateQuickPick(date)}
                      showTodayButton
                      format="E MMM d Y"
                      InputProps={{
                        disableUnderline: true
                      }}
                      inputProps={{ style: { textAlign: 'center' } }}
                      labelFunc={(date) => { return date.toDateString() }}
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
                    handleCurrentDateChange(1)
                  }}>
                  <ChevronRightIcon color="primary" />
                </IconButton>
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
              setName(e.target.value)
            }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              value={selectedDate}
              disablePast
              onChange={(date) => setSelectedDate(date)}
              label="Day"
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
              setDescription(e.target.value)
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
      <Dialog
        open={shouldOpenUpdateModal}
        onClose={handleTaskUpdateModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            required
            value={updateName}
            onChange={(e) => {
              setUpdateName(e.target.value)
            }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              value={currentDate}
              disablePast
              onChange={(date) => setUpdateCurrentDate(date)}
              label="Day"
              showTodayButton
              style={{ marginTop: "35px", marginBottom: "4px" }}
            />
          </MuiPickersUtilsProvider>
          <TextField
            value={updateDescription}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows="2"
            onChange={(e) => {
              setUpdateDescription(e.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskUpdateModalClose}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <List className={classes.root} style={{ paddingTop: "15px" }}>
        {tasks.map((task) => {
          const labelId = `checkbox-list-label-${task.id}`

          return (
            <ListItem
              key={task.id}
              role={undefined}
              dense
              button
              disabled={isPast(currentDate) ? true : false}
              onClick={() => {
                toggleTaskCompleted(task)
              }}> 
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item
                  button> 
                  <Grid
                    container
                    direction="row"
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
                  <IconButton aria-label="edit" className={classes.margin} onClick={(e) => handleSetUpdatingTask(task, e)}>
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
          )
        })}
      </List>
    </div>
  )
}
