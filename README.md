#Image Generator Project

#Getting Started
To start the frontend React project:
npm start


Start the Node.js server:
node index.js


Start your MongoDB locally.

In the frontend React - Inside the .env file, please update your LinkedIn client ID and add it in the REACT_APP_AUTH_URL.

Add your client ID and client secret inside the server .env file.

#LinkedIn Setup
1.Go to LinkedIn Developer Portal.
2.Create an App.
3.Request access to the following 3 main products:
    a.Sign In with LinkedIn using OpenID Connect
    b. Share on LinkedIn
    c. Advertising API
4.Create Authorized Redirect URLs for your app:
    a.For frontend: http://localhost:3000
    b.For backend: http://localhost:4000/auth/linkedin/callback

#APIs
1. /api/linkedin/authorize - To call the first URL method which will return the code.
From frontend you do not need to hit it 

2. /auth/linkedin/callback - It will accept the code and return an access token which will be used to get the user details.

#Note: From now on, you have to send the access_token in the header for the below APIs to work.

3. /api/user-info - To retrieve the user details.

4. Additional: Hit "https://api.linkedin.com/v2/me" to retrieve the URN if the Sub did not work as a URN. This will be to check if you have profile level access or not.

5. /api/linkedin/post - To create a post and share the content over LinkedIn. Here you need to send the base64Image as the body and access_token & urn in the header.
