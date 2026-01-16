// Personel listesi
const personeller = ["Ahmet", "Ayşe", "Mehmet", "Zeynep", "Ali"];
// Vardiya türleri
const vardiyalar = ["Sabah", "Akşam", "Gece"];

// Rastgele vardiya seçimi
function rastgeleVardiya() {
  return vardiyalar[Math.floor(Math.random() * vardiyalar.length)];
}

// Tabloya doldurma
const tbody = document.querySelector("#vardiyaTablosu tbody");

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
