const logoButton = document.querySelector('#hawaiiPopUp');
if (logoButton) {
    logoButton.addEventListener('click', function() {
        modal.classList.add('is-active');
    });
}

const modalBG = document.querySelector('.modal-background');
const modal = document.querySelector('.modal');

if (modalBG && modal) {
    modalBG.addEventListener('click', function() {
        modal.classList.remove('is-active');
    });
}

// sideBar function 

function showSidebar() {
    event.preventDefault();
    const sidebar = document.querySelector(".sidebar")
    sidebar.style.display = "flex"
}
function hideSidebar() {
    const sidebar = document.querySelector(".sidebar")
    sidebar.style.display = "none"
}