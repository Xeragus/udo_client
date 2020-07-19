import React from 'react'

export const Dashboard = props => {
  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <h1>{props.loggedInStatus}</h1>
      </div>
    </div>
  )
}

export default Dashboard