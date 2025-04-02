import { create_modal } from "../public/modals/global_modal.js";
    

const email = document.getElementById("email");
const password = document.getElementById("password");

const form = document.getElementById("form")
form.addEventListener("submit", async (event) => {
    event.preventDefault()
    await login()
})

async function login() {
  try {
      const user_data = {
        email:email.value,
        password:password.value
      }

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/10.3.1'},
      body: JSON.stringify(user_data)
    };
    
    fetch('http://localhost/Back_end_twoitter/users/login', options)
    .then(response => response.json())
    
    .then(data => {
        if(data["error"]){
           create_modal(data["message"])
        }
        if (data.success) {
            const jwt = localStorage.setItem("jwt_login", data.jwt)
            window.location.href = "../home/home.html";
        } else {
            console.log("Erro no login:", data.message);
        }

    })
  } catch (error) {
    console.error(error);
  }
}