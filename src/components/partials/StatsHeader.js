import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  mainNumber: {
    fontSize: 32
  },
  tagName: {
    fontSize: 15
  }
}));

export default function StatsHeader() {
  const classes = useStyles();
  const [favoriteTag, setFavoriteTag] = useState({})
  const [leastFavoriteTag, setLeastFavoriteTag] = useState({})
  const [mostSuccessfullTag, setMostSuccessfullTag] = useState({})
  const [toughestTag, setToughestTag] = useState({})

  const fetchStatsHeaderData = () => {
    axios
      .get("http://localhost:3001/task-stats-header-data", {
        params: {
          email: localStorage.getItem('email')
        },
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setFavoriteTag(res.data.favorite_tag)
        setLeastFavoriteTag(res.data.least_favorite_tag)
        setMostSuccessfullTag(res.data.most_successfull_tag)
        setToughestTag(res.data.toughest_tag)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchStatsHeaderData()
  }, [])

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <div><i>Favorite tag</i></div>
            <div>used <span style={{ color: '#4caf50' }} className={classes.mainNumber}>{favoriteTag[Object.keys(favoriteTag)[0]]}</span>times</div>
            <div><b className={classes.tagName}>#{Object.keys(favoriteTag)[0]}</b></div>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <div><i>Least favorite tag</i></div>
            <div>used <span style={{ color: '#ff1744' }} className={classes.mainNumber}>{leastFavoriteTag[Object.keys(leastFavoriteTag)[0]]}</span> times</div>
            <div><b className={classes.tagName}>#{Object.keys(leastFavoriteTag)[0]}</b></div>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <div><i>Most successful tag</i></div>
            <div><span style={{ color: '#4caf50' }} className={classes.mainNumber}>{mostSuccessfullTag.percentage}</span>%</div>
            <div><b className={classes.tagName}>#{mostSuccessfullTag.name}</b></div>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <div><i>Toughest tag</i></div>
            <div><span style={{ color: '#ff1744' }} className={classes.mainNumber}>{toughestTag.percentage}</span>%</div>
            <div><b className={classes.tagName}>#{toughestTag.name}</b></div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}