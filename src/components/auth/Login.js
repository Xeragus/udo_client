import React, { Component } from 'react'
import axios from 'axios'

export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    axios.post('http://localhost:3001/sessions', 
    {
      user: {
        email: this.state.email,
        password: this.state.password
      }
    },
    { withCredentials: true }
    ).then(response => {
      console.log(response)
      if (response.data.logged_in) {
        this.props.handleSuccessfulAuth(response.data)
      }
    }).catch(error => {
      console.log('error', error)
    })
    event.preventDefault()
  }

  render() {
    return (
      <div>
        Login goes here
        <form onSubmit={this.handleSubmit}>
          <input type='email' name='email' placeholder='Email' 
                 value={this.state.email}
                 onChange={this.handleChange} required />

          <input type='password' name='password' placeholder='Password' 
                 value={this.state.password}
                 onChange={this.handleChange} required />

          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }
}
