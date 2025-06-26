document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  //===== Preloader
  window.addEventListener("load", function () {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      setTimeout(() => {
        preloader.style.transition = "opacity 0.5s";
        preloader.style.opacity = 0;
        setTimeout(() => preloader.style.display = "none", 500);
      }, 500);
    }
  });

// Dimanismo de transicao de logo


  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header_navbar");
    const logo = document.querySelector(".header_navbar img");
    if (window.scrollY < 20) {
      header?.classList.remove("sticky");
      if (logo) logo.src = "assets/images/logo.png";
    } else {
      header?.classList.add("sticky");
      if (logo) logo.src = "assets/images/logo2.png";
    }
  });



  //===== Navbar collapse on link click
  document.querySelectorAll(".navbar-nav a").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelector(".navbar-collapse")?.classList.remove("show");
      document.querySelector(".navbar-toggler")?.classList.remove("active");
    });
  });

  document.querySelector(".navbar-toggler")?.addEventListener("click", function () {
    this.classList.toggle("active");
  });

  //===== Back to top button
  const backToTop = document.querySelector(".back-to-top");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 600) {
      backToTop?.classList.add("visible");
    } else {
      backToTop?.classList.remove("visible");
    }
  });

  backToTop?.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  //===== WOW.js
  if (typeof WOW === "function") {
    new WOW({
      boxClass: 'wow',
      mobile: false
    }).init();
  }
});
