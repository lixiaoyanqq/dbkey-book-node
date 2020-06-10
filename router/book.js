const express = require('express')
const multer = require('multer')
const { UPLOAD_PATH } = require('../utils/constant')
const Result = require('../models/Result')
const Book = require('../models/Book')
const boom = require('boom')

const router = express.Router()

router.post(
    '/upload',
    multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),
    function(req, res, next){
        if(!req.file || req.file.length === 0) {
            new Result('上传电子书失败').file(res)
        } else {
            const book = new Book(req.file)
            console.log('解压后电子书对象', book)
            book.parse()
                .then(book => {
                    new Result('上传电子书成功').success(res)
                })
                .catch(err => {
                    next(boom.badImplementation(err))
                })
            // new Result('上传电子书成功').success(res)
        }
})

module.exports = router