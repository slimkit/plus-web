/**
 * 将搜索结果的树结构展平
 * @param {Object} tree 地区搜索树
 * @param {number} level 展平级别 如 level = 2 搜索成都市时返回 “四川省 成都市”
 */
export const parseSearchTree = (tree = {}, level = 2) => {
  let result = tree.name
  let p = tree.parent
  while (p && level > 1) {
    result = `${p.name} ${result}`
    p = p.parent
    level--
  }
  return result
}
