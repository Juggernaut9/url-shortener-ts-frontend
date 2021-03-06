import React, { useState, useRef } from "react";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import CopyToClipboard from "react-copy-to-clipboard";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import QRCode from "qrcode.react";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { API_URL } from "./config";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bigRoot: {
      minHeight: "100vh",
      position: "relative",
    },
    root: {
      textAlign: "center",
    },
    title: {
      marginTop: theme.spacing(5),
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
    },
    inputContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      display: "flex",
      marginLeft: "auto",
      marginRight: "auto",
      padding: theme.spacing(1),
      marginTop: theme.spacing(5),
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      width: "100%",
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    shortUrlContainer: {
      cursor: "pointer",
      display: "inline-block",
      "&:hover": {
        "& svg": {
          color: theme.palette.secondary["main"],
        },
      },
      maxWidth: "100%",
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    shortUrlDiv: {
      display: "flex",
    },
    copyIcon: {
      color: theme.palette.grey[500],
      marginLeft: theme.spacing(4),
      [theme.breakpoints.down("xs")]: {
        marginLeft: theme.spacing(0),
      },
    },
    qrcode: {
      width: "100%",
      marginBottom: theme.spacing(2),
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(3),
    },
    // displayResultRoot: {
    //   display: "flex",
    //   flexDirection: "column",
    // },
  })
);

export default function Form() {
  const classes = useStyles();
  const [shortUrl, setShortUrl] = useState<string>("");
  const baseUrl = window.location.origin;
  const textInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const matches = useMediaQuery("(max-width:600px)");
  const [titleVisible, setTitleVisible] = useState(true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const textInput = textInputRef.current?.value;
    console.log(textInput);
    const timer = setTimeout(() => {
      setLoading(true);
    }, 1000);
    const response = await axios.post(`${API_URL}`, { url: textInput });
    clearTimeout(timer);
    setLoading(false);
    setShortUrl(`${baseUrl}/${response.data.url.short}`);
    setTitleVisible(true);
  };

  // snackbar
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleOnFocus = () => {
    if (matches) {
      setTitleVisible(false);
    }
  };

  const handleOnBlur = () => {
    setTitleVisible(true);
  };

  return (
    <div className={classes.bigRoot}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Copied to clipboard"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Navbar />
      <Container className={classes.root}>
        {titleVisible ? (
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            className={classes.title}
          >
            Shorts - URL Shortening Service
          </Typography>
        ) : null}

        <Paper
          component="form"
          onSubmit={handleSubmit}
          className={classes.inputContainer}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        >
          <InputBase
            className={classes.input}
            placeholder="Enter Long URL"
            inputProps={{ "aria-label": "Enter Long URL" }}
            type="url"
            required
            inputRef={textInputRef}
          />
          <Button color="secondary" type="submit">
            Generate
          </Button>
        </Paper>
        {loading ? <CircularProgress color="secondary" /> : null}
        {shortUrl ? (
          <div>
            <QRCode value={shortUrl} className={classes.qrcode} />
            <CopyToClipboard text={shortUrl} onCopy={handleClick}>
              <Tooltip title="Click to copy">
                <Paper
                  component="div"
                  elevation={1}
                  className={classes.shortUrlContainer}
                >
                  <div className={classes.shortUrlDiv}>
                    <Typography>{shortUrl}</Typography>
                    <FileCopyIcon className={classes.copyIcon} />
                  </div>
                </Paper>
              </Tooltip>
            </CopyToClipboard>
          </div>
        ) : null}
      </Container>
      <Footer />
    </div>
  );
}
