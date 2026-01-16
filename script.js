const gunler = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

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

    // Saat hücresi
    const tdSaat = document.createElement("td");
    tdSaat.textContent = saat;
    tr.appendChild(tdSaat);

    // Gün hücreleri
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

    // Renk sınıfları
    if (saat.startsWith("06:30")) tr.classList.add("saat-0630");
    else if (saat.startsWith("09:00")) tr.classList.add("saat-0900");
    else if (saat.startsWith("12:00")) tr.classList.add("saat-1200");
    else if (saat.startsWith("16:00")) tr.classList.add("saat-1600");
    else if (saat.startsWith("00:00")) tr.classList.add("saat-0000");
    else if (saat === "İZİN") tr.classList.add("izin");
    else if (saat === "DIŞ YAYIN") tr.classList.add("disyayin");

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
