import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import Button from "@material-ui/core/Button"
import React from "react"
import DateFnsUtils from "@date-io/date-fns"

export default function TaskUpdate(props) {
  return (
    <Dialog
        open={props.shouldOpenUpdateModal}
        onClose={props.handleTaskUpdateModalClose}
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
            value={props.updateName}
            onChange={(e) => {
              props.setUpdateName(e.target.value)
            }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              value={props.updateCurrentDate}
              disablePast
              onChange={(date) => props.setUpdateCurrentDate(date)}
              label="Day"
              showTodayButton
              style={{ marginTop: "35px", marginBottom: "4px" }}
            />
          </MuiPickersUtilsProvider>
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