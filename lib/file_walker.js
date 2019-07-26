const fs = require('fs')
const path = require('path')

/**
 * 递归遍历，生成目录树
 * @param {String} _path 文件绝对路径
 * @returns {Array} tree 目录生成树 
 */
function fileWalker(_path) {
  const fileTree = []
  const dirents = fs.readdirSync(_path, {withFileTypes: true})
  for(let dirent of dirents) {
    const profile = {name: dirent.name}
    if(dirent.isDirectory()) {
      const subPath = path.resolve(_path, dirent.name)
      profile.type = 'DIR'
      profile.children = fileWalker(subPath)
    }else {
      profile.type = 'FILE'
    }
    fileTree.push(profile)
  }
  return fileTree
}

module.exports = fileWalker