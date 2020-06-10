 const { env } = require('./env')
 const UPLOAD_PATH = env === 'dev' ? '/Users/dbkey/upload/admin-upload-ebook' : '/root/upload/admin-upload/ebook'
 const UPLOAD_URL = env === 'dev' ? 'http://dbkey.xyz:8089/admin-upload-ebook' : 'https://www.youbaobao.xyz/admin-upload-ebook'

 module.exports = {
   CODE_ERROR: -1,
   CODE_TOKEN_EXPIRED: -2,
   CODE_SUCCESS: 0,
   debug: true,
   PWD_SALT: 'admin_imooc_node',
   PRIVATE_KEY: 'admin_book_node_test_dbkey_xyz',
   JWT_EXPIRED: 60 * 60, //token失效时间,
   UPLOAD_PATH,
   UPLOAD_URL,
   MINE_TYPE_EPUB: 'application/epub+zip'
 };
