const express = require('express');
const router = express.Router();
const axios = require('axios');
const  {Authorize, redirectLink,getUserProfile, postOnLinkedin, fetchDummyContent, createDummyContent, deleteDummyContentById} = require('../helper/helperFunctions');

router.get('/',async(req,res)=>{
   try {
    res.status(200).send({
        status:"success",
        message: "Welcome to Linkedin Login"
    })

   } catch (error) {
    res.status(400).json({
        status:"Fail",
        message:error
    })
   }
})

router.get('/api/linkedin/authorize',async(req,res)=>{
    return res.redirect(Authorize())
})

router.get('/auth/linkedin/callback',async(req,res) => {
    try {
        const response = await redirectLink(req.query.code);
        const user = await getUserProfile(response.access_token);

        res.status(200).send({
            status:200,
            response,
            user
        })
    } catch (error) {
        res.status(400).send({
            status:400,
            error
        })
    }

});

router.get('/api/user-info',async(req,res)=>{
    try {
        const response = await getUserProfile(req);
        res.status(200).send({
            status:"success",
            response
        })
    } catch (error) {
        res.status(400).send({
            status:"failure",
            error
        })
    }
});

router.post('/api/linkedin/post',async(req, res)=>{
    try {
        const response = await postOnLinkedin(req);
        res.status(200).send({
            status:"success",
            response
        })
    } catch (error) {
        res.status(400).send({
            status:"failure",
            error
        })
    }
})

router.post("/dummyContent", async(req,res)=>{
    try {
        const response = await createDummyContent();
        res.status(200).send({
            status:"success",
            response
        })
    } catch (error) {
        res.status(400).send({
            status:"failure",
            error
        })
    }
})

router.get("/dummyContent", async(req,res)=>{
    try {
        const response = await fetchDummyContent();
        res.status(200).send({
            status:"success",
            response
        })
    } catch (error) {
        res.status(400).send({
            status:"failure",
            error
        })
    }
})

router.delete("/dummyContent/:id", async(req,res)=>{
    try {
        const response = await deleteDummyContentById(req);
        res.status(200).send({
            status:"success",
            response
        })
    } catch (error) {
        res.status(400).send({
            status:"failure",
            error
        })
    }
})


module.exports = router