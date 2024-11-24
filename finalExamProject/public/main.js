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
    password = document.querySelector('#password').value
    console.log(user, ":", password) //remove before release
    send({type:'login', user: user, password: password})
    document.querySelector('#password').value = ''
    document.querySelector('#username').value = ''
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
                case 'main':
                    switch (msg.statusinfo){
                        case 'success':
                            console.log('login success')
                            break
                        default:
                            console.log(msg.statusinfo);
                            break
                    }
            }
    }
}