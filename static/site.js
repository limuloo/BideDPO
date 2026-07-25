(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const themeKey = "bidedpo-theme";

  const getStoredTheme = () => {
    try {
      const theme = window.localStorage.getItem(themeKey);
      return theme === "light" || theme === "dark" ? theme : null;
    } catch (error) {
      return null;
    }
  };

  const updateThemeControl = (theme) => {
    if (!themeToggle) return;
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Use ${nextTheme} theme`);
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.title = `Use ${nextTheme} theme`;
  };

  const applyTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    updateThemeControl(theme);

    if (persist) {
      try {
        window.localStorage.setItem(themeKey, theme);
      } catch (error) {
        // The selected theme still applies when storage is unavailable.
      }
    }
  };

  const storedTheme = getStoredTheme();
  applyTheme(storedTheme || (themeQuery.matches ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  themeQuery.addEventListener?.("change", (event) => {
    if (!getStoredTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  const closeMenu = (returnFocus = false) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
    if (returnFocus) menuToggle.focus();
  };

  const openMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    mobileMenu.hidden = false;
    document.body.classList.add("menu-open");
    mobileMenu.querySelector("a")?.focus();
  };

  menuToggle?.addEventListener("click", () => {
    if (menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && menuToggle?.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });

  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const observedSections = [...document.querySelectorAll("[data-section]")];

  const setActiveSection = (id) => {
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const visibleSections = new Map();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        const current = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0];
        if (current) setActiveSection(current[0]);
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0, 0.1, 0.25, 0.5] }
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
  } else {
    setActiveSection("overview");
  }

  document.querySelectorAll("[data-tabs]").forEach((tabGroup) => {
    const tabs = [...tabGroup.querySelectorAll("[role='tab']")];
    const panels = [...tabGroup.querySelectorAll("[role='tabpanel']")];

    const selectTab = (selectedTab, focus = false) => {
      tabs.forEach((tab) => {
        const selected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== selectedTab.dataset.tab;
      });

      if (focus) selectedTab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;

        if (nextIndex !== null) {
          event.preventDefault();
          selectTab(tabs[nextIndex], true);
        }
      });
    });
  });

  const copyButton = document.querySelector("[data-copy-button]");
  const copyLabel = document.querySelector("[data-copy-label]");
  const copyStatus = document.querySelector("#copy-status");
  const bibtex = document.querySelector("#bibtex");
  let copyResetTimer;

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  };

  copyButton?.addEventListener("click", async () => {
    const text = bibtex?.textContent.trim();
    if (!text) return;

    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (error) {
      copied = fallbackCopy(text);
    }

    if (!copyLabel || !copyStatus) return;
    copyLabel.textContent = copied ? "Copied" : "Copy failed";
    copyStatus.textContent = copied ? "BibTeX copied to clipboard." : "BibTeX could not be copied.";
    window.clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(() => {
      copyLabel.textContent = "Copy BibTeX";
      copyStatus.textContent = "";
    }, 2200);
  });

  const dialog = document.querySelector("[data-figure-dialog]");
  const dialogImage = dialog?.querySelector("[data-dialog-image]");
  const dialogCaption = dialog?.querySelector("[data-dialog-caption]");
  const dialogClose = dialog?.querySelector("[data-dialog-close]");

  document.querySelectorAll("[data-lightbox]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!dialog?.showModal || !dialogImage || !dialogCaption) return;
      event.preventDefault();
      const previewImage = link.querySelector("img");
      dialogImage.src = link.href;
      dialogImage.alt = previewImage?.alt || "Full-resolution paper figure";
      dialogCaption.textContent = link.dataset.caption || previewImage?.alt || "Paper figure";
      dialog.showModal();
      dialogClose?.focus();
    });
  });

  const closeDialog = () => {
    if (!dialog?.open) return;
    dialog.close();
  };

  dialogClose?.addEventListener("click", closeDialog);
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog?.addEventListener("close", () => {
    if (dialogImage) {
      dialogImage.src = "static/teaser.webp";
      dialogImage.alt = "";
    }
  });
})();
