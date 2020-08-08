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
import ToggleSwitch from "@material-ui/core/Switch";
import {
  AuthProvider,
  AuthContext
} from './context/auth-context';
import { FetchProvider } from './context/fetch-context';
import { Paper } from "@material-ui/core"

const LoadingFallback = () => (
  <div>
    <div className="p-4">Loading...</div>
  </div>
);

const Dashboard = lazy(() => import('./components/Dashboard'));

const UnauthenticatedRoutes = () => (
  <Switch>
    <Route path="/signin">
      <SignIn />
    </Route>
    <Route path="/signup">
      <SignUp />
    </Route>
    <Route path="/da">
      <Dashboard />
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
            <Dashboard />
          </AuthenticatedRoute>
          <UnauthenticatedRoutes />
          {/* <AuthenticatedRoute path="/account">
            <Account />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/settings">
            <Settings />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/users">
            <Users />
          </AuthenticatedRoute> */}
        </Switch>
      </Suspense>
    </>
  );
};

const App = () => {
  const [darkState, setDarkState] = useState(false)
  const lightMode = darkState ? 'dark' : 'light'
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#19cffc",
      },
      type: lightMode
    },
  })

  const handleLightChange = () => {
    setDarkState(!darkState)
  }

  return (
    <ThemeProvider theme={theme}>
      {/* <Paper style={{ height: '100vh' }}> */}

        <Router>
          <AuthProvider>
            <FetchProvider>
              <div style={{position: 'absolute', right: 0, top: 0}}>
                  <ToggleSwitch
                    checked={darkState}
                    onChange={handleLightChange}
                  />
              </div>
              <div className="bg-gray-100">
                <AppRoutes />
              </div>
            </FetchProvider>
          </AuthProvider>
        </Router>

      {/* </Paper> */}
    </ThemeProvider>
  )
}

export default App
