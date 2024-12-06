import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname TEXT, acount TEXT, password TEXT)");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, user TEXT, nickname TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, privacy BOOLEAN DEFAULT TRUE)");

export function register(user, password, nickname, wsc) {
	console.log('register()...');
	var sqldata = [];
	if (user.length >= 26 || password.length >= 26 || nickname.length >= 26) {
		console.log('input too long');
		wsc.send(JSON.stringify({ type: 'info', where: 'register', statusinfo: 'input too long' }));
		return;
	}
	else if (user.length == 0 || password.length == 0 || nickname.length == 0) {
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

export async function login(user, password, wsc) {
	let sqldata = [];
	if (user.length >= 26 || password.length >= 26) {
		console.log('input too long');
		wsc.send(JSON.stringify({ type: 'info', where: 'login', statusinfo: 'input too long' }));
		return;
	}
	else if (user.length == 0 || password.length == 0){
		console.log('empty input');
		wsc.send(JSON.stringify({ type: 'info', where: 'login', statusinfo: 'empty input' }));
		return;
	}
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
		wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goPosts', posts: posts }));
	}
	else {
		console.log('login failed');
		wsc.send(JSON.stringify({ type: 'info', where: 'login', statusinfo: 'Wrong User or Password' }));
	}
	console.log('login()...end'); //remove before release
}

export function reset(user, password, nickname, wsc) {
	console.log('reset()...');
	var sqldata = [];
	if (user.length >= 26 || password.length >= 26 || nickname.length >= 26) {
		console.log('input too long');
		wsc.send(JSON.stringify({ type: 'info', where: 'reset', statusinfo: 'input too long' }));
		return;
	}
	else if (user.length == 0 || password.length == 0 || nickname.length == 0) {
		console.log('empty input');
		wsc.send(JSON.stringify({ type: 'info', where: 'reset', statusinfo: 'empty input' }));
		return;
	}
	try {
		sqldata = db.query("SELECT * FROM users WHERE acount = ? AND nickname = ?", [user,nickname]);
		console.log(sqldata);
	}
	catch (e) {
		console.log('Error:', e);
		wsc.send(JSON.stringify({ type: 'info', where: 'reset', statusinfo: 'internal error' }));
	}
	if (sqldata.length == 0) {
		wsc.send(JSON.stringify({ type: 'info', where: 'reset', statusinfo: 'User not found' }));
		return;
	}
	else {
		console.log('User found');
		try {
			db.query("UPDATE users SET password = ? WHERE acount = ?", [password, user]);
			console.log('reset success');
			wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goLogin' }));
			wsc.send(JSON.stringify({ type: 'info', where: 'reset', statusinfo: 'success'}));
		}
		catch (e) {
			console.log('Error:', e);
			wsc.send(JSON.stringify({ type: 'info', where: 'reset', statusinfo: 'internal error' }));
		}
	}
	console.log('reset()...end');
}

export function listpost(user){
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

export async function addposts(title, body, user, privacy, password, wsc){
	console.log('addposts()...');
	if (!checkpassword(user, password)) {
		wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goLogin' }));
		console.log("wrong password");
		return;
	}
	if (title.length >= 26 || body.length >= 260) {
		wsc.send(JSON.stringify({ type: 'info', where: 'main', statusinfo: 'add post reject: input too long' }));
		console.log("input too long");
		return;
	}
	else if (title.length == 0 || body.length == 0) {
		wsc.send(JSON.stringify({ type: 'info', where: 'main', statusinfo: 'add post reject: empty input' }));
		console.log("empty input");
		return;
	}
	else if (body.split('\n').length > 50) {
		wsc.send(JSON.stringify({ type: 'info', where: 'main', statusinfo: 'add post reject: too many lines' }));
		console.log("too many lines");
		return;
	}
	let nickname;
	console.log(title, body, user);
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
		wsc.send(JSON.stringify({ type: 'info', where: 'main', statusinfo: 'add post success' }));
	}
	catch(e){
		console.log('Error:', e);
		wsc.send(JSON.stringify({ type: 'info', where: 'main', statusinfo: 'add post error' }));
	}
	console.log('addposts()...end');
}

export function checkpassword(user, password){
	console.log('checkpassword()...');
	let sqldata = [];
	if (user.length >= 26 || password.length >= 26) {
		console.log('invalid input');
		return false;
	}
	else if (user.length == 0 || password.length == 0) {
		console.log('empty input');
		return false;
	}
	try{
		sqldata = db.query("SELECT id FROM users WHERE acount = ? AND password = ?", [user, password]);
		console.log(sqldata);
		console.log(sqldata.length);
	}
	catch(e){
		console.log('Error:', e);
		return false;
	}
	if(sqldata.length == 0){
		console.log('checkpassword()...end');
		return false;
	}
	else{
		console.log('checkpassword()...end');
		return true;
	}
}