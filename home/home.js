import { create_modal } from "../public/modals/global_modal.js";

const jwt = localStorage.getItem("jwt");

if (!jwt) {
  create_modal("Do you need to stay logged in to do this.");
  window.location.href = "../login/login.html";
}

let limit = 10;
let offset = 0;
let is_loading = false;

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

    if (data.success && data.jwt.length > 0) {
      render_posts(data.jwt);
      offset += limit;
    } else {
      window.removeEventListener("scroll", scroll_event);
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

    let image_url = post.image_post
      ? `http://localhost/Back_end_twoitter/public/uploads/profile_pictures/${post.image_post}`
      : null;

    div.innerHTML = `
      <p>${post.text_post || "Sem conteúdo"}</p>
      ${image_url ? `<img src="${image_url}" alt="Post Image" style="max-width: 100%; height: auto;">` : ""}
    `;

    post_container.appendChild(div);
  });
}

function scroll_event() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
    load_posts();
  }
}

window.addEventListener("scroll", scroll_event);
load_posts();
