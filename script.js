const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  // Mobile menu
  const menuToggle = $("#menuToggle");
  const nav = $("#nav");
  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#nav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  // Scroll progress + active navigation
  const progress = $("#scrollProgress");
  const sections = $$("main section[id]");
  const navLinks = $$("#nav a");
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
    let current = "home";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
  };
  window.addEventListener("scroll", updateScroll, {passive:true});
  updateScroll();

  // Reveal on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  $$(".reveal").forEach(el => observer.observe(el));

  // Project filters
  $$(".filter").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    $$(".project-card").forEach(card => {
      const show = filter === "all" || card.dataset.category.split(" ").includes(filter);
      card.style.display = show ? "" : "none";
    });
  }));

  // Project modal
  const modal = $("#projectModal");
  const modalTitle = $("#modalTitle");
  const modalDescription = $("#modalDescription");
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };
 const projectCaseStudies = {
  "Multi-Service Cloud Deployment": {
    overview: "Professional DevOps work involving a multi-service application deployment. Source code and internal implementation details remain private due to company confidentiality.",
    implementation: [
      "Containerized application services using Docker.",
      "Configured Nginx reverse proxy routing.",
      "Worked with SSL/HTTPS configuration.",
      "Performed health checks and deployment troubleshooting.",
      "Supported deployments across separate environments."
    ],
    stack: "Docker · Linux · Nginx · SSL/HTTPS · Cloud Infrastructure",
    focus: "Deployment reliability, service availability and production troubleshooting."
  },

  "Ubuntu Server Deployment": {
    overview: "Linux server setup and administration focused on application deployment and infrastructure operations.",
    implementation: [
      "Configured an Ubuntu server environment.",
      "Worked with Docker containers and Nginx.",
      "Configured SSL certificates for HTTPS.",
      "Managed Python environments and server tooling.",
      "Checked services, storage and deployment issues."
    ],
    stack: "Ubuntu · Docker · Nginx · SSL · Python",
    focus: "Linux administration, service management and troubleshooting."
  },

  "AWS Cloud Infrastructure Deployment": {
    overview: "Hands-on AWS infrastructure work involving cloud compute, storage, networking, access control and monitoring.",
    implementation: [
      "Worked with EC2 compute instances.",
      "Used S3 for cloud storage tasks.",
      "Worked with IAM permissions and access management.",
      "Worked with VPC networking and infrastructure configuration.",
      "Explored monitoring with AWS services."
    ],
    stack: "AWS EC2 · S3 · IAM · VPC · RDS · CloudWatch",
    focus: "Cloud infrastructure, networking, access control and monitoring."
  }
};

$$(".project-details").forEach(btn => btn.addEventListener("click", () => {
    const title = btn.dataset.title;
    const project = projectCaseStudies[title];

    modalTitle.textContent = title;
    modalDescription.replaceChildren();

    if (!project) {
      const paragraph = document.createElement("p");
      paragraph.textContent = btn.dataset.description || "";
      modalDescription.appendChild(paragraph);
    } else {
      const sections = [
        ["Project Overview", project.overview],
        ["Implementation & Work Performed", project.implementation],
        ["Technical Stack", project.stack],
        ["Engineering Focus", project.focus]
      ];

      sections.forEach(([heading, content]) => {
        const section = document.createElement("section");
        section.className = "case-study-section";

        const h3 = document.createElement("h3");
        h3.textContent = heading;
        section.appendChild(h3);

        if (Array.isArray(content)) {
          const list = document.createElement("ul");

          content.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
          });

          section.appendChild(list);
        } else {
          const paragraph = document.createElement("p");
          paragraph.textContent = content;
          section.appendChild(paragraph);
        }

        modalDescription.appendChild(section);
      });
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
})); 

  $("#modalCloseAction")?.addEventListener("click", closeModal);
  $("#modalClose")?.addEventListener("click", closeModal);
  $(".modal-backdrop")?.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

   // Service buttons -> Cal.com booking page
  $$(".service-book").forEach(btn => {
    btn.addEventListener("click", () => {
      window.open(
        "https://cal.com/sebin-tjubgh/cloud-consultation",
        "_blank",
        "noopener,noreferrer"
      );
    });
  });
 });
