const DIR_TEMPLATE = `<li><div class="dir-template"><ul>{children}</ul></div></li>`
const FILE_TEMPLATE = `<li><div class="file-template">{children}</div></li>`
const HTML_TEMPLATE = `<html lang="zh"><head><title>{content.title}</title></head><body><div class="dir-template"><ul>{__innerHTML}</ul></div></body></html>`

/**
 * 数据驱动，生成dom节点
 * @param {Array} tree 
 */
function renderEngine(tree) {
  let html = HTML_TEMPLATE
  if(!tree || !tree.length) {
    return html.replace('{__innerHTML}', '空文件夹')
  }
  const innerHTML = render(tree)
  return html.replace('{__innerHTML}', innerHTML)
}

function render(tree) {
  if(!tree || !tree.length) return ''
  let dom = DIR_TEMPLATE
  let children = ''
  tree.forEach(node=> {
    if(node.type === 'FILE') {
      children += FILE_TEMPLATE.replace('{children}', node.name)
    }else if(node.type === 'DIR'){
      children += render(node.children)
    }
  })
  dom = dom.replace('{children}', children)
  return dom
}

module.exports = renderEngine