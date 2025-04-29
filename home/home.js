import { create_modal } from "../public/modals/global_modal.js";
import {search_modal} from "../public/modals/search_modal.js"

const jwt = localStorage.getItem("jwt");

if (!jwt) {
  create_modal("Do you need to stay logged in to do this.");
  window.location.href = "../login/login.html";
}

let limit = 10;
let offset = 0;
let is_loading = false;
let search_mode = "";

async function load_posts() {
  if (is_loading) return;
  is_loading = true;

  try {
    const response = await fetch(
      `http://localhost/Back_end_twoitter/post/for_you?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (Array.isArray(data.jwt) && data.jwt.length > 0) {
      render_posts(data.jwt);
      offset += limit;
    } else {
      window.removeEventListener("scroll", scroll_event_handler);
    }
  } catch (error) {
    create_modal("Requisition error: " + error);
  }

  is_loading = false;
}

function render_posts(posts) {
  let post_container = document.getElementById("post_container");

  posts.forEach((post) => {
    let div = document.createElement("div");
    div.classList.add("post");

    let user_name = post.name;
    let user_id = post.user_id;

    let profile_picture = post.profile_picture_url
      ? `http://localhost/Back_end_twoitter/public/uploads/profile_pictures/${post.profile_picture_url}`
      : null;
    let image_url = post.image_post
      ? `http://localhost/Back_end_twoitter/public/uploads/image_posts/${post.image_post}`
      : null;

    div.innerHTML = `
      <div class="div_profile">
        <i><img class="profile_icon" src="${profile_picture}" alt="user${user_id}"></i>
        <p id='User${user_id}'>${user_name}</p>
      </div>
      ${
        image_url
          ? `<img src="${image_url}" alt="Post Image" style="max-width: 100%; height: auto;">`
          : ""
      }
      <div>
        <i class="like-icon" id="like_id_${post.post_id}" data-liked="false">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-transparent stroke-current" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 
              4.5 2.09C13.09 3.81 14.76 3 
              16.5 3 19.58 3 22 5.42 22 
              8.5c0 3.78-3.4 6.86-8.55 
              11.54L12 21.35z"/>
          </svg>
        </i>
        <i class="comment_icon" id="comment_icon_${post.post_id}">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12 12m4.125 0a.375.375 0 1 1-.75 0 
              .375.375 0 0 1 .75 0Zm0 0h-.375M21 
              12c0 4.556-4.03 8.25-9 8.25a9.764 
              9.764 0 0 1-2.555-.337A5.972 
              5.972 0 0 1 5.41 20.97a5.969 
              5.969 0 0 1-.474-.065 4.48 
              4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 
              16.178 3 14.189 3 12c0-4.556 
              4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
        </i>
        <i class="share_icon" id="share_icon_${post.post_id}">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186 
              c.18.324.283.696.283 1.093s-.103.77-.283 
              1.093m0-2.186 9.566-5.314m-9.566 
              7.5 9.566 5.314m0 0a2.25 2.25 
              0 1 0 3.935 2.186 2.25 2.25 
              0 0 0-3.935-2.186Zm0-12.814a2.25 
              2.25 0 1 0 3.933-2.185 2.25 
              2.25 0 0 0-3.933 2.185Z" />
          </svg>
        </i>
      </div>
      <p>${post.text_post || "Sem conteúdo"}</p>
    `;

    post_container.appendChild(div);

    const like = div.querySelector(`#like_id_${post.post_id}`);
    const comment = div.querySelector(".comment_icon");
    const share = div.querySelector(".share_icon");
    const profile = div.querySelector(".profile_icon");

    like.addEventListener("click", async () => {
      const user_id = localStorage.getItem("user_id");
      let user_post_liked_id = post.user_id;
      const post_id = post.post_id;
      let date = new Date();
      let day = String(date.getDate()).padStart(2, "0");
      let month = String(date.getMonth() + 1).padStart(2, "0");
      let year = date.getFullYear();
      let liked_at = `${year}-${month}-${day}`;

      const user_data = { post_id, liked_at, user_post_liked_id };

      try {
        const datas = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(user_data),
        };
        const response = await fetch(
          "http://localhost/Back_end_twoitter/post/register_like",
          datas
        );
        const data = await response.json();
        if (data.success && data.data === "Like registered successfully!") {
          like.classList.add("liked");
        }
        if (data.success && data.data === "like deleted successfuly!") {
          like.classList.remove("liked");
        }
      } catch (error) {
        create_modal("Requisition error: " + error);
      }
    });

    comment.addEventListener("click", () => {
      console.log("comentários");
    });

    share.addEventListener("click", () => {
      console.log("compartilhei");
    });

    profile.addEventListener("click", () => {
      console.log("clicou no perfil");
    });
  });
}


//search users
async function fetch_users_by_search(search) {
  if (is_loading) return;
  is_loading = true;


  try {
    const user_data = { name: search };
    const datas = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(user_data),
    };

    const response = await fetch(
      `http://localhost/Back_end_twoitter/users/fetch?limit=${limit}&offset=${offset}`,
      datas
    );
    const data = await response.json();

    if (data.message && offset == 0) {
      search_result = await search_modal("We couldn't find any users with that name. You can search for:", ["POSTS","TAGS"]);
      console.log(result)
      is_loading = false;
      return;
    }

    if (data.jwt ) {
      let post_container = document.getElementById("post_container");
      let filter = document.getElementById("filter");
      if (offset === 0) post_container.innerHTML = "";
      post_container.style.display = "block";
      filter.style.display = "flex";
      render_users(data.jwt);
      offset += limit;
    }
  } catch (error) {
    create_modal("Requisition error: " + error);
  }

  is_loading = false;
}

function render_users(users) {
  let post_container = document.getElementById("post_container");

  users.forEach((user) => {
    let user_div = document.createElement("div");
    user_div.classList.add("users");

    let user_name = user.name;
    let user_id = user.user_id;
    let profile_picture = user.profile_picture_url
      ? `http://localhost/Back_end_twoitter/public/uploads/profile_pictures/${user.profile_picture_url}`
      : null;

    user_div.innerHTML = `
      <div class="div_profile">
        <i><img class="profile_icon" src="${profile_picture}" alt="user${user_id}"></i>
        <p id='User${user_id}'>${user_name}</p>
      </div>
    `;

    post_container.appendChild(user_div);

    const user_img = user_div.querySelector(".profile_icon");
    user_img.addEventListener("click", () => {
      console.log("vai pro perfil");
    });
  });
}

function call_fetch_user() {
  const btn = document.getElementById("search_button");
  btn.addEventListener("click", () => {
    const search = document.getElementById("input-search").value;
    search_mode = "users";
    limit = 10;
    offset = 0;
    fetch_users_by_search(search);
  });
}


//search posts

async function fetch_posts_by_search(search) {
  if (is_loading) return;
  is_loading = true;

  try {
    const post_data = { search: search };
    const datas = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(post_data),
    };

    const response = await fetch(
      `http://localhost/Back_end_twoitter/post/fetch?limit=${limit}&offset=${offset}`,
      datas
    );
    const data = await response.json();

    if (data.message && offset == 0) {
      search_result = await search_modal("We couldn't find any post with that text. You can search for:", ["USERS","TAGS"]);
      is_loading = false;
      return;
    }

    if (data.jwt) {
      let post_container = document.getElementById("post_container");
      let filter = document.getElementById("filter");
     
      if (offset === 0) post_container.innerHTML = "";
      post_container.style.display = "block";
      filter.style.display = "flex";
      render_posts_search(data.jwt);
      offset += limit;
    }
  } catch (error) {
    create_modal("Requisition error: " + error);
  }

  is_loading = false;
}

function render_posts_search(posts) {
  let post_container = document.getElementById("post_container");
  
  posts.forEach((post) => {
    let div = document.createElement("div");
    div.classList.add("post");

    

    let user_name = post.name;
    let user_id = post.user_id;

    let profile_picture = post.profile_picture_url
      ? `http://localhost/Back_end_twoitter/public/uploads/profile_pictures/${post.profile_picture_url}`
      : null;
    let image_url = post.image_post
      ? `http://localhost/Back_end_twoitter/public/uploads/image_posts/${post.image_post}`
      : null;

    div.innerHTML = ''
    div.innerHTML = `
      <div class="div_profile">
        <i><img class="profile_icon" src="${profile_picture}" alt="user${user_id}"></i>
        <p id='User${user_id}'>${user_name}</p>
      </div>
      ${
        image_url
          ? `<img src="${image_url}" alt="Post Image" style="max-width: 100%; height: auto;">`
          : ""
      }
      <div>
        <i class="like-icon" id="like_id_${post.post_id}" data-liked="false">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-transparent stroke-current" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 
              4.5 2.09C13.09 3.81 14.76 3 
              16.5 3 19.58 3 22 5.42 22 
              8.5c0 3.78-3.4 6.86-8.55 
              11.54L12 21.35z"/>
          </svg>
        </i>
        <i class="comment_icon" id="comment_icon_${post.post_id}">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12 12m4.125 0a.375.375 0 1 1-.75 0 
              .375.375 0 0 1 .75 0Zm0 0h-.375M21 
              12c0 4.556-4.03 8.25-9 8.25a9.764 
              9.764 0 0 1-2.555-.337A5.972 
              5.972 0 0 1 5.41 20.97a5.969 
              5.969 0 0 1-.474-.065 4.48 
              4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 
              16.178 3 14.189 3 12c0-4.556 
              4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
        </i>
        <i class="share_icon" id="share_icon_${post.post_id}">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186 
              c.18.324.283.696.283 1.093s-.103.77-.283 
              1.093m0-2.186 9.566-5.314m-9.566 
              7.5 9.566 5.314m0 0a2.25 2.25 
              0 1 0 3.935 2.186 2.25 2.25 
              0 0 0-3.935-2.186Zm0-12.814a2.25 
              2.25 0 1 0 3.933-2.185 2.25 
              2.25 0 0 0-3.933 2.185Z" />
          </svg>
        </i>
      </div>
      <p>${post.text_post || "Sem conteúdo"}</p>
    `;

    post_container.appendChild(div);
  });
}

function call_fetch_post() {
  const btn = document.getElementById("search_posts_btn");
  btn.addEventListener("click", () => {
    const search = document.getElementById("input-search").value;
    search_mode = "post";
    limit = 10;
    offset = 0;
    
    fetch_posts_by_search(search);
  });
}

//search tags

const search_user_btn = document.getElementById("search_users_btn")
search_user_btn.addEventListener('click', async() => {
  const search = document.getElementById("input-search").value;
  fetch_users_by_search(search);
})

const search_post_btn = document.getElementById("search_posts_btn")
search_post_btn.addEventListener('click', async () =>{
  search_mode = "post"
  console.log(search_mode)
  // Array.from(div_users).forEach(element=>{
  //   console.log(element)
  //   element.style.display = "none"
  //   element.innerHTML = ""
  // })
})


const search_tag_btn = document.getElementById("search_tags_btn")
search_tag_btn.addEventListener('click', async () =>{
  console.log("tags")
})



function scroll_event_handler() {
  const distance_to_bottom =
    document.documentElement.scrollHeight - window.innerHeight - window.scrollY;

  if (distance_to_bottom < 200) {
    if (search_mode === "") {
      load_posts();
    } 
    else if (search_mode === "users") {
      const search = document.getElementById("input-search").value;
      fetch_users_by_search(search);
    }
    else if (search_mode === "post"){
      console.log(search_mode)
      const search = document.getElementById("input-search").value;
      fetch_posts_by_search(search);
    }
  }
}

window.addEventListener("scroll", scroll_event_handler);


call_fetch_user();
call_fetch_post()

if (search_mode === "") {
  load_posts();
}
