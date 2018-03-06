/**
 * This is to handle the post request coming from github repo
 */
const schedule = require('node-schedule');
const simpleGit = require('simple-git')

/**
 * This is handler webhooks post request
 * @param {*} config
 */
module.exports = function run (config) {
  if (process.env.NODE_APP_INSTANCE === '0') {
    console.log('schedule a job to commit and push docs')
    schedule.scheduleJob(config.cron_git_push, function () {
      simpleGit(config.content_dir)
        .add('./*')
        .commit('Commit by raneto!')
        .push(['-u', 'origin', 'master'], (error) => {
          if (error) {
            console.error(error)
          } else {
            console.log('Push successfully')
          }
        });
    });
  }
}
