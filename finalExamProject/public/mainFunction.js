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

function submitchat() {
    let message = document.querySelector('#chatinput').value
    console.log(message) //remove before release
    send({type:'message', message: message, user: user, password: password})
    document.querySelector('#chatinput').value = ''
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

