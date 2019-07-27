
/**
 * 模板引擎，一般外部传入
 * 扩展解析规则
 */
const folderSvg = '<svg viewBox="64 64 896 896" focusable="false" class="" data-icon="folder-open" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 0 0-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z"></path></svg>'
const fileSvg = '<svg viewBox="64 64 896 896" focusable="false" class="" data-icon="file" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"></path></svg>'
const DIR_TEMPLATE = `<li><span class="icon">${folderSvg}</span><span>{name}</span><ul class="dir-template">{children}</ul></li>`
const FILE_TEMPLATE = `<li><span class="icon">${fileSvg}</span><span class="file-template">{name}</span></li>`
const HTML_TEMPLATE = `<html lang="zh"><head>{__style}<title>目录树</title></head><body><div class="container"><ul class="dir-template">{__innerHTML}</ul></div></body></html>`
const style = `.container {font-size:14px;}ul{list-style: none;}li{padding: 4px 0;list-style: none;}.icon{margin-right: 5px; vertical-align: middle;}`

module.exports = {
  DIR_TEMPLATE,
  FILE_TEMPLATE,
  HTML_TEMPLATE,
  style
}