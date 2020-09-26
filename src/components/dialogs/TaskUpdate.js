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
import AddTags from "../partials/AddTags"
import TagsDisplayUpdate from '../partials/TagsDisplayUpdate'
import axios from 'axios'

export default function TaskUpdate(props) {
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
        open={props.shouldOpenUpdateModal}
        onClose={props.handleTaskUpdateModalClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update task</DialogTitle>
        <DialogContent>
          <Grid row container spacing={2} alignItems="center">
            <Grid item xs='7'>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                required
                value={props.updateName}
                onChange={(e) => {
                  props.setUpdateName(e.target.value)
                }}
              />
            </Grid>
            <Grid item xs='5'>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  value={props.updateCurrentDate}
                  disablePast
                  onChange={(date) => props.setUpdateCurrentDate(date)}
                  label="Day"
                  showTodayButton
                  style={{  marginTop: '5px', marginBottom: '3px' }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <TextField
            value={props.updateDescription}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows="2"
            onChange={(e) => {
              props.setUpdateDescription(e.target.value)
            }}
          />
          <AddTags
            setSelectedTags={props.setSelectedTags}
            selectedTags={props.selectedTags}
            tags={tags}
          />
          <TagsDisplayUpdate
            updateTags={props.updateTags}
            setUpdateTags={props.setUpdateTags}
            selectedTags={props.selectedTags}
            setSelectedTags={props.setSelectedTags}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleTaskUpdateModalClose}>Cancel</Button>
          <Button onClick={props.handleUpdate} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
  )
}