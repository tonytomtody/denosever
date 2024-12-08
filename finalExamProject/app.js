import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { WebSocketServer } from "https://deno.land/x/websocket/mod.ts";
import * as changeHTML from './changeHTML.js';
import * as mainFunction from './mainFunction.js';

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
		switch (message.type) {
			case 'login':
				mainFunction.login(message.user, message.password, wsc);
				break;
			case 'register':
				mainFunction.register(message.user, message.password, message.nickname, wsc);
				break;
			case 'reset':
				mainFunction.reset(message.user, message.password, message.nickname, wsc);
				break;
			case 'changeHTML':
				switch (message.to) {
					case 'login':
						changeHTML.goLogin(wsc);
						break;
					case 'register':
						changeHTML.goRegister(wsc);
						break;
					case 'reset':
						changeHTML.goReset(wsc);
						break;
					case 'posts':
						changeHTML.goPosts(message.user, message.password, wsc);
						break;
					case 'chat':
						changeHTML.goChat(message.user, message.password, wsc);
						break;
					default:
						changeHTML.goLogin(wsc);
						break;
				}
				break;
			case 'addpost':
				mainFunction.addposts(message.title, message.body, message.user, message.privacy, message.password, wsc);
				break;
			case 'message':
				mainFunction.addchat(message.message, message.user, message.password, wsc, wss);
				break;
			default:
				console.log('request not found');
				break;
		}
	});
});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });