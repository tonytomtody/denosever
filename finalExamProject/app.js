import { Application, send, Router } from "https://deno.land/x/oak/mod.ts";
import { WebSocketServer } from "https://deno.land/x/websocket/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname TEXT, acount TEXT, password TEXT)");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, user TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, privacy BOOLEAN DEFAULT TRUE)");

//const router = new Router();
//router.get("/", redirectTo);
//router.get("/login/", userLogin);
//router.post("/login/post/", );

/*function redirectTo(ctx) {
    ctx.response.redirect("/login/");
}

function userLogin(ctx) {
    ctx.response.body = "index.html";
}*/

// html serve
const app = new Application();

app.use(async (ctx) => {
  console.log('path=', ctx.request.url.pathname)
	try {
		await send(ctx, ctx.request.url.pathname, {
			root: `${Deno.cwd()}/public/`,
			index: "index.html",
		});	
	} catch (e) { console.log('Error:', e); }
});

// websocket serve
const wss = new WebSocketServer(8080);

wss.on("connection", function (wsc) {
	wsc.on("message", function (message) {
		console.log(message);
		//ws.send(message);
		// broadcast message
		wss.clients.forEach(function each(client) {
			if (!client.isClosed) {
				//client.send(message);
			}
		});
	});
});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });
