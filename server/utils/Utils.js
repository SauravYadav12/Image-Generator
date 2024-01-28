const fs = require('fs');
const path = require('path');


exports.convertbase64toImage = async(image)=>{
    try {
        const outputPath = path.join(__dirname, 'image', 'output_image.png');
        const base64Data = image.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(outputPath, buffer);
        return outputPath;
    } catch (error) {
        console.log("image conversion error",error);
    }
}

exports.deleteImageLocally = async(filePath)=>{
    try {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
    } catch (error) {
        return error
    }
}

exports.getRegisterUploadPayload = (urn)=>{
    return {
        "registerUploadRequest": {
            "recipes": [
                "urn:li:digitalmediaRecipe:feedshare-image"
            ],
            "owner": `urn:li:person:${urn}`,
            "serviceRelationships": [
                {
                    "relationshipType": "OWNER",
                    "identifier": "urn:li:userGeneratedContent"
                }
            ]
        }
    }
 }

 exports.generateSharePayload = (urn,asset,title, text, description) =>{
    return (
        {
            "author": `urn:li:person:${urn}`,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": `${text}`
                    },
                    "shareMediaCategory": "IMAGE",
                    "media": [
                        {
                            "status": "READY",
                            "description": {
                                "text": `${description}`
                            },
                            "media": `${asset}`,
                            "title": {
                                "text": `${title}`
                            }
                        }
                    ]
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }
    )
 }