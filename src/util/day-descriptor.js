import { isToday, isYesterday, isTomorrow, differenceInCalendarDays } from "date-fns"

export default (date) => {
  if (isToday(date)) return "today" 
  else if (isYesterday(date)) return "yesterday"
  else if (isTomorrow(date)) return "tomorrow"
  else {
    const differenceInDays = differenceInCalendarDays(date, new Date())
    if (differenceInDays > 0) return `in ${differenceInDays} days`
    return `${Math.abs(differenceInDays)} days ago`
  }
}