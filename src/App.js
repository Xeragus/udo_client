import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import axios from "axios";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ToggleSwitch from "@material-ui/core/Switch";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#19cffc",
    },
  },
});

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedInStatus: null,
      user: {},
      darkState: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLightChange = this.handleLightChange(this);

    theme.palette.type = this.state.darkState ? "dark" : "light";
  }

  checkLoginStatus() {
    axios
      .get("http://localhost:3001/logged_in", { withCredentials: true })
      .then((response) => {
        if (response.data.logged_in && this.state.loggedInStatus == null) {
          this.setState({
            loggedInStatus: "LOGGED_IN",
            user: response.data.user,
          });
        } else if (
          !response.data.logged_in &&
          this.state.loggedInStatus === "LOGGED_IN"
        ) {
          this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            user: {},
          });
        }
      })
      .catch((error) => {
        console.log("check login error", error);
      });
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: data.user,
    });
  }

  handleLogout() {
    this.setState({
      loggedInStatus: null,
      user: {},
    });
  }

  handleLightChange() {
    console.log(this)
    this.setState(({darkState}) => ({ darkState: !darkState }));
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="app">
          <div style={{position: 'absolute', right: 0, top: 0}}>
            <ToggleSwitch
              checked={this.state.darkState}
              onChange={this.handleLightChange}
            />
          </div>
          {/* <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> */}
          <BrowserRouter>
            <Switch>
              <Route
                exact
                path={"/"}
                render={(props) => (
                  <Home
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                    handleLogin={this.handleLogin}
                    handleLogout={this.handleLogout}
                  />
                )}
              />

              <Route
                exact
                path={"/dashboard"}
                render={(props) => (
                  <Dashboard
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                  />
                )}
              />

              <Route
                exact
                path={"/signin"}
                render={(props) => (
                  <SignIn
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                  />
                )}
              />

              <Route
                exact
                path={"/signup"}
                render={(props) => (
                  <SignUp
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                  />
                )}
              />
            </Switch>
          </BrowserRouter>
        </div>
      </MuiThemeProvider>
    );
  }
}
