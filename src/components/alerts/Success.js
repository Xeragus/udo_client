import React from 'react'
import { Alert, AlertTitle } from '@material-ui/lab';

export default function Success(props) {
  return (
    <Alert severity="success" className="">
      <AlertTitle>Success</AlertTitle>
      {props.message}
    </Alert>
  )
}
