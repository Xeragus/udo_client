import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from '@material-ui/core/Box';
import LogoHeader from '../LogoHeader'
import { AuthContext } from '../../context/auth-context'
import { Redirect } from 'react-router-dom';
import SuccessAlert from '../alerts/Success'
import ErrorAlert from '../alerts/Error'
import { publicFetch } from '../../util/fetch';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontWeight: 700,
    color: '#fff'
  },
  textContent: {
    color: '#403c3cde'
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const authContext = useContext(AuthContext)
  const [signupSuccess, setSignupSuccess] = useState();
  const [signupError, setSignupError] = useState();
  const [redirectOnLogin, setRedirectOnLogin] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoginLoading(true);

      const userData = { 
        first_name: firstName, 
        last_name: lastName, 
        email: email, 
        password: password 
      }

      const { data } = await publicFetch.post(
        'http://localhost:3001/users/register',
        userData
      );

      authContext.setAuthState(data);
      setSignupSuccess('Registration success! Redirecting to login...');
      setSignupError('');
  
      setTimeout(() => {
        setRedirectOnLogin(true);
      }, 3000);
    } catch (error) {
      setLoginLoading(false);
      setSignupError('Email has already been taken');
      setSignupSuccess('');
    }
  };

  return (
    <>
      {redirectOnLogin && <Redirect to="/signin" />}
      <LogoHeader />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <form className={classes.form} >
              <Box mb={5}>
                {signupSuccess && (<SuccessAlert message={signupSuccess} />)}
                {signupError && (<ErrorAlert message={signupError} />)}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    className={classes.textContent}
                    style={{color: '#403c3cde'}}
                    onChange={(e) => {setFirstName(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    className={classes.textContent}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    className={classes.textContent}
                    onChange={(e) => {setEmail(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    className={classes.textContent}
                    onChange={(e) => {setPassword(e.target.value)}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                    className={classes.textContent}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                {loginLoading ? 'Loading...' : 'Sign Up'}
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
        </div>
      </Container>
    </>
  )
}
