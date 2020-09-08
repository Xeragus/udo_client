import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import axios from 'axios'

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

export default function Chart() {
  const theme = useTheme();
  const [last30DaysTaskCompletionData, setLast30DaysTaskCompletionData] = useState([])

  const fetchLast30DaysTaskCompletionData = () => {
    axios
      .get("http://localhost:3001/task-completion-data", {
        params: {
          number_of_days: 25,
        },
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        let data = []
        res.data.forEach(dataItem => {
          let date = new Date(dataItem.date)
          data.push(createData(date.toUTCString().slice(0, 16), dataItem.completion_percentage))
        })

        setLast30DaysTaskCompletionData(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchLast30DaysTaskCompletionData()
  }, [])

  return (
    <React.Fragment>
      <div>Task Completion: Last 30 Days</div>
      <ResponsiveContainer>
        <LineChart
          data={last30DaysTaskCompletionData}
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