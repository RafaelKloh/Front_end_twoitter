import { create_modal } from "../public/modals/global_modal.js";

// Pegamos o formulário
const form = document.getElementById("form_register_1");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;
  let confirm_password = document.getElementById("confirm_password").value;
  let sex = document.getElementById("sex").value;
  let birthday = document.getElementById("birthday").value;
  let terms_of_use = document.getElementById("terms_of_use").checked;

  let data = new Date();
  let day = data.getDate().toString().padStart(2, "0");
  let month = (data.getMonth() + 1).toString().padStart(2, "0"); 
  let year = data.getFullYear();
  const date = `${year}-${month}-${day}`;

  if (password !== confirm_password) {
    create_modal("Passwords need to be the same");
    return;
  }

  if (!terms_of_use) {
    create_modal("You need to agree with our terms of use to continue");
    return;
  }
  register(name, email, password, sex, birthday, date);
});

async function register(name, email, password, sex, birthday, date) {
  try {
    const user_data = {
      name: name,
      email: email,
      password: password,
      sex: sex,
      profile_img: "",
      bio: "",
      user_birth_date: birthday,
      user_creation_date: date,
    };
    localStorage.setItem("email_verify", email)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "insomnia/10.3.1",
      },
      body: JSON.stringify(user_data),
    };

    const response = await fetch(
      "http://localhost/Back_end_twoitter/users/create",
      options
    );
    const data = await response.json();

    console.log(data);

    if (data.error) {
      create_modal(data.message);
      return;
    }

    if (data.success) {
      window.location.href = "./register_2.html";
    }
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    create_modal("An unexpected error occurred. Please try again.");
  }
}
