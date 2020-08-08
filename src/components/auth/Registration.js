import React, { useState } from 'react'
import axios from 'axios'

const Registration = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    switch(event.target.name) {
      case 'email':
        setEmail(event.target.value)
        break
      case 'password':
        setPassword(event.target.value)
        break
      case 'passwordConfirmation':
        setPasswordConfirmation(event.target.value)
        break
    }
  }

  const handleSubmit = (event) => {
    axios.post('http://localhost:3001/registrations', 
    {
      user: {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      }
    },
    { withCredentials: true }
    ).then(response => {
      if (response.data.status === 'created') {
        props.handleSuccessfulAuth(response.data)
      }
    }).catch(error => {
      console.log('error', error)
    })
    event.preventDefault()
  }

  return (
    <div>
      Registration goes here
      <form onSubmit={handleSubmit}>
        <input type='email' name='email' placeholder='Email' 
               value={email}
               onChange={handleChange} required />

        <input type='password' name='password' placeholder='Password' 
               value={password}
               onChange={handleChange} required />

        <input type='password' name='passwordConfirmation' placeholder='Password confirmation' 
               value={passwordConfirmation}
               onChange={handleChange} required />

        <button type='submit'>Register</button>
      </form>
    </div>
  )
}

export default Registration