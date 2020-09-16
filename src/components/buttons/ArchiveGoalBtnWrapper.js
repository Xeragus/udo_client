import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import ArchiveIcon from '@material-ui/icons/Archive'
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import { useConfirm } from 'material-ui-confirm'
import axios from 'axios'

export default function ArchiveGoalBtnWrapper(props) {
  const confirm = useConfirm();

  const archiveGoal = (e, goal, shouldArchive) => {
    let description = `You are trying to archive this goal. 
                      Once you archive it you won't see it by default, 
                      but only by applying the archived filter. 
                      You can restore archived goals anytime.`
    if (!shouldArchive) {
      description = `You are trying to unarchive this goal. 
                      Once you unarchive it you will see it as active.`
    }

    e.stopPropagation();
    confirm({
      description: description,
    })
      .then(() => {
        axios
          .patch(
            `http://localhost:3001/goals/${goal.id}`,
            {
              status: shouldArchive ? 'archived' : 'active'
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
    <Tooltip title={props.goal.status == 'archived' ? 'Unarchive' : 'Archive'}>
      <IconButton
        aria-label='delete'
        className={props.classes.margin}
        onClick={(e) => {
          if (props.goal.status == 'archived') {
            archiveGoal(e, props.goal, false)
            return
          } 
          archiveGoal(e, props.goal, true)
        }}
      >
         {props.goal.status != 'archived' ?
          (<ArchiveIcon style={{ color: '#ffc107' }} />) : 
          (<UnarchiveIcon style={{ color: '#00e676' }} />)}
      </IconButton>
    </Tooltip>
  )
}