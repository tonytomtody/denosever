var socket = new WebSocket("ws://" + window.location.hostname + ":8080")
var domParser = new DOMParser()
var user, password, nvb, sendcounter = 0, ab, mb

// 參考 -- https://davidwalsh.name/convert-html-stings-dom-nodes
function html2node(html) {
    let doc = domParser.parseFromString(html, 'text/html')
    return doc.body.firstChild
}

socket.onopen = function (event) {
    console.log('socket:onopen()...')
    setTimeout(requestLogin(), 1000)
}
socket.onerror = function (event) { console.log('socket:onerror()...') }
socket.onclose = function (event) { console.log('socket:onclose()...') }
socket.onmessage = function (event) {
    var msg = JSON.parse(event.data)
    console.log('socket:onmessage()...', msg)
    switch (msg.type) {
        case 'info':
            switch (msg.where) {
                case 'login':
                    switch (msg.statusinfo) {
                        default:
                            document.querySelector('#errormsg').innerHTML = msg.statusinfo
                            break
                    }
                    break;
                case 'posts':
                    switch (msg.statusinfo) {
                        case 'success':
                            console.log('login success')
                            break
                        default:
                            console.log(msg.statusinfo);
                            alert(msg.statusinfo);
                            break
                    }
                    break;
                case 'register':
                    switch (msg.statusinfo) {
                        case 'success':
                            console.log('register success')
                            document.querySelector('#errormsg').innerHTML = 'Register Success'
                            break
                        default:
                            document.querySelector('#errormsg').innerHTML = msg.statusinfo
                            break
                    }
                    break;
                case 'reset':
                    switch (msg.statusinfo) {
                        case 'success':
                            console.log('reset success')
                            document.querySelector('#errormsg').innerHTML = 'Reset Success'
                            break
                        default:
                            document.querySelector('#errormsg').innerHTML = msg.statusinfo
                            break
                    }
                    break;
                case 'chat':
                    switch (msg.statusinfo) {
                        case 'success':
                            console.log('chat success')
                            addChat(msg.message,'我');
                            break
                        case 'new message':
                            console.log('new message')
                            addchat(msg.message,msg.nickname);
                            break
                        default:
                            console.log(msg.statusinfo);
                            alert(msg.statusinfo);
                            break
                    }
                    break;
                case 'unknown':
                    switch (msg.statusinfo) {
                        case 'goLogin':
                            console.log(msg.statusinfo)
                            navigationoff();
                            goLogin()
                            ab = false
                            mb = false
                            break
                        case 'goRegister':
                            console.log(msg.statusinfo)
                            navigationoff()
                            goRegister()
                            ab = false
                            mb = false
                            break
                        case 'goPosts':
                            console.log(msg.statusinfo)
                            navigationbar();
                            goPosts(msg.posts);
                            postsButton()
                            mb = false
                            break
                        case 'goReset':
                            console.log(msg.statusinfo)
                            navigationoff()
                            goReset()
                            ab = false
                            mb = false
                            break
                        case 'goChat':
                            console.log(msg.statusinfo)
                            navigationbar()
                            goChat()
                            messageButton()
                            ab = false
                            break
                        default:
                            console.log(msg.statusinfo);
                            break
                    }
                    break;
            }
    }
}