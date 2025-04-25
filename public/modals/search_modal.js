export function search_modal(message,option) {
    return new Promise((resolve) => {
  const existingModal = document.querySelector(".modal_container");
  if (existingModal) {
    existingModal.remove();
  }
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal_container");

  modalContainer.innerHTML = `
        <div class="modal_content">
            <p>${message}</p>
            <div id="option_modal">
            <button id="posts_button">${option[0]}</button>
            <button id="tags_button">${option[1]}</button>
        </div>
        </div>
    `;
  document.body.appendChild(modalContainer);

  setTimeout(() => {
    const post_button = document.getElementById("posts_button");
    post_button.addEventListener("click", () => {
      modalContainer.remove();
      resolve("POSTS")
    });
  }, 100);
  
  setTimeout(() => {
    const tag_button = document.getElementById("tags_button");
    tag_button.addEventListener("click", async () => {
      modalContainer.remove();
      resolve("TAGS")
    });
  }, 100);
})}
