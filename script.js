
/* ===== COMMON NAV ===== */
document.addEventListener("DOMContentLoaded", function () {
  var nav = document.getElementById("nav-placeholder");
  if (nav) {
    fetch("./nav.html?v=83")
      .then(function (res) { return res.text(); })
      .then(function (html) {
        nav.innerHTML = html;

        var currentPage = window.location.pathname.split("/").pop() || "index.html";
        nav.querySelectorAll("a").forEach(function (link) {
          var linkPage = link.getAttribute("href").split("/").pop();
          if (linkPage === currentPage || linkPage + ".html" === currentPage) {
            link.setAttribute("aria-current", "page");
          }
        });
      })
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


/* v71 image song player */
(function(){
  const card=document.getElementById("kainImageSongPlayer");
  if(!card) return;
  const audio=document.getElementById("kainSongAudio");
  const playBtn=document.getElementById("kainSongPlay");
  const progress=document.getElementById("kainSongProgress");
  const current=document.getElementById("kainSongCurrent");
  const duration=document.getElementById("kainSongDuration");
  const waveBars=Array.from(document.querySelectorAll("#kainSongWave span"));
  const openLyrics=document.getElementById("kainLyricsOpen");
  const closeLyrics=document.getElementById("kainLyricsClose");
  const lyricsOverlay=document.getElementById("kainLyricsOverlay");
  let audioCtx=null,analyser=null,dataArray=null,sourceNode=null,rafId=null;
  function formatTime(sec){if(!Number.isFinite(sec))return"00:00";const m=Math.floor(sec/60),s=Math.floor(sec%60);return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}
  function updateProgress(){const d=audio.duration||0,c=audio.currentTime||0;current.textContent=formatTime(c);duration.textContent=formatTime(d);const r=d?c/d:0;progress.value=Math.max(0,Math.min(1000,r*1000));progress.style.setProperty("--p",(r*100).toFixed(2)+"%");}
  function connectAnalyser(){if(sourceNode)return;audioCtx=new(window.AudioContext||window.webkitAudioContext)();analyser=audioCtx.createAnalyser();analyser.fftSize=64;analyser.smoothingTimeConstant=.72;dataArray=new Uint8Array(analyser.frequencyBinCount);sourceNode=audioCtx.createMediaElementSource(audio);sourceNode.connect(analyser);analyser.connect(audioCtx.destination)}
  function renderWave(){if(!analyser||audio.paused||audio.ended){rafId=null;return}analyser.getByteFrequencyData(dataArray);waveBars.forEach((bar,i)=>{const idx=Math.floor(i/waveBars.length*dataArray.length),v=dataArray[idx]||0;bar.style.height=(4+v/255*20).toFixed(1)+"px";bar.style.opacity=(.24+v/255*.66).toFixed(2)});rafId=requestAnimationFrame(renderWave)}
  async function playSong(){try{connectAnalyser();if(audioCtx.state==="suspended")await audioCtx.resume();await audio.play();card.classList.remove("is-fake-playing");playBtn.textContent="Ⅱ";if(!rafId)renderWave()}catch(e){card.classList.toggle("is-fake-playing");playBtn.textContent=card.classList.contains("is-fake-playing")?"Ⅱ":"▶"}}
  function pauseSong(){audio.pause();card.classList.remove("is-fake-playing");playBtn.textContent="▶";waveBars.forEach(bar=>{bar.style.height="4px";bar.style.opacity=".24"})}
  playBtn.addEventListener("click",()=>audio.paused?playSong():pauseSong());
  audio.addEventListener("loadedmetadata",updateProgress);audio.addEventListener("timeupdate",updateProgress);audio.addEventListener("ended",()=>{playBtn.textContent="▶";progress.value=0;progress.style.setProperty("--p","0%")});
  progress.addEventListener("input",()=>{if(!audio.duration)return;audio.currentTime=Number(progress.value)/1000*audio.duration;updateProgress()});
  openLyrics.addEventListener("click",()=>{lyricsOverlay.classList.add("is-open");lyricsOverlay.setAttribute("aria-hidden","false")});
  closeLyrics.addEventListener("click",()=>{lyricsOverlay.classList.remove("is-open");lyricsOverlay.setAttribute("aria-hidden","true")});
  lyricsOverlay.addEventListener("click",e=>{if(e.target===lyricsOverlay){lyricsOverlay.classList.remove("is-open");lyricsOverlay.setAttribute("aria-hidden","true")}});
  updateProgress();
})();


/* v76 Image Song Player */
function initHalcyonImageSongPlayers(){
  document.querySelectorAll("[data-image-song-player]").forEach((card) => {
    if(card.dataset.songReady === "true") return;
    card.dataset.songReady = "true";

    const audio = card.querySelector("[data-song-audio]");
    const playBtn = card.querySelector("[data-song-play]");
    const progress = card.querySelector("[data-song-progress]");
    const current = card.querySelector("[data-song-current]");
    const duration = card.querySelector("[data-song-duration]");
    const lyricsOpen = card.querySelector("[data-lyrics-open]");
    const lyricsClose = card.querySelector("[data-lyrics-close]");
    const lyricsOverlay = card.querySelector("[data-lyrics-overlay]");
    const waveBars = Array.from(card.querySelectorAll(".kain-song-wave span"));

    let audioCtx = null;
    let analyser = null;
    let dataArray = null;
    let sourceNode = null;
    let rafId = null;

    const formatTime = (sec) => {
      if(!Number.isFinite(sec)) return "00:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
    };

    const updateProgress = () => {
      const d = audio?.duration || 0;
      const c = audio?.currentTime || 0;
      if(current) current.textContent = formatTime(c);
      if(duration) duration.textContent = formatTime(d);
      const ratio = d ? c / d : 0;
      if(progress){
        progress.value = Math.max(0, Math.min(1000, ratio * 1000));
        progress.style.setProperty("--p", (ratio * 100).toFixed(2) + "%");
      }
    };

    const connectAnalyser = () => {
      if(sourceNode || !audio) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = .72;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      sourceNode = audioCtx.createMediaElementSource(audio);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    };

    const renderWave = () => {
      if(!analyser || !audio || audio.paused || audio.ended){
        rafId = null;
        return;
      }
      analyser.getByteFrequencyData(dataArray);
      waveBars.forEach((bar, i) => {
        const idx = Math.floor(i / waveBars.length * dataArray.length);
        const value = dataArray[idx] || 0;
        bar.style.height = (4 + value / 255 * 20).toFixed(1) + "px";
        bar.style.opacity = (.24 + value / 255 * .66).toFixed(2);
      });
      rafId = requestAnimationFrame(renderWave);
    };

    const pauseSong = () => {
      if(audio) audio.pause();
      card.classList.remove("is-fake-playing");
      if(playBtn) playBtn.textContent = "▶";
      waveBars.forEach(bar => {
        bar.style.height = "4px";
        bar.style.opacity = ".24";
      });
    };

    const playSong = async () => {
      try{
        connectAnalyser();
        if(audioCtx?.state === "suspended") await audioCtx.resume();
        await audio.play();
        card.classList.remove("is-fake-playing");
        if(playBtn) playBtn.textContent = "Ⅱ";
        if(!rafId) renderWave();
      }catch(error){
        card.classList.toggle("is-fake-playing");
        if(playBtn) playBtn.textContent = card.classList.contains("is-fake-playing") ? "Ⅱ" : "▶";
      }
    };

    playBtn?.addEventListener("click", () => {
      if(!audio || audio.paused) playSong();
      else pauseSong();
    });

    audio?.addEventListener("loadedmetadata", updateProgress);
    audio?.addEventListener("timeupdate", updateProgress);
    audio?.addEventListener("ended", () => {
      if(playBtn) playBtn.textContent = "▶";
      if(progress){
        progress.value = 0;
        progress.style.setProperty("--p","0%");
      }
    });

    progress?.addEventListener("input", () => {
      if(!audio?.duration) return;
      audio.currentTime = Number(progress.value) / 1000 * audio.duration;
      updateProgress();
    });

    lyricsOpen?.addEventListener("click", () => {
      lyricsOverlay?.classList.add("is-open");
      lyricsOverlay?.setAttribute("aria-hidden","false");
    });

    lyricsClose?.addEventListener("click", () => {
      lyricsOverlay?.classList.remove("is-open");
      lyricsOverlay?.setAttribute("aria-hidden","true");
    });

    lyricsOverlay?.addEventListener("click", (event) => {
      if(event.target === lyricsOverlay){
        lyricsOverlay.classList.remove("is-open");
        lyricsOverlay.setAttribute("aria-hidden","true");
      }
    });

    updateProgress();
  });
}

document.addEventListener("DOMContentLoaded", initHalcyonImageSongPlayers);

/* ===== PROMPT ARCHIVE V80 ===== */
document.addEventListener("DOMContentLoaded", function () {
  var archive = document.querySelector("[data-prompt-carousel]");
  if (!archive) return;

  /*
    thumbnail: 캐러셀에 보이는 세로 썸네일
    image: 클릭했을 때 팝업에 보이는 원본 이미지
    두 파일을 따로 지정하면 각각 다른 이미지를 사용할 수 있습니다.
  */
  var records = [
    {
      title: "FIRN",
      thumbnail: "./images/archive/firn_frs.png",
      image: "./images/archive/firn_fr.png",
      prompt: "girl, 3::aged up::, mature female, tall female, small breasts, long hair, side part, parted bangs, pale sky blue hair, no bangs, straight hair, very long sidelocks, half updo, lavender eyes, empty eyes, 1.5::dead eyes::, tsurime, unturned eyes, half-closed eyes, black military officer uniform, 2::black peaked cap::, formal black long coat, black one-shoulder cape, silver epaulettes, silver trim, black dress shirt, high collar"
    },
    {
      title: "LIBERTY",
      thumbnail: "./images/archive/liberty_frs.png",
      image: "./images/archive/liberty_fr.png",
      prompt: "1girl, mature female, white hair, sleepy eyes, white padded uniform, winter field gear, cold atmosphere, desaturated blue-gray palette, cinematic portrait"
    },
    {
      title: "REM",
      thumbnail: "./images/archive/rem_frs.png",
      image: "./images/archive/rem_fr.png",
      prompt: "1girl, black tactical uniform, electric light, pale yellow lightning, black background, high contrast, cinematic rim light, character portrait"
    },
    {
      title: "KAIN",
      thumbnail: "./images/archive/kain_frs.png",
      image: "./images/archive/kain_fr.png",
      prompt: "1girl, short brown hair, neat bangs, restrained expression, practical uniform, muted noir palette, soft backlight, vertical portrait"
    },
    {
      title: "LILY",
      thumbnail: "./images/archive/lily_frs.png",
      image: "./images/archive/lily_fr.png",
      prompt: "1girl, wind guide, dark uniform, subtle air vibration, soundwave distortion, pure black background, cool gray highlights"
    },
    {
      title: "SHORT",
      thumbnail: "./images/archive/short_frs.png",
      image: "./images/archive/short_fr.png",
      prompt: "1man, navy slicked-back undercut, gray eyes, facial burn scar, black military uniform, one-shoulder cape, blue fire, cinematic character portrait"
    },
    {
      title: "NOCTURNE",
      thumbnail: "./images/archive/nocturne_frs.png",
      image: "./images/archive/nocturne_fr.png",
      prompt: "1girl, medical researcher, black uniform, clinical lighting, monochrome laboratory mood, calm expression, precise linework, portrait"
    },
    {
      title: "AVICI",
      thumbnail: "./images/archive/avici_frs.png",
      image: "./images/archive/avici_fr.png",
      prompt: "1girl, elegant long hair, black uniform, dark green botanical effects, poisonous flowers, serene smile, moody portrait lighting"
    },
    {
      title: "MARIGOLD",
      thumbnail: "./images/archive/marigold_frs.png",
      image: "./images/archive/marigold_fr.png",
      prompt: "1girl, very long blue-black hair, blue eyes, pale skin, black formal uniform, cold expression, dim electric light, cinematic portrait"
    },
    {
      title: "SORA",
      thumbnail: "./images/archive/sora_frs.png",
      image: "./images/archive/sora_fr.png",
      prompt: "1man, dark military uniform, long coat, wind pressure, teal air current, black background, sharp profile, dramatic rim light"
    },
    {
      title: "DAWN",
      thumbnail: "./images/archive/dawn_frs.png",
      image: "./images/archive/dawn_fr.png",
      prompt: "1girl, guide uniform, quiet expression, starlight reflection, dark navy background, muted celestial atmosphere, film grain"
    },
    {
      title: "MUSE",
      thumbnail: "./images/archive/muse_frs.png",
      image: "./images/archive/muse_fr.png",
      prompt: "1girl, short stature, black officer uniform, thin yellow lightning, blackout city lights, hard rim light, high contrast portrait"
    },
     {
      title: "CAIRN",
      thumbnail: "./images/archive/cairn_frs.png",
      image: "./images/archive/cairn_fr.png",
      prompt: "1girl, short stature, black officer uniform, thin yellow lightning, blackout city lights, hard rim light, high contrast portrait"
    },
     {
      title: "ECHO",
      thumbnail: "./images/archive/echo_frs.png",
      image: "./images/archive/echo_fr.png",
      prompt: "1girl, short stature, black officer uniform, thin yellow lightning, blackout city lights, hard rim light, high contrast portrait"
    },
     {
      title: "DOVE",
      thumbnail: "./images/archive/dove_frs.png",
      image: "./images/archive/dove_fr.png",
      prompt: "1girl, short stature, black officer uniform, thin yellow lightning, blackout city lights, hard rim light, high contrast portrait"
    },
     {
      title: "DR.LEXI",
      thumbnail: "./images/archive/lexi_frs.png",
      image: "./images/archive/lexi_fr.png",
      prompt: "1girl, short stature, black officer uniform, thin yellow lightning, blackout city lights, hard rim light, high contrast portrait"
    },
     {
      title: "POLARIS",
      thumbnail: "./images/archive/polaris_frs.png",
      image: "./images/archive/polaris_fr.png",
      prompt: "1girl, short stature, black officer uniform, thin yellow lightning, blackout city lights, hard rim light, high contrast portrait"
    }
  ];

  var track = archive.querySelector("[data-carousel-track]");
  var prev = archive.querySelector("[data-carousel-prev]");
  var next = archive.querySelector("[data-carousel-next]");
  var progress = document.querySelector("[data-carousel-progress]");
  var modal = document.querySelector("[data-archive-modal]");
  var modalTitle = modal.querySelector("[data-modal-title]");
  var modalImage = modal.querySelector("[data-modal-image]");
  var modalPrompt = modal.querySelector("[data-modal-prompt]");
  var copyButton = modal.querySelector("[data-copy-prompt]");
  var lastFocused = null;
  var position = 0;

  records.forEach(function (record, index) {
    var item = document.createElement("button");
    var image = document.createElement("img");
    var label = document.createElement("span");

    item.type = "button";
    item.className = "prompt_archive_item";
    item.setAttribute("aria-label", record.title + " 프롬프트 열기");

    image.src = record.thumbnail;
    image.alt = record.title + " 썸네일";
    image.loading = index < 8 ? "eager" : "lazy";

    label.className = "prompt_archive_item_label";
    label.innerHTML = "<span>" + record.title + "</span>";

    item.appendChild(image);
    item.appendChild(label);
    item.addEventListener("click", function () {
      openModal(record, item);
    });
    track.appendChild(item);
  });

  function visibleCount() {
    var value = parseInt(getComputedStyle(track).getPropertyValue("--visible-count"), 10);
    return Number.isFinite(value) ? value : 8;
  }

  function maxPosition() {
    return Math.max(0, records.length - visibleCount());
  }

  function renderCarousel() {
    var visible = visibleCount();
    var max = maxPosition();
    position = Math.min(position, max);
    track.style.transform = "translate3d(" + (-position * (100 / visible)) + "%, 0, 0)";
    prev.disabled = position === 0;
    next.disabled = position === max;

    progress.style.width = ((position + visible) / records.length * 100) + "%";
  }

  function openModal(record, source) {
    lastFocused = source;
    modalTitle.textContent = record.title;
    modalImage.src = record.image;
    modalImage.alt = record.title + " 원본 이미지";
    modalPrompt.textContent = record.prompt;
    copyButton.textContent = "COPY PROMPT";
    modal.classList.add("is_open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("prompt_archive_modal_open");
    modal.querySelector(".prompt_archive_modal_close").focus();
  }

  function closeModal() {
    modal.classList.remove("is_open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("prompt_archive_modal_open");
    if (lastFocused) lastFocused.focus();
  }

  prev.addEventListener("click", function () {
    position = Math.max(0, position - 1);
    renderCarousel();
  });

  next.addEventListener("click", function () {
    position = Math.min(maxPosition(), position + 1);
    renderCarousel();
  });

  modal.querySelectorAll("[data-archive-close]").forEach(function (button) {
    button.addEventListener("click", closeModal);
  });

  copyButton.addEventListener("click", function () {
    var promptText = modalPrompt.textContent;
    var copied = navigator.clipboard && window.isSecureContext
      ? navigator.clipboard.writeText(promptText)
      : Promise.reject();

    copied.then(function () {
      copyButton.textContent = "COPIED";
    }).catch(function () {
      var field = document.createElement("textarea");
      field.value = promptText;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
      copyButton.textContent = "COPIED";
    });
  });

  document.addEventListener("keydown", function (event) {
    if (modal.classList.contains("is_open")) {
      if (event.key === "Escape") closeModal();
      return;
    }

    if (event.key === "ArrowLeft") prev.click();
    if (event.key === "ArrowRight") next.click();
  });

  window.addEventListener("resize", renderCarousel);
  renderCarousel();
});

/* ===== COMMON UNIT IMAGE LIGHTBOX V80 ===== */
document.addEventListener("DOMContentLoaded", function () {
  var photoLinks = Array.prototype.slice.call(
    document.querySelectorAll(".sfs_photo, .rgr_photo")
  );

  if (!photoLinks.length) return;

  var lightbox = document.createElement("div");
  lightbox.className = "unit_media_lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML =
    '<div class="unit_media_lightbox_inner" role="dialog" aria-modal="true" aria-label="이미지 크게 보기">' +
      '<button class="unit_media_lightbox_close" type="button" aria-label="닫기">×</button>' +
      '<img class="unit_media_lightbox_img" src="" alt="확대 이미지">' +
      '<div class="unit_media_lightbox_hint">CLICK ANYWHERE TO CLOSE</div>' +
    '</div>';
  document.body.appendChild(lightbox);

  var lightboxImage = lightbox.querySelector(".unit_media_lightbox_img");
  var closeButton = lightbox.querySelector(".unit_media_lightbox_close");
  var lastFocused = null;

  function closeLightbox() {
    lightbox.classList.remove("is_open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("unit_media_lightbox_open");
    lightboxImage.removeAttribute("src");
    if (lastFocused) lastFocused.focus();
  }

  photoLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var thumbnail = link.querySelector("img");
      var fullImage = link.getAttribute("data-full") || link.getAttribute("href") || (thumbnail ? thumbnail.getAttribute("src") : "");

      event.preventDefault();
      if (!fullImage || fullImage === "#" || !thumbnail || thumbnail.hidden) return;
      if (thumbnail.complete && thumbnail.naturalWidth === 0) return;

      lastFocused = link;
      lightboxImage.src = fullImage;
      lightboxImage.alt = thumbnail.alt || "확대 이미지";
      lightbox.classList.add("is_open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("unit_media_lightbox_open");
      closeButton.focus();
    });
  });

  lightbox.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox.classList.contains("is_open")) {
      closeLightbox();
    }
  });
});
