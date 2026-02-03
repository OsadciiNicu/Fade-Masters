// Conținutul Hero Section
const heroContent = {
  title1: "FADE",
  title2: "MASTERS",
  subtitle: "Maestri ai fade-ului, creatori de stil.",
  buttonText: "Programează-te acum"
};

console.log("Hero Section content loaded:", heroContent);

// Verificăm dacă există deja secțiunea Hero
let heroSection = document.getElementById("hero");

if (!heroSection) {
  // Creăm secțiunea Hero
  heroSection = document.createElement("section");
  heroSection.setAttribute("id", "hero");
  
  // Adăugăm secțiunea după navigație
  const navigation = document.querySelector(".navigation");
  navigation.after(heroSection);
}

// Creăm conținutul Hero Section
const heroDiv = document.createElement("div");
heroDiv.setAttribute("class", "hero-content");

const titleContainer = document.createElement("div");
titleContainer.setAttribute("class", "title-container");

const titleLine1 = document.createElement("div");
titleLine1.setAttribute("class", "title-line-1");
titleLine1.innerText = heroContent.title1;

const titleLine2 = document.createElement("div");
titleLine2.setAttribute("class", "title-line-2");
titleLine2.innerText = heroContent.title2;

const subtitle = document.createElement("p");
subtitle.setAttribute("class", "subtitle");
subtitle.innerText = heroContent.subtitle;

const ctaButton = document.createElement("a");
ctaButton.setAttribute("href", "#programare");
ctaButton.setAttribute("class", "cta-button");
ctaButton.innerText = heroContent.buttonText;

// Asamblăm totul
titleContainer.appendChild(titleLine1);
titleContainer.appendChild(titleLine2);

heroDiv.appendChild(titleContainer);
heroDiv.appendChild(subtitle);
heroDiv.appendChild(ctaButton);

heroSection.appendChild(heroDiv);

console.log("Hero Section created successfully");