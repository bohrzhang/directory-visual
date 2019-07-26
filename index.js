const Reader = require('./reader')
const syncLock = require('./lib/syncLock')
const reader = new Reader()

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    chunk = chunk.toString().replace('\n', '')
    if (chunk === 'exit') {
      process.exit()
    } else {
      if (!syncLock.getLocked()) {
        syncLock.lock()
        reader.run(chunk)
      }
    }
  }
})

console.log('启动: 请输入文件名...')