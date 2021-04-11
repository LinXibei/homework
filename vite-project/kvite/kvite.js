const Koa = require("koa")
const app = new Koa()
const fs = require("fs")
const path = require("path")
const compilerSfc = require("@vue/compiler-sfc")
const compilerDom = require("@vue/compiler-dom")
app.use(async (ctx) => {
  const { url, query } = ctx.request;
  if (url === "/") {
      ctx.type = "text/html"
      const content = fs.readFileSync("./index.html", "utf8").replace('<script type="module" src="/src/main.js"></script>',`<script>
      window.process = {env: {NODE_ENV: "dev"}}
  </script>
  <script type="module" src="/src/main.js"></script>`)
      ctx.body = content
  } else if (url.endsWith(".js")) {
      const p = path.join(__dirname, url)
      ctx.type = "text/javascript"
      const file = rewriteImport(fs.readFileSync(p, "utf8"))
      ctx.body = file
      console.log(file)
  } else if (url.startsWith("/@modules/")) {
      const moduleName = url.replace("/@modules/", "")
      const prefix = path.join(__dirname, "../node_modules", moduleName)
      const module = require(prefix + '/package.json').module
      const filePath = path.join(prefix, module)
      const ret = fs.readFileSync(filePath, "utf8")
      ctx.type = "text/javascript"
      // const file = rewriteImport(fs.readFileSync(p, "utf8"))
      ctx.body = rewriteImport(ret)
  } else if (url.indexOf('.vue') > -1) {
    // 读取vue文件内容
    const p = path.join(__dirname, url.split("?")[0])
    // compilerSfc解析SFC，获取一个ast
    const ret = compilerSfc.parse(fs.readFileSync(p, 'utf8'))
    // 没有query.type 说明是SFC
    if (!query.type) {
      // 处理内如script
      // 获取脚本内容
      const scriptContent = ret.descriptor.script.content
      // 转换默认导出配置对象为变量
      const script = scriptContent.replace("export default ", 'const __script = ')
      ctx.type = "text/javascript"
      ctx.body = `
        ${rewriteImport(script)}
        import {render as __render} from '${url}?type=template'
        __script.render = __render
        export default __script
      `
      // console.log(ret)
    } else if (query.type === "template") {
      const tpl = ret.descriptor.template.content
      const render = compilerDom.compile(tpl, { mode: "module"}).code
      ctx.type = "text/javascript"
      ctx.body = rewriteImport(render)
    }
  }
})

// 重写导入，变成相对地址
function rewriteImport(content) {
  return content.replace(/ from ['"](.*)['"]/g, function(s0, s1) {
      // s0是匹配字符串，s1是分组内容
      // 看看是不是相对地址
      // 是相对地址=>直接加载，不是相对地址变成相对地址
      if(s1.startsWith('./') || s1.startsWith("../") || s1.startsWith("/")) {
          return s0
      } else {
          return ` from '/@modules/${s1}'`
      }
  })
}

app.listen(3001, () => {
  console.log("kvite start!!")
})