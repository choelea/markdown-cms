
'use strict';

// Modules
var fs = require('fs');
var path = require('path');
var get_filepath = require('../functions/get_filepath.js');
var create_meta_info = require('../functions/create_meta_info.js');
const imagemin = require('imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

function route_page_edits (config, raneto) {
  const _compressOption = {
    accurate: true, // 高精度模式
    quality: 'high', // 图像质量:low, medium, high and veryhigh;
    method: 'smallfry', // 网格优化:mpe, ssim, ms-ssim and smallfry;
    min: 70, // 最低质量
    loops: 0, // 循环尝试次数, 默认为6;
    progressive: false, // 基线优化
    subsample: 'default' // 子采样:default, disable;
  }

  /**
   * Get File Path according to URI
   * @param {} uri
   */
  function _getFilePath (uri) {
    var file_category;
    var file_name;

    // Handle category in file path
    var req_file = uri.split('/');
    if (req_file.length > 2) {
      file_category = req_file[1];
      file_name = req_file[2];
    } else {
      file_name = req_file[1];
    }

    // Generate Filepath
    return get_filepath({
      content: raneto.config.content_dir,
      category: file_category,
      filename: file_name
    });
  }
  var route_page_edit = function (req, res, next) {
    let filepath = _getFilePath(req.body.file)
    // No file at that filepath?
    // Add ".md" extension to try again
    if (!fs.existsSync(filepath)) {
      filepath += '.md';
    }

    // Create content including meta information (i.e. title, description, sort)
    function create_content (body) {
      var meta = create_meta_info(body.meta_title, body.meta_description, body.meta_sort);
      return meta + body.content;
    }

    var complete_content = create_content(req.body);

    fs.writeFile(filepath, complete_content, function (error) {
      if (error) {
        return res.json({
          status: 1,
          message: error
        });
      }
      res.json({
        status: 0,
        message: config.lang.api.pageSaved
      });
    });

  };

  const route_page_simplemde = function (req, res, next) {
    let filepath = _getFilePath(req.body.file)
    // No file at that filepath?
    // Add ".md" extension to try again
    if (!fs.existsSync(filepath)) {
      filepath += '.md';
    }
    try {
      fs.writeFileSync(filepath, req.body.content)
      res.json({
        status: 0,
        message: config.lang.api.pageSaved
      });
    } catch (error) {
      return res.json({
        status: 1,
        message: error
      });
    }
  };

  const uploadImage = async (req, res, next) => {
    try {
      const relatedFolder = req.body.imgPath
      let targetFolder = _getFilePath(relatedFolder)
      const file = req.file;
      const destPath = path.join(targetFolder, file.originalname)
      fs.renameSync(file.path, destPath);
      const arrFiles = [destPath];
      await imagemin(arrFiles, targetFolder, {
        use: [
          imageminJpegRecompress(_compressOption)
        ]
      });
      res.json({ url: `${config.base_url}${relatedFolder}/${file.originalname}` });
    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Error Happened!' })
    }
  }

  /**
   * Not used for now. uploadImage can also upload pdf
   */
  const upload =  (req, res, next) => {
    try {
      const relatedFolder = req.body.imgPath
      let targetFolder = _getFilePath(relatedFolder)
      const file = req.file;
      const destPath = path.join(targetFolder, file.originalname)
      fs.renameSync(file.path, destPath);
      res.json({ url: `${config.base_url}${relatedFolder}/${file.originalname}` });
    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Error Happened!' })
    }
  }
  return { route_page_edit, route_page_simplemde, uploadImage, upload }
}

// Exports
module.exports = route_page_edits;
