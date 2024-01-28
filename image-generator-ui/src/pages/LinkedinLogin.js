import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { toast } from "react-toastify";
import { MagnifyingGlass } from "react-loader-spinner";
import "../App.css";

const defaultTheme = createTheme();

export default function LinkedinLogin(props) {
  const initialState = {
    user: {},
    loggedIn: false,
    loading: false,
  };

  const [state, setState] = useState(initialState);
  useEffect(() => {
    if (props.isloggedIn) {
      setState({
        ...state,
        loggedIn: true,
        loading: false,
      });
    }
  }, []);

  const getCodeFromWindowURL = (url) => {
    const popupWindowURL = new URL(url);
    return popupWindowURL.searchParams.get("code");
  };

  const handlePostMessage = (event) => {
    try {
      if (event.data.type === "code") {
        const { code } = event.data;
        getUserCredentials(code);
      }
    } catch (error) {
      throw new Error("Unable to retrieve user details:", error);
    }
  };

  const showPopup = () => {
    try {
      setState({
        ...state,
        loading: true,
      });
      const updatedOauthUrl = `${process.env.REACT_APP_AUTH_URL}`;
      const width = 450,
        height = 730,
        left = window.screen.width / 2 - width / 2,
        top = window.screen.height / 2 - height / 2;
      window.open(
        updatedOauthUrl,
        "Linkedin",
        "menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=" +
          width +
          ", height=" +
          height +
          ", top=" +
          top +
          ", left=" +
          left
      );
    } catch (error) {
      throw new Error("Unable to open linkedin", error);
    }
  };

  const getUserCredentials = async (code) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_LINKEDIN_TOKEN}?code=${code}`
      );
      const user = res.data;

      if (user.status === 200) {
        console.log(user);
        toast.success("Login Successfull");
        localStorage.setItem("user", JSON.stringify(user.user));
        localStorage.setItem("auth", JSON.stringify(user.response));
        setState({
          ...state,
          user,
          loggedIn: true,
          loading: false,
        });
      }
    } catch (error) {
      toast.error("Error Fetching Credentials");
    }
  };

  useEffect(() => {
    try {
      if (window.opener && window.opener !== window) {
        const code = getCodeFromWindowURL(window.location.href);
        window.opener.postMessage({ type: "code", code: code }, "*");
        window.close();
      }
      window.addEventListener("message", handlePostMessage);

      return () => {
        window.removeEventListener("message", handlePostMessage);
      };
    } catch (error) {
      throw new Error("Error retrieving values from popup", error);
    }
  }, []);

  const handleLoggin = () => {
    setState({
      ...state,
      user: {},
      loggedIn: false,
    });
  };

  if (state.loggedIn) {
    localStorage.setItem("loggedIn", true);
  }

  return (
    <>
      {state.loading && (
        <div className="loader-overlay">
          <MagnifyingGlass
            visible={true}
            height="80"
            width="80"
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{}}
            wrapperClass="magnifying-glass-wrapper"
            glassColor="#c0efff"
            color="#e15b64"
          />
        </div>
      )}
      {state.loggedIn === true ? (
        <Dashboard user={state.user} isLoggedIn={handleLoggin} />
      ) : (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Welcome to Image Generator
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 1 }}
                onClick={showPopup}
              >
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  <LinkedInIcon sx={{ mr: 2 }} />
                  Sign In with Linkedin
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}
