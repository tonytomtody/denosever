var socket = new WebSocket("ws://" + window.location.hostname + ":8080")
var form = document.querySelector('form')
var user = document.querySelector('#username')
var password = document.querySelector('#password')
var errormsg = document.querySelector('errormsg')
var domParser = new DOMParser()

// 參考 -- https://davidwalsh.name/convert-html-stings-dom-nodes
function html2node(html) {
    let doc = domParser.parseFromString(html, 'text/html')
    return doc.body.firstChild
}

function submitform() {
    console.log('submitform()...')
    user = document.querySelector('#username').value
    password = document.querySelector('#password').value
    console.log(user, ":", password)
}

socket.onopen = function (event) { console.log('socket:onopen()...') }
socket.onerror = function (event) { console.log('socket:onerror()...') }
socket.onclose = function (event) { console.log('socket:onclose()...') }
socket.onmessage = function (event) {
    console.log(event.data);
    var line = JSON.parse(event.data);
    messages.appendChild(html2node('<li>' + line + '</li>'))
    window.scrollTo(0, document.body.scrollHeight)
}