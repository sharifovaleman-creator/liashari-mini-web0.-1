
function initLiashari() {
  const urunler = document.querySelectorAll(".urun");
  const printButtons = document.querySelectorAll(".printCards");

  // Barkodları yarat və çap sayını əlavə et
  urunler.forEach(urun => {
    const nomreElement = urun.querySelector(".barkodnomre");
    const barkodDiv = urun.querySelector(".barkod");

    if (
      nomreElement &&
      barkodDiv &&
      typeof JsBarcode !== "undefined" &&
      !barkodDiv.querySelector("svg")
    ) {
      const nomre = nomreElement.textContent.trim();
      barkodDiv.innerHTML = "";

      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      barkodDiv.appendChild(svg);

      try {
        JsBarcode(svg, nomre, {
          format: "CODE128",
          width: 2,
          height: 80,
          displayValue: false,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000"
        });

        svg.style.display = "block";
        svg.style.width = "100%";
        svg.style.maxWidth = "320px";
        svg.style.height = "auto";
        svg.style.margin = "0 auto";

        const numberLabel = document.createElement("div");
        numberLabel.className = "barkodnomre";
        numberLabel.textContent = nomre;
        barkodDiv.appendChild(numberLabel);
      } catch (error) {
        console.error("Barkod xətası:", error);
      }
    }

    if (!urun.querySelector(".kart-sayi")) {
      const input = document.createElement("input");
      input.type = "number";
      input.className = "kart-sayi";
      input.min = "0";
      input.max = "999";
      input.step = "1";
      input.value = "0";
      input.placeholder = "Kart sayı";
      input.style.width = "100px";
      input.style.padding = "8px";
      input.style.margin = "8px 0";

      const label = document.createElement("label");
      label.append("დასაბეჭდი ნომერი: ", input);
      urun.appendChild(label);
    }
  });

  // Hər iki çap düyməsini aktivləşdir
  printButtons.forEach(button => {
    if (button.dataset.ready === "true") return;
    button.dataset.ready = "true";

    button.addEventListener("click", () => {
      const cards = [];

      urunler.forEach(urun => {
        if (getComputedStyle(urun).display === "none") return;

        const input = urun.querySelector(".kart-sayi");
        const count = Math.max(
          0,
          Math.min(999, parseInt(input?.value, 10) || 0)
        );

        if (!count) return;

        const getText = selector =>
          urun.querySelector(selector)?.textContent.trim() || "";

        const name = getText(".ad");
        const barcode = getText(".barkodnomre");
        const price = getText(".qiymet");

        const svg = urun.querySelector(".barkod svg");
        let barcodeImage = "";

        if (svg) {
          const clone = svg.cloneNode(true);
          clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          clone.setAttribute("width", "320");
          clone.setAttribute("height", "100");

          barcodeImage = new XMLSerializer()
            .serializeToString(clone);
        }

        for (let i = 0; i < count; i++) {
          cards.push({
            name,
            barcode,
            price,
            barcodeImage
          });
        }
      });

      if (!cards.length) {
        alert("Ən azı bir məhsul üçün çap sayını daxil edin!");
        return;
      }

      const escapeHTML = value =>
        String(value).replace(/[&<>"']/g, char => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[char]);

      const pages = [];

      for (let i = 0; i < cards.length; i += 18) {
        const pageCards = cards.slice(i, i + 18);

        const cardHTML = pageCards.map(card => `
          <article class="print-card">
            <div class="card-title">
              ${escapeHTML(card.name || "Məhsul")}
            </div>

            <div>Kod №: ${escapeHTML(card.barcode || "—")}</div>

            <div class="print-barcode">
              ${card.barcodeImage}
            </div>

            <div class="bottom">
              <span>ფასი: ${escapeHTML(card.price || "—")}</span>
              <span class="quantity-box"></span>
            </div>
          </article>
        `).join("");

        pages.push(`<section class="page">${cardHTML}</section>`);
      }

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Brauzerdə pop-up pəncərələrə icazə ver və yenidən yoxla.");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ka">
        <head>
          <meta charset="UTF-8">
          <title>Liashari Mini Web 0.2</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 6mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #111;
            }

            .page {
              width: 198mm;
              height: 285mm;
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              grid-template-rows: repeat(6, minmax(0, 1fr));
              gap: 1mm;
              overflow: hidden;
              break-after: page;
              page-break-after: always;
            }

            .page:last-child {
              break-after: auto;
              page-break-after: auto;
            }

            .print-card {
              min-width: 0;
              min-height: 0;
              overflow: hidden;
              border: 0.25mm solid #999;
              padding: 2mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              font-size: 8pt;
              overflow-wrap: anywhere;
            }

            .card-title {
              font-weight: bold;
              font-size: 9pt;
            }

            .print-barcode {
              width: 100%;
              height: 15mm;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
            }

            .print-barcode svg {
              display: block;
              width: 100%;
              max-width: 100%;
              height: 15mm;
            }

            .bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 1mm;
            }

            .quantity-box {
              width: 7mm;
              height: 7mm;
              border: 0.35mm solid #111;
              flex-shrink: 0;
            }

            @media screen {
              body {
                background: #eee;
                padding: 10px;
              }

              .page {
                background: white;
                margin: 0 auto 15px;
              }
            }
          </style>
        </head>

        <body>
          ${pages.join("")}

          <script>
            window.onload = () => {
              window.focus();
              window.print();
            };
          <\/script>
        </body>
        </html>
      `);

      printWindow.document.close();
    });
  });
}

// Məhsul adına və ya barkodun son rəqəmlərinə görə axtarış
function filterProducts() {
  const inputElement = document.getElementById("searchInput");
  if (!inputElement) return;

  const input = inputElement.value.trim().toLowerCase();

  document.querySelectorAll(".urun").forEach(urun => {
    const name = urun.querySelector(".ad")
      ?.textContent.trim().toLowerCase() || "";

    const barcode = urun.querySelector(".barkodnomre")
      ?.textContent.trim() || "";

    urun.style.display =
      name.includes(input) || barcode.endsWith(input)
        ? ""
        : "none";
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLiashari);
} else {
  initLiashari();
}
