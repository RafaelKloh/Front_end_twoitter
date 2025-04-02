export function create_modal(error) {
    const existingModal = document.querySelector(".modal_container");
    if (existingModal) {
      existingModal.remove();
    }
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal_container");
  
    modalContainer.innerHTML = `
        <div class="modal_content">
            <p>${error}</p>
            <button id="modal_button">OK</button>
        </div>
    `;
    document.body.appendChild(modalContainer);
  
    setTimeout(() => {
      const modalButton = document.getElementById("modal_button");


  
      modalButton.addEventListener("click", () => {

        modalContainer.remove();
      });
    }, 100); // Pequeno atraso para garantir que o DOM foi atualizado
  }
  