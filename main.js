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
    const nomreYazisi = document.createElement("div");
    nomreYazisi.className = "barkodnomre";
    nomreYazisi.textContent = nomre;
    
    barkodDiv.appendChild(nomreYazisi);
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
