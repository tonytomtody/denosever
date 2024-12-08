function requestLogin() {
    send({ type: 'changeHTML', where: 'unknown', to: 'login' })
}

function requestRegister() {
    send({ type: 'changeHTML', where: 'unknown', to: 'register' })
}

function requestReset() {
    send({ type: 'changeHTML', where: 'unknown', to: 'reset' })
}

function requestPosts() {
    send({ type: 'changeHTML', where: 'unknown', to: 'posts', user: user, password: password })
}

function requestChat() {
    send({ type: 'changeHTML', where: 'unknown', to: 'chat', user: user, password: password })
}