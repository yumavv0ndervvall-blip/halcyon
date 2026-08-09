/* ===== LEXI ONLY BACKLOG ERROR SEQUENCE V67 ===== */
document.addEventListener("DOMContentLoaded", function () {
  var reader = document.getElementById("lexiBacklogReader");
  var page = document.getElementById("lexiBacklogPage");
  var access = document.getElementById("lexiBacklogAccess");
  var count = document.getElementById("lexiBacklogCount");
  var title = document.getElementById("lexiBacklogTitle");
  var text = document.getElementById("lexiBacklogText");
  var corruptLine = document.getElementById("lexiCorruptLine");
  var image = document.getElementById("lexiBacklogImage");
  var prev = document.getElementById("lexiPrev");
  var next = document.getElementById("lexiNext");

  if (!reader || !page || !access || !count || !title || !text || !prev || !next) return;

  var index = 0;
  var running = false;
  var unlocked = false;

  var normal = [
    {
      page: "Page 01 / 04",
      access: "ACCESS LEVEL 01",
      title: "생명분석국 수석",
      line: "CORE LIFE ANALYSIS DATABASE",
      text: "알렉산드라 언더힐. 코드네임 Dr. 렉시. 하모니 CORE 소속 생명분석국 수석 연구원. 그녀의 보고서는 언제나 지나치게 정확했고, 지나치게 차가웠다."
    },
    {
      page: "Page 02 / 04",
      access: "ACCESS LEVEL 02",
      title: "역가이딩 수치",
      line: "GUIDING RESPONSE VALUE 98.7",
      text: "렉시는 가이드 파장, 약물 반응, 역가이딩 내성의 상관관계를 가장 빠르게 해석하는 인물로 기록되어 있다. 그녀의 데이터는 종종 현장 판단보다 우선되었다."
    },
    {
      page: "Page 03 / 04",
      access: "ACCESS LEVEL 03",
      title: "약물 개발 기록",
      line: "STABILIZER PROTOCOL ARCHIVE",
      text: "가이딩 보조 약물과 센티넬 안정화 처방의 상당수는 렉시의 검증 절차를 통과했다. 부작용 기록은 별도 권한으로 분리 보관된다."
    },
    {
      page: "Page 04 / 04",
      access: "LOCKED INDEX",
      title: "비공개 인덱스",
      line: "REQUESTING NEXT PAGE WILL TRIGGER SECURITY CHECK",
      text: "이 기록은 현재 열람 권한 밖에 있습니다. 다음 페이지를 요청할 경우 보안 검증 절차가 실행됩니다."
    }
  ];

  var secret = {
    page: "Page 01 / 01",
    access: "ACCESS GRANTED",
    title: "PRIVATE RECORD UNSEALED",
    line: "MISSING SUBJECT INDEX RESTORED",
    text: "승인된 기록은 기존 보고서와 일치하지 않는다. 렉시의 연구는 단순한 치료와 안정화가 아니라, 생명 반응을 재현하고 역전시키는 영역에 접근해 있었다. 누락된 실험명, 삭제된 피험자 번호, 그리고 본인의 서명이 남아 있다."
  };

  var fragments = [
    "LXI_INDEX_0000 // ████",
    "SUBJECT VALUE: NULL",
    "GUIDING RESPONSE 98.7 // OVERFLOW",
    "CORE RECORD FAILED",
    "IDENTITY KEY DOES NOT MATCH",
    "RECONSTRUCTING PAGE 01",
    "PRIVATE INDEX FOUND",
    "UNSEALING..."
  ];

  function setPage(data) {
    page.textContent = data.page;
    access.textContent = data.access;
    count.textContent = data.page;
    title.textContent = data.title;
    text.textContent = data.text;
    if (corruptLine) corruptLine.textContent = data.line;
    prev.disabled = unlocked || index === 0 || running;
    next.disabled = unlocked || running;
  }

  function makeNoise(length) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_/#$%&<>[]{}░▒▓█";
    var out = "";
    for (var i = 0; i < length; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
      if (i % 24 === 23) out += " ";
    }
    return out;
  }

  function scrambleText(duration) {
    var started = Date.now();
    var timer = setInterval(function () {
      title.textContent = fragments[Math.floor(Math.random() * fragments.length)];
      text.textContent = makeNoise(132 + Math.floor(Math.random() * 90));
      if (corruptLine) corruptLine.textContent = makeNoise(28);
      page.textContent = "Page ?? / ??";
      access.textContent = "RECORD COLLISION";
      count.textContent = "Page 00 / 00";

      if (Date.now() - started > duration) {
        clearInterval(timer);
      }
    }, 82);
  }

  function popup(message, delay, danger) {
    setTimeout(function () {
      var p = document.createElement("div");
      p.className = "lexi-error-popup" + (danger ? " is-danger" : "");
      p.innerHTML = "<span>" + message + "</span>";
      p.style.left = (14 + Math.random() * 72) + "vw";
      p.style.top = (16 + Math.random() * 64) + "vh";
      document.body.appendChild(p);

      setTimeout(function () {
        p.classList.add("is-dead");
        setTimeout(function () {
          if (p.parentNode) p.parentNode.removeChild(p);
        }, 260);
      }, 720 + Math.random() * 520);
    }, delay);
  }

  function approved() {
    var p = document.createElement("div");
    p.className = "lexi-approved-popup";
    p.innerHTML = "<b>ACCESS GRANTED</b><span>PRIVATE RECORD UNSEALED</span>";
    document.body.appendChild(p);

    setTimeout(function () {
      p.classList.add("is-dead");
      setTimeout(function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 320);
    }, 1300);
  }

  function runUnlock() {
    if (running || unlocked) return;

    running = true;
    prev.disabled = true;
    next.disabled = true;

    document.body.classList.add("lexi-glitch-mode");
    reader.classList.add("is-corrupting");

    [
      "ERROR CODE 0xLXI-772",
      "DATA FRAGMENT DETECTED",
      "UNAUTHORIZED ACCESS",
      "MEMORY INDEX COLLISION",
      "RECORD LOCK FAILURE",
      "IDENTITY MISMATCH",
      "RECONSTRUCTING PAGE 01",
      "PRIVATE KEY FOUND"
    ].forEach(function (msg, i) {
      popup(msg, i * 135, i % 2 === 0);
    });

    scrambleText(1750);

    setTimeout(function () {
      document.body.classList.remove("lexi-glitch-mode");
      reader.classList.remove("is-corrupting");
      approved();
    }, 1900);

    setTimeout(function () {
      unlocked = true;
      running = false;
      reader.classList.add("is-unsealed");
      if (image) {
        image.src = "/halcyon/images/lexi_backlog_secret.jpg";
        image.alt = "렉시 비공개 백로그 이미지";
      }
      index = 0;
      setPage(secret);
      prev.disabled = true;
      next.disabled = true;
    }, 3200);
  }

  prev.addEventListener("click", function () {
    if (running || unlocked) return;
    index = Math.max(0, index - 1);
    setPage(normal[index]);
  });

  next.addEventListener("click", function () {
    if (running || unlocked) return;
    if (index >= normal.length - 1) {
      runUnlock();
      return;
    }
    index += 1;
    setPage(normal[index]);
  });

  setPage(normal[index]);
});
