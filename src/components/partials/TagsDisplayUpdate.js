import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

export default function TagsDisplayUpdate(props) {
  const handleDelete = (name) => {
      const filteredTags = props.updateTags.filter(tag => {
        return tag.name != name
      })

      props.setUpdateTags([...filteredTags])
  }

  return (
    <div style={{ marginTop: '6px' }}>
      <Grid container spacing={1}>
        {props.updateTags.map(tag => {
          return  (
            <Grid item kye={tag.name}>
              <Chip
                label={tag.name}
                onDelete={() => { handleDelete(tag.name) }}
                key={tag.name}
              />
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}