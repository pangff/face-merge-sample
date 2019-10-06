'use strict';
const Router = require('koa-router');
const router = new Router();
const {formatHttpError} = require("./common.js")
const rp = require("request-promise");
const key = "xsR4xP84dY9uPG9ADk5FcXcrRCpOrbgK";
const secret = "-W18CxqaxvVW6g6s3dle8J1sTsVcBQh_";
router.get('/', ctx => {
    ctx.body = {
        time: new Date(),
        status: true,
        version: '1.0',
        env: process.env.NODE_ENV,
    };
});


router.post('/make/photo', async (ctx)=>{
    const { requestId } = ctx;
    try {
        let {template,avatar} = ctx.request.body;

        let data = await doMake(template,avatar);
        ctx.contentType="text/plain"
        ctx.body = data;
    } catch (error) {
        formatHttpError(ctx, error, requestId);
    }
});


async function doMake(template,avatar){

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
    console.log(img)
    return img;
}

module.exports = router;
