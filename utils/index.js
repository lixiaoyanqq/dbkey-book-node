const crypto = require('crypto');
const { PRIVATE_KEY } = require('./constant');
const jwt = require('jsonwebtoken')

function md5(s){
    //注意参数需要为 String 类型，否则会出错
    return crypto.createHash('md5')
        .update(String(s)).digest('hex')
}

function decoded(req){
    let token = req.get('Authorization');
    if (token.indexOf('Bearer') === 0) {
        token = token.replace('Bearer ', '')
    }
    return jwt.verify(token, PRIVATE_KEY)
}

module.exports = {
    md5,
    decoded
}