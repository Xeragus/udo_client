import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import clsx from "clsx";
import Input from "@material-ui/core/Input";
import axios from "axios";
import format from "date-fns/format";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Skeleton from "@material-ui/lab/Skeleton";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  differenceInCalendarDays,
  isToday,
  isYesterday,
  isTomorrow,
  isPast
} from "date-fns";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    color: "#fff",
  },
  formControl: {
    margin: theme.spacing(1),
    marginLeft: 0,
    width: "100%",
    marginBottom: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const measuredInOptions = {
  hours: "hours",
  steps: "steps",
  items: "items",
  percentage: "percentage",
  dollars: "dollars",
  euros: "euros",
  times: "times",
  weeks: "weeks",
  days: "days",
  lbs: "lbs",
  kgs: "kg",
  miles: "miles",
  kms: "km",
  books: "books",
  chapters: "chapters",
  pages: "pages",
  words: "words",
  courses: "courses",
  sessions: "sessions",
  classes: "classes",
  videos: "videos",
};

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy HH:mm");
  }
}

export default function GoalsWrapper() {
  const classes = useStyles();
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false);
  const [shouldOpenUpdateModal, setShouldOpenUpdateModal] = useState(false);
  const [measuredIn, setMeasuredIn] = useState("hours");
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentDate, handleDateChange] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [target, setTarget] = useState(1);
  const [name, setName] = useState("");
  const [startFrom, setStartFrom] = useState(0);
  const [goalsFetched, setGoalsFetched] = useState(false);
  const [goals, setGoals] = useState([]);
  const [updateName, setUpdateName] = useState("");
  const [updateTarget, setUpdateTarget] = useState("");
  const [updatingGoal, setUpdatingGoal] = useState(null);
  const [updateMeasuredIn, setUpdateMeasuredIn] = useState("");
  const [addProgress, setAddProgress] = useState(1)

  const handleSubmit = () => {
    axios
      .post(
        "http://localhost:3001/goals",
        {
          name,
          measured_in: measuredIn,
          start_from: startFrom,
          target,
          deadline: selectedDate,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setShouldOpenCreateModal(false);
        fetchGoals();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (updatingGoal) => {
    axios
      .post(
        `http://localhost:3001/goals/${updatingGoal.id}`,
        {
          name,
          measured_in: measuredIn,
          start_from: startFrom,
          target,
          deadline: selectedDate,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setShouldOpenUpdateModal(false);
        fetchGoals();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchGoals = () => {
    axios
      .get("http://localhost:3001/goals", {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setGoals(res.data.goals);
        console.log(res.data);
        setGoalsFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateDifferenceInDays = (date) => {
    if (isToday(date)) return "today";
    else if (isYesterday(date)) return "yesterday";
    else if (isTomorrow(date)) return "tomorrow";
    else if (differenceInCalendarDays(date, new Date()) > 0)
      return `in ${Math.abs(differenceInCalendarDays(new Date(), date))} days`;
    else
      return `${Math.abs(differenceInCalendarDays(date, new Date()))} days ago`;
  };

  const calculateCompletionPercentage = (goal) => {
    return ((goal.current_progress * 100) / goal.target).toFixed(0);
  };

  const handleSelectUpdateGoal = (goal) => {
    setUpdatingGoal(goal);
    setUpdateName(goal.name);
    setUpdateTarget(goal.target);
    console.log(goal.measured_in);
    setUpdateMeasuredIn(goal.measured_in);
    setShouldOpenUpdateModal(true);
  };

  useEffect(fetchGoals, []);

  if (!goalsFetched) {
    return (
      <div style={{ margin: "-12px" }}>
        <Skeleton variant="rect" width={976} height={76} />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        text="white"
        className={classes.button}
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          setShouldOpenCreateModal(true);
        }}
      >
        Add
      </Button>
      <Dialog open={shouldOpenCreateModal} aria-labelledby="form-dialog-title">
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
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Grid
            container
            spacing={3}
            style={{ marginTop: "10px" }}
            alignItems="flex-end"
          >
            <Grid item xs={3}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">
                  Measured in
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={measuredIn}
                  onChange={(e) => {
                    setMeasuredIn(e.target.value);
                  }}
                >
                  <MenuItem value="hours">Hours</MenuItem>
                  <MenuItem value="steps">Steps</MenuItem>
                  <MenuItem value="items">Items</MenuItem>
                  <MenuItem value="percentage">%</MenuItem>
                  <MenuItem value="dollars">$</MenuItem>
                  <MenuItem value="euros">&euro;</MenuItem>
                  <MenuItem value="times">Times</MenuItem>
                  <MenuItem value="weeks">Weeks</MenuItem>
                  <MenuItem value="days">Days</MenuItem>
                  <MenuItem value="lbs">Lbs</MenuItem>
                  <MenuItem value="kgs">Kg</MenuItem>
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
            </Grid>
            <Grid item xs={3}>
              <FormControl
                className={clsx(
                  classes.margin,
                  classes.withoutLabel,
                  classes.textField
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
                  onChange={(e) => {
                    setStartFrom(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                className={clsx(
                  classes.margin,
                  classes.withoutLabel,
                  classes.textField
                )}
              >
                <InputLabel id="standard-adornment-weight-2">Target</InputLabel>
                <Input
                  id="standard-adornment-weight-2"
                  value={target}
                  onChange={(e) => {
                    setTarget(e.target.value);
                  }}
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
            onClick={() => {
              setShouldOpenCreateModal(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={shouldOpenUpdateModal} aria-labelledby="form-dialog-title">
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
            value={updateName}
            onChange={(e) => {
              setUpdateName(e.target.value);
            }}
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
                  classes.margin,
                  classes.withoutLabel,
                  classes.textField
                )}
              >
                <InputLabel id="standard-adornment-weight-3">
                  Add Progress
                </InputLabel>
                <Input
                  id="standard-adornment-weight-3"
                  value={addProgress}
                  endAdornment={
                    <InputAdornment position="end">
                      {measuredInOptions[updateMeasuredIn]}
                    </InputAdornment>
                  }
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  required={true}
                  onChange={(e) => {
                    setAddProgress(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">
                  Measured in
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={updateMeasuredIn}
                  onChange={(e) => {
                    setUpdateMeasuredIn(e.target.value);
                  }}
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
            </Grid>
            <Grid item xs={3}>
              <FormControl
                className={clsx(
                  classes.margin,
                  classes.withoutLabel,
                  classes.textField
                )}
              >
                <InputLabel id="standard-adornment-weight-2">Target</InputLabel>
                <Input
                  id="standard-adornment-weight-2"
                  value={updateTarget}
                  onChange={(e) => {
                    setUpdateTarget(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      {measuredInOptions[updateMeasuredIn]}
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
            onClick={() => {
              setShouldOpenUpdateModal(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <List className={classes.root} style={{ paddingTop: "15px" }}>
        {goals.map((goal) => {
          const labelId = `checkbox-list-label-${goal.id}`;

          return (
            <ListItem
              key={goal.id}
              role={undefined}
              dense
              button
              onClick={() => {
                handleSelectUpdateGoal(goal);
              }}
              style={{
                marginBottom: "10px",
                borderRadius: "3px",
                border: "1px solid #cccccc",
              }}
              disabled={isPast(new Date(goal.deadline)) ? true : false}
            >
              <div
                style={{
                  width: "100%",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                <div style={{ paddingBottom: "10px" }}>
                  <span style={{ fontSize: "17px" }} id={labelId}>
                    <strong>{goal.name}</strong> &middot; {" "}
                    {goal.current_progress}/{goal.target}{" "}
                    {measuredInOptions[goal.measured_in]} (<strong>{calculateCompletionPercentage(goal)}%</strong>) &middot;
                    <i>
                      {" "}
                      due on{" "}
                      <strong>{new Date(goal.deadline)
                        .toUTCString()
                        .slice(0, -3)} ({calculateDifferenceInDays(new Date(goal.deadline))})</strong>
                    </i>
                  </span>
                </div>
                <div>
                  <LinearProgress
                    variant="determinate"
                    value={calculateCompletionPercentage(goal)}
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "3px",
                    }}
                  />
                </div>
              </div>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
