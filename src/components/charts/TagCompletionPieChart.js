import React, { PureComponent } from 'react'
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts'

export default function TagCompletionPieChart(props) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', right: `${props.right}px`, top: 35, fontSize: '0.875rem' }}>{props.title}</span>
      <PieChart width={400} height={400}>
        <Pie dataKey="value" isAnimationActive={false} data={props.data} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
        <Tooltip title="Add" />
      </PieChart>
    </div>
  )
}
