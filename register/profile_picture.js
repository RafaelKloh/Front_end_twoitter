import { create_modal } from "../public/modals/global_modal.js";



let btn_photo = document.querySelector('#btn_photo')
btn_photo.addEventListener('click', () => {
    var video = document.querySelector('video')
    navigator.mediaDevices.getUserMedia({video:true})
    .then(stream =>{
    video.srcObject = stream
    video.play()
    })
    .catch(error =>{
        console.log(error)
    })
})

const capture_button = document.createElement('button');
capture_button.textContent = "Capture";
document.body.appendChild(capture_button);

capture_button.addEventListener('click', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const file = new File([blob], "profile_image.png", { type: "image/png" });

        // Simula o input file com o arquivo criado
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const input = document.getElementById('profile_picture');
        input.files = dataTransfer.files;

        console.log("Imagem capturada e inserida no input");
    }, 'image/png');
});


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
        formData.append("user_id", user_id)
        formData.append("bio", bio)
        formData.append("profile_picture", fileInput.files[0])
        try {
            let response = await fetch("http://localhost/Back_end_twoitter/users/upload_profile", {
                method: "POST",
                body: formData
            });

            let result =  await response.json();
            console.log(result)

            if (result.success) {
                window.location.href = "../login/login.html";
            } else {
                create_modal("Error trying to send image");
            }

        } catch (error) {
            console.log(error)
            create_modal("Error in the request");
        }
    }
});

document.getElementById("jump_form").addEventListener("submit", function (event) {
    event.preventDefault();
    window.location.href = "../login/login.html";
});
