import React from 'react'
import dayDescriptor from '../../util/day-descriptor'
import measuredInOptions from '../../util/measured-in-options'

export default function GoalHighlights(props) {
  const goal = props.goal

  return (
    <span style={{ fontSize: '17px' }} id={props.labelId}>
      <strong>{goal.name}</strong> &middot;{' '}
      {goal.current_progress}/{goal.target}{' '}
      {measuredInOptions[goal.measured_in]} (
      <strong>{props.completedPercentage}%</strong>)
      &middot;
      <i>
        &nbsp; due on&nbsp;
        <strong>
          {new Date(goal.deadline).toString().slice(0, -43)}
          &nbsp;({dayDescriptor(new Date(goal.deadline))})
        </strong>
      </i>
    </span>
  )
}