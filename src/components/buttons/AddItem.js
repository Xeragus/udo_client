import React from 'react';
import Button from "@material-ui/core/Button"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"

export default function AddItem(props) {
  return (
    <Button
      variant='contained'
      color='primary'
      text='white'
      className={props.classes.button}
      startIcon={<AddCircleOutlineIcon />}
      onClick={() => {
        props.setShouldOpenCreateModal(true);
      }}
    >
      Add
    </Button>
  )
}