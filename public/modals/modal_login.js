export function create_modal(error) {
    const body = document.body;
    body.insertAdjacentHTML("beforeend", `
    <div class="modal_container">
        <div class="modal_content">
            <p>${error}</p>
            <button id="modal_button">OK</button>
        </div>
    </div>
    `);
    
    const modalButton = document.querySelector("#modal_button");
    modalButton.addEventListener("click", () => {
        const modalContainer = document.querySelector(".modal_container");
        modalContainer.remove();
    });
}
