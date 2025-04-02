async function getProfile (userId) {
    try {
          const user_data = {
            userId
          }
    
        const options = {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/10.3.1'},
          body: JSON.stringify(user_data)
        };
        
        fetch('http://localhost:3000/users/verify_profile_picture', options)
        .then(response => response.json())
        
        .then(data => {
            console.log(data)
            if(data["error"]){
               create_modal(data["message"])
            }
            if (data.success) {
                const header = document.querySelector("#header")
                header.innerHTML += `
                <img src="" alt="">`
            } else {
                const header = document.querySelector("#header")
                header.innerHTML += `
                <img src="" alt="">`
            }
        })
      } catch (error) {
        console.error(error);
      }
}
const user_id = localStorage.getItem("user_id")
getProfile(user_id)