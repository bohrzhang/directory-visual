const fs = require('fs')
const path = require('path')
const fileWalker = require('./lib/file_walker')
const renderEngine = require('./lib/render_engine')

const noop = ()=> {}

// 抽象为状态机
// 根据状态自动寻址执行下一操作
const STATE = {
  READY: 'READY', // 初始状态
  FIND: 'FIND', // 查找路径
  WALKER: 'WALKER', // 文件夹遍历
  RENDER: 'RENDER', // 渲染html
  SUCCESS: 'SUCCESS', // 渲染成功
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
    this.name = ''

    Object.keys(STATE).forEach(state=> {
      const fn = this[state.toLocaleLowerCase()] || noop
      this[state.toLocaleLowerCase()] = fn.bind(this)
    })
  }
  
  // 就绪态，判断寻址方式
  ready(inputPath = '') {
    const prefix = inputPath[0]
    const pathType = prefix === '/' ? PATH_TYPE.ABSOLUTE : PATH_TYPE.RELATIVE
    return {
      state: STATE.FIND,
      inputPath,
      pathType
    }
  }

  // 目录树渲染成dom树
  render() {
    const html = renderEngine(this.files)
    const name = this.abPath.split('/').pop()+ '_' + Date.now() + '.html'
    fs.writeFileSync(path.resolve(__dirname, './report', name) ,html)
  }

  // 查询找文件
  async find(params = {}) {
    const {inputPath, pathType} = params
    switch(pathType) {
      case PATH_TYPE.ABSOLUTE: 
        this.abPath = inputPath
        break
      case PATH_TYPE.RELATIVE:
        this.abPath = path.resolve(__dirname, inputPath)
    }
    if(!fs.existsSync(this.abPath)) {
      throw {message: '路径不存在！'}
    }
    if(!fs.statSync(this.abPath).isDirectory()) {
      throw {message: '该文件不是文件夹！'}
    }
    return {...params, state: STATE.WALKER}
  }

  // 遍历文件，生成目录树
  async walker() {
    try {
    const files = fileWalker(this.abPath)
    this.files = files
    return {state: STATE.RENDER}
    }catch(e) {
      throw {message: `文件遍历出错: ${e.message}`}
    }
  }

  // 操作执行成功，退出
  success() {
    console.log('执行成功!')
    process.exit()
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
    console.log(`执行 ${state}阶段...`)
    const result = await fn(params)
    const {state: _state, ...others} = result
    this.state = _state
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