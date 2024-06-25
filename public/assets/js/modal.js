// Modal popup for Hawaii
const logoButton = document.querySelector('#hawaiiPopUp');
const modal = document.querySelector('.modal');
const modalBG = document.querySelector('.modal-background');

if (logoButton && modal) {
    logoButton.addEventListener('click', function() {
        modal.classList.add('is-active');
    });
}

if (modalBG && modal) {
    modalBG.addEventListener('click', function() {
        modal.classList.remove('is-active');
    });
}

// Sidebar functions
function showSidebar(event) {
    event.preventDefault();
    const sidebar = document.querySelector("#sidebar"); // Ensure the correct selector
    if (sidebar) {
        sidebar.style.display = "flex";
    }
}

function hideSidebar() {
    const sidebar = document.querySelector("#sidebar"); // Ensure the correct selector
    if (sidebar) {
        sidebar.style.display = "none";
    }
}
