import { checkpassword , listpost} from "./mainFunction.js";

export function goLogin(wsc) {
	console.log('goLogin()...');
	wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goLogin' }));
	console.log('goLogin()...end');
}

export function goRegister(wsc) {
	console.log('goRegister()...');
	wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goRegister' }));
	console.log('goRegister()...end');
}

export function goReset(wsc) {
	console.log('goReset()...');
	wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goReset' }));
	console.log('goReset()...end');
}

export async function goPosts(user, password, wsc){
	console.log('goPosts()...');
	if (!await checkpassword(user, password)) {
		wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goLogin' }));
		console.log("check failed");
		return;
	}
	else{
		let posts = listpost(user);
		wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goPosts', posts: posts }));
	}
	console.log('goPosts()...end');
}

export async function goChat(user, password, wsc){
	console.log('goChat()...');
	if (!await checkpassword(user, password)) {
		wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goLogin' }));
		console.log("check failed");
		return;
	}
	else{
		wsc.send(JSON.stringify({ type: 'info', where: 'unknown', statusinfo: 'goChat' }));
	}
	console.log('goChat()...end');
}