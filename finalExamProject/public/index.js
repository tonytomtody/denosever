var socket = new WebSocket("ws://" + window.location.hostname + ":8080")
var domParser = new DOMParser()
var user, password

// 參考 -- https://davidwalsh.name/convert-html-stings-dom-nodes
function html2node(html) {
    let doc = domParser.parseFromString(html, 'text/html')
    return doc.body.firstChild
}

var sendcounter = 0

function send(msg) {
    if (socket.readyState == 1) {
        sendcounter++
        console.log(`send()...${sendcounter} times Success`)
        socket.send(JSON.stringify(msg))
        sendcounter = 0
    }
    else if (sendcounter < 5) {
        console.log(`send()...failed retry ${5 - sendcounter} times left`)
        sendcounter++
        setTimeout(send(msg), 1000) //need fix
    }
}

function submitformlogin() {
    sendcounter = 0
    console.log('submitform()...')
    user = document.querySelector('#username').value
    password = document.querySelector('#password').value
    console.log(user, ":", password) //remove before release
    send({ type: 'login', user: user, password: password })
    document.querySelector('#password').value = ''
    document.querySelector('#username').value = ''
}

function submitformregister() {
    sendcounter = 0
    console.log('submitform()...') 
    user = document.querySelector('#username').value
    nickname = document.querySelector('#nickname').value
    password = document.querySelector('#password').value
    passwordagain = document.querySelector('#password2').value
    if (password != passwordagain){
        document.querySelector('#errormsg').innerHTML = 'Password not match'
        return
    }
    console.log(user, ":", password, ':', nickname) //remove before release
    send({type:'register', user: user, password: password, nickname: nickname})
    document.querySelector('#password').value = ''
    document.querySelector('#username').value = ''
    document.querySelector('#nickname').value = ''
    document.querySelector('#password2').value = ''
}

function submitformreset() {
    sendcounter = 0
    console.log('submitform()...') 
    user = document.querySelector('#username').value
    nickname = document.querySelector('#nickname').value
    password = document.querySelector('#password').value
    passwordagain = document.querySelector('#password2').value
    if (password != passwordagain){
        document.querySelector('#errormsg').innerHTML = 'Password not match'
        return
    }
    console.log(user, ":", password, ':', nickname) //remove before release
    send({type:'reset', user: user, password: password, nickname: nickname})
    document.querySelector('#password').value = ''
    document.querySelector('#username').value = ''
    document.querySelector('#nickname').value = ''
    document.querySelector('#password2').value = ''
}

function submitpost() {
    let title = document.querySelector('#posttitle').value
    let content = document.querySelector('#postcontent').value
    let privacy = document.querySelector('#privacy').checked
    console.log(title, ":", content, ":", privacy) //remove before release
    send({type:'addpost', title: title, body: content, user: user, privacy: privacy, password: password})
    closepost()
}

function addposts() {
    document.querySelector('.addpost').style.display = 'block'
}

function closepost() {
    document.querySelector('#posttitle').value = ''
    document.querySelector('#postcontent').value = ''
    document.querySelector('#privacy').checked = true
    document.querySelector('.addpost').style.display = 'none'
}

function requestLogin() {
    send({ type: 'changeHTML', where: 'unknown', to: 'login' })
}

function requestRegister() {
    send({ type: 'changeHTML', where: 'unknown', to: 'register' })
}

function requestReset() {
    send({ type: 'changeHTML', where: 'unknown', to: 'reset' })
}

function requestMain() {
    send({ type: 'changeHTML', where: 'unknown', to: 'main', user: user, password: password })
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
                case 'main':
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
                case 'unknown':
                    switch (msg.statusinfo) {
                        case 'goLogin':
                            console.log(msg.statusinfo)
                            goLogin()
                            break
                        case 'goRegister':
                            console.log(msg.statusinfo)
                            goRegister()
                            break
                        case 'goMain':
                            console.log(msg.statusinfo)
                            goMain(msg.posts);
                            break
                        case 'goReset':
                            console.log(msg.statusinfo)
                            goReset()
                            break
                        default:
                            console.log(msg.statusinfo);
                            break
                    }
                    break;
            }
    }
}

function goLogin() {
    document.querySelector('#content').innerHTML = `
    <link rel="stylesheet" href="index.css">
    <div class = "login">
        <h1>Blog登入</h1>
        <p1 id="errormsg"></p1>
        <form onsubmit="return false;">
        <input type="text" id="username" placeholder="輸入帳號" maxlength="25" autocomplete="off">
        <input type="password" id="password" placeholder="輸入密碼" autocomplete="off" maxlength="25">
        <button id='loginbutton' onclick="submitformlogin()">登入</button>
        </form>
        <hr>
        <div class="register">
            <p>還沒有帳號？</p>
            <a onclick="requestRegister()">註冊</a>
        </div>
        <div class="register">
            <p>忘記密碼？</p>
            <a onclick="requestReset()">重設</a>
        </div>
    </div>
    `
}

function goRegister() {
    document.querySelector('#content').innerHTML = `
    <link rel="stylesheet" href="index.css">
    <div class = "login">
        <h1>Blog註冊</h1>
        <p1 id="errormsg"></p1>
        <form onsubmit="return false;">
        <input type="text" id="username" placeholder="輸入帳號" maxlength="25" autocomplete="off">
        <input type="text" id="nickname" placeholder="輸入暱稱" maxlength="25" autocomplete="off">
        <input type="password" id="password" placeholder="輸入密碼" maxlength="25" autocomplete="off">
        <input type="password" id="password2" placeholder="再次輸入密碼" maxlength="25" autocomplete="off">
        <button id="loginbutton" onclick="submitformregister()">註冊</button>
        </form>
        <hr>
        <div class="register">
            <p>已經有帳號？</p>
            <a onclick="requestLogin()">登入</a>
        </div>
        <div class="register">
            <p>忘記密碼？</p>
            <a onclick="requestReset()">重設</a>
        </div>
    </div>
    `
}

function goReset() {
    document.querySelector('#content').innerHTML = `
    <link rel="stylesheet" href="index.css">
    <div class = "login">
        <h1>Blog密碼重設</h1>
        <p1 id="errormsg"></p1>
        <form onsubmit="return false;">
        <input type="text" id="username" placeholder="輸入帳號">
        <input type="text" id="nickname" placeholder="輸入暱稱">
        <input type="password" id="password" placeholder="輸入密碼">
        <input type="password" id="password2" placeholder="再次輸入密碼">
        <button id="loginbutton" onclick="submitformreset()">重設</button>
        </form>
        <hr>
        <div class="register">
            <p>已經有帳號？</p>
            <a onclick="requestLogin()">登入</a>
        </div>
        <div class="register">
            <p>還沒有帳號？</p>
            <a onclick="requestRegister()">註冊</a>
        </div>
        </div>
    `
}

function goMain(posts) {
    let list = [];
    for (let post of posts) {
        console.log(post.body)
        let body = post.body.split('\n')
        let p = '';
        for (part of body){
            if (part.length > 0){
                p += `<p>${part}</p>`
            }
            else {
                p += `<br>`
            }
        }
        list.push(`
        <div id = "post" class = "posts">
            <h3>${post.title}</h3>
            ${p}
            <p class="usertime">${post.nickname} 在${post.timestamp}寫到</p>
        </div>
        `)
    }
    document.querySelector('#content').innerHTML = `
    <link rel="stylesheet" href="main.css">
    <h1 id = "titleh1">Blog</h1>
    <ul class = "navigationbar">
        <li><button onclick="requestMain()">貼文</button></li>
        <li><button onclick="">聊天</button></li>
        <li><button onclick="requestLogin()" class="userinfo">登出</button></li>
        <li><button onclick="" id = "username" class="userinfo">${user}</button></li>
    </ul>
    ${list.join('\n')}
    <div onclick="addposts()" class="add">
        <p>+</p>
    </div>
    <div class="addpost">
        <form onsubmit="return false;">
            <p>新增貼文</p>
            <div>
                <input type="checkbox" id="privacy" checked>
                <label>私人</label>    
            </div>
            <input type="text" id="posttitle" placeholder="輸入標題" maxlength="25" autocomplete="off">
            <textarea id="postcontent" placeholder="輸入內容" maxlength="250" autocomplete="off"></textarea>
            <div>
                <button id="cancelbutton" onclick="closepost()">取消</button>
                <button id="submitbutton" onclick="submitpost()">發布</button>
            </div>
        </form>
    </div>
    `
}
