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
    simpleGit(config.content_dir)
      .pull((err, update) => {
        if (err) {
          console.log(err.message)
          res.json({ success: false, msg: err.message })
        } else {
          res.json({ success: true })
        }
      });
  })

  return router
}
