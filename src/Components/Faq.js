import { Box } from "@mui/material";
import React from "react";
import FaqElement from "./FaqElement";

const faqs = [
  {
    summary: "Where is the data being archived?",
    detail:
      "The data is stored on IPFS and the IPFS hash is saved in a smart contract on ethereum",
  },
  {
    summary: "Is it free to use?",
    detail:
      "Yes, you can store any data for free on IPFS in a decentralized manner",
  },
  {
    summary:
      "When will we enable the integration and archiving of youtube videos?",
    detail:
      "The option of archiving youtube video via youtube link will be added soon",
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
