
document.addEventListener("DOMContentLoaded", function () {
  var nav = document.getElementById("nav-placeholder");
  if (nav) {
    fetch("/halcyon/nav.html?v=65")
      .then(function (res) { return res.text(); })
      .then(function (html) { nav.innerHTML = html; })
      .catch(function () {});
  }
});


/* ===== CHARACTER PROMPT MODAL COMMON ===== */
document.addEventListener("DOMContentLoaded", function () {
  var openBtn =
    document.getElementById("openIdCard") ||
    document.querySelector("[data-open-prompt]") ||
    document.querySelector(".kain-prompt-card");

  var modal =
    document.getElementById("characterPromptModal") ||
    document.getElementById("kainIdModal") ||
    document.querySelector("[data-prompt-modal]");

  var closeBtn =
    document.getElementById("closePromptBtn") ||
    document.getElementById("closeIdCardBtn") ||
    (modal ? modal.querySelector("[data-close-prompt]") : null) ||
    (modal ? modal.querySelector(".kain-modal-close") : null);

  var dim =
    document.getElementById("closePromptDim") ||
    document.getElementById("closeIdCardDim") ||
    (modal ? modal.querySelector(".kain-modal-dim") : null);

  function openModal(event) {
    if (event) event.preventDefault();
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(event) {
    if (event) event.preventDefault();
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (openBtn) {
    openBtn.addEventListener("click", openModal);
    openBtn.addEventListener("touchend", openModal, { passive: false });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
    closeBtn.addEventListener("touchend", closeModal, { passive: false });
  }

  if (dim) {
    dim.addEventListener("click", closeModal);
    dim.addEventListener("touchend", closeModal, { passive: false });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal(event);
  });
});

/* ===== LEXI BACKLOG ERROR SEQUENCE ===== */
document.addEventListener("DOMContentLoaded", function () {
  var pageNo = document.getElementById("backlogPageNo");
  var status = document.getElementById("lexiBacklogStatus");
  var title = document.getElementById("lexiBacklogTitle");
  var text = document.getElementById("lexiBacklogText");
  var visual = document.getElementById("lexiBacklogVisual");
  var frame = document.querySelector(".lexi-backlog-frame");
  var shell = document.querySelector(".char_lexi");
  var prev = document.getElementById("backlogPrev");
  var next = document.getElementById("backlogNext");

  if (!pageNo || !status || !title || !text || !visual || !prev || !next) return;

  var unlocked = false;
  var running = false;
  var index = 0;

  var normalPages = [
    {
      no: "01 / 04",
      status: "ACCESS LEVEL 01",
      title: "01. 생명분석국 수석",
      text: "알렉산드라 언더힐. 코드네임 Dr. 렉시. 하모니 CORE 소속 생명분석국 수석 연구원. 그녀의 보고서는 언제나 지나치게 정확했고, 지나치게 차가웠다."
    },
    {
      no: "02 / 04",
      status: "ACCESS LEVEL 02",
      title: "02. 역가이딩 수치",
      text: "렉시는 가이드 파장, 약물 반응, 역가이딩 내성의 상관관계를 가장 빠르게 해석하는 인물로 기록되어 있다. 그녀의 데이터는 종종 현장 판단보다 우선되었다."
    },
    {
      no: "03 / 04",
      status: "ACCESS LEVEL 03",
      title: "03. 약물 개발 기록",
      text: "가이딩 보조 약물과 센티넬 안정화 처방의 상당수는 렉시의 검증 절차를 통과했다. 부작용 기록은 별도 권한으로 분리 보관된다."
    },
    {
      no: "04 / 04",
      status: "LOCKED INDEX",
      title: "04. 비공개 인덱스",
      text: "이 기록은 현재 열람 권한 밖에 있습니다. 다음 페이지를 요청할 경우 보안 검증 절차가 실행됩니다."
    }
  ];

  var secretPage = {
    no: "05 / 05",
    status: "ACCESS GRANTED",
    title: "05. PRIVATE RECORD UNSEALED",
    text: "승인된 기록은 기존 보고서와 일치하지 않는다. 렉시의 연구는 단순한 치료와 안정화가 아니라, 생명 반응을 재현하고 역전시키는 영역에 접근해 있었다. 누락된 실험명, 삭제된 피험자 번호, 그리고 본인의 서명이 남아 있다."
  };

  function render(page) {
    pageNo.textContent = page.no;
    status.textContent = page.status;
    title.textContent = page.title;
    text.textContent = page.text;
  }

  function makePopup(message, delay, danger) {
    setTimeout(function () {
      var p = document.createElement("div");
      p.className = "lexi-error-popup" + (danger ? " is-danger" : "");
      p.innerHTML = "<span>" + message + "</span>";
      p.style.left = (8 + Math.random() * 68) + "vw";
      p.style.top = (12 + Math.random() * 62) + "vh";
      document.body.appendChild(p);

      setTimeout(function () {
        p.classList.add("is-dead");
        setTimeout(function () {
          if (p && p.parentNode) p.parentNode.removeChild(p);
        }, 260);
      }, 700 + Math.random() * 560);
    }, delay);
  }

  function approvedPopup() {
    var p = document.createElement("div");
    p.className = "lexi-approved-popup";
    p.innerHTML = "<b>ACCESS GRANTED</b><span>PRIVATE RECORD UNSEALED</span>";
    document.body.appendChild(p);

    setTimeout(function () {
      p.classList.add("is-dead");
      setTimeout(function () {
        if (p && p.parentNode) p.parentNode.removeChild(p);
      }, 350);
    }, 1250);
  }

  function unlockSequence() {
    if (running || unlocked) return;
    running = true;
    document.body.classList.add("lexi-glitch-mode");
    if (frame) frame.classList.add("is-corrupting");

    var messages = [
      "ERROR CODE 0xLXI-772",
      "DATA FRAGMENT DETECTED",
      "UNAUTHORIZED ACCESS",
      "MEMORY INDEX COLLISION",
      "RECORD LOCK FAILURE",
      "IDENTITY MISMATCH",
      "ARCHIVE RESPONSE FAILED",
      "PRIVATE KEY FOUND"
    ];

    messages.forEach(function (m, i) {
      makePopup(m, i * 135, i % 2 === 0);
    });

    setTimeout(function () {
      document.body.classList.remove("lexi-glitch-mode");
      if (frame) frame.classList.remove("is-corrupting");
      approvedPopup();
    }, 1650);

    setTimeout(function () {
      unlocked = true;
      running = false;
      index = 0;
      if (shell) shell.classList.add("is-unsealed");
      if (frame) frame.classList.add("is-unsealed");
      render(secretPage);
      prev.disabled = true;
      next.disabled = true;
    }, 2900);
  }

  prev.addEventListener("click", function () {
    if (running || unlocked) return;
    index = Math.max(0, index - 1);
    render(normalPages[index]);
  });

  next.addEventListener("click", function () {
    if (running || unlocked) return;
    if (index >= normalPages.length - 1) {
      unlockSequence();
      return;
    }
    index += 1;
    render(normalPages[index]);
  });

  render(normalPages[index]);
});
