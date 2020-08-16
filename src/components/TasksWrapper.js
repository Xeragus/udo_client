import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  }
}));

export default function TasksWrapper() {
  const classes = useStyles();
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false)
  const [selectedDate, handleDateChange] = useState((new Date()).setHours(23, 59, 59, 999));
  const handleTaskCreateModalClose = () => {
    setShouldOpenCreateModal(false)
  }

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => { setShouldOpenCreateModal(true) }}
      >Add</Button>
      <Dialog open={shouldOpenCreateModal} 
              onClose={handleTaskCreateModalClose}
              style={{ minWidth: '600px' }}
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
            multiline="true"
            rows="2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskCreateModalClose}>
            Cancel
          </Button>
          <Button onClick={handleTaskCreateModalClose} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
