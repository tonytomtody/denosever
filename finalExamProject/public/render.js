export function goLogin() {
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

export function goRegister() {
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

export function goReset() {
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

export function goMain(posts) {
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