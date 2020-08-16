import React, { createContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

const AuthContext = createContext()
const { Provider } = AuthContext

const AuthProvider = ({ children }) => {
  const history = useHistory()

  const token = localStorage.getItem('token')
  const first_name = localStorage.getItem('first_name')
  const email = localStorage.getItem('email')
  const expires_at = localStorage.getItem('expires_at')

  const [authState, setAuthState] = useState({
    token,
    first_name,
    email,
    expires_at
  })

  const setAuthInfo = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('first_name', data.user.first_name)
    localStorage.setItem('email', data.user.email)
    localStorage.setItem('expires_at', data.expires_at)

    setAuthState({
      token,
      first_name,
      email,
      expires_at
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('first_name')
    localStorage.removeItem('email')
    localStorage.removeItem('expires_at')
    setAuthState({})
    history.push('/signin')
  }

  const isAuthenticated = () => {
    if (!localStorage.token || !localStorage.expires_at) {
      return false
    }
    return (
      new Date().getTime() / 1000 < localStorage.expires_at
    )
  }

  return (
    <Provider
      value={{
        authState,
        setAuthState: authInfo => setAuthInfo(authInfo),
        logout,
        isAuthenticated
      }}
    >
      {children}
    </Provider>
  )
}

export { AuthContext, AuthProvider }
