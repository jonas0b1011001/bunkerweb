import { Checkbox, Select, Password, DisabledPop } from "./utils/form.js";

class Menu {
  constructor() {
    this.sidebarEl = document.querySelector("[data-sidebar-menu]");
    this.toggleBtn = document.querySelector("[data-sidebar-menu-toggle]");
    this.closeBtn = document.querySelector("[data-sidebar-menu-close]");

    this.toggleBtn.addEventListener("click", this.toggle.bind(this));
    this.closeBtn.addEventListener("click", this.close.bind(this));
    this.init();
  }

  init() {
    window.addEventListener("click", (e) => {
      try {
        if (
          e.target.closest("aside").hasAttribute("data-sidebar-menu") &&
          e.target.closest("button").getAttribute("role") === "tab"
        ) {
          this.close();
        }
      } catch (err) {}
    });
  }

  toggle() {
    this.sidebarEl.classList.toggle("-translate-x-full");
    if (this.sidebarEl.classList.contains("-translate-x-full")) {
      this.sidebarEl.setAttribute("aria-hidden", "true");
      this.toggleBtn.setAttribute("aria-expanded", "false");
      this.closeBtn.setAttribute("aria-expanded", "false");
    } else {
      this.sidebarEl.setAttribute("aria-hidden", "false");
      this.toggleBtn.setAttribute("aria-expanded", "true");
      this.closeBtn.setAttribute("aria-expanded", "true");
    }
  }

  close() {
    this.toggleBtn.setAttribute("aria-expanded", "false");
    this.closeBtn.setAttribute("aria-expanded", "false");
    this.sidebarEl.classList.add("-translate-x-full");
    this.sidebarEl.setAttribute("aria-hidden", "true");
  }
}

class Sidebar {
  constructor(elAtt, btnOpenAtt, btnCloseAtt) {
    this.sidebarEl = document.querySelector(elAtt);
    this.openBtn = document.querySelector(btnOpenAtt);
    this.closeBtn = document.querySelector(btnCloseAtt);
    this.openBtn.addEventListener("click", this.open.bind(this));
    this.closeBtn.addEventListener("click", this.close.bind(this));
    this.init();
  }

  init() {
    this.openBtn.setAttribute("aria-expanded", "false");
    this.closeBtn.setAttribute("aria-expanded", "false");
    this.sidebarEl.setAttribute("aria-hidden", "false");
  }

  open() {
    this.openBtn.setAttribute("aria-expanded", "true");
    this.closeBtn.setAttribute("aria-expanded", "true");
    this.sidebarEl.classList.add("translate-x-0");
    this.sidebarEl.classList.remove("translate-x-90");
    this.sidebarEl.setAttribute("aria-hidden", "false");
  }

  close() {
    this.openBtn.setAttribute("aria-expanded", "false");
    this.closeBtn.setAttribute("aria-expanded", "false");
    this.sidebarEl.classList.add("translate-x-90");
    this.sidebarEl.classList.remove("translate-x-0");
    this.sidebarEl.setAttribute("aria-hidden", "true");
  }
}

class darkMode {
  constructor() {
    this.htmlEl = document.querySelector("html");
    this.darkToggleEl = document.querySelector("[data-dark-toggle]");
    this.darkToggleLabel = document.querySelector("[data-dark-toggle-label]");
    this.csrf = document.querySelector("input#csrf_token");
    this.darkMode = false;
    this.init();
  }

  init() {
    // Retrieve dark mode from session storage
    if (sessionStorage.getItem("mode")) {
      this.darkMode = sessionStorage.getItem("mode") === "dark" ? true : false;
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // dark mode
      this.darkMode = true;
      sessionStorage.setItem("mode", "dark");
    } else {
      this.darkMode = false;
      sessionStorage.setItem("mode", "light");
    }

    // Set dark mode
    if (this.darkMode && !this.htmlEl.classList.contains("dark")) {
      this.darkToggleEl.checked = true;
      this.toggle();
    }

    // Handle switch
    this.darkToggleEl.addEventListener("change", (e) => {
      this.toggle();
      this.saveMode();
    });
  }

  toggle() {
    this.htmlEl.classList.toggle("dark");
    this.darkToggleLabel.textContent = this.darkToggleEl.checked
      ? "dark mode"
      : "light mode";
  }

  async saveMode() {
    const mode = this.darkToggleEl.checked ? "dark" : "light";
    sessionStorage.setItem("mode", mode);
  }
}

class FlashMsg {
  constructor() {
    this.openBtn = document.querySelector("[data-flash-sidebar-open]");
    this.flashCount = document.querySelector("[data-flash-count]");
    this.isMsgCheck = false;
    this.init();
  }

  init() {
    //animate message button if message + never opened
    window.addEventListener("load", (e) => {
      if (Number(this.flashCount.textContent) > 0) this.animeBtn();
      // display only one fixed flash message
      const flashFixedEls = document.querySelectorAll(
        "[data-flash-message-fixed]",
      );
      if (flashFixedEls.length > 1) {
        flashFixedEls.forEach((el, i) => {
          if (i > 0) el.remove();
        });
      }
    });
    //stop animate if clicked once
    this.openBtn.addEventListener("click", (e) => {
      try {
        if (
          e.target.closest("button").hasAttribute("data-flash-sidebar-open")
        ) {
          this.isMsgCheck = true;
        }
      } catch (err) {}
    });
    //remove flash message and change count
    window.addEventListener("click", (e) => {
      try {
        if (
          e.target.closest("button").hasAttribute("data-close-flash-message")
        ) {
          //remove logic
          const closeBtn = e.target.closest("button");
          const flashEl = closeBtn.closest("[data-flash-message]");
          flashEl.remove();
          //update count
          this.flashCount.textContent = document.querySelectorAll(
            "[data-flash-message]",
          ).length;
        }
      } catch (err) {}
    });
  }

  animeBtn() {
    this.openBtn.classList.add("rotate-12");

    setTimeout(() => {
      this.openBtn.classList.remove("rotate-12");
      this.openBtn.classList.add("-rotate-12");
    }, 150);

    setTimeout(() => {
      this.openBtn.classList.remove("-rotate-12");
    }, 300);

    setTimeout(() => {
      if (!this.isMsgCheck) {
        this.animeBtn();
      }
    }, 1500);
  }
}

class Loader {
  constructor() {
    this.menuContainer = document.querySelector("[data-menu-container]");
    this.logoContainer = document.querySelector("[data-loader]");
    this.logoEl = document.querySelector("[data-loader-img]");
    this.isLoading = true;
    this.init();
  }

  init() {
    this.loading();
    window.addEventListener("load", (e) => {
      setTimeout(() => {
        this.logoContainer.classList.add("opacity-0");
      }, 350);

      setTimeout(() => {
        this.isLoading = false;
        this.logoContainer.classList.add("hidden");
      }, 650);

      setTimeout(() => {
        this.logoContainer.remove();
      }, 800);
    });
  }

  loading() {
    if ((this.isLoading = true)) {
      setTimeout(() => {
        this.logoEl.classList.toggle("scale-105");
        this.loading();
      }, 300);
    }
  }
}

class Clipboard {
  constructor() {
    this.isCopy = false;
    this.init();
  }

  init() {
    // Show clipboard copy if https and has permissions
    window.addEventListener("load", async () => {
      if (!window.location.href.startsWith("https://")) return;
      document.querySelectorAll("[data-clipboard-copy]").forEach((el) => {
        el.classList.remove("hidden");
      });
    });

    window.addEventListener("click", async (e) => {
      if (!e.target.hasAttribute("data-clipboard-target")) return;
      this.isCopy = false;
      // With Chrome
      try {
        navigator.permissions
          .query({ name: "clipboard-write" })
          .then((result) => {
            try {
              if (result.state === "granted" || result.state === "prompt") {
                /* write to the clipboard now */
                const copyEl = document.querySelector(
                  e.target.getAttribute("data-clipboard-target"),
                );

                copyEl.select();
                copyEl.setSelectionRange(0, 99999); // For mobile devices

                // Copy the text inside the text field

                navigator.clipboard.writeText(copyEl.value);
                // Stop selecting
                copyEl.blur();
                this.isCopy = true;
              }
            } catch (e) {}
          })
          .catch((e) => {});
      } catch (e) {}
      // With Firefox
      try {
        if (!this.isCopy) {
          /* write to the clipboard now */
          const copyEl = document.querySelector(
            e.target.getAttribute("data-clipboard-target"),
          );

          copyEl.select();
          copyEl.setSelectionRange(0, 99999); // For mobile devices

          // Copy the text inside the text field

          navigator.clipboard.writeText(copyEl.value);
          // Stop selecting
          copyEl.blur();
          this.isCopy = true;
        }
      } catch (e) {}
      // Default
      try {
        if (!this.isCopy) {
          /* write to the clipboard now */
          const copyEl = document.querySelector(
            e.target.getAttribute("data-clipboard-target"),
          );

          copyEl.select();
          copyEl.setSelectionRange(0, 99999); // For mobile devices

          // Copy the text inside the text field

          navigator.clipboard.writeText(copyEl.value);
          // Stop selecting

          document.execCommand("copy");
          copyEl.blur();

          this.isCopy = true;
        }
      } catch (e) {}

      // Show feedback
      const btn = e.target.closest("[data-clipboard-copy]");
      const feedbackEl = document.createElement("div");
      feedbackEl.classList.add(
        "absolute",
        "top-0",
        "right-0",
        "p-1",
        "text-white",
        "text-xs",
        "rounded",
        "opacity-0",
        "transition-opacity",
        "duration-300",
        this.isCopy ? "bg-green-500" : "bg-red-500",
      );
      feedbackEl.textContent = this.isCopy ? "Copied!" : "Error!";
      btn.appendChild(feedbackEl);
      setTimeout(() => {
        feedbackEl.classList.remove("opacity-0");
      }, 50);
      setTimeout(() => {
        feedbackEl.classList.add("opacity-0");
      }, 1200);
      setTimeout(() => {
        feedbackEl.remove();
      }, 1550);
    });
  }
}

const setCheckbox = new Checkbox();
const setSelect = new Select();
const setPassword = new Password();
const setDisabledPop = new DisabledPop();
const setDarkM = new darkMode();
const setFlash = new FlashMsg();
const setLoader = new Loader();
const setMenu = new Menu();


const setFlashSidebar = new Sidebar(
  "[data-flash-sidebar]",
  "[data-flash-sidebar-open]",
  "[data-flash-sidebar-close]",
);

const setClipboard = new Clipboard();
