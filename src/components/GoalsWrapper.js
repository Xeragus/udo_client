import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  differenceInCalendarDays,
  isToday,
  isYesterday,
  isTomorrow,
  isPast,
} from 'date-fns'
import ArchiveIcon from '@material-ui/icons/Archive'
import DeleteIcon from '@material-ui/icons/Archive'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import { useConfirm } from 'material-ui-confirm'
import measuredInOptions from '../util/measured-in-options'
import GoalsWrapperHeader from './partials/GoalsWrapperHeader'
import GoalCreate from './dialogs/GoalCreate'
import GoalUpdate from './dialogs/GoalUpdate'
import GoalsFilter from './dialogs/GoalsFilter'
import goalsWrapperStyler from '../stylers/goals-wrapper' 
import dayDescriptor from '../util/day-descriptor'

const useStyles = goalsWrapperStyler

export default function GoalsWrapper() {
  const classes = useStyles()
  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false);
  const [shouldOpenUpdateModal, setShouldOpenUpdateModal] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [goals, setGoals] = useState([]);
  const [updateName, setUpdateName] = useState('');
  const [updateTarget, setUpdateTarget] = useState('');
  const [updatingGoal, setUpdatingGoal] = useState(null);
  const [updateMeasuredIn, setUpdateMeasuredIn] = useState('');
  const [addProgress, setAddProgress] = useState(1);
  const [updateDate, setUpdateDate] = useState(null);
  const confirm = useConfirm();
  const [shouldOpenFilters, setShouldOpenFilters] = useState(false);

  const handleUpdate = () => {
    axios
      .patch(
        `http://localhost:3001/goals/${updatingGoal.id}`,
        {
          name: updateName,
          measured_in: updateMeasuredIn,
          target: updateTarget,
          deadline: updateDate,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        setShouldOpenUpdateModal(false);
        fetchGoals();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchGoals = () => {
    axios
      .get('http://localhost:3001/goals', {
        headers: {
          Authorization: `Basic ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setGoals(res.data.goals);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateCompletionPercentage = (goal) => {
    return ((goal.current_progress * 100) / goal.target).toFixed(0);
  };

  const handleSelectUpdateGoal = (goal) => {
    setUpdatingGoal(goal);
    setUpdateName(goal.name);
    setUpdateTarget(goal.target);
    setUpdateMeasuredIn(goal.measured_in);
    setShouldOpenUpdateModal(true);
    console.log(goal.deadline);
    console.log(new Date(goal.deadline));
    setUpdateDate(new Date(goal.deadline));
  };

  const openFilterDialog = (e) => {
    if (e.stopPropagation()) e.stopPropagation()
    setShouldOpenFilters(true)
  }

  const archiveGoal = (e, goal) => {
    e.stopPropagation();
    confirm({
      description: `You are trying to archive this goal. 
                   Once you archive it you won't see it by default, but only by applying the archived filter. 
                   You can restore archived goals anytime.`,
    })
      .then(() => {
        console.log('ARCHIVED YES');
      })
      .catch(() => {
        console.log('ARCHIVED NO');
      });
  };

  const deleteGoal = (e, goal) => {
    e.stopPropagation();
    confirm({
      description: 'Deleting a goal is a permanent action.',
    })
      .then(() => {
        console.log('ARCHIVED YES');
      })
      .catch(() => {
        console.log('ARCHIVED NO');
      });
  };

  useEffect(fetchGoals, []);

  return (
    <div>
      <GoalsWrapperHeader
        classes={classes}
        shouldOpenCreateModal={shouldOpenCreateModal}
        setShouldOpenCreateModal={setShouldOpenCreateModal}
      />
      <GoalCreate
        setShouldOpenCreateModal={setShouldOpenCreateModal}
        shouldOpenCreateModal={shouldOpenCreateModal}
        classes={classes}
        fetchGoals={fetchGoals}
      />
      <GoalUpdate 
        shouldOpenUpdateModal={shouldOpenUpdateModal}
        setShouldOpenUpdateModal={setShouldOpenUpdateModal}
        updateName={updateName}
        setUpdateName={setUpdateName}
        classes={classes}
        addProgress={addProgress}
        setAddProgress={setAddProgress}
        updateMeasuredIn={updateMeasuredIn}
        setUpdateTarget={setUpdateTarget}
        updateDate={updateDate}
        setUpdateDate={setUpdateDate}
        handleUpdat={handleUpdate}
      />
      <GoalsFilter />
      <List className={classes.root} style={{ paddingTop: '15px' }}>
        {goals.map((goal) => {
          const labelId = `checkbox-list-label-${goal.id}`;

          return (
            <ListItem
              key={goal.id}
              role={undefined}
              dense
              button
              onClick={() => {
                handleSelectUpdateGoal(goal);
              }}
              style={{
                marginBottom: '20px',
                borderRadius: '3px',
                border: '1px solid #cccccc',
              }}
              disabled={isPast(new Date(goal.deadline)) ? true : false}
            >
              <div
                style={{
                  width: '100%',
                  paddingTop: '15px',
                  paddingBottom: '15px',
                }}
              >
                <div style={{ paddingBottom: '10px' }}>
                  <Grid
                    container
                    spacing={3}
                    justify='space-end'
                    alignItems='center'
                  >
                    <Grid item xs={10}>
                      <span style={{ fontSize: '17px' }} id={labelId}>
                        <strong>{goal.name}</strong> &middot;{' '}
                        {goal.current_progress}/{goal.target}{' '}
                        {measuredInOptions[goal.measured_in]} (
                        <strong>{calculateCompletionPercentage(goal)}%</strong>)
                        &middot;
                        <i>
                          &nbsp; due on&nbsp;
                          <strong>
                            {new Date(goal.deadline).toString().slice(0, -43)}
                            {/* {(new Date(goal.deadline)).to()}  */}
                            &nbsp;(
                            {dayDescriptor(new Date(goal.deadline))}
                            )
                          </strong>
                        </i>
                      </span>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title='Archive'>
                        <IconButton
                          aria-label='delete'
                          className={classes.margin}
                          onClick={(e) => archiveGoal(e, goal)}
                        >
                          <ArchiveIcon style={{ color: '#ffc107' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton
                          aria-label='delete'
                          color='secondary'
                          className={classes.margin}
                          onClick={(e) => deleteGoal(e, goal)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </div>
                <div>
                  <LinearProgress
                    variant='determinate'
                    value={calculateCompletionPercentage(goal)}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
