fetch("./nav.html?v=25")
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    var navPlaceholder = document.getElementById("nav-placeholder");

    if (navPlaceholder) {
      navPlaceholder.innerHTML = data;
    }

    setupCustomCursor();
  })
  .catch(function(error) {
    console.log("Navigation load failed:", error);
    setupCustomCursor();
  });

document.addEventListener("DOMContentLoaded", function () {
  setupCustomCursor();
});

function setupCustomCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  var cursor = document.getElementById("customCursor");

  if (!cursor) {
    cursor = document.createElement("div");
    cursor.className = "custom_cursor";
    cursor.id = "customCursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
  }

  if (cursor.dataset.ready === "true") {
    return;
  }

  cursor.dataset.ready = "true";

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var currentX = mouseX;
  var currentY = mouseY;
  var isHovering = false;

  cursor.style.left = currentX + "px";
  cursor.style.top = currentY + "px";
  cursor.classList.add("is_active");

  function moveCursor(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.classList.add("is_active");
  }

  function animateCursor() {
    currentX += (mouseX - currentX) * 0.38;
    currentY += (mouseY - currentY) * 0.38;

    cursor.style.left = currentX + "px";
    cursor.style.top = currentY + "px";

    cursor.classList.add("is_active");

    if (isHovering) {
      cursor.classList.add("is_hover");
    } else {
      cursor.classList.remove("is_hover");
    }

    requestAnimationFrame(animateCursor);
  }

  window.addEventListener("pointermove", moveCursor, { passive: true });
  window.addEventListener("mousemove", moveCursor, { passive: true });

  document.addEventListener("pointerover", function (event) {
    if (event.target.closest("a, button, input, textarea, select, label, summary, .arch-card, .sfs_photo, .rgr_photo, .nav_dropdown")) {
      isHovering = true;
    }
  }, true);

  document.addEventListener("pointerout", function (event) {
    if (event.target.closest("a, button, input, textarea, select, label, summary, .arch-card, .sfs_photo, .rgr_photo, .nav_dropdown")) {
      isHovering = false;
    }
  }, true);

  document.addEventListener("mousedown", function () {
    isHovering = true;
    cursor.classList.add("is_hover");
    cursor.classList.add("is_active");
  }, true);

  document.addEventListener("mouseup", function () {
    isHovering = false;
    cursor.classList.remove("is_hover");
    cursor.classList.add("is_active");
  }, true);

  window.addEventListener("blur", function () {
    cursor.classList.add("is_active");
  });

  window.addEventListener("focus", function () {
    cursor.classList.add("is_active");
  });

  setInterval(function () {
    cursor.classList.add("is_active");
  }, 250);

  requestAnimationFrame(animateCursor);
}
