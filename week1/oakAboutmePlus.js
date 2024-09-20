import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  console.log('url=', ctx.request.url)
  let pathname = ctx.request.url.pathname
  if (pathname == '/name') {
    ctx.response.body = 'Tony'
  }
  if (pathname == '/age'){
    ctx.response.body = '3 years old'
  }
  if (pathname == '/gender'){
    ctx.response.body = '正德'
  }
  else {
    ctx.response.body = '<html><body><ol><a href = "http://127.0.0.1:8000/name">name</a></ol></body></html>'
}
  // ctx.response.body = 'Not Found!'
});


console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 })
