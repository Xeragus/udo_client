import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied"
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied"
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied"
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt"
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied"
import React from "react";

export default (completionPercentage) => {
  if (!completionPercentage)
    return [
      "#cc0000",
      <SentimentVeryDissatisfiedIcon style={{ fontSize: "32px" }} />,
      "rgba(204, 0, 0, 0.1)",
    ]

  if (completionPercentage < 25) {
    return [
      "#cc0000",
      <SentimentVeryDissatisfiedIcon style={{ fontSize: "32px" }} />,
      "rgba(204, 0, 0, 0.1)",
    ]
  } else if (completionPercentage <= 50) {
    return [
      "#cc6500",
      <SentimentDissatisfiedIcon style={{ fontSize: "32px" }} />,
      "rgba(204, 101, 0, 0.1)",
    ]
  } else if (completionPercentage < 75) {
    return [
      "#CBCC00",
      <SentimentSatisfiedIcon style={{ fontSize: "32px" }} />,
      "rgba(203, 204, 0, 0.1)",
    ]
  } else if (completionPercentage < 90) {
    return [
      "#7fcc00",
      <SentimentSatisfiedAltIcon style={{ fontSize: "32px" }} />,
      "rgba(127, 204, 0, 0.1)",
    ]
  }

  return [
    "#33cc00",
    <SentimentVerySatisfiedIcon style={{ fontSize: "32px" }} />,
    "rgba(51, 204, 0, 0.1)",
  ]
}