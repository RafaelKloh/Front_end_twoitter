import { create_modal } from "../public/modals/global_modal.js";
const jwt = localStorage.getItem("jwt");
if (!jwt) {
  create_modal("Do you need to stay logged in to do this.");
  window.location.href = "../login/login.html";
}

document.getElementById("create_post_form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const user_id = localStorage.getItem("user_id");
  let fileInput = document.getElementById("image_post");
  let text_post = document.getElementById("text_post").value;
  let tags = document.getElementById("tags").value;
  let data = new Date();
  let day = data.getDate().toString().padStart(2, "0");
  let month = (data.getMonth() + 1).toString().padStart(2, "0"); 
  let year = data.getFullYear();
  const date = `${year}-${month}-${day}`;
 
  let formData = new FormData();
  formData.append("text_post", text_post);
  formData.append("image_post", fileInput.files[0]);
  formData.append("tags[]", tags);
  formData.append("posted_at", date);

  try {
      let response = await fetch("http://localhost/Back_end_twoitter/post/create", {
          method: "POST",
          body: formData,
          headers: {
              Authorization: `Bearer ${jwt}`
          }, 
      });

      const result = await response.json();

      if (result.success) {
          //agr tenho que redirecionar pra home ou pra um outro canto pra ele visualizar como q vai ficar o post
          //no momento vou deixar indo pra home, dps eu faço essa alteração 
      } else {
          create_modal("Error trying to send image");
      }

  } catch (error) {
      console.log(error);
      create_modal("Error in the request");
  }
});
