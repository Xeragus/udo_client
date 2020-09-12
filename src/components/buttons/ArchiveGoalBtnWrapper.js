import Tooltip from '@material-ui/core/Tooltip'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import ArchiveIcon from '@material-ui/icons/Archive'
import { useConfirm } from 'material-ui-confirm'

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
        console.log('ARCHIVED YES');
      })
      .catch(() => {
        console.log('ARCHIVED NO');
      });
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