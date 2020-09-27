import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import Button from "@material-ui/core/Button"
import React, { useState, useEffect } from "react"
import DateFnsUtils from "@date-io/date-fns"
import Grid from '@material-ui/core/Grid';
import AddTags from '../partials/AddTags'
import TagsDisplay from '../partials/TagsDisplay'
import axios from 'axios'

export default function TaskCreateDialog(props) {
  const [tags, setTags] = useState([])

  const fetchTags = () => {
    axios
      .get("http://localhost:3001/tags", {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <Dialog
      open={props.shouldOpenCreateModal}
      onClose={props.handleTaskCreateModalClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add new task</DialogTitle>
      <DialogContent>
        <Grid row container spacing={2} alignItems="center">
          <Grid item xs="7">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              required
              onChange={(e) => {
                props.setName(e.target.value)
              }}
            />
          </Grid>
          <Grid item xs="5">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                value={props.selectedDate}
                // disablePast
                onChange={(date) => props.setSelectedDate(date)}
                label="Do on"
                showTodayButton
                style={{ marginTop: '5px', marginBottom: '3px' }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows="1"
          onChange={(e) => {
            props.setDescription(e.target.value)
          }}
        />
        <AddTags
          setSelectedTags={props.setSelectedTags}
          selectedTags={props.selectedTags}
          tags={tags}
        />
        <TagsDisplay 
          selectedTags={props.selectedTags}
          setSelectedTags={props.setSelectedTags}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleTaskCreateModalClose}>Cancel</Button>
        <Button onClick={props.handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
