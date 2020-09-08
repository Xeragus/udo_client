import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import axios from 'axios'
import Slider from '@material-ui/core/Slider';

function createData(time, amount) {
  return { time, amount };
}

export default function Chart() {
  const theme = useTheme();
  const [lastXDaysTaskCompletionData, setLastXDaysTaskCompletionData] = useState([])
  const [numberOfDays, setNumberOfDays] = useState(7)

  const fetchLastXDaysTaskCompletionData = (numberOfDays) => {
    axios
      .get("http://localhost:3001/task-completion-data", {
        params: {
          number_of_days: numberOfDays,
        },
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        let data = []
        res.data.forEach(dataItem => {
          let date = new Date(dataItem.date)
          data.push(createData(date.toUTCString().slice(0, 16), dataItem.completion_percentage))
        })

        setNumberOfDays(numberOfDays)
        setLastXDaysTaskCompletionData(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchLastXDaysTaskCompletionData(7)
  }, [])

  const marks = [
    {
      value: 7,
      label: '7',
    },
    {
      value: 14,
      label: '14',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 60,
      label: '60',
    },
    {
      value: 180,
      label: '180',
    },
  ];

  return (
    <React.Fragment>
      <div>Task Completion: Last {numberOfDays} Days</div>
      <Slider
        defaultValue={numberOfDays}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks={marks}
        onChangeCommitted={(e, val) => { fetchLastXDaysTaskCompletionData(val) }}
        min={1}
        max={365}
      />
      <ResponsiveContainer>
        <LineChart
          data={lastXDaysTaskCompletionData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Completed (%)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}