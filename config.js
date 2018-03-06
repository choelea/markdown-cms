
'use strict';

// Modules
var path = require('path');
var fs = require('fs')
var config = {

  // Your site title (format: page_title - site_title)
  site_title: '旧书 Tech. Blog',

  // The base URL of your site (can use %base_url% in Markdown files)
  base_url: 'http://localhost:3000',

  // Used for the "Get in touch" page footer link
  support_email: '',

  // Footer Text / Copyright
  copyright: 'Copyright &copy; ' + new Date().getFullYear() + ' - <a href="http://www.joe-shu.com">Powered by Joe</a>',

  // Excerpt length (used in search)
  excerpt_length: 400,

  // The meta value by which to sort pages (value should be an integer)
  // If this option is blank pages will be sorted alphabetically
  page_sort_meta: 'sort',

  // Should categories be sorted numerically (true) or alphabetically (false)
  // If true category folders need to contain a "sort" file with an integer value
  category_sort: true,

  // Controls behavior of home page if meta ShowOnHome is not present. If set to true
  // all categories or files that do not specify ShowOnHome meta property will be shown
  showOnHome: true,

  // Which Theme to Use?
  theme_dir: path.join(__dirname, 'themes'),
  // theme_name: 'default',
  theme_name: 'new',

  // Specify the path of your content folder where all your '.md' files are located
  // Fix: Needs trailing slash for now!
  // Fix: Cannot be an absolute path
  content_dir : path.join(__dirname, '../', 'tech-docs'),
  github_secret: 'keep should be overwritten by config on disk', // github repository webhoooks secret
  // Where is the public directory or document root?
  public_dir: path.join(__dirname, 'themes', 'default', 'public'),

  // The base URL of your images folder,
  // Relative to config.public_dir
  // (can use %image_url% in Markdown files)
  image_url: '/images',

  // Add your analytics tracking code (including script tags)
  analytics: '',

  // Set to true to enable the web editor
  allow_editing: true,

  // Set to true to enable HTTP Basic Authentication
  authentication: true,

  // If editing is enabled, set this to true to only authenticate for editing, not for viewing
  authentication_for_edit: true,

  // If authentication is enabled, set this to true to enable authentication for reading too
  authentication_for_read: false,

  secret: 'someCoolSecretRightHere',

  credentials: [
    {
      username: 'admin',
      password: 'admin'
    },
    {
      username: 'admin2',
      password: 'password'
    }
  ],

  locale: 'zh',
  // Sets the format for datetime's
  datetime_format: 'Do MMM YYYY',

  // Edit Home Page title, description, etc.
  home_meta: {
    // title       : 'Custom Home Title',
    // description : 'Custom Home Description'
  },

  // variables: [
  //   {
  //     name: 'test_variable',
  //     content: 'test variable'
  //   },
  //   {
  //     name: 'test_variable_2',
  //     content: 'test variable 2'
  //   }
  // ]

  table_of_contents: true,
  tempFolder: 'upload/',
  cron_git_push: '59 16 * * *'
};
config.public_dir = path.join(__dirname, 'themes', config.theme_name, 'public');

/**
 * Load credential config from disk
*/
function loadConfig () {
  const sdkConfigPath = '/data/config/raneto.config.json'

  // 检查文件是否存在
  try {
    const stats = fs.statSync(sdkConfigPath)

    if (!stats.isFile()) {
      console.log(`${sdkConfigPath} 不存在，将使用 config.js 中的配置`)
      return {}
    }
  } catch (e) {
    // console.log(e)
    console.log('cannot find the give file:' + sdkConfigPath)
    return {}
  }
  // 返回配置信息
  try {
    const content = fs.readFileSync(sdkConfigPath, 'utf8')
    return JSON.parse(content)
  } catch (e) {
    // 如果配置读取错误或者 JSON 解析错误，则输出空配置项
    console.log(`${sdkConfigPath} 解析错误，不是 JSON 字符串`)
    return {}
  }
}
// Exports
module.exports = Object.assign(config, loadConfig());
