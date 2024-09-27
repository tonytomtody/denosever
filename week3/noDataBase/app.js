import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'

const posts = {
  defualtuser:[{id:0, title:'config',body:'1234',created_at:false},
               {id:1, title:'aaa', body:'aaaaa', created_at:new Date()},
               {id:2, title:'bbb', body:'bbbbb', created_at:new Date()}],
  user1:[{id:0,title:'config',body:'1234',create_at:false},{id:1, title:'ccc', body:'ccccc', created_at:new Date()}],
};

const router = new Router();

router.get('/', redirectTo)
  .get('/:user/login', userLogin)
  .get('/userselect/', userSelect)
  .get('/:user/', list)
  .get('/:user/post/new', add)
  .get('/:user/post/:id', show)
  .post('/:user/post', create)
  .post('/:user/check', check);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function userLogin(ctx) {
  const user = ctx.params.user;
  ctx.response.body = await render.userLogin(user);
}

async function redirectTo(ctx) {
  ctx.response.redirect('/userselect/');
}

async function userSelect(ctx) {
  ctx.response.body = await render.userSelect(Object.keys(posts));
}

async function list(ctx) {
  if (posts[ctx.params.user][0].created_at == true) {
    const user = ctx.params.user;
    ctx.response.body = await render.list(user,posts[user]);
  }
  else {
    ctx.response.redirect('/userselect/');
  }
}

async function add(ctx) {
  const user = ctx.params.user;
  ctx.response.body = await render.newPost(user);
}

async function show(ctx) {
  const user = ctx.params.user;
  const id = ctx.params.id;
  const post = posts[user][id];
  console.log('post=', post);
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(user,post);
}

async function create(ctx) {
  const user = ctx.params.user;
  const body = ctx.request.body
  if (body.type() === "form") {
    const pairs = await body.form() // body.value
    const post = {}
    for (const [key, value] of pairs) {
      post[key] = value
    }
    console.log('post=', post)
    const id = posts[user].push(post) - 1;
    post.created_at = new Date();
    post.id = id;
    ctx.response.redirect(`/${user}/`);
  }
}

async function check(ctx) {
  const user = ctx.params.user;
  const body1 = ctx.request.body;
  const post = posts[user][0];
  if (body1.type() === "form") {
    const pairs = await body1.form()
    for (const [key, value] of pairs) {
      if (value == post.body) {
        post.created_at = true;
        ctx.response.redirect(`/${user}/`);
      }
      else {
        ctx.response.body = 'password error';
      }
    }
    }
    
}

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });
