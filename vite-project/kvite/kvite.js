const Koa = require("koa")
const app = new Koa()

const fs = require("fs")
const path = require('path')

app.use(async ctx => {
  const {url} = ctx.request;
  if (url === "/") {
    // ctx.type = "html"
    ctx.body = fs.readFileSync("./index.html", "utf8")
    // ctx.body = "hahahah"
    console.log(3333)
  } else if (url.endsWith('.js')) {
    const p = path.join(__dirname, url);
    ctx.type = "text/javascript"
    ctx.body = fs.readFileSync(p, 'utf8')
    console.log(p)
  }
})

app.listen(3001, () => {
  console.log('kvite start')
})
