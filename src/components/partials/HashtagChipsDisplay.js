import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  completed: {
    textDecoration: 'line-through',
    color: '#808080'
  },
}))

export default function HashtagChipsDisplay(props) {
  const classes = useStyles()

  return (
    <div>
      <Grid container spacing={1}>
        {props.selectedTags.map(tag => {
          return  (
            <Grid item key={props.task.id}>
              <span key={props.task.id} className={`${props.task.is_completed ? classes.completed : ''}`}>#{tag.name}</span>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}