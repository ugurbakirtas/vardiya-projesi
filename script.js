const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = [
  "06:30–16:00", "09:00–18:00", "12:00–22:00",
  "16:00–00:00", "00:00–07:00",
  "İZİN", "DIŞ YAYIN"
];
const birimler = ["Teknik Yönetmen", "Ses Operatörü", "Playout Operatörü", "KJ Operatörü", "Ingest Operatörü", "Uplink"];

const personeller = [
  { isim: "YUNUS EMRE YAYLA", birim: "Teknik Yönetmen", gece: true },
  { isim: "HASAN CAN SAĞLAM", birim: "Teknik Yönetmen", gece: true },
  { isim: "MEHMET BERKMAN", birim: "Teknik Yönetmen", gece: true },
  { isim: "EKREM FİDAN", birim: "Teknik Yönetmen", gece: true },
  { isim: "CAN ŞENTUNALI", birim: "Teknik Yönetmen", gece: true },
  { isim: "BARIŞ İNCE", birim: "Teknik Yönetmen", gece: true },
  { isim: "ZAFER AKAR", birim: "Ses Operatörü", gece: false },
  { isim: "ENES KALE", birim: "Ses Operatörü", gece: false },
  { isim: "ANIL RİŞVAN", birim: "Ses Operatörü", gece: false },
  { isim: "ERSAN TİLBE", birim: "Ses Operatörü", gece: false },
  { isim: "ULVİ MUTLUBAŞ", birim: "Ses Operatörü", gece: false },
  { isim: "OSMAN DİNÇER", birim: "Ses Operatörü", gece: false },
  { isim: "DOĞUŞ MALGIL", birim: "Ses Operatörü", gece: false },
  { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "Ses Operatörü", gece: false },
  { isim: "SENA MİNARECİ", birim: "Playout Operatörü", gece: true },
  { isim: "YUSUF İSLAM TORUN", birim: "KJ Operatörü", gece: false },
  { isim: "RAMAZAN KOÇAK", birim: "Ingest Operatörü", gece: true },
  { isim: "Selin", birim: "Uplink", gece: true }
];

const izinSayaci = {};
const oncekiAksam = {};
const geceSayaci = {};

function uygunPersonelTeknikYonetmen(saat, gunIndex) {
  const geceMi = saat === "00:00–07:00";
  const sabahMi = saat === "06:30–16:00";
  const aksamMi = saat === "16:00–00:00";
  let uygunlar = personeller.filter(p => p.birim === "Teknik Yönetmen" && (!geceMi || p.gece));
  
  if (geceMi) {
    let adaylar = uygunlar.filter(p => (geceSayaci[p.isim] || 0) < 2);
    if (adaylar.length === 0) adaylar = uygunlar; 
    const secilen = adaylar[Math.floor(Math.random() * adaylar.length)];
    geceSayaci[secilen.isim] = (geceSayaci[secilen.isim] || 0) + 1;
    return secilen.isim;
  }

  const limit = (sabahMi || aksamMi) ? 2 : 1;
  const secilenler = [];
  while (secilenler.length < limit && secilenler.length < uygunlar.length) {
    const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
    if (!secilenler.includes(secilen.isim)) secilenler.push(secilen.isim);
  }
  return secilenler.join(", ");
}

function uygunPersonelSesOperatoru(saat, gunIndex) {
  const sabahMi = saat === "06:30–16:00";
  const aksamMi = saat === "16:00–00:00";
  const izinMi = saat === "İZİN";
  let uygunlar = personeller.filter(p => p.birim === "Ses Operatörü");

  if (saat === "00:00–07:00" || saat === "DIŞ YAYIN") return "";

  if (izinMi) {
    const secilenler = [];
    let deneme = 0;
    while (secilenler.length < 2 && deneme < 20) {
      const aday = uygunlar[Math.floor(Math.random() * uygunlar.length)];
      if (!secilenler.includes(aday.isim)) {
        secilenler.push(aday.isim);
        izinSayaci[aday.isim] = (izinSayaci[aday.isim] || 0) + 1;
      }
      deneme++;
    }
    return secilenler.join(", ");
  }

  const limit = aksamMi ? 2 : (sabahMi ? 4 : 1);
  const secilenler = [];
  let deneme = 0;
  while (secilenler.length < limit && deneme < 50) {
    const aday = uygunlar[Math.floor(Math.random() * uygunlar.length)];
    const oncekiGunAksamlari = oncekiAksam[gunIndex - 1] || [];
    if (!oncekiGunAksamlari.includes(aday.isim) && !secilenler.includes(aday.isim)) {
      secilenler.push(aday.isim);
      if (aksamMi) {
        oncekiAksam[gunIndex] = oncekiAksam[gunIndex] || [];
        if (!oncekiAksam[gunIndex].includes(aday.isim)) oncekiAksam[gunIndex].push(aday.isim);
      }
    }
    deneme++;
  }
  return secilenler.join(", ");
}

function uygunPersonel(birim, saat, gunIndex) {
  if (birim === "Teknik Yönetmen") return uygunPersonelTeknikYonetmen(saat, gunIndex);
  if (birim === "Ses Operatörü") return uygunPersonelSesOperatoru(saat, gunIndex);
  if (saat === "İZİN" || saat === "DIŞ YAYIN") return "";
  const geceMi = saat === "00:00–07:00";
  let uygunlar = personeller.filter(p => p.birim === birim && (!geceMi || p.gece));
  return uygunlar.length > 0 ? uygunlar[Math.floor(Math.random() * uygunlar.length)].isim : "";
}

function tabloyuOlustur() {
  const container = document.getElementById("tablolar");
  let tableHTML = `<table>
    <thead>
      <tr>
        <th>Vardiya Saatleri</th>
        ${gunler.map(g => `<th>${g}</th>`).join('')}
      </tr>
    </thead>
    <tbody>`;

  saatler.forEach(saat => {
    const rawSaat = saat.split('–')[0].replace(':', '');
    const safeClass = saat === "İZİN" ? "izin" : (saat === "DIŞ YAYIN" ? "disyayin" : rawSaat);
    
    tableHTML += `<tr class="saat-${safeClass}">
      <td><strong>${saat}</strong></td>`;
    
    gunler.forEach((_, gunIndex) => {
      let cellContent = "";
      birimler.forEach(birim => {
        const pIsmi = uygunPersonel(birim, saat, gunIndex);
        if (pIsmi) {
          cellContent += `<div style="margin-bottom:12px">
            <span class="birim-label">${birim}</span>
            <span>${pIsmi}</span>
          </div>`;
        }
      });
      tableHTML += `<td class="editable" contenteditable="true">${cellContent}</td>`;
    });
    tableHTML += `</tr>`;
  });

  tableHTML += `</tbody></table>`;
  container.innerHTML = tableHTML;
}

document.getElementById("excelBtn").addEventListener("click", () => {
  const table = document.querySelector("table");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Vardiya Listesi" });
  XLSX.writeFile(wb, "Teknik_Vardiya_Programi.xlsx");
});

window.onload = tabloyuOlustur;