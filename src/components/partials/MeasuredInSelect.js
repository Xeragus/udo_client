import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from "@material-ui/core/FormControl";

export default function MeasuredInSelect(props) {
  return (
    <FormControl className={props.classes.formControl}>
      <InputLabel id="demo-simple-select-label">Measured in</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.measuredIn}
        onChange={(e) => { props.setMeasuredIn(e.target.value) }}
      >
        <MenuItem value="hours">Hours</MenuItem>
        <MenuItem value="steps">Steps</MenuItem>
        <MenuItem value="items">Items</MenuItem>
        <MenuItem value="percentage">Percents (%)</MenuItem>
        <MenuItem value="dollars">Dollars ($)</MenuItem>
        <MenuItem value="euros">Euros (&euro;)</MenuItem>
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
  )
}