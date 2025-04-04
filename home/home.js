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
      ${image_url ? `<img src="${image_url}" alt="Post Image" style="max-width: 100%; height: auto;">` : ""}
      <div>
      <i><img class="like-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhlYXJ0LWljb24gbHVjaWRlLWhlYXJ0Ij48cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIi8+PC9zdmc+" alt="like"></i>
      <i><img class="comment-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1lc3NhZ2UtY2lyY2xlLWljb24gbHVjaWRlLW1lc3NhZ2UtY2lyY2xlIj48cGF0aCBkPSJNNy45IDIwQTkgOSAwIDEgMCA0IDE2LjFMMiAyMloiLz48L3N2Zz4=" alt="Comment"></i>
      <i><img class="share-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNlbmQtaWNvbiBsdWNpZGUtc2VuZCI+PHBhdGggZD0iTTE0LjUzNiAyMS42ODZhLjUuNSAwIDAgMCAuOTM3LS4wMjRsNi41LTE5YS40OTYuNDk2IDAgMCAwLS42MzUtLjYzNWwtMTkgNi41YS41LjUgMCAwIDAtLjAyNC45MzdsNy45MyAzLjE4YTIgMiAwIDAgMSAxLjExMiAxLjExeiIvPjxwYXRoIGQ9Im0yMS44NTQgMi4xNDctMTAuOTQgMTAuOTM5Ii8+PC9zdmc+" alt="share"></i>
      </div>
      <p>${post.text_post || "Sem conteúdo"}</p>
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

//function to validate click in post's icons, such as like icon
