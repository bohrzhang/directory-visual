const Reader = require('./reader')
const reader = new Reader()

const inputPath = process.argv[2]

if(!inputPath) {
  console.error('请输入文件路径!')
  return
}

reader.run(inputPath)