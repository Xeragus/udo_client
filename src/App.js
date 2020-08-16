import React, { useState, lazy, Suspense, useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  AuthProvider,
  AuthContext
} from './context/auth-context';
import { FetchProvider } from './context/fetch-context';
import Paper from '@material-ui/core/Paper';

const LoadingFallback = () => (
  <div></div>
);
const Home = lazy(() => import('./components/Home'));
const Stats = lazy(() => import('./components/Stats'));
const UnauthenticatedRoutes = () => (
  <Switch>
    <Route path="/signin">
      <SignIn />
    </Route>
    <Route path="/signup">
      <SignUp />
    </Route>
    <Route path="*">
      <div>404 hehe custom</div>
    </Route>
  </Switch>
);
const AuthenticatedRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={() => 
        auth.isAuthenticated() ? (
          <div>{children}</div>
        ) : (
          <Redirect to="/signin" />
        )
      }
    ></Route>
  );
};
const AppRoutes = () => {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          <AuthenticatedRoute exact path="/">
            <Home />
          </AuthenticatedRoute>
          <AuthenticatedRoute exact path="/stats">
            <Stats />
          </AuthenticatedRoute>
          <UnauthenticatedRoutes />
        </Switch>
      </Suspense>
    </>
  );
};

const App = () => {
  const [darkState, setDarkState] = useState(false)
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#19cffc",
      },
      type: 'light'
    },
  })

  const handleLightChange = () => {
    setDarkState(!darkState)
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: '100vh' }}>
        <Router>
          <AuthProvider>
            <FetchProvider>
              <div>
                <AppRoutes />
              </div>
            </FetchProvider>
          </AuthProvider>
        </Router>
      </Paper>
    </ThemeProvider>
  )
}

export default App
