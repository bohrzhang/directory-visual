const { DIR_TEMPLATE, FILE_TEMPLATE, HTML_TEMPLATE, style} = require('./template')

/**
 * 渲染引擎，数据驱动
 * 对传入虚拟树做解析，生成真是dom节点
 * @param {Array} tree 
 */
function renderEngine(tree) {
  let html = HTML_TEMPLATE
  if(!tree || !tree.length) {
    return html.replace('{__innerHTML}', '空文件夹')
  }
  const innerHTML = render(tree)
  return {
    html: html.replace('{__innerHTML}', innerHTML),
    style
  }
}

function render(tree) {
  if(!tree || !tree.length) return ''
  let dom = ''
  tree.forEach(node => {
    let children = ''
    if(node.type === 'FILE') {
      children += FILE_TEMPLATE.replace('{name}', node.name)
    } else if (node.type === 'DIR') {
      children += DIR_TEMPLATE.replace('{name}', node.name).replace('{children}', render(node.children))
    }
    dom += children
  })
  return dom
}

module.exports = renderEngine