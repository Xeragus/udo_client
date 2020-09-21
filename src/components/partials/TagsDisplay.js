import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

export default function TagsDisplay(props) {
  const handleDelete = (name) => {
      const filteredTags = props.selectedTags.filter(tag => {
        return tag.name != name
      })

      props.setSelectedTags([...filteredTags])
  }

  return (
    <div style={{ marginTop: '6px' }}>
      <Grid container spacing={1}>
        {props.selectedTags.map(tag => {
          return  (
            <Grid item>
              <Chip
                label={tag.name}
                onDelete={props.deletable ? (() => {  handleDelete(tag.name) }) : null}
              />
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}