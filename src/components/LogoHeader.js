import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import logo from '../logo.svg'

const useStyles = makeStyles((theme) => ({
  appName: {marginBottom: 0, fontWeight: 100, color: '#19cffc', fontSize: '70px'},
  appDescription: {marginTop: 0, color: '#9ba1af', fontWeight: '300'},
  logo: { width: '130px', height: '130px' },
  header: { textAlign: 'center' }
}));

export default function LogoHeader() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.header}>
        <h1 className={classes.appName}>Udo</h1>
        <h2 className={classes.appDescription}>Tasks & Goals Manager</h2>
        <div className={classes.logoWrapper}>
          <img className={classes.logo} src={logo} alt="React Logo" />
        </div>
      </div>
    </div>
  )
}
