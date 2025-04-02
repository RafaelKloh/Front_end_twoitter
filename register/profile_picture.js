document.getElementById("upload_form").addEventListener("submit", async function (event) {
  event.preventDefault(); 
  const user_id = localStorage.getItem("user_id")
  console.log(user_id)
  let fileInput = document.getElementById("profile_picture");


  if (fileInput.files.length === 0) {
      alert("Selecione uma imagem primeiro!");
      return;
  }

  let formData = new FormData();
  formData.append("profile_picture", fileInput.files[0]); // Adiciona a imagem
  formData.append("user_id", user_id); // Adiciona o user_id

  try {
      let response = await fetch("http://localhost/Back_end_twoitter/src/controllers/user_controller.php/upload_profile_image", {
          method: "POST",
          body: formData
      });

      let result = await response.json();

      if (result.success) {
          alert("Imagem enviada com sucesso!");
          console.log("URL da imagem:", result.image_url);
      } else {
          alert("Erro ao enviar imagem: " + result.message);
      }
  } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao enviar imagem!");
  }
});
