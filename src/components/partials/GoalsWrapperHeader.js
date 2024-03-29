import React from 'react'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import FilterListIcon from '@material-ui/icons/FilterList'
import AddItem from '../buttons/AddItem'

export default function GoalsWrapperHeader(props) {
  return (
    <Grid
      container
      direction='row'
      alignItems='center'
      justify='space-between'
    >
      <Grid item>
        <AddItem classes={props.classes} setShouldOpenCreateModal={props.setShouldOpenCreateModal} />
      </Grid>
      <Grid item>
        <Tooltip title='Filters'>
          <IconButton
            aria-label='delete'
            className={props.classes.margin}
            onClick={(e) => { props.openFilterDialog(e) }}
          >
            <i style={{ fontSize: '15px', marginRight: '10px' }}>{`viewing ${props.goalStatus}: ${props.goals.length} ${props.goals.length == 1 ? 'goal' : 'goals'}`}</i>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  )
}