import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  completed: {
    textDecoration: 'line-through',
    color: '#808080'
  },
  task: {
    fontSize: '17px'
  },
}))

export default function TaskItem(props) {
  const classes = useStyles()

  return (
    <div id="divid">
      <span className={`${classes.task} ${props.task.is_completed ? classes.completed : ''}`}>
        <b>{props.task.name.replace(/^\w/, (c) => c.toUpperCase())}</b> <i>{props.task.description ? `(${props.task.description})` : ''}</i></span>
    </div>
  )
}
