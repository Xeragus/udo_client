import LinearProgress from '@material-ui/core/LinearProgress'
import React from 'react'

export default function LinearProgressWrapper(props) {
  return (
    <div>
      <LinearProgress
        variant='determinate'
        value={props.goal.status == 'completed' ? 100 : parseInt(props.value)}
        style={{ width: '100%', height: '8px', borderRadius: '3px' }}
      />
    </div>
  )
}