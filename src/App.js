import React, { Component } from 'react'
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <BrowserRouter>
          <Switch>
            <Route exact path={'/'} component={Home}></Route>
            <Route exact path={'/dashboard'} component={Dashboard}></Route>
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
