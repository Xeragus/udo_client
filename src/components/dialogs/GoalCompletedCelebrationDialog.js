import React from "react"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


export default function GoalCompletedCelebrationDialog(props) {
  return (
    <Dialog
    open={props.shouldOpenGoalCelebrationsModal}
    onClose={() => {
      props.setShouldOpenGoalCelebrationsModal(false)
    }}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Great job!</DialogTitle>
    <DialogContent>
      You have successfully completed your goal!
    </DialogContent>
    <DialogActions>
      <Button onClick={() => { props.setShouldOpenGoalCelebrationsModal(false) }} color="primary">
        Proceed
      </Button>
    </DialogActions>
  </Dialog>
  )
}