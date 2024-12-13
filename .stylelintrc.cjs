module.exports = {
  // 继承一系列规则集合
  extends: [
    // standard 规则集合
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    // 样式属性顺序规则
    'stylelint-config-recess-order',
    // 接入 Prettier 规则
    'stylelint-prettier/recommended'
  ],
}
