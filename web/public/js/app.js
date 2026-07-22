(() => {
  "use strict";

  /* -----------------------------------------------------------
     Utilities
  ----------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     Toasts
  ----------------------------------------------------------- */
  const toastStack = $("#toastStack");
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16.5h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>',
  };

  function toast({ type = "success", title, message, duration = 4500 }) {
    const el = document.createElement("div");
    el.className = "toast";
    el.dataset.type = type;
    el.innerHTML = `
      <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
      <div class="toast-body">
        <strong>${title}</strong>
        ${message ? `<p>${message}</p>` : ""}
      </div>
      <span class="toast-progress" style="animation-duration:${duration}ms"></span>
    `;
    toastStack.appendChild(el);
    const remove = () => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 260);
    };
    const timer = setTimeout(remove, duration);
    el.addEventListener("click", () => { clearTimeout(timer); remove(); });
  }

  /* -----------------------------------------------------------
     Mobile nav
  ----------------------------------------------------------- */
  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    $$("#mainNav a").forEach((a) =>
      a.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* -----------------------------------------------------------
     FAQ accordion
  ----------------------------------------------------------- */
  $$(".faq-item").forEach((item) => {
    const btn = $(".faq-question", item);
    const answer = $(".faq-answer", item);
    btn.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      $$(".faq-item").forEach((other) => {
        other.setAttribute("data-open", "false");
        $(".faq-question", other).setAttribute("aria-expanded", "false");
        $(".faq-answer", other).style.maxHeight = null;
      });
      if (!isOpen) {
        item.setAttribute("data-open", "true");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* -----------------------------------------------------------
     Status pill + Socket.IO realtime updates
  ----------------------------------------------------------- */
  const statusPill = $("#statusPill");
  function setStatus(state, text) {
    if (!statusPill) return;
    statusPill.dataset.state = state;
    $(".status-text", statusPill).textContent = text;
  }

  function applyStatus(status) {
    if (!status) return;
    if (status.registered) setStatus("registered", "Device linked");
    else if (status.ready) setStatus("ready", "Bot online");
    else setStatus("loading", "Starting up…");
  }

  fetch("/api/status")
    .then((r) => r.json())
    .then(applyStatus)
    .catch(() => setStatus("error", "Offline"));

  if (window.io) {
    try {
      const socket = window.io({ transports: ["websocket", "polling"] });
      socket.on("status", applyStatus);
      socket.on("paired", () => {
        toast({
          type: "success",
          title: "Device linked!",
          message: "Your WhatsApp is now connected to the bot.",
          duration: 6000,
        });
        setStatus("registered", "Device linked");
      });
    } catch { /* socket.io optional, page still works without realtime */ }
  }

  /* -----------------------------------------------------------
     Pairing form
  ----------------------------------------------------------- */
  const form = $("#pairForm");
  const phoneInput = $("#phoneInput");
  const submitBtn = $("#pairSubmit");
  const alertBox = $("#pairAlert");
  const idleView = $("#pairIdle");
  const resultView = $("#pairResult");
  const codeText = $("#codeText");
  const copyBtn = $("#copyBtn");
  const newCodeBtn = $("#newCodeBtn");

  const PHONE_RE = /^\+[1-9]\d{6,14}$/;

  function showAlert(message) {
    alertBox.textContent = message;
    alertBox.hidden = false;
  }
  function hideAlert() {
    alertBox.hidden = true;
    alertBox.textContent = "";
  }

  function formatCode(raw) {
    const clean = String(raw).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (clean.length <= 4) return clean;
    return clean.slice(0, 4) + "-" + clean.slice(4);
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);
  }

  async function requestCode(number) {
    const res = await fetch("/api/pair", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number }),
    });
    let data;
    try { data = await res.json(); } catch { data = {}; }
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to generate a pairing code.");
    }
    return data.code;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();

    const raw = phoneInput.value.trim();
    const number = raw.startsWith("+") ? raw : "+" + raw.replace(/[^0-9]/g, "");

    if (!PHONE_RE.test(number)) {
      showAlert("Enter a valid number with country code, e.g. +18095551234.");
      phoneInput.focus();
      return;
    }

    setLoading(true);
    try {
      const code = await requestCode(number);
      codeText.textContent = formatCode(code);
      idleView.hidden = true;
      resultView.hidden = false;
      toast({ type: "success", title: "Code generated", message: "Enter it in WhatsApp before it expires." });
    } catch (err) {
      showAlert(err.message || "Something went wrong. Please try again.");
      toast({ type: "error", title: "Couldn't generate code", message: err.message });
    } finally {
      setLoading(false);
    }
  });

  copyBtn?.addEventListener("click", async () => {
    const value = codeText.textContent.replace(/\u2011|-/g, "").trim();
    try {
      await navigator.clipboard.writeText(value);
      copyBtn.classList.add("copied");
      const label = $("span:last-child", copyBtn);
      const original = label.textContent;
      label.textContent = "Copied!";
      toast({ type: "success", title: "Copied to clipboard" });
      setTimeout(() => { label.textContent = original; copyBtn.classList.remove("copied"); }, 1800);
    } catch {
      toast({ type: "error", title: "Copy failed", message: "Select and copy the code manually." });
    }
  });

  newCodeBtn?.addEventListener("click", () => {
    resultView.hidden = true;
    idleView.hidden = false;
    hideAlert();
    phoneInput.focus();
  });
})();
