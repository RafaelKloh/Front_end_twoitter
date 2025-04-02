import { create_modal } from "../public/modals/global_modal.js";

document.getElementById("upload_form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const user_id = localStorage.getItem("user_id");
    let fileInput = document.getElementById("profile_picture");
    let bio = document.getElementById("bio").value;

    if (fileInput.files.length === 0) {
        try {
            let response = await fetch("http://localhost/Back_end_twoitter/users/register_bio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, bio })
            });

            let result = await response.json();
            console.log(result);
            if (result.success) {
                window.location.href = "../login/login.html";
                return;
            } else {
                create_modal("Error registering your bio.");
            }
        } catch (error) {
            create_modal("Error in the request bio");
        }
    } else {
        let formData = new FormData();
        formData.append("profile_picture", fileInput.files[0]);
        formData.append("user_id", user_id);
        formData.append("bio", bio);

        try {
            let response = await fetch("http://localhost/Back_end_twoitter/users/upload_profile", {
                method: "POST",
                body: formData
            });

            let result = await response.json();
            if (result.success) {
                window.location.href = "../login/login.html";
            } else {
                create_modal("Error trying to send image");
            }
        } catch (error) {
            create_modal("Error in the request");
        }
    }
});

document.getElementById("jump_form").addEventListener("submit", function (event) {
    event.preventDefault();
    window.location.href = "../login/login.html";
});
