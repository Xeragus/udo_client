import React, { PureComponent } from 'react'
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts'

const data01 = [
  { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 },
]

export default function TagCompletionPieChart(props) {
  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie dataKey="value" isAnimationActive={false} data={data01} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
        <Tooltip title="Add" />
      </PieChart>
    </div>
  )
}
