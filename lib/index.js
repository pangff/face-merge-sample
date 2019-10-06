const rp = require("request-promise");
const key = "xsR4xP84dY9uPG9ADk5FcXcrRCpOrbgK";
const secret = "-W18CxqaxvVW6g6s3dle8J1sTsVcBQh_";
const image2base64 = require('image-to-base64');
const fs = require("fs");

(async ()=>{

    let indexTemplate = 1;
    let indexAvatar = 6;

    let template = await image2base64(__dirname+"/images/"+indexTemplate+".jpeg");
    let avatar = await image2base64(__dirname+"/images/"+indexAvatar+".jpeg");

    const options = {
        method: 'POST',
        uri: 'https://api-cn.faceplusplus.com/imagepp/v1/mergeface',
        form: {
            api_key: key,
            api_secret: secret,
            template_base64:template,
            merge_base64:avatar,
            merge_rate:50
        }
    };

    let response = await rp(options);
    let responseJson = JSON.parse(response)
    let img = responseJson.result;

    let base64Data = img.replace(/^data:image\/png;base64,/, "");

    console.log(img)

    let path =__dirname+"/result";

    let r = fs.writeFileSync(path+"/"+indexTemplate+"-"+indexAvatar+".png", base64Data, 'base64');

    console.log(r)
})();
