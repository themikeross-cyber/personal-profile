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

const skills = document.querySelector("#skills");
const skillsToggle = document.querySelector("#skills-toggle");

function setSkillsVisible(show) {
  skills.hidden = !show;
  skillsToggle.textContent = show ? "Hide" : "Show";
  skillsToggle.setAttribute("aria-expanded", String(show));
}

function toggleSkills() {
  setSkillsVisible(skills.hidden);
}

skillsToggle.addEventListener("click", toggleSkills);

document.addEventListener("keydown", (event) => {
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key !== "t" && event.key !== "T") return;
  const active = document.activeElement;
  const tag = active && active.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (active && active.isContentEditable)) return;
  event.preventDefault();
  toggleSkills();
});
