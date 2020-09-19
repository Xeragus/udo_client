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
        <Grid container justify='flex-end'>
          <Grid item xs='6'>
            <ArchiveGoalBtnWrapper 
              classes={props.classes}
              fetchGoals={props.fetchGoals}
              goal={props.goal}
              goalStatus={props.goalStatus}
            />
          </Grid>
          <Grid item xs='6'>
            <DeleteGoalBtnWrapper
              goal={props.goal}
              fetchGoals={props.fetchGoals}
              classes={props.classes}
              goalStatus={props.goalStatus}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}