import { create_modal } from "../public/modals/global_modal.js";

document.getElementById("form_register_2").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = localStorage.getItem("email_verify")
    const number = document.getElementById("confirm_email").value
    verify(email,number)
  });
  
  async function verify(email,number) {
    try {
      const user_data = {
        email:email
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "insomnia/10.3.1",
        },
        body: JSON.stringify(user_data),
      };
  
      const response = await fetch(
        "http://localhost/Back_end_twoitter/users/fetch_verify_email",
        options
      );
      const data = await response.json();
      if (data.error) {
        create_modal(data.message);
        return;
      }

      if (data.jwt.verification_code === number) {
        try {
          const emial_info = {
            email:email,
            verification_code:number
          };
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "insomnia/10.3.1",
            },
            body: JSON.stringify(emial_info),
          };
      
          const response = await fetch(
            "http://localhost/Back_end_twoitter/users/verify_email",
            options
          );
          const resp = await response.json();
          if (resp.error) {
            create_modal(resp.message);
            return;
          }

          if(resp['message'] === "Email verified successfully!"){
            localStorage.setItem("user_id",resp['user_id'])
            window.location.href = "./register_profile_picture.html";
            return;
          }
        } catch (error) {
          create_modal("An unexpected error occurred. Please try again.");
        }





      }

      if(data.jwt.verification_code !== number){
        let message = "The code provided does not match what was sent to your email"
        create_modal(message)
        return
      }
      else{
        console.log(data)
        let message = "Something is not working properly, please try again later"
        create_modal(message)
        return
      }

    } catch (error) {
      create_modal("An unexpected error occurred. Please try again.");
    }
  }
