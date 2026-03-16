

const typingText = document.getElementById("typingText");

const roles = [
  "Future Software Developer",
  "Marketing Advisor",
  "Logo Designer",
  "Content Creator",
  "Java Enthusiast"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {

  const currentRole = roles[roleIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingText.textContent = currentRole.substring(0, charIndex);

  if (!deleting && charIndex === currentRole.length) {
    deleting = true;
    setTimeout(typeEffect, 1500);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeEffect, deleting ? 50 : 90);
}

window.addEventListener("load", () => {
  if (typingText) {
    setTimeout(typeEffect, 500);
  }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (e) {

    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }

  });

});

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }

  });

}, { threshold: 0.1 });

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));


const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

if (savedTheme === "dark") {
  html.classList.add("dark");
}

themeToggle?.addEventListener("click", () => {

  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }

});



const SERVICE_ID = "service_j4mmqh8";
const TEMPLATE_ID = "template_nvio5k2";
const PUBLIC_KEY = "Utg0v9tJQy6Seb5kU";

emailjs.init(PUBLIC_KEY);
const form = document.getElementById("contactForm");
const popup = document.getElementById("emailPopup");
const closePopup = document.getElementById("closePopup");


form?.addEventListener("submit", function (e) {

  e.preventDefault();

  emailjs
    .sendForm(SERVICE_ID, TEMPLATE_ID, this)
    .then(function () {

      popup.style.display = "flex";
      popup.classList.remove("hidden");

      form.reset();

    })
    .catch(function (error) {

      console.log("FAILED...", error);
      alert("Failed to send message");

    });

});

closePopup?.addEventListener("click", () => {

  popup.classList.add("hidden");
  popup.style.display = "none";

});

popup?.addEventListener("click", (e) => {

  if (e.target === popup) {
    popup.classList.add("hidden");
    popup.style.display = "none";
  }

});

if ("IntersectionObserver" in window) {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imgObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll("img[data-src]").forEach(img => {
    imgObserver.observe(img);
  });

}