
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
