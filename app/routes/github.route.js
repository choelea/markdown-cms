/**
 * This is to handle the post request coming from github repo
 */
const express = require('express')
const router = express.Router()
const simpleGit = require('simple-git')
const crypto = require('crypto')

/**
 * This is handler webhooks post request
 * @param {*} config
 */
module.exports = function openApi (config) {
  router.post('/webhooks/post-handler', (req, res, next) => {
    // console.log(req.body)
    const signFromHeader = req.get('X-Hub-Signature');
    // console.log(signFromHeader)
    // console.log('-------------------------------------------')
    const signHex = 'sha1=' + crypto.createHmac('sha1', config.github_secret).update(req.body).digest('hex');
    // console.log(signHex)
    if (signFromHeader === signHex) {
      simpleGit(config.content_dir)
        .pull((err, update) => {
          if (err) {
            console.log(err.message)
            res.json({ success: false, msg: err.message })
          } else {
            res.json({ success: true })
          }
        });
    } else {
      next(new Error('Invalid post request; only request from github with the right signature will be handled'))
    }
  })

  return router
}
