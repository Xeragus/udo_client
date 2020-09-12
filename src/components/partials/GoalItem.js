import React from 'react'
import Grid from '@material-ui/core/Grid'
import GoalHighlights from './GoalHighlights'
import ArchiveGoalBtnWrapper from '../buttons/ArchiveGoalBtnWrapper'
import DeleteGoalBtnWrapper from '../buttons/DeleteGoalBtnWrapper'

export default function GoalItem(props) {
  return (
    <Grid
      container
      spacing={3}
      justify='space-end'
      alignItems='center'
    >
      <Grid item xs={10}>
        <GoalHighlights 
          labelId={props.labelId} 
          goal={props.goal}
          completedPercentage={props.completedPercentage}
        />
      </Grid>
      <Grid item xs={2}>
        <ArchiveGoalBtnWrapper classes={props.classes} />
        <DeleteGoalBtnWrapper classes={props.classes} />
      </Grid>
    </Grid>
  )
}