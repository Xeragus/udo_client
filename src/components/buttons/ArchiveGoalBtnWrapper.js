import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import ArchiveIcon from '@material-ui/icons/Archive'
import { useConfirm } from 'material-ui-confirm'
import axios from 'axios'

export default function ArchiveGoalBtnWrapper(props) {
  const confirm = useConfirm();
  
  const archiveGoal = (e, goal) => {
    e.stopPropagation();
    confirm({
      description: `You are trying to archive this goal. 
                   Once you archive it you won't see it by default, but only by applying the archived filter. 
                   You can restore archived goals anytime.`,
    })
      .then(() => {
        axios
          .patch(
            `http://localhost:3001/goals/${goal.id}`,
            {
              status: 'archived'
            },
            {
              headers: {
                Authorization: `Basic ${localStorage.getItem('token')}`,
              },
            }
          )
          .then((res) => {
            props.fetchGoals()
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch(() => {});
  };

  return (
    <Tooltip title='Archive'>
      <IconButton
        aria-label='delete'
        className={props.classes.margin}
        onClick={(e) => archiveGoal(e, props.goal)}
      >
        <ArchiveIcon style={{ color: '#ffc107' }} />
      </IconButton>
    </Tooltip>
  )
}