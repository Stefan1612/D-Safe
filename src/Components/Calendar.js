import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Card, Typography, CardMedia } from "@mui/material";
import dTweetNFT from "../config/contracts/DTweetNFT.json";
import addressMap from "../config/contracts/map.json";
import {
  REACT_APP_ALCHEMY_API_KEY_RINKEBY,
  PINATA_PREFIX,
} from "../config/globals";

function Calendar() {
  const [image, setImage] = useState();
  const [currentTweet, setCurrentTweet] = useState({
    tokenID: 0,
    tokenURI: "",
    owner: "",
    hash: "",
    imageData: "",
  });

  // this provider is not dependent if user is logged in to metamask
  const provider = new ethers.providers.AlchemyProvider(
    "rinkeby",
    REACT_APP_ALCHEMY_API_KEY_RINKEBY
  );

  const NFTContract = new ethers.Contract(
    addressMap[1337].DTweetNFT,
    dTweetNFT.abi,
    provider
  );

  const fetchLastTweet = async () => {
    if (NFTContract) {
      const tokens = await NFTContract.getAllMintedTokens();
      const tweetId = ethers.BigNumber.from(tokens.length - 1);
      const result = await NFTContract.arrayOffAllTweets(tweetId);
      const hash = result.tokenURI.replace("ipfs://", "");

      setCurrentTweet({
        tokenID: result.tokenID,
        tokenURI: result.tokenURI,
        owner: result.owner,
        hash: hash,
      });
    }
  };

  useEffect(() => {
    if (currentTweet.hash) {
      fetch(`https://gateway.pinata.cloud/ipfs/${currentTweet.hash}`, {
        method: "GET",
      })
        .then(async (res) => res.json())
        .then((json) => {
          // if (json.error) {
          //   reject(new Error(standardErrorMessage));
          // }
          setImage(PINATA_PREFIX + json.image);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTweet.hash]);

  useEffect(() => {
    fetchLastTweet();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      {/* Proposed by: Date */}
      <Typography sx={{ textAlign: "center" }}>Data saved:</Typography>
      <a
        href="http://localhost:5000/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Card variant="outlined" sx={{ width: 1, mt: 2 }}>
          <CardMedia
            component="img"
            image={image}
            alt="screenshot of tweet"
            width="100%"
          />
        </Card>
      </a>
    </Box>
  );
}

export default Calendar;
