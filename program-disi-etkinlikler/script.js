document.addEventListener("DOMContentLoaded", function () {

    window.setLanguage = function(lang) {

        const aboutTR = document.getElementById("about-tr");
        const aboutEN = document.getElementById("about-en");

        if (lang === "tr") {
            aboutTR.style.display = "block";
            aboutEN.style.display = "none";
        }

        if (lang === "en") {
            aboutTR.style.display = "none";
            aboutEN.style.display = "block";
        }
    };

});