const fs = require('fs')
const path = require('path')
const fileWalker = require('./lib/file_walker')
const renderEngine = require('./lib/render_engine')

// 抽象为状态机
// 根据状态自动寻址执行下一操作
const STATE = {
  READY: 'READY', // 初始状态
  FIND: 'FIND', // 查找路径
  WALKER: 'WALKER', // 文件夹遍历
  RENDER: 'RENDER', // 渲染html
  SUCCESS: 'SUCCESS', // 渲染成功
  ERROR: 'ERROR' // 出错
}
const PATH_TYPE = {
  ABSOLUTE: 'ABSOLUTE', // 绝对路径
  RELATIVE: 'RELATIVE' //相对路径
}

class Reader {

  constructor() {
    this.state = STATE.READY
    this.abPath = ''
    this.files = []
  }
  
  ready(inputPath = '') {
    const prefix = inputPath[0]
    const pathType = prefix === '/' ? PATH_TYPE.ABSOLUTE : PATH_TYPE.RELATIVE
    return {
      state: STATE.FIND
      inputPath,
      pathType
    }
  }

  async find({inputPath, pathType}) {
    switch(pathType) {
      case PATH_TYPE.ABSOLUTE: 
        this.abPath = inputPath
        break
      case PATH_TYPE.RELATIVE:
        this.abPath = path.resolve(__dirname, inputPath)
    }
    if(!fs.existsSync(this.abPath)) {
      return {state: STATE.ERROR, message: '路径不存在！'}
    }
    if(!fs.statSync(this.abPath).isDirectory()) {
      return {state: STATE.ERROR, message: '该文件不是文件夹！'}
    }
    return {state: STATE.WALKER}
  }

  async walker() {
    const files = fileWalker(this.abPath)
    console.log(files)
  }

  // 错误处理
  error(e) {
    const {message} = e
    console.error(message)
    process.exit()
  }

  // 状态调度器
  async schedule(params) {
    const {state} = this
    const fn = this[state.toLocaleLowerCase()]
    if(!fn || typeof(fn) !== 'function') {
      throw {message: `${state}: 不存在状态处理函数!`}
    }
    console.log(`执行${state}阶段...`)
    const result = await fn(params)
    const {state, ...others} = result
    this.state = state
    return await this.schedule(others)
  }

  // 程序执行入口
  async run(inputPath) {
    try {
    this.state = STATE.READY
    await this.schedule(inputPath)
    }catch(e) {
      this.error(e)
    }
  }

}

module.exports = Reader