fetch("./nav.html?v=18")
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
  setupBgmPlayer();
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
    cursor.classList.remove("is_active");
  });

  document.addEventListener("mouseover", function (event) {
    if (event.target.closest("a, button, .arch-card, .sfs_photo, .rgr_photo")) {
      cursor.classList.add("is_hover");
    }
  });

  document.addEventListener("mouseout", function (event) {
    if (event.target.closest("a, button, .arch-card, .sfs_photo, .rgr_photo")) {
      cursor.classList.remove("is_hover");
    }
  });
}

function setupBgmPlayer() {
  if (document.getElementById("bgmPlayer")) {
    return;
  }

  var player = document.createElement("div");
  player.className = "bgm_player";
  player.id = "bgmPlayer";
  player.setAttribute("aria-label", "BGM player");

  player.innerHTML =
    '<audio id="bgmAudio" src="./audio/bgm.mp3" loop preload="auto"></audio>' +
    '<div class="bgm_meta">' +
      '<span class="bgm_label">BGM</span>' +
      '<span class="bgm_title">ARCHIVE AMBIENCE</span>' +
    '</div>' +
    '<button class="bgm_button" id="bgmToggle" type="button" aria-label="BGM 재생">PLAY</button>';

  document.body.appendChild(player);

  var bgmAudio = document.getElementById("bgmAudio");
  var bgmToggle = document.getElementById("bgmToggle");

  if (bgmAudio && bgmToggle) {
    bgmAudio.volume = 0.18;

    bgmToggle.addEventListener("click", function () {
      if (bgmAudio.paused) {
        bgmAudio.play();
        bgmToggle.textContent = "STOP";
        bgmToggle.setAttribute("aria-label", "BGM 정지");
      } else {
        bgmAudio.pause();
        bgmToggle.textContent = "PLAY";
        bgmToggle.setAttribute("aria-label", "BGM 재생");
      }
    });
  }
}
