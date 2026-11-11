const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");

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

if (skills && skillsToggle) {
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
}
