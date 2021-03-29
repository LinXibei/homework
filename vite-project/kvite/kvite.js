const Koa = require("koa")
const app = new Koa()

const fs = require("fs")
const path = require('path')
const compilerSfc = require("@vue/compiler-sfc")
const compilerDom = require("@vue/compiler-dom")

app.use(async ctx => {
  const {url, query} = ctx.request;
  if (url === "/") {
    ctx.type = "html"
    const p = path.join(__dirname, './index.html')
    const content = fs.readFileSync(p, "utf8").replace('<script type="module" src="/src/main.js"></script>', `
      <script type="module" src="/src/main.js"></script>
      <script>window.process = {env: {NODE_ENV: 'div'}}</script>
    `)

    ctx.body = content
  } else if (url.endsWith('.js')) {
    const p = path.join(__dirname, url);
    ctx.type = "text/javascript"
    ctx.body = rewriteImport(fs.readFileSync(p, 'utf8'))
  } else if (url.startsWith("/@modules/")) {
    // 获取@modules后面部分，模块名称
    const moduleName = url.replace("/@modules/", "")
    const prefix = path.join(__dirname, "../node_modules", moduleName)
    // 加载文件的地址
    const module = require(prefix + "/package.json").module
    const filePath = path.join(prefix, module)
    const ret = fs.readFileSync(filePath, 'utf8')
    ctx.type = "text/javascript"
    ctx.body = rewriteImport(ret)
  } else if (url.indexOf(".vue") > -1) {
    // 解析sfc
    // 处理内部的script
    // 读取vue文件内容
    const p = path.join(__dirname, url.split("?")[0])
    // compilerSfc解析SFC，获得一个ast
    const ret = compilerSfc.parse(fs.readFileSync(p, 'utf8'))
    // 没有query.type处理sfc
    if (!query.type) {
      // 获取脚本内容
      const scriptContent = ret.descriptor.script.content
      // 转换默认导出的配置变量
      const script = scriptContent.replace('export default ', 'const __script = ')
      ctx.type = "text/javascript"
      ctx.body = `
        ${rewriteImport(script)}
        import { render as __render } from '${url}?type=template'
        __script.render = __render
        export default __script
      `
    } else if (query.type === 'template') {
      const tpl = ret.descriptor.template.content
      const code = compilerDom.compile(tpl, { mode: "module" }).code
      ctx.type = "text/javascript"
      ctx.body = rewriteImport(code)
    }
  }
})

function rewriteImport(content) {
  return content.replace(/ from ['"](.*)['"]/g, function(s0, s1) {
    if (s1.startsWith('./') || s1.startsWith('/') || s1.startsWith('../')) {
      return s0;
    } else {
      return ` from '/@modules/${s1}'`;
    }
  })
}

app.listen(3001, () => {
  console.log('kvite start')
})
