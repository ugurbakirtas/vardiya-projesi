const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "İZİN", "DIŞ YAYIN"];
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

let geceSayaci = {};

// Akıllı Atama Fonksiyonu
function uygunPersonelGetir(birim, saat, gunIndex) {
  const geceMi = saat === "00:00–07:00";
  let liste = personeller.filter(p => p.birim === birim);
  
  if (geceMi) {
    liste = liste.filter(p => p.gece && (geceSayaci[p.isim] || 0) < 2);
    if (liste.length === 0) return "Atama Yok";
    const secilen = liste[Math.floor(Math.random() * liste.length)];
    geceSayaci[secilen.isim] = (geceSayaci[secilen.isim] || 0) + 1;
    return secilen.isim;
  }

  // Rastgele Seçim
  const secilen = liste[Math.floor(Math.random() * liste.length)];
  return secilen ? secilen.isim : "-";
}

function tabloyuOlustur() {
  const container = document.getElementById("tablolar");
  let html = `<table><thead><tr><th>Saat / Gün</th>`;
  gunler.forEach(g => html += `<th>${g}</th>`);
  html += `</tr></thead><tbody>`;

  saatler.forEach(saat => {
    const sCls = saat.split('–')[0].replace(':', '');
    html += `<tr class="saat-${sCls}"><td><strong>${saat}</strong></td>`;
    
    gunler.forEach((_, gIdx) => {
      let hucreContent = "";
      birimler.forEach(birim => {
        const isim = uygunPersonelGetir(birim, saat, gIdx);
        hucreContent += `<div class="birim-card">
          <span class="birim-tag">${birim}</span>
          <span class="p-isim">${isim}</span>
        </div>`;
      });
      html += `<td class="editable" contenteditable="true">${hucreContent}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// Excel Fonksiyonu
document.getElementById("excelBtn").onclick = () => {
  const wb = XLSX.utils.table_to_book(document.querySelector("table"));
  XLSX.writeFile(wb, "Haftalik_Vardiya.xlsx");
};

window.onload = tabloyuOlustur;