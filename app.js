const express = require('express');
const router = require('./router');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

//创建 express 应用
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/', router);


const privateKey = fs.readFileSync(path.join(process.cwd(), './https/dbkey.xyz.key'), 'utf8');
const certificate = fs.readFileSync(path.join(process.cwd(), './https/dbkey.xyz.crt'), 'utf8');
const credentials = {
    key: privateKey,
    cre: certificate
};

const httpsServer = https.createServer(credentials, app);
const PORT = 18081;
const SSLPORT = 18082;

//使 express 监听 5000 端口号发起的 http 请求
const server = app.listen(PORT, function () {
    const { port } = server.address();
    console.log('HTTP服务启动成功： http://localhost:%s', port)
});

httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS 服务启动成功: https://localhost:%s', SSLPORT)
});



