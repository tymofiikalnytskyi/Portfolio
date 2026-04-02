const root = document.body;
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector(".site-header");
const yearTarget = document.querySelector("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const tabGroups = document.querySelectorAll("[data-tabs]");
const reactiveItems = document.querySelectorAll("[data-reactive]");
const filterGroups = document.querySelectorAll("[data-filter-group]");

const storedTheme = localStorage.getItem("portfolio-theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const theme = storedTheme || (preferredDark ? "dark" : "light");
root.dataset.theme = theme;

if (themeToggle) {
  const syncLabel = () => {
    themeToggle.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.textContent = root.dataset.theme === "dark" ? "Light mode" : "Dark mode";
  };

  syncLabel();
  themeToggle.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("portfolio-theme", root.dataset.theme);
    syncLabel();
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 10);
};

document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = contactForm.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Form endpoint placeholder active. Connect Formspree, Basin, or your preferred provider to make this live.";
    }
    contactForm.reset();
  });
}

tabGroups.forEach((group) => {
  const buttons = group.querySelectorAll("[data-tab-button]");
  const panels = group.querySelectorAll("[data-tab-panel]");

  const setActive = (target) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.tabButton === target;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === target;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setActive(button.dataset.tabButton));
  });

  const spotlightCards = group.closest(".feature-showcase")?.querySelectorAll("[data-spotlight-button]") || [];
  spotlightCards.forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.dataset.spotlightButton;
      if (target && group.querySelector(`[data-tab-panel="${target}"]`)) {
        setActive(target);
      }
    });
  });
});

reactiveItems.forEach((item) => {
  const reset = () => {
    item.style.setProperty("--rx", "0deg");
    item.style.setProperty("--ry", "0deg");
    item.style.setProperty("--mx", "50%");
    item.style.setProperty("--my", "50%");
  };

  reset();

  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const ry = (x - 0.5) * 8;
    const rx = (0.5 - y) * 8;

    item.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    item.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    item.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    item.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
  });

  item.addEventListener("pointerleave", reset);
});

filterGroups.forEach((group) => {
  const buttons = group.querySelectorAll("[data-filter-button]");
  const items = group.querySelectorAll("[data-filter-item]");

  const setFilter = (value) => {
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filterButton === value);
    });

    items.forEach((item) => {
      const tags = item.dataset.filterItem.split(" ");
      const matches = value === "all" || tags.includes(value);
      item.classList.toggle("is-hidden", !matches);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filterButton));
  });
});
