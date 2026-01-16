let personeller = ["Ahmet", "Ayşe", "Mehmet", "Zeynep", "Ali"];
const vardiyalar = ["Sabah", "Akşam", "Gece"];

function rastgeleVardiya() {
  return vardiyalar[Math.floor(Math.random() * vardiyalar.length)];
}

function tabloyuGuncelle() {
  const tbody = document.querySelector("#vardiyaTablosu tbody");
  tbody.innerHTML = "";

  personeller.forEach(personel => {
    const tr = document.createElement("tr");
    const tdIsim = document.createElement("td");
    tdIsim.textContent = personel;
    tr.appendChild(tdIsim);

    for (let i = 0; i < 5; i++) {
      const td = document.createElement("td");
      td.textContent = rastgeleVardiya();
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });
}

document.querySelector("#personelForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const yeniPersonel = document.querySelector("#personelInput").value.trim();
  if (yeniPersonel) {
    personeller.push(yeniPersonel);
    document.querySelector("#personelInput").value = "";
    tabloyuGuncelle();
  }
});

// Excel çıktısı
document.querySelector("#excelBtn").addEventListener("click", () => {
  const table = document.getElementById("vardiyaTablosu");
  const wb = XLSX.utils.table_to_book(table, {sheet:"Vardiya"});
  XLSX.writeFile(wb, "vardiya-listesi.xlsx");
});

// PDF çıktısı
document.querySelector("#pdfBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Personel Vardiya Listesi", 10, 10);

  let y = 20;
  personeller.forEach(personel => {
    let satir = personel;
    for (let i = 0; i < 5; i++) {
      satir += " | " + rastgeleVardiya();
    }
    doc.text(satir, 10, y);
    y += 10;
  });

  doc.save("vardiya-listesi.pdf");
});

tabloyuGuncelle();
