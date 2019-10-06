'use strict';

const path = require('path');
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const favicon = require('koa-favicon');
const serve = require('koa-static');
const koaBody = require('koa-body');
const routes = require('./lib/routes');
const onerror = require('koa-onerror');

onerror(app);

app.use(cors({
    origin(ctx) {
        return ctx.accept.headers.origin;
    },
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
}));

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 50 * 1024 * 1024, // 设置上传文件大小最大限制，暂定 50M，默认 2M
    },
}));
app.use(bodyParser());

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(serve(path.join(__dirname, 'public')));

app.use(routes.routes(), routes.allowedMethods());

app.on('error', function(err) {
    console.error('server error', err.stack);
});

process.on('uncaughtException', err => {
    console.error('app uncaughtException', err.stack);
});
process.on('unhandledRejection', (reason, p) => {
    console.error('app Unhandled Rejection at:', p, 'reason:', reason);
});

module.exports = app;
