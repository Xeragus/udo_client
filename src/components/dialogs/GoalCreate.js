import React, { useState } from "react"
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MeasuredInMenuItems from "../partials/MeasuredInSelect";
import DateFnsUtils from '@date-io/date-fns'
import format from 'date-fns/format'
import { useConfirm } from 'material-ui-confirm'
import FormControl from "@material-ui/core/FormControl";
import clsx from 'clsx';
import MeasuredInSelect from '../partials/MeasuredInSelect'
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import measuredInOptions from '../../util/measured-in-options'
import authHeaders from '../../util/auth-header'
import axios from 'axios'

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, 'd MMM yyyy HH:mm')
  }
}

export default function GoalCreate(props) {
  const confirm = useConfirm();
  const [name, setName] = useState('');
  const [measuredIn, setMeasuredIn] = useState('hours');
  const [startFrom, setStartFrom] = useState(0);
  const [target, setTarget] = useState(1);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [currentDate, handleDateChange] = useState(new Date());

  const handleSubmit = () => {
    axios
      .post(
        'http://localhost:3001/goals',
        {
          name,
          measured_in: measuredIn,
          start_from: startFrom,
          target,
          deadline: new Date(selectedDate),
        },
        authHeaders
      )
      .then((res) => {
        props.setShouldOpenCreateModal(false);
        props.fetchGoals();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog
      open={props.shouldOpenCreateModal}
      onClose={() => { props.setShouldOpenCreateModal(false) }}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add new goal</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="What is your goal?"
          type="text"
          fullWidth
          required
          onChange={(e) => { setName(e.target.value) }}
        />
        <Grid
          container
          spacing={3}
          style={{ marginTop: "10px" }}
          alignItems="flex-end"
        >
          <Grid item xs={3}>
            <MeasuredInSelect
              classes={props.classes}
              measuredIn={measuredIn}
              setMeasuredIn={setMeasuredIn}
            />
            <FormControl className={props.classes.formControl}>
              <InputLabel id="demo-simple-select-label">Measured in</InputLabel>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl
              className={clsx(
                props.classes.margin,
                props.classes.withoutLabel,
                props.classes.textField
              )}
            >
              <InputLabel id="standard-adornment-weight">
                Starting From
              </InputLabel>
              <Input
                id="standard-adornment-weight"
                value={startFrom}
                endAdornment={
                  <InputAdornment position="end">
                    {measuredInOptions[measuredIn]}
                  </InputAdornment>
                }
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                required={true}
                onChange={(e) => { setStartFrom(e.target.value) }}
              />
            </FormControl>
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
                value={target}
                onChange={(e) => { setTarget(e.target.value) }}
                endAdornment={
                  <InputAdornment position="end">
                    {measuredInOptions[measuredIn]}
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
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
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
          onClick={() => { props.setShouldOpenCreateModal(false) }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
