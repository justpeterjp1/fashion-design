const menu = document.querySelector(".menu");
const navLinks = document.querySelector(".nav-links")

menu.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("fa-bars");
     menu.classList.toggle("fa-x");
     navLinks.classList.toggle("hidden");
     navLinks.classList.toggle("active");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.toggle("active");
     menu.classList.toggle("fa-x");
        menu.classList.toggle("fa-bars");
  });
});


document.addEventListener("click", (e) => {
    const isClickInisideNav = navLinks.contains(e.target);
    const isClickOnMenu = menu.contains(e.target);
    if (!isClickInisideNav && !isClickOnMenu) {
       if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menu.classList.toggle("fa-x");
        menu.classList.toggle("fa-bars");
      }
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".slide-up").forEach((el) => observer.observe(el));


