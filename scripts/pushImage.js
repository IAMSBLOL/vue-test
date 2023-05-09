const shell = require('shelljs')
const utils = require('./utils')
const chalk = require('chalk')
// const https = require('https')

const fs = require('fs')
const gitHEAD = fs.readFileSync('.git/HEAD', 'utf-8').trim() // ref: refs/heads/develop
const ref = gitHEAD.split(': ')[1] // refs/heads/develop
const develop = gitHEAD.split('/')[2] // 环境：develop
const gitVersion = fs.readFileSync('.git/' + ref, 'utf-8').trim() // git版本号，例如：6ceb0ab5059d01fd444cf4e78467cc2dd1184a66
const gitCommitVersion = develop + '-' + gitVersion // 例如dev环境: "develop: 6ceb0ab5059d01fd444cf4e78467cc2dd1184a66"
// const gitCommitVersion = 'latest'
const args = require('minimist')(process.argv.slice(2))

const _tag = args['--tag'] || args.tag || new Date().valueOf()

// const _describetion = args['--d'] || args.d || `${new Date().valueOf()} 更新`

if (/[\u4e00-\u9fa5]/.test(_tag)) {
  console.log(chalk.yellow('命令参数:'))
  console.log(_tag)
  console.log(chalk.redBright('中文优雅、博大精深，但是docker并不支持'))
  process.exit(1)
}

const tag = _tag || gitCommitVersion

const build = shell.exec(`docker build -t market_web_06:${tag} -f ./docker/Dockerfile .`)
if (build.code) {
  utils.error('npm run build failed……\n意外总比惊喜来得快~这就是生活吧\n我猜是你的小鲸鱼跪了')
} else {
  shell.exec(`docker tag market_web_06:${tag} registry.gddi.com/fe/market_web_06:${tag}`)
  const rst = shell.exec(`docker push registry.gddi.com/fe/market_web_06:${tag}`)

  if (rst.code) {
    utils.error('镜像推送失败……')
  } else {
    utils.success(`
    -----------------------------------------------------------------------------------------------------------
    |    恭喜您推送镜像成功，具体地址请查看，https://registry.gddi.com/harbor/projects/39/repositories/market_web_06      |
    -----------------------------------------------------------------------------------------------------------
    `)
  }
}
