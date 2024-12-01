import { Application, send, Router } from "https://deno.land/x/oak/mod.ts";
import { WebSocketServer } from "https://deno.land/x/websocket/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname TEXT, acount TEXT, password TEXT)");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, user TEXT, nickname TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, privacy BOOLEAN DEFAULT TRUE)");

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
			case 'changeHTML':
				switch (message.to) {
					case 'login':
						goLogin(wsc);
						break;
					case 'register':
						goRegister(wsc);
						break;
					default:
						goLogin(wsc);
						break;
				}
				break;
			case 'addpost':
				addposts(message.title, message.body, message.user, message.privacy, wsc);
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
	if (user.length == 0 || password.length == 0 || nickname.length == 0) {
		console.log('empty input');
		wsc.send(JSON.stringify({ type: 'info', where: 'register', statusinfo: 'empty input' }));
		return;
	}
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
			wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goLogin' }));
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

async function login(user, password, wsc) {
	let sqldata = [];
	try {
		sqldata = await db.query("SELECT password FROM users WHERE acount = ?", [user]);
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
		let posts = await listpost(user);
		wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goMain', posts: posts }));
	}
	else {
		console.log('login failed');
		wsc.send(JSON.stringify({ type: 'info', where: 'login', statusinfo: 'Wrong User or Password' }));
	}
	console.log('login()...end'); //remove before release
}

function goLogin(wsc) {
	console.log('goLogin()...');
	wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goLogin' }));
	console.log('goLogin()...end');
}

function goRegister(wsc) {
	console.log('goRegister()...');
	wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goRegister' }));
	console.log('goRegister()...end');
}

function listpost(user){
	console.log('listpost()...');
	let posts = [];
	let sqldata = [];
	try{
		sqldata = db.query("SELECT id, title, body, nickname, timestamp FROM posts WHERE user = ? OR privacy = FALSE", [user]);
	}
	catch(e){
		console.log('Error:', e);
		return posts;
	}
	for (const [id, title, body, nickname, timestamp] of sqldata) {
		posts.push({ id, title, body, nickname, timestamp });
	}
	console.log('listpost:posts=', posts);
	console.log('listpost()...end');
	return posts;
}

async function addposts(title, body, user, privacy, wsc){
	console.log('addposts()...');
	let nickname;
	console.log(title, body, user);
	if (title.length == 0 || body.length == 0) {
		wsc.send(JSON.stringify({ type: 'info', where: 'main', statusinfo: 'add post reject' }));
		console.log("empty input");
		return;
	}
	try{
		nickname = await db.query("SELECT nickname FROM users WHERE acount = ?", [user]);
	}
	catch(e){
		console.log('Error:', e)
	}
	try{
		db.query("INSERT INTO posts (title, body, user, nickname, privacy) VALUES (?, ?, ?, ?, ?)", [title, body, user, nickname[0].toString(), privacy]);
		console.log('addposts success');
		let posts = await listpost(user);
		wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goMain', posts: posts }));
	}
	catch(e){
		console.log('Error:', e);
		wsc.send(JSON.stringify({ type: 'info', where: 'main', statusinfo: 'add post error' }));
	}
	console.log('addposts()...end');
}

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });
