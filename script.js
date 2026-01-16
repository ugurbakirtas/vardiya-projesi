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

// Personel listesi (kısaltılmış örnek, senin verdiğin isimler buraya tam gelecek)
const personeller = [
  { isim:"YUNUS EMRE YAYLA", birim:"Teknik Yönetmen", gece:true },
  { isim:"HASAN CAN SAĞLAM", birim:"Teknik Yönetmen", gece:true },
  { isim:"MEHMET BERKMAN", birim:"Teknik Yönetmen", gece:true },
  { isim:"EKREM FİDAN", birim:"Teknik Yönetmen", gece:true },
  { isim:"CAN ŞENTUNALI", birim:"Teknik Yönetmen", gece:true },
  { isim:"BARIŞ İNCE", birim:"Teknik Yönetmen", gece:true },
  { isim:"ZAFER AKAR", birim:"Ses Operatörü", gece:false },
  { isim:"ENES KALE", birim:"Ses Operatörü", gece:false },
  { isim:"ANIL RİŞVAN", birim:"Ses Operatörü", gece:false },
  { isim:"ERSAN TİLBE", birim:"Ses Operatörü", gece:false },
  { isim:"ULVİ MUTLUBAŞ", birim:"Ses Operatörü", gece:false },
  { isim:"OSMAN DİNÇER", birim:"Ses Operatörü", gece:false },
  { isim:"DOĞUŞ MALGIL", birim:"Ses Operatörü", gece:false },
  { isim:"ERDOĞAN KÜÇÜKKAYA", birim:"Ses Operatörü", gece:false },
  { isim:"SENA MİNARECİ", birim:"Playout Operatörü", gece:true },
  { isim:"YUSUF İSLAM TORUN", birim:"KJ Operatörü", gece:false },
  { isim:"RAMAZAN KOÇAK", birim:"Ingest Operatörü", gece:true },
  { isim:"Selin", birim:"Uplink", gece:true }
];

// Sayaçlar
const izinSayaci = {};
const oncekiAksam = {};
function uygunPersonelTeknikYonetmen(saat, gunIndex) {
  const geceMi = saat === "00:00–07:00";
  const sabahMi = saat === "06:30–16:00";
  const aksamMi = saat === "16:00–00:00";

  let uygunlar = personeller.filter(p => p.birim === "Teknik Yönetmen" && (!geceMi || p.gece));
  if (uygunlar.length === 0) return "İZİN";

  if (!uygunPersonelTeknikYonetmen.geceSayaci) uygunPersonelTeknikYonetmen.geceSayaci = {};

  if (geceMi) {
    uygunlar = uygunlar.filter(p => (uygunPersonelTeknikYonetmen.geceSayaci[p.isim] || 0) < 2);
    if (uygunlar.length === 0) return "İZİN";
    const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
    uygunPersonelTeknikYonetmen.geceSayaci[secilen.isim] = (uygunPersonelTeknikYonetmen.geceSayaci[secilen.isim] || 0) + 1;
    return secilen.isim;
  }

  if (sabahMi && gunIndex < 5) {
    const secilenler = [];
    while (secilenler.length < 2 && secilenler.length < uygunlar.length) {
      const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
      if (!secilenler.includes(secilen.isim)) secilenler.push(secilen.isim);
    }
    return secilenler.join(", ");
  }

  if (aksamMi) {
    const kacKisi = Math.random() < 0.5 ? 1 : 2;
    const secilenler = [];
    while (secilenler.length < kacKisi && secilenler.length < uygunlar.length) {
      const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
      if (!secilenler.includes(secilen.isim)) secilenler.push(secilen.isim);
    }
    return secilenler.join(", ");
  }

  const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
  return secilen.isim;
}

function uygunPersonelSesOperatoru(saat, gunIndex) {
  const sabahMi = saat === "06:30–16:00";
  const aksamMi = saat === "16:00–00:00";
  const geceMi = saat === "00:00–07:00";
  const izinMi = saat === "İZİN";
  const disYayinMi = saat === "DIŞ YAYIN";

  let uygunlar = personeller.filter(p => p.birim === "Ses Operatörü");

  if (geceMi) return ""; // gece boş
  if (disYayinMi) return ""; // dış yayın boş

  if (izinMi) {
    const secilenler = [];
    while (secilenler.length < 2) {
      const aday = uygunlar[Math.floor(Math.random() * uygunlar.length)];
      const izinSayisi = izinSayaci[aday.isim] || 0;
      if (izinSayisi < 2 && !secilenler.includes(aday.isim)) {
        secilenler.push(aday.isim);
        izinSayaci[aday.isim] = izinSayisi + 1;
      }
    }
    return secilenler.join(", ");
  }

  if (aksamMi) {
    const secilenler = [];
    while (secilenler.length < 2) {
      const aday = uygunlar[Math.floor(Math.random() * uygunlar.length)];
      if (!secilenler.includes(aday.isim)) {
        secilenler.push(aday.isim);
        oncekiAksam[gunIndex] = oncekiAksam[gunIndex] || [];
        oncekiAksam[gunIndex].push(aday.isim);
      }
    }
    return secilenler.join(", ");
  }

  if (sabahMi) {
    const secilenler = [];
    while (secilenler.length < 4) {
      const aday = uygunlar[Math.floor(Math.random() * uygunlar.length)];
      const oncekiGun = gunIndex - 1;
      if (oncekiGun >= 0 && oncekiAksam[oncekiGun] && oncekiAksam[oncekiGun].includes(aday.isim)) {
        continue; // önceki gün akşam çalışmışsa sabaha gelmesin
      }
      if (!secilenler.includes(aday.isim)) {
        secilenler.push(aday.isim);
      }
    }
    return secilenler.join(", ");
  }

  return "";
}

function uygunPersonel(birim, saat, gunIndex) {
  if (birim === "Teknik Yönetmen") return uygunPersonelTeknikYonetmen(saat, gunIndex);
  if (birim === "Ses Operatörü") return uygunPersonelSesOperatoru(saat, gunIndex);
  if (saat === "İZİN" || saat === "DIŞ YAYIN") return saat;
  const geceMi = saat === "00:00–07:00";
  let uygunlar = personeller.filter(p => p.birim === birim && (!geceMi || p.gece));
  if (uygunlar.length === 0) return "İZİN";
  const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
