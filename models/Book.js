const { 
    MINE_TYPE_EPUB, 
    UPLOAD_URL,
    UPLOAD_PATH
} = require('../utils/constant')
const fs = require('fs')
const Epub = require('../utils/epub')

//Book对象开发
class Book {
    //构造函数
    //file 表示电子书对象是刚上传的一电子书文件
    //data 表示我们要做更新或者插入电子书数据
    constructor(file, data) {
        if(file){
            this.createBookFromFile(file)
        } else {
            this.createBookFromData(data)
        }
    }

    createBookFromFile(file) {
        const {
            destination,
            filename,
            mimetype = MINE_TYPE_EPUB,
            originalname,
            path
        } = file
        //电子书的文件后缀名
        const suffix = mimetype === MINE_TYPE_EPUB ? '.epub' : ''
        //电子书的原有路径
        const oldBookPath = path
        //电子书新路径
        const bookPath = `${destination}/${filename}${suffix}`
        //电子书的下载URL链接
        const url = `${UPLOAD_URL}/book/${filename}${suffix}`
        //电纸书解压后的文件夹路径
        const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`
        //电子书解压后的文件夹URL
        const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`
        //
        if (!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath, { recursive: true })
        }
        //
        if (fs.existsSync(oldBookPath) && !fs.existsSync(bookPath)) {
            fs.renameSync(oldBookPath, bookPath)
        }

        this.fileName = filename //文件名
        this.path = `/book/${filename}${suffix}` //epub文件相对路径
        this.unzipPath = `/unzip/${filename}` //epub解压后相对路径
        this.filePath = this.path
        this.unzipUrl = unzipUrl //解压后文件夹链接
        this.originalname = originalname //源文件名
        this.url = url //epub文件下载链接
        this.title = '' //电子书的标题或者书名
        this.author = '' //作者
        this.publiser = '' //出版社
        this.contents = [] //目录
        this.cover = '' //封面图片URL
        this.coverPath = '' //封面图片的路径
        this.category = -1 //电子书分类ID
        this.categoryText = '' //分类名称
        this.language = '' //语种
    }
    createBookFromData(data) {
        console.log('data数据', data)
    }

    parse() {
        return new Promise((resolve, reject) =>{
            const bookPath = `${UPLOAD_PATH}${this.filePath}`
            if (!fs.existsSync(bookPath)) {
                reject(new Error('电子书不存在'))
            }
            const epub = new Epub(bookPath)
            epub.on('error', err =>{
                reject(err)
            })
            epub.on('end', err =>{
                if (err) {
                    reject(err) 
                } else {
                    const {
                        language,
                        title,
                        publisher,
                        cover,
                        creator,
                        creatorFileAs
                    } = epub.metadata
                    if(!title){
                        reject(new Error('图书标题为空'))
                    } else {
                        this.title = title
                        this.language = language || 'en'
                        this.author = creator || creatorFileAs || 'unknown'
                        this.publiser = publisher || 'unknown'
                        this.rootFile = epub.rootFile
                        try {
                            this.unzip()
                            const handleGetImage = (err, file, mimeType) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    const suffix = mimeType.split('/')[1]
                                    const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
                                    const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`
    
                                    fs.writeFileSync(coverPath, file, 'binary')
                                    this.coverPath = `/img/${this.fileName}.${suffix}`
                                    this.cover = coverUrl
                                    resolve(this)
                                }
                            }
                            epub.getImage(cover, handleGetImage)
                        } catch (e) {
                            reject(e)
                        }
                        }
                }
            })
            epub.parse()
        })
    }
    unzip(){
        const AdmZip = require('adm-zip')
        const zip = new AdmZip(Book.genPath(this.path))
        zip.extractAllTo(Book.genPath(this.unzipPath), true)
    }

    static genPath(path){
        if (!path.startsWith('/')) {
            path = `/${path}`
        }
        return `${UPLOAD_PATH}${path}`
    }
}

module.exports = Book