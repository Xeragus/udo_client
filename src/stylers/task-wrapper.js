import { makeStyles } from "@material-ui/core/styles"

export default makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    color: "#fff",
  },
  completed: {
    textDecoration: "line-through",
    color: "#808080",
  },
  task: {
    fontSize: "15px",
  },
  calendarButton: {
    height: "36px",
  },
  hasTasks: {
    border: "1px solid #cecece",
    borderRadius: "10px",
    background: "#f8f8f8",
  },
}))