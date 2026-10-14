const urunler = document.querySelectorAll(".urun");

urunler.forEach(urun => {
    const nomreElement = urun.querySelector(".barkodnomre");
    const barkodDiv = urun.querySelector(".barkod");
    
    if (!nomreElement || !barkodDiv) return;
    
    const nomre = nomreElement.textContent.trim();
    
    // Barkod sahəsini təmizlə
    barkodDiv.innerHTML = "";
    
    // SVG yarat
    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    
    barkodDiv.appendChild(svg);
    
    // Barkod yarat
    JsBarcode(svg, nomre, {
        format: "CODE128",
        width: 2,
        height: 80,
        displayValue: false,
        margin: 10,
        background: "#ffffff",
        lineColor: "#000000"
    });
    
    // Mobil ekranda SVG-ni qorumaq
    svg.style.display = "block";
    svg.style.width = "100%";
    svg.style.maxWidth = "320px";
    svg.style.height = "auto";
    svg.style.margin = "0 auto";
    
    // Nömrəni yenidən göstər
    // Mövcud barkod nömrəsini saxla, yenisini yaratma
nomreElement.textContent = nomre;
});

const sehifeler = document.querySelectorAll(".sehife");
const navDuyme = document.querySelectorAll(".nav-btn");

navDuyme.forEach(duyme => {
  duyme.addEventListener("click", () => {
    const sehifeId = duyme.dataset.sehife;

    if (!sehifeId) return;

    sehifeler.forEach(sehife => {
      sehife.classList.remove("aktiv");
    });

    navDuyme.forEach(btn => {
      btn.classList.remove("aktiv");
    });

    document.getElementById(sehifeId)
      .classList.add("aktiv");

    duyme.classList.add("aktiv");
  });
});

// Printer
document.getElementById("printCards")
  .addEventListener("click", () => {
    window.location.href = "elave.html";
  });
  
const overlay = document.createElement("div");
overlay.className = "barkod-overlay";
document.body.appendChild(overlay);

let aktivBarkod = null;

document.querySelectorAll(".barkod").forEach(barkod => {
  barkod.style.cursor = "zoom-in";

  barkod.addEventListener("click", () => {
    if (aktivBarkod === barkod) {
      baglaBarkod();
      return;
    }

    baglaBarkod();

    aktivBarkod = barkod;
    barkod.classList.add("barkod-focus");
    overlay.classList.add("active");
  });
});

function baglaBarkod() {
  if (aktivBarkod) {
    aktivBarkod.classList.remove("barkod-focus");
    aktivBarkod = null;
  }

  overlay.classList.remove("active");
}

overlay.addEventListener("click", baglaBarkod);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    baglaBarkod();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const mehsullar = document.querySelectorAll(".urun");

  // Favoriləri yadda saxla
  let favoriler = JSON.parse(
    localStorage.getItem("liashari-favoriler") || "[]"
  );

  // Əvvəlki görünüş seçimini yadda saxla
  let yalnizFavoriler = localStorage.getItem(
    "liashari-yalniz-favoriler"
  ) === "true";

  // Qaranlıq rejimi yadda saxla
  const qaranliq = localStorage.getItem("liashari-dark") === "true";

  document.body.classList.toggle("dark", qaranliq);

  function favorileriYenile() {
    mehsullar.forEach((mehsul, index) => {
      const nomre = mehsul.querySelector(".barkodnomre");
      const duymə = mehsul.querySelector(".favori");

      if (!nomre || !duymə) return;

      const id = nomre.textContent.trim();
      const secilib = favoriler.includes(id);

      duymə.classList.toggle("secilib", secilib);
      duymə.innerHTML = secilib ? "♥" : "♡";
      duymə.setAttribute(
        "aria-label",
        secilib ? "Favoridən çıxar" : "Favoriyə əlavə et"
      );

      mehsul.classList.toggle(
        "favoriden-gizlet",
        yalnizFavoriler && !secilib
      );
    });

    localStorage.setItem(
      "liashari-favoriler",
      JSON.stringify(favoriler)
    );
  }

  // Hər məhsulun favori düyməsi
  mehsullar.forEach(mehsul => {
    const nomre = mehsul.querySelector(".barkodnomre");
    const duymə = mehsul.querySelector(".favori");

    if (!nomre || !duymə) return;

    duymə.addEventListener("click", () => {
      const id = nomre.textContent.trim();

      if (favoriler.includes(id)) {
        favoriler = favoriler.filter(item => item !== id);
      } else {
        favoriler.push(id);
      }

      favorileriYenile();
    });
  });

  // Favoriləri göstər / bütün məhsulları göstər
  const filtrDuyme = document.getElementById("favorileriGoster");

  if (filtrDuyme) {
    function filtrYenile() {
      filtrDuyme.textContent = yalnizFavoriler
        ? "♡ყველა პროდუქტი "
        : "♥ფავორიტები";

      localStorage.setItem(
        "liashari-yalniz-favoriler",
        String(yalnizFavoriler)
      );

      favorileriYenile();
    }

    filtrDuyme.addEventListener("click", () => {
      yalnizFavoriler = !yalnizFavoriler;
      filtrYenile();
    });

    filtrYenile();
  } else {
    favorileriYenile();
  }


});
