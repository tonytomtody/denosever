import { DB } from "https://deno.land/x/sqlite/mod.ts";
var socket = new WebSocket("ws://"+window.location.hostname+":8080")
var form = document.querySelector('form')
var user = document.querySelector('#username')
var password  = document.querySelector('#password')
var errormsg = document.querySelector('errormsg')
var domParser = new DOMParser()
const db = new DB("blog.db");

// 參考 -- https://davidwalsh.name/convert-html-stings-dom-nodes
function html2node(html) {
let doc = domParser.parseFromString(html, 'text/html')
return doc.body.firstChild
}



form.onsubmit = function() {
    console.log('form.onsubmit()...')
    for (const [nickname, account, password] of db.query(`SELECT nickname, account, password FROM users WHERE account == '${user.value}'`)) {
        list.push({nickname, account, password})
    }
    if (list[0].password == password.value) {
        console.log('login success')
        window.location.href = '/main.html'
    }
    else {
        console.log('login fail')
        errormsg.innerHTML = "Login fail"
    }
    return false
}

socket.onopen = function (event) { console.log('socket:onopen()...') }
socket.onerror = function (event) { console.log('socket:onerror()...') }
socket.onclose = function (event) { console.log('socket:onclose()...') }
socket.onmessage = function(event){
console.log(event.data);
var line = JSON.parse(event.data);
messages.appendChild(html2node('<li>'+line+'</li>'))
window.scrollTo(0, document.body.scrollHeight)
      }