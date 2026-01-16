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
  "KJ Operatörü",
  "Ingest Operatörü",
  "Uplink"
];

// Personel listesi (senin verdiğin isimler burada olacak)
const personeller = [ 
  { isim:"YUNUS EMRE YAYLA", birim:"Teknik Yönetmen", gece:true },
  { isim:"HASAN CAN SAĞLAM", birim:"Teknik Yönetmen", gece:true },
  { isim:"MEHMET BERKMAN", birim:"Teknik Yönetmen", gece:true },
  { isim:"EKREM FİDAN", birim:"Teknik Yönetmen", gece:true },
  { isim:"CAN ŞENTUNALI", birim:"Teknik Yönetmen", gece:true },
  { isim:"BARIŞ İNCE", birim:"Teknik Yönetmen", gece:true },
  // ... diğer birim personelleri ...
];

function uygunPersonelTeknikYonetmen(saat, gunIndex) {
  const geceMi = saat === "00:00–07:00";
  const sabahMi = saat === "06:30–16:00";
  const aksamMi = saat === "16:00–00:00";

  let uygunlar = personeller.filter(p => p.birim === "Teknik Yönetmen" && (!geceMi || p.gece));
  if (uygunlar.length === 0) return "İZİN";

  if (!uygunPersonelTeknikYonetmen.geceSayaci) uygunPersonelTeknikYonetmen.geceSayaci = {};

  // Gece vardiyası → tek kişi, max 2 gece
  if (geceMi) {
    uygunlar = uygunlar.filter(p => (uygunPersonelTeknikYonetmen.geceSayaci[p.isim] || 0) < 2);
    if (uygunlar.length === 0) return "İZİN";
    const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
    uygunPersonelTeknikYonetmen.geceSayaci[secilen.isim] = (uygunPersonelTeknikYonetmen.geceSayaci[secilen.isim] || 0) + 1;
    return secilen.isim;
  }

  // Sabah vardiyası → Pazartesi–Cuma 2 kişi
  if (sabahMi && gunIndex < 5) {
    if (uygunlar.length < 2) return uygunlar.map(u => u.isim).join(", ");
    const secilenler = [];
    while (secilenler.length < 2) {
      const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
      if (!secilenler.includes(secilen.isim)) secilenler.push(secilen.isim);
    }
    return secilenler.join(", ");
  }

  // Akşam vardiyası → bazen tek, bazen 2 kişi
  if (aksamMi) {
    const kacKisi = Math.random() < 0.5 ? 1 : 2;
    if (uygunlar.length < kacKisi) return uygunlar.map(u => u.isim).join(", ");
    const secilenler = [];
    while (secilenler.length < kacKisi) {
      const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
      if (!secilenler.includes(secilen.isim)) secilenler.push(secilen.isim);
    }
    return secilenler.join(", ");
  }

  // Diğer saatlerde → tek kişi
  const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
  return secilen.isim;
}

function uygunPersonel(birim, saat, gunIndex) {
  if (saat === "İZİN" || saat === "DIŞ YAYIN") return saat;
  if (birim === "Teknik Yönetmen") {
    return uygunPersonelTeknikYonetmen(saat, gunIndex);
  }
  const geceMi = saat === "00:00–07:00";
  let uygunlar = personeller.filter(p => p.birim === birim && (!geceMi || p.gece));
  if (uygunlar.length === 0) return "İZİN";
  const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
  return secilen.isim;
}

function tabloyuOlustur() {
  const container = document.getElementById("tablolar");
  birimler.forEach(birim => {
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent = birim;
    table.appendChild(caption);

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    trHead.innerHTML = "<th>Saat</th>" + gunler.map(g => `<th>${g}</th>`).join("");
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("