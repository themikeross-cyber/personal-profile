const starterProjects = [
  {
    name: "Identity and access upkeep",
    description: "Keep Active Directory, Azure AD, and ADFS accounts and groups current so people can reach the systems they need."
  },
  {
    name: "Practical AI for the technology team",
    description: "Put everyday AI tools into the work of the help desk, procurement, and the rest of the technology group."
  }
];

const projectForm = document.querySelector("#project-form");
const projectList = document.querySelector("#project-list");
const projectName = document.querySelector("#project-name");
const projectDescription = document.querySelector("#project-description");
const projectSearch = document.querySelector("#project-search");
const projectCount = document.querySelector("#project-count");
const projectEmpty = document.querySelector("#project-empty");

function loadProjects() {
  try {
    const saved = localStorage.getItem("projects");
    if (!saved) return starterProjects.map((project) => ({ ...project }));
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return starterProjects.map((project) => ({ ...project }));
    return parsed.filter((project) => {
      return project && typeof project.name === "string" && typeof project.description === "string";
    });
  } catch (error) {
    return starterProjects.map((project) => ({ ...project }));
  }
}

const projects = loadProjects();

function saveProjects() {
  try {
    localStorage.setItem("projects", JSON.stringify(projects));
  } catch (error) {}
}

function matchingProjects() {
  const term = projectSearch.value.trim().toLowerCase();
  return projects.filter((project) => {
    const name = project.name.toLowerCase();
    const description = project.description.toLowerCase();
    return name.includes(term) || description.includes(term);
  });
}

function renderProjects() {
  const visible = matchingProjects();
  projectList.replaceChildren();
  projectCount.textContent = "Showing " + visible.length + " of " + projects.length + " projects";

  const noMatches = visible.length === 0;
  projectEmpty.hidden = !noMatches;
  projectList.hidden = noMatches;

  visible.forEach((project) => {
    const card = document.createElement("li");
    card.className = "project-card";

    const title = document.createElement("h3");
    title.textContent = project.name;

    const description = document.createElement("p");
    description.textContent = project.description;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "project-delete";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Delete " + project.name);
    remove.addEventListener("click", () => {
      projects.splice(projects.indexOf(project), 1);
      saveProjects();
      renderProjects();
    });

    card.append(title, description, remove);
    projectList.append(card);
  });
}

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = projectName.value.trim();
  const description = projectDescription.value.trim();
  if (!name || !description) return;

  projects.push({ name, description });
  projectForm.reset();
  saveProjects();
  renderProjects();
});

projectSearch.addEventListener("input", renderProjects);

renderProjects();
