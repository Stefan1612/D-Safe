import React from "react";
import { IconButton } from "@mui/material";

import { ReactComponent as CodeIcon } from "../assets/icons/code.svg";
import { ReactComponent as OSIcon } from "../assets/icons/opensea.svg";

function Social() {
  return (
    <>
      <IconButton
        size="large"
        aria-label="opensea"
        href="https://testnets.opensea.io/collection/time-travellers-nft-vdinxbu2if"
        color="inherit"
        target="_blank"
        rel="noopener"
      >
        <OSIcon width="24px" height="24px" />
      </IconButton>
      <IconButton
        size="large"
        aria-label="github"
        href=""
        color="inherit"
        target="_blank"
        rel="noopener"
      >
        <CodeIcon width="24px" height="24px" />
      </IconButton>
    </>
  );
}

export default Social;
