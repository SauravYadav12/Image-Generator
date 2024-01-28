import axios from "axios";
import { toast } from "react-toastify";

// export const getCodeFromWindowURL = (url) => {
//   const popupWindowURL = new URL(url);
//   return popupWindowURL.searchParams.get("code");
// };

export const getAccessToken = async (code) => {
  try {
    const accessTokenEndopoint = `${process.env.REACT_APP_LINKEDIN_TOKEN}`;
    const data = await axios.get(accessTokenEndopoint);
    return data;
  } catch (error) {
    throw new Error("Unable to retrieve Token:", error);
  }
};

export const shareContentOnLinkedin = async (image) => {
  try {
    console.log(image);
    const { sub } = JSON.parse(localStorage.getItem("user"));
    const { access_token } = JSON.parse(localStorage.getItem("auth"));
    const url = `${process.env.REACT_APP_BASE_URL}/linkedin/post`;
    console.log(access_token);
    console.log(url);
    const data = { image };
    const res = await axios.post(url, data, {
      headers: { authorization: `${access_token}`, urn: `${sub}` },
    });
    console.log(res);
    return res.status;
  } catch (error) {
    // throw new Error("Unable to Post Content on linkedin:", error);
    toast.error("Unable to Post Content on linkedin:", error);
  }
};

export const getDummyContent = async () => {
  try {
    const dummy = await axios.get(`${process.env.REACT_APP_DUMMY}`);
    const dummyArray = dummy?.data?.response;
    const randomIndex = Math.floor(Math.random() * dummyArray.length);
    const dummyData = dummyArray[randomIndex];
    return dummyData;
  } catch (error) {
    throw new Error("unable to retrieve dummy:", error);
  }
};
