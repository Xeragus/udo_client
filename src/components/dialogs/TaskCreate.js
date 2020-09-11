import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import Button from "@material-ui/core/Button"
import React from "react"
import DateFnsUtils from "@date-io/date-fns"

export default function TaskCreateDialog(props) {
  return (
    <Dialog
      open={props.shouldOpenCreateModal}
      onClose={props.handleTaskCreateModalClose}
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
            props.setName(e.target.value)
          }}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            value={props.selectedDate}
            disablePast
            onChange={(date) => props.setSelectedDate(date)}
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
            props.setDescription(e.target.value)
          }}
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
