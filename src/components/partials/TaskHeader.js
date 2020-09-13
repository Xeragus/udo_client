import DateFnsUtils from "@date-io/date-fns"
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import React from 'react'
import getDayDescription from '../../util/day-descriptor'

export default function TaskHeader(props) {
  return (
    <div
      style={{
        display: "inline-block",
        textAlign: "center",
        position: "relative",
        width: "140px",
      }}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          autoOk
          value={props.currentDate}
          onChange={(date) => props.setCurrentDateQuickPick(date)}
          showTodayButton
          InputProps={{
            disableUnderline: true,
          }}
          inputProps={{ style: { textAlign: "center" } }}
          labelFunc={(date) => {
            return date.toDateString();
          }}
          id="central_date_picker"
        />
      </MuiPickersUtilsProvider>
      <span style={{ fontSize: '16px' }}>
        <i>{getDayDescription(props.currentDate).replace(/^\w/, (c) => c.toUpperCase())}</i>
      </span>
    </div>
  )
}