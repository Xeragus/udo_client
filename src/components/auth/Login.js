import React, { useState } from 'react'
import axios from 'axios'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    switch(event.target.name) {
      case 'email':
        setEmail(event.target.value)
        break
      case 'password':
        setPassword(event.target.value)
        break
    }
  }

  const handleSubmit = (event) => {
    axios.post('http://localhost:3001/sessions', 
    {
      user: {
        email: email,
        password: password
      }
    },
    { withCredentials: true }
    ).then(response => {
      console.log(response)
      if (response.data.logged_in) {
        props.handleSuccessfulAuth(response.data)
      }
    }).catch(error => {
      console.log('error', error)
    })
    event.preventDefault()
  }

  return (
    <div>
      Login goes here
      <form onSubmit={handleSubmit}>
        <input type='email' name='email' placeholder='Email' 
               value={email}
               onChange={handleChange} required />

        <input type='password' name='password' placeholder='Password' 
               value={password}
               onChange={handleChange} required />

        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login