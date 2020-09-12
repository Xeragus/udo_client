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
import axios from 'axios'

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, 'd MMM yyyy HH:mm')
  }
}

export default function GoalUpdate(props) {
  const handleUpdate = () => {
    axios
      .patch(
        `http://localhost:3001/goals/${props.updatingGoal.id}`,
        {
          name: props.updateName,
          measured_in: props.updateMeasuredIn,
          target: props.updateTarget,
          deadline: props.updateDate,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        props.setShouldOpenUpdateModal(false)
        props.fetchGoals()
      })
      .catch((err) => {
        console.log(err)
      })
  }

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
            <MeasuredInSelect
              classes={props.classes}
              measuredIn={props.updateMeasuredIn}
              setMeasuredIn={props.setUpdateMeasuredIn}
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
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}
