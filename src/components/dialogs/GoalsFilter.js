import React from "react"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';

export default function GoalsFilter(props) {
  const handleChange = (status) => {
    props.setGoalStatus(status)
    props.fetchGoals(status)
    props.setShouldOpenFilters(false)
  }

  return (
    <Dialog
      open={props.shouldOpenFilters}
      onClose={() => { props.setShouldOpenFilters(false) }}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>View only:</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup aria-label="filter" name="filter" value={props.goalStatus} onChange={(e) => { handleChange(e.target.value) }}>
            <FormControlLabel value="active" control={<Radio />} label="Active" />
            <FormControlLabel value="completed" control={<Radio />} label="Completed" />
            <FormControlLabel value="overdue" control={<Radio />} label="Overdue" />
            <FormControlLabel value="archived" control={<Radio />} label="Archived" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => { props.setShouldOpenFilters(false) }}
        >
          Cancel
        </Button>
        <Button onClick={props.handleFilter} color='primary'>
          Filter
        </Button>
      </DialogActions>
    </Dialog>
  )
}