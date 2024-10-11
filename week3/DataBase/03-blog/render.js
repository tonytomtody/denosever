export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        padding: 80px;
        font: 16px Helvetica, Arial;
      }
  
      h1 {
        font-size: 2em;
      }
  
      h2 {
        font-size: 1.2em;
      }
  
      #posts {
        margin: 0;
        padding: 0;
      }
  
      #posts li {
        margin: 40px 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        list-style: none;
      }
  
      #posts li:last-child {
        border-bottom: none;
      }
  
      textarea {
        width: 500px;
        height: 300px;
      }
  
      input[type=text],
      textarea {
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=text] {
        width: 500px;
      }

      input[type=password],
      textarea {
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=password] {
        width: 500px;
      }
    </style>
  </head>
  <body>
    <section id="content">
      ${content}
    </section>
  </body>
  </html>
  `
}

export function list(posts,user) {
  let list = []
  for (let post of posts) {
    list.push(`
    <li>
      <h2>${post.title }</h2>
      <p>by ${post.user}</p>
      <p>Create at ${post.timestamp.toLocaleString()}</p>
      <p><a href="/${user}/post/${post.id}/">Read post</a></p>
    </li>
    `)
  }
  let content = `
  <h1>Posts</h1>
  <h2>Login as ${user}</h2>
  <p><a href="/">Log out</a></p>
  <p>You have <strong>${posts.length}</strong> posts!</p>
  <p><a href="/${user}/post/new/">Create a Post</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  `
  return layout('Posts', content)
}

export function userSelect(users) {
  let list = []
  for (let user of users) {
    list.push(`
    <li>
      <h2><a href="/${user.user}/login/">${user.user}</a></h2>
    </li>
    `)
  }
  let content = `
  <h1>Users Select</h1>
  <p><a href="/signup/">Register a new user</a></p>
  <ul id="users">
    ${list.join('\n')}
  </ul>
  `
  return layout('Users Select', content)
}

export function userLogin(user) {
  return layout('Log in', `
    <h1>Log in as ${user}</h1>
    <p>Welcome Back ${user}!.</p>
    <form action="check/" method="post">
      <p><input type="password" placeholder="Password" name="body"></p>
      <p><input type="submit" value="Log in"></p>
    </form>
    `)
}

export function signUp() {
  return layout('Sign Up', `
    <h1>Sign Up</h1>
    <p>Register a new User.</p>
    <form action="/signup/confirm/" method="post">
      <p><input type="text" placeholder="Username" name="user"></p>
      <p><input type="password" placeholder="Password" name="body"></p>
      <p><input type="submit" value="Register"></p>
    </form>
    `)
}

export function newPost(user) {
  return layout('New Post', `
  <h1>New Post</h1>
  <p>Create a new post.</p>
  <form action="/${user}/post/" method="post">
    <p><input type="text" placeholder="Title" name="title"></p>
    <p><textarea placeholder="Contents" name="body"></textarea></p>
    <p><input type="checkbox" name="privacy" checked>Privacy</p>
    <p><input type="submit" value="Create"></p>
  </form>
  `)
}

export function show(post,user) {
  return layout(post.title, `
    <h1>${post.title}</h1>
    <p>Created by ${post.user}</p>
    <p>Create at ${post.timestamp.toLocaleString()}</p>
    <p>${post.body}</p>
    <p>View as ${user}</p>
  `)
}
