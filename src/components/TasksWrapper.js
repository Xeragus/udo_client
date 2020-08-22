import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DateFnsUtils from '@date-io/date-fns' // choose your lib
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import axios from 'axios'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import TaskItem from './TaskItem'
import Grid from '@material-ui/core/Grid';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { isYesterday, isTomorrow } from 'date-fns'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  completed: {
    textDecoration: 'line-through',
    color: '#808080'
  },
  task: {
    fontSize: '15px'
  },
  calendarButton: {
    height: '36px'
  }
}))

export default function TasksWrapper() {
  const classes = useStyles()
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false)
  const today = new Date()
  const [selectedDate, handleDateChange] = useState((new Date(today.setHours(23, 59, 59, 999))))
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [displayedDate, setDisplayedDate] = useState(currentDate.toDateString())

  const fetchTasks = (date = null) => {
    date = date ? date : new Date()
    axios.get('http://localhost:3001/tasks', {
      params: {
        date: date.toISOString().slice(0, -14)
      },
      headers: {
        'Authorization': `Basic ${localStorage.getItem('token')}` 
      }
    })
    .then((res) => {
      setTasks(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const handleSubmit = () => {
    axios.post('http://localhost:3001/tasks', {
      name,
      deadline: selectedDate,
      description
    }, {
      headers: {
        'Authorization': `Basic ${localStorage.getItem('token')}` 
      }
    })
    .then((res) => {
      setShouldOpenCreateModal(false)
      setTimeout(() => {
        fetchTasks()
      }, 400)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const handleTaskCreateModalClose = () => { setShouldOpenCreateModal(false) }

  const toggleTaskCompleted = (task) => {
    axios.patch(`http://localhost:3001/tasks/${task.id}`, { 
      is_completed: !task.is_completed 
    }, {
      headers: {
        'Authorization': `Basic ${localStorage.getItem('token')}` 
      }
    })
    .then((res) => {
      fetchTasks()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const handleCurrentDateChange = (addOrDeductDay) => {
    currentDate.setDate(currentDate.getDate() + addOrDeductDay)
    setCurrentDate(currentDate)
    setDisplayedDate(currentDate.toDateString())

    fetchTasks(currentDate)
  }

  useEffect(fetchTasks, [])

  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
  }

  const isYesterday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() - 1 &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
  }

  const isTomorrow = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() + 1 &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
  }

  const differenceInDays = (date) => {
    const today = new Date()
    const diffTime = today - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1

    if (diffDays > 0) {
      return `${Math.abs(diffDays)} days ago`
    }

    return `In ${Math.abs(diffDays)} days`
  }

  const getDayDescription = (date) => {
    if (isToday(date)) {
      return 'Today'
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else if (isTomorrow(date)) {
      return 'Tomorrow'
    } else {
      return differenceInDays(date)
    }
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => { setShouldOpenCreateModal(true) }}
          >Add</Button>
        </Grid>
        <Grid item xs={5} id='date_section'>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Button
                variant="contained"
                className={`${classes.calendarButton} ${classes.button}`}
                startIcon={<ChevronLeftIcon />}
                onClick={() => { handleCurrentDateChange(-1) }} />
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '18px' }}>{currentDate.toDateString()}</span><br />
              <span><i>{getDayDescription(currentDate)}</i></span>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                className={`${classes.calendarButton} ${classes.button}`}
                startIcon={<ChevronRightIcon styles={{marginRight: 0}} />}
                onClick={() => { handleCurrentDateChange(1) }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Dialog open={shouldOpenCreateModal} 
              onClose={handleTaskCreateModalClose}
              aria-labelledby="form-dialog-title">
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
            onChange={(e) => { setName(e.target.value) }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <DateTimePicker
              value={selectedDate}
              disablePast
              ampm={false}
              onChange={handleDateChange}
              label="Finish before"
              showTodayButton
              style={{ marginTop: '35px', marginBottom: '4px' }}
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
            onChange={(e) => { setDescription(e.target.value) }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskCreateModalClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <List className={classes.root}>
        {tasks.map((task) => {
          const labelId = `checkbox-list-label-${task.id}`

          return (
            <ListItem key={task.id} role={undefined} dense button onClick={() => { toggleTaskCompleted(task) }}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.is_completed}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <TaskItem id={labelId} task={task} />
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}
