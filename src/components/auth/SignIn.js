import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import LogoHeader from '../LogoHeader'
import { publicFetch } from '../../util/fetch';
import ErrorAlert from '../alerts/Error'
import { AuthContext } from '../../context/auth-context'
import { Redirect } from 'react-router-dom';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontWeight: 700,
    color: '#fff'
  },
}))

const SignIn = (props) => {
  const authContext = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirectOnLogin, setRedirectOnLogin] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false);
  const [signInError, setSignInError] = useState();
  const classes = useStyles()
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoginLoading(true);

      const credentials = { 
        email: email, 
        password: password 
      }

      const { data } = await publicFetch.post(
        'http://localhost:3001/users/login',
        credentials
      );

      authContext.setAuthState(data);
      setSignInError('');
  
      setRedirectOnLogin(true);
    } catch (error) {
      setLoginLoading(false);
      setSignInError('Email has already been taken');
    }
  };

  return (
    <>
      {redirectOnLogin && <Redirect to="/" />}
      <LogoHeader />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} noValidate>
            <Box mb={5}>
              {signInError && (<ErrorAlert message={signInError} />)}
            </Box>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={e => handleSubmit(e)}
            >
              {loginLoading ? 'Loading...' : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  )
}

export default SignIn