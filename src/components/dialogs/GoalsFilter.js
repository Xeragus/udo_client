import React from "react"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function GoalsFilter(props) {
  return (
    <Dialog
      open={props.shouldOpenFilters}
      onClose={() => { props.setShouldOpenFilters(false) }}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>Filter by:</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button
          onClick={() => { props.setShouldOpenFilters(false) }}
        >
          Cancel
        </Button>
        <Button onClick={props.handleUpdate} color='primary'>
          Filter
        </Button>
      </DialogActions>
    </Dialog>
  )
}