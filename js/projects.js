const projects = [
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

function renderProjects() {
  projectList.replaceChildren();

  projects.forEach((project, index) => {
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
      projects.splice(index, 1);
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
  renderProjects();
});

renderProjects();
