'use strict';
console.log("начало выполнения кода");
const TOGGLE_BUTTON = document.getElementById("toggle-button");
TOGGLE_BUTTON.addEventListener('click', function() {
    const EMAIL_CONTACT = document.getElementById("contact-form");

    if (EMAIL_CONTACT.style.display === "none" || 
        EMAIL_CONTACT.style.display == "") {
       EMAIL_CONTACT.style.display = "block" ;
       this.textContent = "Скрыть";
    } else {
        EMAIL_CONTACT.style.display = 'none';
        this.textContent = "Связаться со мной по email";
    }
});
console.log("конец выполнения кода");