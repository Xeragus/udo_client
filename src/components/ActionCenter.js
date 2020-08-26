import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import AdjustOutlinedIcon from '@material-ui/icons/AdjustOutlined';
import TasksWrapper from './TasksWrapper'
import GoalsWrapper from './GoalsWrapper'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 1000,
    margin: '0 auto',
    background: '#fff'
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

export default function IconLabelTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Paper square className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon label tabs example"
          centered
        >
          <Tab icon={<ListAltOutlinedIcon />} label="Tasks" />
          <Tab icon={<AdjustOutlinedIcon />} label="Goals" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <TasksWrapper />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <GoalsWrapper />
        </TabPanel>
      </Paper>
    </Box>
  )
}