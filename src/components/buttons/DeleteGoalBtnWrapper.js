import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Archive'
import { useConfirm } from 'material-ui-confirm'

export default function DeleteGoalBtnWrapper(props) {
  const confirm = useConfirm();

  const deleteGoal = (e, goal) => {
    e.stopPropagation();
    confirm({
      description: 'Deleting a goal is a permanent action.',
    })
      .then(() => {
        console.log('ARCHIVED YES');
      })
      .catch(() => {
        console.log('ARCHIVED NO');
      });
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