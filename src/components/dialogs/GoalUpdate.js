import React from "react"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import DateFnsUtils from '@date-io/date-fns'
import format from 'date-fns/format'
import FormControl from "@material-ui/core/FormControl";
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import MeasuredInSelect from '../partials/MeasuredInSelect'
import measuredInOptions from '../../util/measured-in-options'
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, 'd MMM yyyy HH:mm')
  }
}

export default function GoalUpdate(props) {
  return (
    <Dialog
      open={props.shouldOpenUpdateModal}
      onClose={() => {
        props.setShouldOpenUpdateModal(false)
      }}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Update goal</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="What is your goal?"
          type="text"
          fullWidth
          required
          value={props.updateName}
          onChange={(e) => { props.setUpdateName(e.target.value) }}
        />
        <Grid
          container
          spacing={3}
          style={{ marginTop: "10px" }}
          alignItems="flex-end"
        >
          <Grid item xs={3}>
            <FormControl
              className={clsx(
                props.classes.margin,
                props.classes.withoutLabel,
                props.classes.textField
              )}
            >
              <InputLabel id="standard-adornment-weight-3">
                Add Progress
              </InputLabel>
              <Input
                id="standard-adornment-weight-3"
                value={props.addProgress}
                endAdornment={
                  <InputAdornment position="end">
                    {measuredInOptions[props.updateMeasuredIn]}
                  </InputAdornment>
                }
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                required={true}
                onChange={(e) => { props.setAddProgress(e.target.value) }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl className={props.classes.formControl}>
              <InputLabel id="demo-simple-select-label">Measured in</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.updateMeasuredIn}
                onChange={(e) => { props.setUpdateMeasuredIn(e.target.value) }}
              >
                <MenuItem value="hours">Hours</MenuItem>
                <MenuItem value="steps">Steps</MenuItem>
                <MenuItem value="items">Items</MenuItem>
                <MenuItem value="percentage">Percents</MenuItem>
                <MenuItem value="dollars">Dollars</MenuItem>
                <MenuItem value="euros">Euros</MenuItem>
                <MenuItem value="times">Times</MenuItem>
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="days">Days</MenuItem>
                <MenuItem value="lbs">Lbs</MenuItem>
                <MenuItem value="kgs">Kgs</MenuItem>
                <MenuItem value="miles">Miles</MenuItem>
                <MenuItem value="kms">Km</MenuItem>
                <MenuItem value="books">Books</MenuItem>
                <MenuItem value="chapters">Chapters</MenuItem>
                <MenuItem value="pages">Pages</MenuItem>
                <MenuItem value="words">Words</MenuItem>
                <MenuItem value="courses">Courses</MenuItem>
                <MenuItem value="sessions">Sessions</MenuItem>
                <MenuItem value="classes">Classes</MenuItem>
                <MenuItem value="videos">Videos</MenuItem>
              </Select>
            </FormControl>
            <MeasuredInSelect
              classes={props.classes}
              measuredIn={props.measuredIn}
              setMeasuredIn={props.setMeasuredIn}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl
              className={clsx(
                props.classes.margin,
                props.classes.withoutLabel,
                props.classes.textField
              )}
            >
              <InputLabel id="standard-adornment-weight-2">Target</InputLabel>
              <Input
                id="standard-adornment-weight-2"
                value={props.updateTarget}
                onChange={(e) => {
                  props.setUpdateTarget(e.target.value)
                }}
                endAdornment={
                  <InputAdornment position="end">
                    {measuredInOptions[props.updateMeasuredIn]}
                  </InputAdornment>
                }
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                required={true}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={LocalizedUtils}>
              <DateTimePicker
                autoOk
                value={props.updateDate}
                onChange={(date) => props.setUpdateDate(date)}
                label="Complete By"
                showTodayButton
                style={{ marginTop: "35px" }}
                format="d MMM HH:mm"
                ampm={false}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => { props.setShouldOpenUpdateModal(false) }}
        >
          Cancel
        </Button>
        <Button onClick={props.handleUpdate} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}
