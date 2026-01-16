const gunler = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

// Saat blokları senin istediğin şekilde
const saatler = [
  "06:30–16:00","06:30–16:00","06:30–16:00","06:30–16:00",
  "09:00–18:00",
  "12:00–22:00",
  "16:00–00:00","16:00–00:00","16:00–00:00",
  "00:00–07:00","00:00–07:00",
  "İZİN","İZİN","İZİN",
  "DIŞ YAYIN","DIŞ YAYIN","DIŞ YAYIN"
];

const birimler = [
  "Teknik Yönetmen",
  "Ses Operatörü",
  "Playout Operatörü",
  "JK Operatörü",
  "Ingest Operatörü",
  "Uplink"
];

const personeller = [
  { isim:"Ahmet", birim:"Teknik Yönetmen", gece:true },
  { isim:"Kemal", birim:"Teknik Yönetmen", gece:true },
  { isim:"Ayşe", birim:"Ses Operatörü", gece:false },
  { isim:"Elif", birim:"Ses Operatörü", gece:false },
  { isim:"Mehmet", birim:"Playout Operatörü", gece:true },
  { isim:"Can", birim:"Playout Operatörü", gece:true },
  { isim:"Zeynep", birim:"JK Operatörü", gece:false },
  { isim:"Ece", birim:"JK Operatörü", gece:false },
  { isim:"Ali", birim:"Ingest Operatörü", gece:true },
  { isim:"Burak", birim:"Ingest Operatörü", gece:true },
  { isim:"Selin", birim:"Uplink", gece:true },
  { isim:"Derya", birim:"Uplink", gece:true }
];

function uygunPersonel(birim, saat) {
  if (saat === "İZİN" || saat === "DIŞ YAYIN") return saat;
  const geceMi = (saat === "00:00–07:00");
  let uygunlar = personeller.filter(p => p.birim === birim && (!geceMi || p.gece));
  if (uygunlar.length === 0) return "İZİN";
  const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
  return secilen.isim;
}

function tabloyuOlustur() {
  const tbody = document.querySelector("#vardiyaTablosu tbody");
  saatler.forEach((saat) => {
    const tr = document.createElement("tr");
    const tdSaat = document.createElement("td");
    tdSaat.textContent = saat;
    tr.appendChild(tdSaat);

    gunler.forEach((gun) => {
      const td = document.createElement("td");
      td.classList.add("editable");

      let cellContent = "";
      birimler.forEach(birim => {
        const isim = uygunPersonel(birim, saat);
        cellContent += `${birim}: ${isim}\n`;
      });

      td.textContent = cellContent.trim();
      td.addEventListener("click", () => elleDegistir(td));
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function elleDegistir(td) {
  const yeniIcerik = prompt("Yeni içerik girin (birim: isim formatında, alt alta):", td.textContent);
  if (yeniIcerik) td.textContent = yeniIcerik;
}

document.querySelector("#excelBtn").addEventListener("click", () => {
  const table = document.getElementById("vardiyaTablosu");
  const wb = XLSX.utils.table_to_book(table, {sheet:"Vardiya"});
  XLSX.writeFile(wb, "teknik-personel-vardiya-listesi.xlsx");
});

tabloyuOlustur();
