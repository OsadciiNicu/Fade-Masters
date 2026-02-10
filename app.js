function safeText(el, value) {
  if (!el) return;
  el.textContent = value ?? "";
}

function setBackgroundImage(el, url) {
  if (!el) return;
  if (!url) return;
  el.style.backgroundImage = `url('${url.replace(/'/g, "\\'")}')`;
}

function renderNav(navData) {
  const ul = document.querySelector(".nav-links");
  if (!ul) return;
  ul.innerHTML = "";

  (navData?.links ?? []).forEach((link) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.href || "#";
    a.textContent = link.label || "";
    li.appendChild(a);
    ul.appendChild(li);
  });
}

function renderServices(servicesData) {
  safeText(document.querySelector("#servicii .section-title"), servicesData?.title);

  const container = document.querySelector("#servicii .servicii-container");
  if (!container) return;
  container.innerHTML = "";

  (servicesData?.items ?? []).forEach((svc) => {
    const card = document.createElement("div");
    card.className = "serviciu-card";
    card.innerHTML = `
      <div class="serviciu-icon">
        <i class="${svc.iconClass || ""}"></i>
      </div>
      <h3 class="serviciu-title">${svc.title || ""}</h3>
      <p class="serviciu-desc">${svc.description || ""}</p>
      <div class="serviciu-pret">${svc.priceLabel || ""}</div>
    `;
    container.appendChild(card);
  });
}

function renderShop(shopData) {
  safeText(document.querySelector("#shop .section-title"), shopData?.title);

  const container = document.querySelector("#shop .produse-container");
  if (!container) return;
  container.innerHTML = "";

  (shopData?.products ?? []).forEach((p) => {
    const card = document.createElement("div");
    card.className = "produs-card";
    card.innerHTML = `
      <div class="produs-image">
        <i class="${p.iconClass || ""}"></i>
      </div>
      <div class="produs-info">
        <h3 class="produs-title">${p.name || ""}</h3>
        <p class="produs-desc">${p.description || ""}</p>
        <div class="produs-pret">${Number(p.price || 0)} Lei</div>
        <button class="produs-button" onclick="addToCart('${String(p.name || "").replace(/'/g, "\\'")}', ${Number(p.price || 0)})">Cumpără acum</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderBooking(bookingData) {
  safeText(document.querySelector("#programare .section-title"), bookingData?.title);
  safeText(document.querySelector("#programare .subtitle"), bookingData?.subtitle);

  const serviceSelect = document.getElementById("serviciu");
  if (serviceSelect) {
    serviceSelect.innerHTML = `<option value="">Selectează un serviciu</option>`;
    (bookingData?.serviceOptions ?? []).forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt.value || "";
      o.textContent = opt.label || "";
      serviceSelect.appendChild(o);
    });
  }

  const timeSelect = document.getElementById("ora");
  if (timeSelect) {
    timeSelect.innerHTML = `<option value="">Selectează o oră</option>`;
    (bookingData?.timeOptions ?? []).forEach((time) => {
      const o = document.createElement("option");
      o.value = time;
      o.textContent = time;
      timeSelect.appendChild(o);
    });
  }
}

function renderFooter(footerData) {
  safeText(document.querySelector("footer .footer-logo"), footerData?.logo);

  const footerInfo = document.querySelector("footer .footer-info");
  if (footerInfo) {
    footerInfo.innerHTML = "";

    (footerData?.columns ?? []).forEach((col) => {
      const colEl = document.createElement("div");
      colEl.className = "footer-column";

      const h3 = document.createElement("h3");
      h3.textContent = col.title || "";
      colEl.appendChild(h3);

      (col.items ?? []).forEach((item) => {
        if (item.type === "link") {
          const a = document.createElement("a");
          a.href = item.href || "#";
          a.textContent = item.label || "";
          colEl.appendChild(a);
        } else {
          const p = document.createElement("p");
          // pentru iconițe font-awesome: folosim HTML controlat din JSON-ul tău
          p.innerHTML = item.html || "";
          colEl.appendChild(p);
        }
      });

      footerInfo.appendChild(colEl);
    });
  }

  const socials = document.querySelector("footer .social-icons");
  if (socials) {
    socials.innerHTML = "";
    (footerData?.socialLinks ?? []).forEach((s) => {
      const a = document.createElement("a");
      a.href = s.href || "#";
      a.innerHTML = `<i class="${s.iconClass || ""}"></i>`;
      socials.appendChild(a);
    });
  }

  safeText(document.querySelector("footer .copyright"), footerData?.copyright);
}

async function loadContent() {
  const res = await fetch("content.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Nu pot încărca content.json (${res.status})`);
  const data = await res.json();

  document.title = data?.site?.title || document.title;

  renderNav(data.navigation);

  // HERO
  setBackgroundImage(document.getElementById("hero"), data?.hero?.backgroundImage);
  safeText(document.querySelector("#hero .title-line-1"), data?.hero?.titleLine1);
  safeText(document.querySelector("#hero .title-line-2"), data?.hero?.titleLine2);
  safeText(document.querySelector("#hero .subtitle"), data?.hero?.subtitle);

  const heroCta = document.querySelector("#hero .cta-button");
  if (heroCta) {
    heroCta.textContent = data?.hero?.cta?.label || "";
    heroCta.href = data?.hero?.cta?.href || "#";
  }

  // ABOUT
  safeText(document.querySelector("#despre-noi .section-title"), data?.about?.title);

  const aboutText = document.querySelector("#despre-noi .despre-text-container");
  if (aboutText) {
    aboutText.innerHTML = "";
    (data?.about?.paragraphs ?? []).forEach((par) => {
      const p = document.createElement("p");
      p.className = "despre-text";
      p.textContent = par;
      aboutText.appendChild(p);
    });
  }

  const aboutCta = document.querySelector("#despre-noi .cta-button");
  if (aboutCta) {
    aboutCta.textContent = data?.about?.cta?.label || "";
    aboutCta.href = data?.about?.cta?.href || "#";
  }

  setBackgroundImage(document.querySelector("#despre-noi .despre-image"), data?.about?.image?.backgroundImage);

  // SERVICES + SHOP + BOOKING + FOOTER
  renderServices(data.services);
  renderShop(data.shop);
  renderBooking(data.booking);
  renderFooter(data.footer);

  // după ce am generat cardurile, activăm observer-ul din fpc.js (dacă există)
  if (typeof window.observeAnimatedElements === "function") {
    window.observeAnimatedElements();
  }
}

loadContent().catch((err) => {
  console.error(err);
});

