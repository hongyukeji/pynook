/**
 * @description 自动import导入所有 api 模块
 */

const modules = {}
const context = import.meta.globEager('./*.js')

Object.entries(context).forEach(([key, value]) => {
  const moduleName = key.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = value.default
})

export default modules
