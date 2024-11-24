var socket = new WebSocket("ws://" + window.location.hostname + ":8080")
var domParser = new DOMParser()

// 參考 -- https://davidwalsh.name/convert-html-stings-dom-nodes
function html2node(html) {
    let doc = domParser.parseFromString(html, 'text/html')
    return doc.body.firstChild
}

var sendcounter = 0

function send(msg){
    if (socket.readyState == 1){
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

function submitform() {
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

socket.onopen = function (event) { console.log('socket:onopen()...') }
socket.onerror = function (event) { console.log('socket:onerror()...') }
socket.onclose = function (event) { console.log('socket:onclose()...') }
socket.onmessage = function (event) {
    var msg = JSON.parse(event.data)
    console.log('socket:onmessage()...',msg)
    switch (msg.type){
        case 'info':
            switch (msg.where){
                case 'register':
                    switch (msg.statusinfo){
                        case 'success':
                            console.log('register success')
                            break
                        default:
                            document.querySelector('#errormsg').innerHTML = msg.statusinfo
                            break
                    }
            }
    }
}