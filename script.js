fetch("./nav.html?v=24")
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

  document.addEventListener("mousemove", function (event) {
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
    cursor.classList.add("is_active");
  });

  document.addEventListener("mouseleave", function () {
    
  });

  document.addEventListener("mouseover", function (event) {
    if (event.target.closest("a, button, .arch-card, .sfs_photo, .rgr_photo, .nav_dropdown")) {
      cursor.classList.add("is_hover");
    }
  });

  document.addEventListener("mouseout", function (event) {
    if (event.target.closest("a, button, .arch-card, .sfs_photo, .rgr_photo, .nav_dropdown")) {
      cursor.classList.remove("is_hover");
    }
  });

  document.addEventListener("mousedown", function () {
    cursor.classList.add("is_hover");
  });

  document.addEventListener("mouseup", function () {
    cursor.classList.remove("is_hover");
  });
}
