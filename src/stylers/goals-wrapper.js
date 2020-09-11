import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    color: '#fff',
  },
  formControl: {
    margin: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    marginBottom: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))