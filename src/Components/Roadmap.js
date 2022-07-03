import React from "react";
import { Typography } from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";

function Roadmap() {
  return (
    <Timeline position="alternate" sx={{ mt: 0, pt: 0 }}>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary" sx={{ px: 0 }}>
          Until Dec
        </TimelineOppositeContent>
        <TimelineSeparator sx={{ mx: 2 }}>
          <TimelineDot variant="outlined" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent sx={{ px: 0 }}>
          <Typography variant="h3" component="span">
            Launch
          </Typography>
          <Typography>Deploy contracts to Mainnet and go live</Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

export default Roadmap;
