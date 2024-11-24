import { Application, send, Router } from "https://deno.land/x/oak/mod.ts";
import { WebSocketServer } from "https://deno.land/x/websocket/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { sleep } from "groq-sdk/core.mjs";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname TEXT, acount TEXT, password TEXT)");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, user TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, privacy BOOLEAN DEFAULT TRUE)");

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
		message = JSON.parse(message);
		console.log(message);
		//ws.send(message);
		// broadcast message
		switch (message.type) {
			case 'login':
				login(message.user, message.password, wsc);
				break;
			case 'register':
				register(message.user, message.password, message.nickname, wsc);
				break;
			default:
				console.log('request not found');
				break;
		}
	});
});

function register(user, password, nickname, wsc) {
	console.log('register()...');
	var sqldata = [];
	try {
		sqldata = db.query("SELECT * FROM users WHERE acount = ?", [user]);
		console.log(sqldata);
	}
	catch (e) {
		console.log('Error:', e);
		wsc.send(JSON.stringify({ type: 'info', where: 'register', statusinfo: 'internal error' }));
	}
	if (sqldata.length == 0) {
		try {
			db.query("INSERT INTO users (nickname, acount, password) VALUES (?, ?, ?)", [nickname, user, password]);
			console.log('register success');
			wsc.send(JSON.stringify({ type: 'info', where: 'register', statusinfo: 'success' }));
		}
		catch (e) {
			console.log('Error:', e);
			wsc.send(JSON.stringify({ type: 'info', where: 'register', statusinfo: 'internal error' }));
		}
	}
	else {
		console.log('User already exist');
		wsc.send(JSON.stringify({ type: 'info', where: 'register', statusinfo: 'User already exist' }));
	}
	console.log('register()...end');
}

function login(user, password, wsc) {
	var sqldata = [];
	try {
		sqldata = db.query("SELECT password FROM users WHERE acount = ?", [user]);
		console.log(sqldata);
	}
	catch (e) {
		console.log('Error:', e);
		wsc.send(JSON.stringify({ type: 'info', where: 'login', statusinfo: 'internal error' }));
	}
	console.log('login()...', sqldata.length); //remove before release
	if (sqldata.length == 0) {
		console.log('data not found');
		wsc.send(JSON.stringify({ type: 'info', where: 'login', statusinfo: 'Wrong User or Password' }));
	}
	else if (sqldata[0] == password) {
		console.log('login success');
		wsc.send(JSON.stringify({ type: 'info', where: 'login', statusinfo: 'success' }));
	}
	else {
		console.log('login failed');
		wsc.send(JSON.stringify({ type: 'info', where: 'login', statusinfo: 'Wrong User or Password' }));
	}
	console.log('login()...end'); //remove before release
}


console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });
