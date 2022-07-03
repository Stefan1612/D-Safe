import { Typography, Box, TextField } from "@mui/material";

import FaqElement from "./FaqElement";

const faq = {
  summary: "Where can I find the link?",
  detail: (
    <>
      <Typography>
        Finding the link to a Tweet you want to share isn't obvious, but it's
        also not difficult. Here is an easy method.
      </Typography>
      <ol>
        <li>Navigate to the Tweet</li>
        <li>Open the Share Menu</li>
        <li>Click the "Copy link to Tweet" Option</li>
      </ol>
      <Typography>Check if your link has the following format:</Typography>
      <Box sx={{ width: 1, wordWrap: "break-word" }}>
        <code>https://twitter.com/yourUsername/status/aBigNumber</code>
      </Box>
    </>
  ),
};

function ImageCreation({ state, formIsSubmitting, handleChange }) {
  return (
    <>
      <Box sx={{ mt: 2 }}>
        <FaqElement {...faq} />
      </Box>
      <TextField
        label="Tweet URL"
        fullWidth
        name="tweetURL"
        value={state.tweetURL}
        disabled={formIsSubmitting}
        onChange={(e) => handleChange(e.target)}
        error={!!state.invalidTweetURLMessage}
        helperText={state.invalidTweetURLMessage}
        sx={{ mt: 2 }}
      />
    </>
  );
}

export default ImageCreation;
