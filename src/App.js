import React, { Component } from 'react'
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import axios from 'axios'

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      loggedInStatus: null,
      user: {}
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  checkLoginStatus() {
    axios.get('http://localhost:3001/logged_in', {withCredentials: true})
         .then(response => {
          if (response.data.logged_in && this.state.loggedInStatus == null) {
            this.setState({
              loggedInStatus: 'LOGGED_IN',
              user: response.data.user
            })
          } else if (!response.data.logged_in && this.state.loggedInStatus === 'LOGGED_IN') {
            this.setState({
              loggedInStatus: 'NOT_LOGGED_IN',
              user: {}
            })
          }
         })
         .catch(error => {
           console.log('check login error', error)
         })
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: 'LOGGED_IN',
      user: data.user
    })
  }

  handleLogout() {
    this.setState({
      loggedInStatus: null,
      user: {}
    })
  }

  componentDidMount() {
    this.checkLoginStatus()
  }

  render() {
    return (
      <div className='app'>
        <BrowserRouter>
          <Switch>
            <Route exact path={'/'} 
                   render={props => (
                     <Home { ...props } 
                          loggedInStatus={this.state.loggedInStatus}
                          handleLogin={this.handleLogin}
                          handleLogout={this.handleLogout} />
                   )}
            />
            <Route exact path={'/dashboard'}
                   render={props => (
                     <Dashboard { ...props } loggedInStatus={this.state.loggedInStatus} />
                   )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
