const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
  const dark = theme === "dark";
  root.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.textContent = dark ? "Light mode" : "Dark mode";
}

applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", next);
  } catch (error) {}
  applyTheme(next);
});

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});
