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

export function list(user,posts) {
  let list = []
  let a = false;
  for (let post of posts) {
    if (!a){
      a = true;
    }
    else {
    list.push(`
    <li>
      <h2>${ post.title }</h2>
      <h3>create at ${post.created_at.toLocaleString()}</h3>
      <p><a href="/${user}/post/${post.id}">Read post</a></p>
    </li>
    `)
    }
  }
  let content = `
  <h1>Posts</h1>
  <p>You have <strong>${posts.length - 1}</strong> posts!</p>
  <p><a href="/${user}/post/new">Create a Post</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  `
  return layout('Posts', content)
}

export function newPost(user) {
  let ctime = new Date();
  return layout('New Post', `
  <h1>New Post</h1>
  <p>Create a new post.</p>
  <p>post as ${user}</p>
  <form action="/${user}/post" method="post">
    <p><input type="text" placeholder="Title" name="title"></p>
    <p><textarea placeholder="Contents" name="body"></textarea></p>
    <p><input type="submit" value="Create"></p>
    <p>${ctime.toLocaleString()}</p>
  `)
}

export function show(user,post) {
  return layout(post.title, `
    <h1>${post.title}</h1>
    <p>View as ${user}</p>
    <pre>${post.body}</pre>
    <p>create at ${post.created_at.toLocaleString()}</p>
  `)
}

export function userSelect(users) {
  let list = []
  for (let user of users) {
    list.push(`
    <li>
      <h1><a href="/${user}/login">${user}</a></h1>
    </li>
    `)
  }
  let content = `
  <h1>Users</h1>
  <ul id="users">
    ${list.join('\n')}
  </ul>
  `
  return layout('Select User', content)
}

export function userLogin(user) {
  return layout('Login', `
  <h1>Login</h1>
  <p>login as ${user}</p>
  <form action="/${user}/check" method="post">
    <p><input type="password" placeholder="password" name="password"></p>
    <p><input type="submit" value="Login"></p>
  `)
}

