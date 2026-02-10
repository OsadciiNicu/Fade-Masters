function safeText(el, value) {
  if (!el) return;
  el.textContent = value == null ? "" : String(value);
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

  const links = (navData && navData.links) ? navData.links : [];
  links.forEach(function (link) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = (link && link.href) ? link.href : "#";
    a.textContent = (link && link.label) ? link.label : "";
    li.appendChild(a);
    ul.appendChild(li);
  });
}

function renderServices(servicesData) {
  safeText(document.querySelector("#servicii .section-title"), servicesData && servicesData.title);

  const container = document.querySelector("#servicii .servicii-container");
  if (!container) return;
  container.innerHTML = "";

  const items = (servicesData && servicesData.items) ? servicesData.items : [];
  items.forEach(function (svc) {
    const card = document.createElement("div");
    card.className = "serviciu-card";
    card.innerHTML = `
      <div class="serviciu-icon">
        <i class="${(svc && svc.iconClass) ? svc.iconClass : ""}"></i>
      </div>
      <h3 class="serviciu-title">${(svc && svc.title) ? svc.title : ""}</h3>
      <p class="serviciu-desc">${(svc && svc.description) ? svc.description : ""}</p>
      <div class="serviciu-pret">${(svc && svc.priceLabel) ? svc.priceLabel : ""}</div>
    `;
    container.appendChild(card);
  });
}

function renderShop(shopData) {
  safeText(document.querySelector("#shop .section-title"), shopData && shopData.title);

  const container = document.querySelector("#shop .produse-container");
  if (!container) return;
  container.innerHTML = "";

  const products = (shopData && shopData.products) ? shopData.products : [];
  products.forEach(function (p) {
    const card = document.createElement("div");
    card.className = "produs-card";
    card.innerHTML = `
      <div class="produs-image">
        <i class="${(p && p.iconClass) ? p.iconClass : ""}"></i>
      </div>
      <div class="produs-info">
        <h3 class="produs-title">${(p && p.name) ? p.name : ""}</h3>
        <p class="produs-desc">${(p && p.description) ? p.description : ""}</p>
        <div class="produs-pret">${Number((p && p.price) ? p.price : 0)} Lei</div>
        <button class="produs-button" onclick="addToCart('${String((p && p.name) ? p.name : "").replace(/'/g, "\\'")}', ${Number((p && p.price) ? p.price : 0)})">Cumpără acum</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderBooking(bookingData) {
  safeText(document.querySelector("#programare .section-title"), bookingData && bookingData.title);
  safeText(document.querySelector("#programare .subtitle"), bookingData && bookingData.subtitle);

  const serviceSelect = document.getElementById("serviciu");
  if (serviceSelect) {
    serviceSelect.innerHTML = `<option value="">Selectează un serviciu</option>`;
    const opts = (bookingData && bookingData.serviceOptions) ? bookingData.serviceOptions : [];
    opts.forEach(function (opt) {
      const o = document.createElement("option");
      o.value = (opt && opt.value) ? opt.value : "";
      o.textContent = (opt && opt.label) ? opt.label : "";
      serviceSelect.appendChild(o);
    });
  }

  const timeSelect = document.getElementById("ora");
  if (timeSelect) {
    timeSelect.innerHTML = `<option value="">Selectează o oră</option>`;
    const times = (bookingData && bookingData.timeOptions) ? bookingData.timeOptions : [];
    times.forEach(function (time) {
      const o = document.createElement("option");
      o.value = time;
      o.textContent = time;
      timeSelect.appendChild(o);
    });
  }
}

function renderFooter(footerData) {
  safeText(document.querySelector("footer .footer-logo"), footerData && footerData.logo);

  const footerInfo = document.querySelector("footer .footer-info");
  if (footerInfo) {
    footerInfo.innerHTML = "";

    const columns = (footerData && footerData.columns) ? footerData.columns : [];
    columns.forEach(function (col) {
      const colEl = document.createElement("div");
      colEl.className = "footer-column";

      const h3 = document.createElement("h3");
      h3.textContent = (col && col.title) ? col.title : "";
      colEl.appendChild(h3);

      const items = (col && col.items) ? col.items : [];
      items.forEach(function (item) {
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
    const socialLinks = (footerData && footerData.socialLinks) ? footerData.socialLinks : [];
    socialLinks.forEach(function (s) {
      const a = document.createElement("a");
      a.href = s.href || "#";
      a.innerHTML = `<i class="${s.iconClass || ""}"></i>`;
      socials.appendChild(a);
    });
  }

  safeText(document.querySelector("footer .copyright"), footerData && footerData.copyright);
}

async function loadContent() {
  const res = await fetch("content.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Nu pot încărca content.json (${res.status})`);
  const data = await res.json();

  if (data && data.site && data.site.title) {
    document.title = data.site.title;
  }

  renderNav(data.navigation);

  // HERO
  setBackgroundImage(document.getElementById("hero"), data && data.hero && data.hero.backgroundImage);
  safeText(document.querySelector("#hero .title-line-1"), data && data.hero && data.hero.titleLine1);
  safeText(document.querySelector("#hero .title-line-2"), data && data.hero && data.hero.titleLine2);
  safeText(document.querySelector("#hero .subtitle"), data && data.hero && data.hero.subtitle);

  const heroCta = document.querySelector("#hero .cta-button");
  if (heroCta) {
    heroCta.textContent = (data && data.hero && data.hero.cta && data.hero.cta.label) ? data.hero.cta.label : "";
    heroCta.href = (data && data.hero && data.hero.cta && data.hero.cta.href) ? data.hero.cta.href : "#";
  }

  // ABOUT
  safeText(document.querySelector("#despre-noi .section-title"), data && data.about && data.about.title);

  const aboutText = document.querySelector("#despre-noi .despre-text-container");
  if (aboutText) {
    aboutText.innerHTML = "";
    const paragraphs = (data && data.about && data.about.paragraphs) ? data.about.paragraphs : [];
    paragraphs.forEach(function (par) {
      const p = document.createElement("p");
      p.className = "despre-text";
      p.textContent = par;
      aboutText.appendChild(p);
    });
  }

  const aboutCta = document.querySelector("#despre-noi .cta-button");
  if (aboutCta) {
    aboutCta.textContent = (data && data.about && data.about.cta && data.about.cta.label) ? data.about.cta.label : "";
    aboutCta.href = (data && data.about && data.about.cta && data.about.cta.href) ? data.about.cta.href : "#";
  }

  setBackgroundImage(document.querySelector("#despre-noi .despre-image"), data && data.about && data.about.image && data.about.image.backgroundImage);

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

document.addEventListener("DOMContentLoaded", function () {
  loadContent().catch(function (err) {
    console.error(err);
  });
});

