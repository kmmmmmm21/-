(() => {
  const cfg = window.SVALKAM_CONFIG || {};
  const $ = (s) => document.querySelector(s);
  const notice = $("#notice");
  const showNotice = () => { notice.classList.add("show"); };
  $("#noticeClose").addEventListener("click", () => notice.classList.remove("show"));

  // Phone details are configured in config.js.
  if (cfg.phone) {
    $("#phoneText").textContent = cfg.phone;
    $("#phoneLink").href = "tel:" + (cfg.phoneHref || cfg.phone.replace(/[^\d+]/g, ""));
  } else {
    $("#phoneLink").hidden = true;
  }

  // All report buttons open the configured Yandex Form.
  const formUrl = (cfg.yandexFormUrl || "").trim();
  ["#reportButton", ".header-cta"].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    if (formUrl) { el.href = formUrl; el.target = "_blank"; el.rel = "noopener"; }
    else el.addEventListener("click", (e) => { e.preventDefault(); showNotice(); });
  });

  // Social links are editable in config.js. Empty links are not shown.
  const socials = cfg.socials || [];
  const socialBox = $("#socialLinks");
  socialBox.innerHTML = "";
  socials.forEach(item => {
    if (!item.url) return;
    const a = document.createElement("a");
    a.href = item.url; a.target = "_blank"; a.rel = "noopener";
    a.textContent = item.short || item.name;
    a.setAttribute("aria-label", item.name);
    socialBox.appendChild(a);
  });
  if (!socialBox.children.length) {
    socialBox.innerHTML = '<span class="social-empty">Добавьте ссылки на сообщества в файле config.js</span>';
    const style = document.createElement("style");
    style.textContent = ".social-empty{font-size:12px;color:#8290a3;padding:12px 0}";
    document.head.appendChild(style);
  }

  // Keep the cases as clearly marked placeholders until real verified photos are supplied.
  const cases = cfg.cases || [];
  const grid = $("#casesGrid");
  if (cases.length) {
    grid.innerHTML = "";
    cases.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "case-card";
      const beforeExists = item.before && item.before.endsWith(".jpg");
      const afterExists = item.after && item.after.endsWith(".jpg");
      card.innerHTML = `
        <div class="case-location">📍 ${escapeHtml(item.location || "Место не указано")}</div>
        <div class="before-after">
          <div class="case-photo ${beforeExists ? "" : "placeholder-photo"}">${beforeExists ? `<img src="${item.before}" alt="До уборки" onerror="this.parentNode.classList.add('placeholder-photo');this.remove()">` : `<span>Добавьте фото свалки</span>`}<b>ДО</b></div>
          <div class="case-photo clean ${afterExists ? "" : "placeholder-photo"}">${afterExists ? `<img src="${item.after}" alt="После уборки" onerror="this.parentNode.classList.add('placeholder-photo');this.remove()">` : `<span>Добавьте фото после уборки</span>`}<b>ПОСЛЕ</b></div>
        </div>
        <p class="case-date">${escapeHtml(item.date || "Добавьте дату и описание")}</p>`;
      grid.appendChild(card);
    });
  }

  $("#year").textContent = new Date().getFullYear();
  const menuButton = $(".menu-toggle");
  const nav = $(".nav");
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false");
  }));

  $("#privacyLink").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Добавьте ссылку на опубликованную политику обработки персональных данных в index.html перед запуском сайта.");
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
})();