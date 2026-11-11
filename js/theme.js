const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;
const pageLink = /^(?:\.\/)?(?:index|about|projects|contact)\.html(?:[?#].*)?$/;
const filePages = location.protocol === "file:";

function themeFromUrl() {
  try {
    const value = new URLSearchParams(location.search).get("theme");
    return value === "dark" || value === "light" ? value : "";
  } catch (e) {
    return "";
  }
}

function savedTheme() {
  if (filePages) {
    const fromUrl = themeFromUrl();
    if (fromUrl) return fromUrl;
  }
  try {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  } catch (e) {
    return "light";
  }
}

function currentTheme() {
  return root.dataset.theme === "dark" ? "dark" : "light";
}

function storeTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {}
  if (!filePages) return;
  try {
    const params = new URLSearchParams(location.search);
    params.set("theme", theme);
    let file = location.pathname.split("/").pop();
    if (!file) file = "index.html";
    history.replaceState(null, "", file + "?" + params.toString() + location.hash);
  } catch (e) {}
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !pageLink.test(href)) return;
    const path = href.split(/[?#]/)[0];
    link.setAttribute("href", path + "?theme=" + theme);
  });
}

function applyTheme(theme) {
  const dark = theme === "dark";
  if (dark) {
    root.dataset.theme = "dark";
  } else {
    root.removeAttribute("data-theme");
  }
  if (!themeToggle) return;
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.textContent = dark ? "Light mode" : "Dark mode";
}

function syncTheme(theme) {
  storeTheme(theme);
  applyTheme(theme);
}

syncTheme(savedTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    syncTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}

window.addEventListener("storage", (event) => {
  if (event.key !== "theme") return;
  syncTheme(event.newValue === "dark" ? "dark" : "light");
});

window.addEventListener("pageshow", () => {
  syncTheme(savedTheme());
});
