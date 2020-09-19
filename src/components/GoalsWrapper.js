import React, { useState, useEffect } from 'react'
import axios from 'axios'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import GoalsWrapperHeader from './partials/GoalsWrapperHeader'
import GoalCreate from './dialogs/GoalCreate'
import GoalUpdate from './dialogs/GoalUpdate'
import GoalsFilter from './dialogs/GoalsFilter'
import goalsWrapperStyler from '../stylers/goals-wrapper' 
import LinearProgressWrapper from './partials/LinearProgressWrapper'
import GoalItem from './partials/GoalItem'

const useStyles = goalsWrapperStyler

export default function GoalsWrapper() {
  const classes = useStyles()
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false)
  const [shouldOpenUpdateModal, setShouldOpenUpdateModal] = useState(false)
  const [goals, setGoals] = useState([])
  const [updateName, setUpdateName] = useState('')
  const [updateTarget, setUpdateTarget] = useState('')
  const [updatingGoal, setUpdatingGoal] = useState(null)
  const [updateMeasuredIn, setUpdateMeasuredIn] = useState('')
  const [updateDate, setUpdateDate] = useState(null)
  const [shouldOpenFilters, setShouldOpenFilters] = useState(false)
  const [goalStatus, setGoalStatus] = useState('active')

  const fetchGoals = (status = 'active') => {
    axios
      .get('http://localhost:3001/goals', {
        params: {
          status: status
        },
        headers: {
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setGoals(res.data.goals)
        setGoalStatus(status)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const calculateCompletionPercentage = (goal) => {
    return ((goal.current_progress * 100) / goal.target).toFixed(0)
  }

  const handleSelectUpdateGoal = (goal) => {
    if (!updateable(goal)) {
      return;
    }
    setUpdatingGoal(goal)
    setUpdateName(goal.name)
    setUpdateTarget(goal.target)
    setUpdateMeasuredIn(goal.measured_in)
    setShouldOpenUpdateModal(true)
    setUpdateDate(new Date(goal.deadline))
  }

  const openFilterDialog = (e) => {
    if (e.stopPropagation()) e.stopPropagation()
    setShouldOpenFilters(true)
  }

  const updateable = (goal) => {
    if (goal.status == 'active') return true

    return false
  }

  useEffect(fetchGoals, []);

  return (
    <div>
      <GoalsWrapperHeader 
        classes={classes}
        shouldOpenCreateModal={shouldOpenCreateModal}
        setShouldOpenCreateModal={setShouldOpenCreateModal}
        openFilterDialog={openFilterDialog}
        goals={goals}
        goalStatus={goalStatus}
      />
      <GoalCreate
        setShouldOpenCreateModal={setShouldOpenCreateModal}
        shouldOpenCreateModal={shouldOpenCreateModal}
        classes={classes}
        fetchGoals={fetchGoals}
      />
      <GoalUpdate
        fetchGoals={fetchGoals}
        shouldOpenUpdateModal={shouldOpenUpdateModal}
        setShouldOpenUpdateModal={setShouldOpenUpdateModal}
        updateName={updateName}
        setUpdateName={setUpdateName}
        classes={classes}
        updateMeasuredIn={updateMeasuredIn}
        updateTarget={updateTarget}
        setUpdateTarget={setUpdateTarget}
        updateDate={updateDate}
        setUpdateDate={setUpdateDate}
        updatingGoal={updatingGoal}
        setUpdateMeasuredIn={setUpdateMeasuredIn}
      />
      <GoalsFilter
        shouldOpenFilters={shouldOpenFilters}
        setShouldOpenFilters={setShouldOpenFilters}
        goalStatus={goalStatus}
        setGoalStatus={setGoalStatus}
        fetchGoals={fetchGoals}
      />
      <List className={classes.root} style={{ paddingTop: '15px' }}>
        {goals.map((goal) => {
          const labelId = `checkbox-list-label-${goal.id}`

          return (
            <ListItem
              key={goal.id}
              role={undefined}
              dense
              button={updateable(goal)}
              onClick={() => { handleSelectUpdateGoal(goal) }}
              style={{ marginBottom: '20px', borderRadius: '3px', border: '1px solid #cccccc' }}
            >
              <div style={{ width: '100%', paddingTop: '15px', paddingBottom: '15px' }}>
                <div style={{ paddingBottom: '10px' }}>
                  <GoalItem 
                    classes={classes}
                    goal={goal}
                    props={labelId}
                    fetchGoals={fetchGoals}
                    goalStatus={goalStatus}
                    completedPercentage={calculateCompletionPercentage(goal)}
                  />
                </div>
                <LinearProgressWrapper goal={goal} value={calculateCompletionPercentage(goal)} />
              </div>
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}
