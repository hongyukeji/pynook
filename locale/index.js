// import en from './en.json'
// import zhHans from './zh-Hans.json'
// import zhHant from './zh-Hant.json'
// import ja from './ja.json'
// export default {
// 	'zh-Hans': zhHans,
// 	'zh-Hant': zhHant,
// 	en,
// 	ja,
// }

/**
 * @description 自动import导入所有 JSON 文件
 */

const modules = {}
const context = import.meta.globEager('./*.json')

Object.entries(context).forEach(([key, value]) => {
	const moduleName = key.replace(/^\.\/(.*)\.\w+$/, '$1')
	modules[moduleName] = value.default
})

export default modules