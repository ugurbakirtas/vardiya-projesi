const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
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

let haftalikProgram = {}; 
let geceSayaci = {};

function programiSifirla() {
  haftalikProgram = {};
  geceSayaci = {};
  personeller.forEach(p => {
    const izinGunu = Math.floor(Math.random() * 7);
    haftalikProgram[p.isim] = Array(7).fill(null);
    haftalikProgram[p.isim][izinGunu] = "İZİN";
  });
}

function uygunlukKontrol(personel, gunIdx, saat) {
  const isim = personel.isim;
  const program = haftalikProgram[isim];

  if (program[gunIdx] !== null) return false;

  if (gunIdx > 0 && saat === "06:30–16:00") {
    const dunkuVardiya = program[gunIdx - 1];
    if (dunkuVardiya === "16:00–00:00" || dunkuVardiya === "00:00–07:00") return false;
  }

  if (saat === "00:00–07:00") {
    const gSayi = program.filter(v => v === "00:00–07:00").length;
    if (gSayi >= 2 || !personel.gece) return false;
  }

  return true;
}

function tabloyuOlustur() {
  programiSifirla();
  const container = document.getElementById("tablolar");
  let html = `<table><thead><tr><th>Saat / Gün</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr></thead><tbody>`;

  saatler.forEach(saat => {
    const sCls = saat.split('–')[0].replace(':', '').replace('DIŞ YAYIN', 'disyayin');
    html += `<tr class="saat-${sCls}"><td><strong>${saat}</strong></td>`;
    
    // YENİ KURAL: 12:00–22:00 ve DIŞ YAYIN otomatik atanmaz
    const otomatikAtamaVarMi = (saat !== "12:00–22:00" && saat !== "DIŞ YAYIN");

    gunler.forEach((_, gIdx) => {
      let hucreContent = "";
      birimler.forEach(birim => {
        let isim = "-";
        if (otomatikAtamaVarMi) {
          let adaylar = personeller.filter(p => p.birim === birim && uygunlukKontrol(p, gIdx, saat));
          if (adaylar.length > 0) {
            const secilen = adaylar[Math.floor(Math.random() * adaylar.length)];
            haftalikProgram[secilen.isim][gIdx] = saat;
            isim = secilen.isim;
          }
        }
        hucreContent += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${isim}</span></div>`;
      });
      html += `<td class="editable" contenteditable="true">${hucreContent}</td>`;
    });
    html += `</tr>`;
  });

  html += `<tr style="background:#eee"><td><strong>İZİNLİLER</strong></td>`;
  gunler.forEach((_, gIdx) => {
    const izinliler = personeller.filter(p => haftalikProgram[p.isim][gIdx] === "İZİN").map(p => p.isim).join('<br>');
    html += `<td>${izinliler}</td>`;
  });
  html += `</tr></tbody></table>`;

  container.innerHTML = html;

  document.querySelectorAll("td.editable").forEach(td => {
    td.addEventListener("input", cakismaKontroluYap);
  });
  cakismaKontroluYap();
}

function cakismaKontroluYap() {
  const tablo = document.querySelector("table");
  for (let gIdx = 1; gIdx <= 7; gIdx++) {
    const isimSayaci = {};
    const satirlar = tablo.querySelectorAll("tbody tr");
    satirlar.forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(!hucre) return;
      hucre.classList.remove("conflict");
      const metinler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      
      metinler.forEach(m => {
        if(m !== "-" && m !== "" && m !== "Atama Yok") {
          isimSayaci[m] = (isimSayaci[m] || 0) + 1;
        }
      });
    });

    satirlar.forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(!hucre) return;
      const metinler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      metinler.forEach(m => {
        if(isimSayaci[m] > 1) hucre.classList.add("conflict");
      });
    });
  }
}

document.getElementById("excelBtn").onclick = () => {
  const wb = XLSX.utils.table_to_book(document.querySelector("table"));
  XLSX.writeFile(wb, "Teknik_Vardiya_Listesi.xlsx");
};

window.onload = tabloyuOlustur;