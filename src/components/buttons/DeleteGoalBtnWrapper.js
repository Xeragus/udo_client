import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import { useConfirm } from 'material-ui-confirm'
import authHeader from '../../util/auth-header'
import axios from 'axios'

export default function DeleteGoalBtnWrapper(props) {
  const confirm = useConfirm();

  const deleteGoal = (e, goal) => {
    e.stopPropagation();
    confirm({
      description: 'Deleting a goal is a permanent action.',
    })
      .then(() => {
        axios
          .delete(`http://localhost:3001/goals/${props.goal.id}`, authHeader)
          .then((res) => {
            props.fetchGoals()
          })
          .catch((err) => { console.log(err) })
      })
      .catch(() => {});
  };

  return (
    <Tooltip title='Delete'>
      <IconButton
        aria-label='delete'
        color='secondary'
        className={props.classes.margin}
        onClick={(e) => deleteGoal(e, props.goal)}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  )
}