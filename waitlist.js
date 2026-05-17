(function () {
  const drawer = document.getElementById("waitlist-drawer");
  const form = document.getElementById("waitlist-form");
  const success = document.getElementById("waitlist-success");
  const error = document.getElementById("waitlist-error");
  const submitBtn = form.querySelector('button[type="submit"]');
  const openTriggers = document.querySelectorAll("[data-waitlist-open]");
  const closeTriggers = drawer.querySelectorAll("[data-waitlist-close]");

  const submitLabel = submitBtn.textContent;

  let lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    requestAnimationFrame(() => drawer.classList.add("drawer--open"));

    const firstInput = form.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeDrawer() {
    drawer.classList.remove("drawer--open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");

    window.setTimeout(() => {
      if (!drawer.classList.contains("drawer--open")) {
        drawer.hidden = true;
      }
    }, 260);

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function resetForm() {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    error.hidden = true;
    submitBtn.disabled = false;
    submitBtn.textContent = submitLabel;
  }

  openTriggers.forEach((el) => {
    el.addEventListener("click", () => {
      resetForm();
      openDrawer();
    });
  });

  closeTriggers.forEach((el) => {
    el.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("drawer--open")) {
      closeDrawer();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Submit failed");
      }

      form.reset();
      form.hidden = true;
      success.hidden = false;
    } catch {
      error.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });
})();
