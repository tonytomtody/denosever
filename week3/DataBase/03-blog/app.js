import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, user TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, privacy INTEGER DEFAULT 1)");
//db.query(`INSERT INTO posts (title, body, user) VALUES ('config', 'admin', 'default')`);
//db.query(`INSERT INTO posts (title, body, user, privacy) VALUES ('Hi', 'Hi', 'admin', 0)`);

const router = new Router();

router.get('/', redirectTo)
  .get('/:user/login/', userLogin)
  .post('/:user/login/check/', check)
  .get('/userselect/', userSelect)
  .get('/signup/', signUp)
  .post('/signup/confirm/', register)
  .get('/:user/list/', list)
  .get('/:user/post/new/', add)
  .get('/:user/post/:id/', show)
  .post('/:user/post/', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql) {
  let list = []
  for (const [id, title, body , user , timestamp] of db.query(sql)) {
    list.push({id, title, body , user , timestamp})
  }
  return list
}

async function userLogin(ctx) {
  const user = ctx.params.user;
  ctx.response.body = await render.userLogin(user);
}

function queryUser() {
  let list = []
  for (const [user] of db.query(`SELECT user FROM posts WHERE title == 'config'`)) {
    list.push({user})
  }
  return list
}

async function signUp(ctx) {
  ctx.response.body = await render.signUp();
}

async function redirectTo(ctx) {
  ctx.response.redirect('/userselect/');
}

async function list(ctx) {
  const user = ctx.params.user;
  let posts = query(`SELECT id, title, body, user, timestamp FROM posts WHERE (user = '${user}' OR privacy = 0) AND title != 'config'`)
  console.log('list:posts=', posts)
  ctx.response.body = await render.list(posts,user);
}

async function userSelect(ctx) {
  let users = queryUser()
  console.log('list:users=', users)
  ctx.response.body = await render.userSelect(users);
}

async function add(ctx) {
  const user = ctx.params.user;
  ctx.response.body = await render.newPost(user);
}

async function show(ctx) {
  const user = ctx.params.user;
  const pid = ctx.params.id;
  let posts = query(`SELECT id, title, body, user, timestamp FROM posts WHERE id=${pid}`)
  let post = posts[0]
  console.log('show:post=', post)
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post,user);
}

async function create(ctx) {
  const user = ctx.params.user;
  const body = ctx.request.body;
  if (body.type() === "form") {
    const pairs = await body.form()
    const post = {}
    for (const [key, value] of pairs) {
      post[key] = value
    }
    console.log('create:post=', post)
    let pravicy = 1
    if (post.privacy) {
      pravicy = 1
    }
    else {
      pravicy = 0
    }
    db.query("INSERT INTO posts (title, body, user, privacy) VALUES (?, ?, ?, ?)", [post.title, post.body, user , pravicy]);
    ctx.response.redirect(`/${user}/list/`);
  }
}

async function check(ctx) {
  const user = ctx.params.user;
  const body = ctx.request.body;
  if (body.type() === "form") {
    const pairs = await body.form()
    const post = {}
    for (const [key, value] of pairs) {
      post[key] = value
    }
    console.log('create:post=', post)
    let list = []
    for (const [body] of db.query(`SELECT body FROM posts WHERE user = '${user}' AND title == 'config'`)) {
      list.push({body})
    }
    console.log('create:post=', list[0])
    if (post.body == list[0].body) {
      ctx.response.redirect(`/${user}/list/`);
    }
    else {
      ctx.response.body = "alert('Invalid Password!')";
      ctx.response.redirect('/userselect/');
    }
  }
}

async function register(ctx) { 
  const body = ctx.request.body;
  if (body.type() === "form") {
    const pairs = await body.form()
    const post = {}
    for (const [key, value] of pairs) {
      post [key] = value
    }
    console.log('create:user=', post)
    db.query("INSERT INTO posts (title, body, user) VALUES (?, ?, ?)", ["config",post.body, post.user]);
    ctx.response.redirect('/userselect/');
  }
}

let port = parseInt(Deno.args[0])
console.log(`Server run at http://127.0.0.1:${port}`)
await app.listen({ port });
