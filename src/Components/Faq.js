import { Box } from "@mui/material";
import React from "react";
import FaqElement from "./FaqElement";

const faqs = [
  {
    summary: "ADWDA",
    detail: "Twdawdaw",
  },
];

function Faq() {
  return (
    <Box>
      {faqs.map((el, i) => (
        <FaqElement key={faqs[i].summary} {...faqs[i]} />
      ))}
    </Box>
  );
}

export default Faq;
