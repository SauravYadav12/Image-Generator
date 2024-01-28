import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Button, Grid, Input, Stack, TextField } from "@mui/material";
import ImageGenerator from "../components/ImageGenerator";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  getDummyContent,
  shareContentOnLinkedin,
} from "../service/api.service";
import { toast } from "react-toastify";
import { MagnifyingGlass } from "react-loader-spinner";
import "../App.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Dashboard = ({ user, isLoggedIn }) => {
  const [userDetails, setUserDetails] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [bgSelect, setBgSelect] = useState(null);
  const [bgImage, setBgImage] = useState();
  const [imageFile, setImageFile] = useState();
  const [firstInput, setFirstInput] = useState();
  const [secondInput, setSecondInput] = useState();
  const [dummyContent, setDummyContent] = useState("This is a Dummy content 0");
  const [imageGen, setImageGen] = useState(false);
  const [imageGenObj, setImageGenObj] = useState({});
  const [poster, setPoster] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const imageGenRef = useRef();

  const handleOpen = async () => {
    const poster = await imageGenRef.current.getPoster();
    const newCanvas = poster.current;
    const newPoster = newCanvas.toDataURL("image/png");
    setPoster(newPoster);
    setOpen(true);
    await shareContentOnLinkedin(newPoster);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setUserDetails(user.user);
  }, [user]);

  const handleFirstInput = (event) => {
    setFirstInput(event.target.value);
  };
  const handleSecondInput = (event) => {
    setSecondInput(event.target.value);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.setItem("loggedIn", false);
    localStorage.setItem("user", null);
    localStorage.setItem("auth", null);
    isLoggedIn();
    toast.success("You have been logged out");
  };

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    fetch(imageUrl)
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        const file = new File([blob], "bgImage");
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setBgImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      });
  };

  const handleBgSelect = () => {
    setBgSelect(selectedImage);
  };

  const handleChangeBg = () => {
    setSelectedImage(null);
    setBgSelect(null);
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageGenerationObj = {
    bgImage,
    imageFile,
    firstInput,
    secondInput,
    dummyContent,
  };

  const handleImageGeneration = () => {
    setImageGenObj(imageGenerationObj);
    setImageGen(true);
  };

  const handleChangeDetails = () => {
    setImageGen(false);
  };

  const handleSelectIcon = () => {
    setImageGen(false);
    setBgSelect(null);
  };

  const handleDummyContent = async () => {
    const dummyContent = await getDummyContent();
    console.log(dummyContent);
    setDummyContent(dummyContent.content);
  };

  const imageThumbnails = ["/images/bg1.jpg", "/images/bg2.jpg"];
  return (
    <>
      <div>
        {loading && (
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
      </div>

      <div>
        <Navbar userName={userDetails?.name || ""} onLogout={handleLogout} />
        <div style={{ display: "flex" }}>
          <Sidebar onSelectOption={handleSelectIcon} />
          <div style={{ marginLeft: 10, padding: 20, width: "100%" }}>
            {imageGen === true ? (
              <div>
                <ImageGenerator posterData={imageGenObj} ref={imageGenRef} />
                <Grid
                  container
                  spacing={2}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      onClick={handleChangeDetails}
                      fullWidth
                    >
                      Change Details
                    </Button>
                  </Grid>

                  <Grid item xs={3}>
                    <Button variant="contained" onClick={handleOpen} fullWidth>
                      Share on Linkedin
                    </Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          Sharing on Linkedin Successfully Done.
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Thank you for using
                        </Typography>
                      </Box>
                    </Modal>
                  </Grid>
                </Grid>
              </div>
            ) : (
              <div className="main-content">
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  <img
                    src={selectedImage}
                    style={{
                      width: "400px",
                      height: "400px",
                      border: "1px solid black",
                    }}
                  />
                </div>

                {bgSelect === null ? (
                  <div>
                    <Grid
                      container
                      spacing={3}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Panel 1: Changing Background */}
                      <Grid item xs={6}>
                        <div
                          style={{
                            padding: 20,
                            background: "#f0f0f0",
                            textAlign: "center",
                          }}
                        >
                          <h3>Choose Background</h3>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {imageThumbnails.map((thumbnail, index) => (
                              <img
                                key={index}
                                src={thumbnail}
                                alt={`Thumbnail ${index + 1}`}
                                style={{
                                  width: 50,
                                  height: 50,
                                  margin: 5,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleThumbnailClick(thumbnail)}
                              />
                            ))}
                          </div>
                        </div>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={3}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "10px",
                      }}
                    >
                      <Grid item xs={3}>
                        <Button
                          variant="contained"
                          onClick={handleBgSelect}
                          fullWidth
                        >
                          Select
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  <>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* <Grid item xs={6}>
                <div
                  style={{
                    padding: 20,
                    background: "#f0f0f0",
                    textAlign: "center",
                  }}
                >
                  <h3>Change Color of Image</h3>
                </div>
              </Grid> */}

                      <Grid item xs={6}>
                        <div
                          style={{
                            padding: 20,
                            background: "#f0f0f0",
                            textAlign: "center",
                          }}
                        >
                          <Stack direction="column" spacing={2}>
                            <TextField
                              value={firstInput}
                              label="First input"
                              size="small"
                              onChange={(event) => handleFirstInput(event)}
                              required
                            />
                            <TextField
                              value={secondInput}
                              label="Second input"
                              size="small"
                              onChange={(event) => handleSecondInput(event)}
                              required
                            />
                            <Input
                              type="file"
                              onChange={handleImage}
                              required
                            />
                            <Button
                              variant="outlined"
                              onClick={handleDummyContent}
                            >
                              Generate Dummy Content
                            </Button>
                          </Stack>
                        </div>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <Grid item xs={3}>
                        <Button
                          variant="contained"
                          onClick={handleChangeBg}
                          fullWidth
                        >
                          Change Background
                        </Button>
                      </Grid>

                      <Grid item xs={3}>
                        <Button
                          variant="contained"
                          onClick={handleImageGeneration}
                          fullWidth
                        >
                          Next
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
