// Scroll reveal for sections
const sections = document.querySelectorAll(".section");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.15 });
sections.forEach(s => revealObserver.observe(s));

// Active dot in side rail based on section in view
const railDots = document.querySelectorAll(".rail-dot");
const railMap = new Map();
railDots.forEach(dot => {
  const id = dot.getAttribute("href").slice(1);
  const target = document.getElementById(id);
  if (target) railMap.set(target, dot);
});

const railObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const dot = railMap.get(entry.target);
    if (!dot) return;
    if (entry.isIntersecting) {
      railDots.forEach(d => d.classList.remove("is-active"));
      dot.classList.add("is-active");
    }
  });
}, { threshold: 0.5 });
railMap.forEach((dot, target) => railObserver.observe(target));

// Animate skill bars when the skills section scrolls into view
const skillBars = document.querySelectorAll(".skill-bar");
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector(".skill-fill");
      const pct = entry.target.dataset.pct;
      fill.style.width = pct + "%";
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
skillBars.forEach(bar => skillObserver.observe(bar));

// Smooth back-to-top
document.querySelector(".to-top")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
