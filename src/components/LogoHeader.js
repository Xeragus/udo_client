import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import logo from '../logo.svg'

const useStyles = makeStyles(() => ({
  appName: {marginBottom: 0, marginTop: 0, paddingTop: '70px', fontWeight: 100, color: '#19cffc', fontSize: '60px'},
  appDescription: {marginTop: 0, color: '#9ba1af', fontWeight: '300'},
  logo: { width: '100px', height: '100px' },
  header: { textAlign: 'center' }
}));

export default function LogoHeader() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.header}>
        <h1 className={classes.appName}>Udo</h1>
        <h2 className={classes.appDescription}>1 personal manager for life, time and money</h2>
        <div className={classes.logoWrapper}>
          <img className={classes.logo} src={logo} alt="React Logo" />
        </div>
      </div>
    </div>
  )
}
