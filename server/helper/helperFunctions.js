const qs = require("querystring");
const axios = require("axios");
const fs = require("fs");
const {
  getRegisterUploadPayload,
  convertbase64toImage,
  generateSharePayload,
} = require("../utils/Utils");

const DummyContent = require('../model/dummy');

const Authorize = () => {
  return encodeURI(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&state=${process.env.STATE}&scope=${process.env.SCOPE}`
  );
};

const redirectLink = async (code) => {
  try {
    const payload = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
      code: code,
    };
    const { data } = await axios({
      url: `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(
        payload
      )}`,
      method: "POST",
      headers: {
        "Content-Type": "x-www-form-urlencoded",
      },
    });
    return data;
  } catch (error) {
    return error;
  }
};

const getUserProfile = async (accessToken) => {
  const userInfoUrl = `${process.env.USER_INFO}`;
  let userProfile = null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const user = await axios.get(userInfoUrl, config);
  userProfile = user.data;
  return userProfile;
};

const postOnLinkedin = async (req) => {
  try {
    const text = "This is generated using an API";
    const description = "This is a description for the image uploaded";
    const title = "Image Generator API";
    const access_token = req.headers["authorization"];
    const urn = req.headers["urn"];
    const url = `${process.env.REGISTER_UPLOAD}`;
    const imagePath = await convertbase64toImage(req.body.image);
    const data = getRegisterUploadPayload(urn);
    console.log(access_token)
    const payloadHeaders = {
      Authorization: `Bearer ${access_token}`,
      "X-Restli-Protocol-Version": "2.0.0",
    };

    const urlResponse = await axios.post(url, data, {
      headers: payloadHeaders,
    });

    if (urlResponse.status === 200) {
       console.log(urlResponse);

      const { asset, uploadMechanism } = urlResponse.data.value;
      console.log("asset--",asset)
      const uploadUrl =
        uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;

      const fileData = fs.readFileSync(imagePath);
      const headers = {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/octet-stream",
      };

      const uploadResponse = await axios.post(`${uploadUrl}`, fileData, {
        headers,
      });
    console.log(uploadResponse.status);
      
      if (uploadResponse.status === 201) {
        const payload = generateSharePayload(
          urn,
          asset,
          title,
          text,
          description
        );
        const shareResponse = await axios.post(
          `${process.env.UGC_POST}`,
          payload,
          { headers: payloadHeaders }
        );

        if (shareResponse.status === 201) {
          console.log("Post successful");
          return shareResponse.status;
        } else {
          throw new Error(
            `Failed to post on LinkedIn. Status: ${shareResponse.status}`
          );
        }
      } else {
        throw new Error(
          `Failed to upload image. Status: ${uploadResponse.status}`
        );
      }
    } else {
      throw new Error(
        `Failed to register upload. Status: ${urlResponse.status}`
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};


const createDummyContent = async () => {
    try {
      const dummyData = [
        { content: 'This is dummy content 4' },
        { content: 'This is dummy content 5' },
        { content: 'This is dummy content 6' },
        { content: 'This is dummy content 7' },
        { content: 'This is dummy content 8' },
        { content: 'This is dummy content 9' },
        { content: 'This is dummy content 10' },
      ];
  
      await DummyContent.insertMany(dummyData);
  
      console.log('Dummy content inserted successfully');
    } catch (error) {
      console.error('Error inserting dummy content:', error.message);
      return error.message
    }
  };

  const fetchDummyContent = async () => {
    try {
      const dummyContent = await DummyContent.find();
      return dummyContent
    } catch (error) {
      console.error('Error fetching dummy content:', error.message);
      return error.message
    }
  };

  const deleteDummyContentById  = async(req)=>{
    try {
        const dummyContent = await DummyContent.findByIdAndDelete(req.params.id);
        console.log('Deleted dummy content:', dummyContent);
      } catch (error) {
        console.error('Error Deleting dummy content:', error.message);
        return error.message
      }
  }

module.exports = {
  Authorize,
  redirectLink,
  getUserProfile,
  postOnLinkedin,
  fetchDummyContent,
  createDummyContent,
  deleteDummyContentById
};
