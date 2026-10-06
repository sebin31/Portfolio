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
  $$(".project-details").forEach(btn => btn.addEventListener("click", () => {
    modalTitle.textContent = btn.dataset.title;
    modalDescription.textContent = btn.dataset.description;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }));
  $("#modalClose")?.addEventListener("click", closeModal);
  $(".modal-backdrop")?.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // Service -> booking form
  const serviceSelect = $("#serviceSelect");
  $$(".service-book").forEach(btn => btn.addEventListener("click", () => {
    serviceSelect.value = btn.dataset.service;
    $("#booking").scrollIntoView({behavior:"smooth"});
    setTimeout(() => serviceSelect.focus(), 600);
  }));

  // Don't allow past booking dates
  const dateInput = $("#dateInput");
  if (dateInput) {
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().split("T")[0];
    dateInput.min = local;
  }

  // Booking request: mailto, no payment is collected here.
  $("#bookingForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    const subject = `Booking Request — ${data.service}`;
    const body = [
      `Hello Sebin,`,
      ``,
      `I would like to request a session/service.`,
      ``,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company / Project: ${data.company || "Not provided"}`,
      `Service: ${data.service}`,
      `Preferred date: ${data.date}`,
      `Preferred time: ${data.time}`,
      ``,
      `Requirement:`,
      data.message,
      ``,
      `Please contact me to confirm availability, scope and final pricing.`
    ].join("\n");
   window.open("https://cal.com/sebin-tjubgh/cloud-consultation", "_blank");
$("#formStatus").textContent = "Opening the Cal.com booking page...";
  });
});
