import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Stepper,
  StepLabel,
  Stack,
  Step,
  Card,
  CardMedia,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { buffer } from "buffer";
// eslint-disable-next-line
import { create as ipfsHttpClient } from "ipfs-http-client";

import { ReactComponent as WalletIcon } from "../assets/icons/wallet.svg";
import URLInput from "./URLInput";

import { BASE_URL, FUNCTIONS_PREFIX } from "../config/globals";

/* const standardErrorMessage = "Something went wrong. Pleas try again later!"; */
const tweetURLPattern =
  /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?twitter\.com\/(\w+)\/status\/(\d+)$/i;

/* const getTweetId = (tweetURL) => {
  const splitTweetURL = tweetURL.split("/");
  const lastItem = splitTweetURL[splitTweetURL.length - 1];
  const splitLastItem = lastItem.split("?");
  return splitLastItem[0];
}; */

const beautifyAddress = (address) =>
  `${address.substr(0, 6)}...${address.substr(-4)}`;

function Propose({ account, network, getAccount }) {
  const [state, setState] = useState({
    theme: "light",
    language: "en",
    tweetURL: "",
    invalidTweetURLMessage: "",
    formErrorMessage: "",
    imageData: "",
    nftMetadata: "",
  });
  const [formIsSubmitting, setFormIsSubmitting] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    if (account && network.chainId !== 4 && !state.formErrorMessage) {
      setState({
        ...state,
        formErrorMessage: "Please use the Rinkeby Test network to proceed.",
      });
    }
    if (account && network.chainId === 4 && activeStep === 0) {
      setState({
        ...state,
        formErrorMessage: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, activeStep, network.chainId]);

  // eslint-disable-next-line arrow-body-style

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // setState({
    //   ...state,
    //   formErrorMessage: "",
    // });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(1);
  };
  // client used to host and upload data, endpoint infura
  const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
  // keeping track of URL inserted as image for NFT metadata
  const [fileURL, setFileURL] = useState(null);
  async function saveOnIPFS() {
    // upload to IPFS but this time with metadata
    // the metadata comes from a json, we need to stringify the data to upload it
    /* const currentImage = state.imageData;
    const blob = await currentImage.blob();
    const file = new File([blob], "something.png", { type: "image/png" }); */
    console.log("saveOnIPFS got called");
    /* const buf = Buffer.from(state.imageData, "base64"); */
    const data = JSON.stringify({
      address: "0x",
      image: /*  `data:image/png;base64,${ */ state.imageData /* }` */,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // run a function that creates Sale and passes in the URL
      console.log(url);
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }
  const handleImageFetch = async () => {
    const { tweetURL, language, theme } = state;
    /*  const tweetId = getTweetId(tweetURL); */
    console.log("handleImageFetch called");
    setFormIsSubmitting(true);

    setState({
      ...state,
      imageData: "",
    });

    fetch(`${BASE_URL}${FUNCTIONS_PREFIX}/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ tweetURL, language, theme }),
    })
      .then(async (res) => {
        if (res.status === 200) return res.json();
        // eslint-disable-next-line
        console.log("After image fetch error");
        const errorMessage = (await res.json()).error;
        throw new Error(errorMessage);
      })
      .then(async (data) => {
        const { image, metadata } = data;
        setState({
          ...state,
          imageData: image,
          nftMetadata: metadata,
        });

        setFormIsSubmitting(false);

        handleNext();
        /*  if (state.invalidTweetURLMessage === "") { */

        /* saveOnIPFS(); */
        /*   } */
      })
      .catch((err) => {
        setState({
          ...state,
          formErrorMessage: err.message,
        });
        setFormIsSubmitting(false);
      });
  };

  const handleChange = (target) => {
    const { value, name } = target;
    // eslint-disable-next-line
    console.log("handleChange called");
    if (name === "tweetURL") {
      const trimmedURL = value.split("?")[0];
      const invalidTweetURLMessage =
        value && !tweetURLPattern.test(trimmedURL)
          ? "This URL is not valid."
          : "";

      setState({
        ...state,
        [name]: trimmedURL,
        invalidTweetURLMessage: invalidTweetURLMessage,
      });

      return;
    }

    setState({
      ...state,
      [name]: value,
    });
  };

  const steps = [
    {
      title: "Login",
      caption: "Connect to MetaMask",
      description: (
        <LoadingButton
          // loading={loading}
          // value="1"
          // name="wallet"
          fullWidth
          loadingIndicator="connecting..."
          aria-label="connect to metamask"
          variant="contained"
          onClick={getAccount}
          endIcon={<WalletIcon />}
          sx={{ mt: 1 }}
        >
          {account ? beautifyAddress(account) : "Connect"}
        </LoadingButton>
      ),
      nextBtnText: "Next",
      handleNext: handleNext,
    },
    {
      title: "Fetch Tweet or Youtube Video",
      caption: "Style and create the Tweet or Video",
      description: (
        <URLInput
          state={state}
          formIsSubmitting={formIsSubmitting}
          handleChange={handleChange}
        />
      ),
      nextBtnText: "Fetch Tweet/Video",
      handleNext: handleImageFetch,
    },
    {
      title: "Archive Data",
      caption: "Submit you suggestion",
      description: (
        <Box>
          The Tweet will be saved on IPFS and the correlating hash on ethereum
        </Box>
      ),
      nextBtnText: "Archive Data",
      handleNext: saveOnIPFS,
    },
  ];
  let image = "";
  const [loaded, setLoaded] = useState(false);
  async function a() {
    // https://ipfs.infura.io/ipfs/Qmd4Qm2tuHC31AE17FCtjodxrVyvF43KYYHzWoAckYcF4g

    // https://bafybeiddbnecmnkpea7lddwuhogivw2kichdvpvoymj24chxo5atjfxnca.ipfs.infura-ipfs.io/
    const result = await axios.get(
      "https://bafybeicwkwe5jjneryeqafqvivqa4ptoum3oktrlinxiycb6rm2s6gg5ia.ipfs.infura-ipfs.io/"
    );
    // eslint-disable-next-line
    console.log("1");
    console.log(result);
    /* result = JSON.parse(result.data.image); */
    console.log("2");
    console.log(result);
    image = result.data.image /* .data */;
    image = image.toString(/* "base64" */);
    console.log(image);
    setLoaded(true);
  }
  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, i) => (
          <Step key={step.title} sx={{ pl: i === 0 ? 0 : 1 }}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mb: 2, mt: 2 }}>
        {activeStep !== steps.length ? (
          <>
            <Typography>{steps[activeStep].description}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                disabled={activeStep === 0 || formIsSubmitting}
                variant="outlined"
                onClick={handleBack}
                sx={{ flexGrow: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={steps[activeStep].handleNext}
                sx={{ flexGrow: 1 }}
                disabled={
                  ((!state.tweetURL || state.invalidTweetURLMessage) &&
                    activeStep === 1) ||
                  !account ||
                  network.chainId !== 4 ||
                  formIsSubmitting
                }
              >
                {steps[activeStep].nextBtnText}
              </Button>
            </Stack>
            <Box sx={{ mt: 1 }}>
              <Typography color="error" variant="caption">
                {state.formErrorMessage}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography>
              The tweet has been successfully saved for eternity!
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleReset}
              sx={{ mt: 1, mr: 1 }}
            >
              More Data to store?
            </Button>
          </>
        )}
      </Box>
      <Box>
        {state.imageData !== "" && (
          <Card sx={{ width: 1, mt: 2 }}>
            <CardMedia
              component="img"
              image={`data:image/png;base64,${state.imageData}`}
              alt="screenshot of tweet"
            />
          </Card>
        )}
      </Box>
      <Box>
        {async function A() {
          const result = await axios.get(
            "https://bafybeichbks5lb2s4c7u2sve6pe6crgtl4dt255bxlw3zmaeo5ui22ccje.ipfs.infura-ipfs.io/"
          );
          // eslint-disable-next-line
          image = result.data.image;
          console.log(image);
        } && (
          <Box>
            <Card sx={{ width: 1, mt: 2 }}>
              <CardMedia
                component="img"
                image={`data:image/png;base64,${image}`}
                alt="screenshot of tweet"
              />
            </Card>
          </Box>
        )}
        <Button onClick={(e) => a()}>get image</Button>
        <br />
        {loaded && (
          <img src={`data:image/png;base64, ${image}`} alt="Red dot" />
        )}
      </Box>
    </Box>
  );
}

export default Propose;
