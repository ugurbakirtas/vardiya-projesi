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
let birimIzinSayaci = {};

function programiSifirla() {
  haftalikProgram = {};
  birimIzinSayaci = {};
  personeller.forEach(p => {
    haftalikProgram[p.isim] = Array(7).fill(null);
  });

  // Her gün her birimden rastgele izin atama (Ses için 2, diğerleri için gerekirse)
  gunler.forEach((_, gIdx) => {
    birimler.forEach(birim => {
      let adaylar = personeller.filter(p => p.birim === birim);
      let limit = (birim === "Ses Operatörü") ? 2 : 2; // Ses için 2 izin, diğerleri için 2 izin
      let atanan = 0;
      
      // Shuffle adaylar
      adaylar.sort(() => Math.random() - 0.5);

      for (let p of adaylar) {
        if (atanan < limit) {
          // Haftalık max izin kontrolü (örneğin herkes haftada en az 1 gün izinli)
          const toplamIzin = haftalikProgram[p.isim].filter(v => v === "İZİN").length;
          if (toplamIzin < 2) { // Haftada max 2 izin
             haftalikProgram[p.isim][gIdx] = "İZİN";
             atanan++;
          }
        }
      }
    });
  });
}

function uygunlukKontrol(personel, gunIdx, saat) {
  const isim = personel.isim;
  if (haftalikProgram[isim][gunIdx] !== null) return false;

  if (gunIdx > 0 && saat === "06:30–16:00") {
    const dun = haftalikProgram[isim][gunIdx - 1];
    if (dun === "16:00–00:00" || dun === "00:00–07:00") return false;
  }

  if (saat === "00:00–07:00") {
    const gSay = haftalikProgram[isim].filter(v => v === "00:00–07:00").length;
    if (gSay >= 2 || !personel.gece) return false;
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
    
    const otomatikAtama = (saat !== "12:00–22:00" && saat !== "DIŞ YAYIN");

    gunler.forEach((_, gIdx) => {
      let hucreContent = "";
      birimler.forEach(birim => {
        let kapasite = 1;
        if(birim === "Teknik Yönetmen") {
           if(saat === "06:30–16:00" || saat === "16:00–00:00") kapasite = 2;
        } else if(birim === "Ses Operatörü") {
           if(saat === "06:30–16:00") kapasite = 4;
           if(saat === "16:00–00:00") kapasite = 2;
           if(saat === "00:00–07:00" || saat === "DIŞ YAYIN") kapasite = 0;
        }

        let atananlar = [];
        if (otomatikAtama && kapasite > 0) {
          let adaylar = personeller.filter(p => p.birim === birim && uygunlukKontrol(p, gIdx, saat));
          for(let i=0; i < kapasite && adaylar.length > 0; i++) {
            const secilen = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
            haftalikProgram[secilen.isim][gIdx] = saat;
            atananlar.push(secilen.isim);
          }
        }

        for(let i=0; i < Math.max(kapasite, 1); i++) {
          let isim = atananlar[i] || "-";
          hucreContent += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${isim}</span></div>`;
        }
      });
      html += `<td class="editable" contenteditable="true">${hucreContent}</td>`;
    });
    html += `</tr>`;
  });

  // İZİN Satırı (Birim bazlı detaylı)
  html += `<tr class="saat-izin-row"><td><strong>İZİN</strong></td>`;
  gunler.forEach((_, gIdx) => {
    let izinIcerik = "";
    birimler.forEach(birim => {
      const izinliler = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][gIdx] === "İZİN");
      if(izinliler.length > 0) {
        izinIcerik += `<div class="birim-card" style="border-color:#ccc; background:#fff">
          <span class="birim-tag" style="color:#2980b9">${birim}</span>
          ${izinliler.map(p => p.isim).join('<br>')}
        </div>`;
      }
    });
    html += `<td>${izinIcerik || "Çalışan Yok"}</td>`;
  });
  html += `</tr></tbody></table>`;

  container.innerHTML = html;
  document.querySelectorAll("td.editable").forEach(td => td.addEventListener("input", cakismaKontroluYap));
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
      const isimler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      // İzin satırındaki isimleri de hesaba katmak için düz metin kontrolü
      const izinIsimleri = hucre.innerText.split('\n').filter(t => t.trim().length > 3 && !birimler.includes(t.trim()));
      
      [...isimler, ...izinIsimleri].forEach(m => { 
        if(m !== "-" && m !== "") isimSayaci[m] = (isimSayaci[m] || 0) + 1; 
      });
    });

    satirlar.forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(!hucre) return;
      const isimler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      if(isimler.some(m => isimSayaci[m] > 1)) hucre.classList.add("conflict");
    });
  }
}

document.getElementById("excelBtn").onclick = () => {
  XLSX.writeFile(XLSX.utils.table_to_book(document.querySelector("table")), "Teknik_Vardiya_Programi.xlsx");
};
window.onload = tabloyuOlustur;