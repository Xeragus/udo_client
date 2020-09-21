import React from "react"
import Grid from "@material-ui/core/Grid"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import TaskItem from "../TaskItem"
import Checkbox from "@material-ui/core/Checkbox"
import { differenceInCalendarDays, isBefore } from "date-fns"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import authHeader from '../../util/auth-header'
import { useConfirm } from "material-ui-confirm"
import axios from "axios"
import TagsDisplay from "./TagsDisplay"
import HashtagChipsDisplay from './HashtagChipsDisplay'

export default function TaskListItemWrapper(props) {
  const confirm = useConfirm()

  const deleteTask = (e, task) => {
    if (e.stopPropagation()) e.stopPropagation()
    
    confirm({
      description: "Deleting a task is a permanent action.",
    })
      .then(() => {
        axios
          .delete(`http://localhost:3001/tasks/${task.id}`, authHeader)
          .then((res) => {
            props.fetchTasks(props.currentDate)
          })
          .catch((err) => { console.log(err) })
      })
      .catch(() => {})
  }

  console.log()

  return (
    <ListItem
      key={props.task.id}
      role={undefined}
      dense
      button
      disabled={differenceInCalendarDays(new Date(props.currentDate), new Date()) >= 0 ? false : true}
      onClick={() => {
        props.toggleTaskCompleted(props.task)
      }}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item button>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={props.task.is_completed}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": props.labelId }}
                  style={{
                    color: `${props.task.is_completed ? "#43a047" : ""}`,
                  }}
                />
              </ListItemIcon>
            </Grid>
            <Grid item>
              <TaskItem id={props.labelId} task={props.task} />
              <HashtagChipsDisplay selectedTags={props.task.tags} task={props.task} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Tooltip title="Edit">
            <IconButton
              aria-label="edit"
              className={props.classes.margin}
              onClick={(e) => props.handleSetUpdatingTask(props.task, e)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              aria-label="delete"
              color="secondary"
              className={props.classes.margin}
              onClick={(e) => deleteTask(e, props.task)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </ListItem>
  )
}
