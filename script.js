
/* ===== COMMON NAV ===== */
document.addEventListener("DOMContentLoaded", function () {
  var nav = document.getElementById("nav-placeholder");
  if (nav) {
    fetch("/halcyon/nav.html?v=68")
      .then(function (res) { return res.text(); })
      .then(function (html) { nav.innerHTML = html; })
      .catch(function () {});
  }
});

/* ===== COMMON CHARACTER PROMPT MODAL ===== */
document.addEventListener("DOMContentLoaded", function () {
  var modal =
    document.querySelector("[data-prompt-modal]") ||
    document.getElementById("characterPromptModal") ||
    document.getElementById("kainIdModal");

  if (!modal) return;

  var openBtns = Array.prototype.slice.call(
    document.querySelectorAll("[data-open-prompt], #openIdCard, .kain-prompt-card")
  );

  var closeBtns = Array.prototype.slice.call(
    modal.querySelectorAll("[data-close-prompt], .kain-modal-close")
  );

  var dim = modal.querySelector(".kain-modal-dim");

  function openModal(event) {
    if (event) event.preventDefault();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("prompt-modal-open");
  }

  function closeModal(event) {
    if (event) event.preventDefault();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("prompt-modal-open");
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });

  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  if (dim) dim.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal(event);
  });
});

/* ===== COMMON BACKLOG PAGER ===== */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-backlog-reader]").forEach(function (reader) {
    var pages = Array.prototype.slice.call(reader.querySelectorAll(".backlog_page"));
    var count = reader.querySelector("[data-backlog-count]");
    var prev = reader.querySelector("[data-backlog-prev]");
    var next = reader.querySelector("[data-backlog-next]");
    var index = 0;

    if (!pages.length || !prev || !next) return;

    function render() {
      pages.forEach(function (page, i) {
        page.classList.toggle("is_active", i === index);
      });
      if (count) {
        count.textContent = "Page " + String(index + 1).padStart(2, "0") + " / " + String(pages.length).padStart(2, "0");
      }
      prev.disabled = index === 0;
      next.disabled = index === pages.length - 1;
    }

    prev.addEventListener("click", function () {
      if (index > 0) index -= 1;
      render();
    });

    next.addEventListener("click", function () {
      if (index < pages.length - 1) index += 1;
      render();
    });

    render();
  });
});

/* ===== COMMON BACKLOG IMAGE LIGHTBOX ===== */
document.addEventListener("DOMContentLoaded", function () {
  var lightbox = document.getElementById("backlogLightbox");
  if (!lightbox) return;

  var img = lightbox.querySelector("img");
  var target = document.querySelector(".backlog_novel_visual img, .backlog_novel_img");

  if (target && img) {
    target.addEventListener("click", function () {
      img.src = target.src;
      lightbox.classList.add("is_open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  }

  lightbox.addEventListener("click", function () {
    lightbox.classList.remove("is_open");
    lightbox.setAttribute("aria-hidden", "true");
  });
});
