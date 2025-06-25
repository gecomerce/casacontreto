window.addEventListener('DOMContentLoaded', () => {
    const btnToggle = document.querySelector('.navbar-toggler');
    const menu = document.getElementById('navbarSupportedContent');

    btnToggle.addEventListener('click', () => {
        menu.classList.toggle('show');
    });
});
