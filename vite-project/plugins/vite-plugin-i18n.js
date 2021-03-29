export default {
  // 将load进来的代码块进一步加工处理
  transform(code, id) {
    if (/vue&type=i18n/.test(id)) {
      return `export default comp=> {
        comp.i18n = ${code}
      }
      `
    }
    return null
  }
  // 将i18n信息写入组件配置
}