let mevcutPazartesi = getMonday(new Date());

function getMonday(d) {
  d = new Date(d);
  let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function tarihFormatla(tarih) {
  return tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

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

function checklistOlustur() {
  const container = document.getElementById("personelChecklist");
  container.innerHTML = personeller.map(p => `
    <div class="check-item">
      <input type="checkbox" id="check_${p.isim}" value="${p.isim}">
      <label for="check_${p.isim}"><strong>${p.isim}</strong><br>${p.birim}</label>
    </div>
  `).join('');
}

function programiSifirla() {
  haftalikProgram = {};
  personeller.forEach(p => { 
    // Eğer checkbox seçiliyse tüm haftayı İZİN yap, değilse boş bırak
    const isSelected = document.getElementById(`check_${p.isim}`)?.checked;
    haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null); 
  });
  
  // Aktif personellere (tüm hafta izinli olmayanlara) rastgele 2 izin günü ata
  personeller.forEach(p => {
    if(haftalikProgram[p.isim][0] !== "İZİN") {
        let izinHakki = 2;
        // Zafer Akar kuralı: Haftasonu sabit izin
        if(p.isim === "ZAFER AKAR") {
            haftalikProgram[p.isim][5] = "İZİN";
            haftalikProgram[p.isim][6] = "İZİN";
        } else {
            while(izinHakki > 0) {
                let gunIdx = Math.floor(Math.random() * 7);
                if(haftalikProgram[p.isim][gunIdx] === null) {
                    haftalikProgram[p.isim][gunIdx] = "İZİN";
                    izinHakki--;
                }
            }
        }
    }
  });
}

function uygunlukKontrol(personel, gunIdx, saat, oncekiHaftaVerisi) {
  const isim = personel.isim;
  const program = haftalikProgram[isim];

  if (program[gunIdx] === "İZİN") return false;
  if (isim === "ZAFER AKAR" && gunIdx < 5 && saat !== "06:30–16:00") return false;
  if (program[gunIdx] !== null) return false;

  // 11 Saat ve Continuity Kontrolü
  if (gunIdx === 0 && oncekiHaftaVerisi?.[isim]) {
    const pz = oncekiHaftaVerisi[isim][6];
    if (saat === "06:30–16:00" && (pz === "16:00–00:00" || pz === "00:00–07:00")) return false;
  } else if (gunIdx > 0) {
    const dun = program[gunIdx - 1];
    if (saat === "06:30–16:00" && (dun === "16:00–00:00" || dun === "00:00–07:00")) return false;
  }

  if (saat === "00:00–07:00") {
    if (program.filter(v => v === "00:00–07:00").length >= 2 || !personel.gece) return false;
  }
  return true;
}

function tabloyuOlustur(devirModu = false) {
  let storageKey = "vardiya_" + tarihFormatla(mevcutPazartesi);
  document.getElementById("tabloBaslik").innerText = `${tarihFormatla(mevcutPazartesi)} Haftası Vardiya Planı`;
  
  let gecmisTarih = new Date(mevcutPazartesi);
  gecmisTarih.setDate(gecmisTarih.getDate() - 7);
  let oncekiHaftaVerisi = JSON.parse(localStorage.getItem("vardiya_" + tarihFormatla(gecmisTarih)));

  programiSifirla();
  const container = document.getElementById("tablolar");
  let html = `<table><thead><tr><th>Saat</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr></thead><tbody>`;

  saatler.forEach(saat => {
    html += `<tr><td><strong>${saat}</strong></td>`;
    gunler.forEach((_, gIdx) => {
      let hucreContent = "";
      const haftaSonuMu = (gIdx >= 5);
      
      birimler.forEach(birim => {
        let kapasite = 0;
        if (birim === "Teknik Yönetmen") {
          if (saat === "00:00–07:00") kapasite = 1;
          else if (["06:30–16:00", "16:00–00:00"].includes(saat)) kapasite = 2;
        } 
        else if (birim === "Ses Operatörü") {
          if (haftaSonuMu) { if (["06:30–16:00", "09:00–18:00", "16:00–00:00"].includes(saat)) kapasite = 2; }
          else { if (saat === "06:30–16:00") kapasite = 4; else if (saat === "16:00–00:00") kapasite = 2; }
        } 
        else if (saat === "06:30–16:00") kapasite = 1;

        let atananlar = [];
        // Zafer Akar Sabitleme (İzinli değilse)
        if (birim === "Ses Operatörü" && saat === "06:30–16:00" && !haftaSonuMu) {
          if (uygunlukKontrol({isim: "ZAFER AKAR"}, gIdx, saat, devirModu ? oncekiHaftaVerisi : null)) {
             haftalikProgram["ZAFER AKAR"][gIdx] = saat;
             atananlar.push("ZAFER AKAR");
          }
        }

        if (kapasite > 0) {
          let adaylar = personeller.filter(p => p.birim === birim && p.isim !== "ZAFER AKAR" && uygunlukKontrol(p, gIdx, saat, devirModu ? oncekiHaftaVerisi : null));
          while(atananlar.length < kapasite && adaylar.length > 0) {
            const secilen = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
            haftalikProgram[secilen.isim][gIdx] = saat;
            atananlar.push(secilen.isim);
          }
        }

        for(let i=0; i < kapasite; i++) {
          let isim = atananlar[i] || "-";
          hucreContent += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${isim}</span></div>`;
        }
      });
      html += `<td class="editable" contenteditable="true">${hucreContent}</td>`;
    });
    html += `</tr>`;
  });

  // İZİN Satırı
  html += `<tr style="background:#f1f5f9"><td><strong>İZİNLİLER</strong></td>`;
  gunler.forEach((_, gIdx) => {
    let izinIcerik = "";
    birimler.forEach(birim => {
      const izinliler = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][gIdx] === "İZİN");
      if(izinliler.length > 0) izinIcerik += `<div class="birim-card" style="border-left-color:#94a3b8"><span class="birim-tag">${birim}</span>${izinliler.map(p => p.isim).join('<br>')}</div>`;
    });
    html += `<td>${izinIcerik || "-"}</td>`;
  });
  html += `</tr></tbody></table>`;

  container.innerHTML = html;
  localStorage.setItem(storageKey, JSON.stringify(haftalikProgram));
  ozetTabloGuncelle();
  cakismaKontroluYap();
}

function ozetTabloGuncelle() {
  let html = `<table style="width:100%; font-size:12px; border-collapse:collapse;"><thead><tr><th>Personel</th><th>Mesai</th><th>İzin</th><th>Gece</th></tr></thead><tbody>`;
  personeller.forEach(p => {
    const calisma = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
    const izin = haftalikProgram[p.isim].filter(v => v === "İZİN").length;
    const gece = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
    html += `<tr><td><strong>${p.isim}</strong></td><td>${calisma} Gün</td><td>${izin} Gün</td><td><span class="${gece > 0 ? 'badge-gece' : ''}">${gece} Gece</span></td></tr>`;
  });
  html += `</tbody></table>`;
  document.getElementById("ozetTablo").innerHTML = html;
}

function cakismaKontroluYap() {
  const tablo = document.querySelector("table");
  for (let gIdx = 1; gIdx <= 7; gIdx++) {
    const isimSayaci = {};
    tablo.querySelectorAll("tbody tr").forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(hucre) {
        hucre.classList.remove("conflict");
        Array.from(hucre.querySelectorAll(".p-isim")).forEach(el => {
          let isim = el.innerText.trim();
          if(isim !== "-") isimSayaci[isim] = (isimSayaci[isim] || 0) + 1;
        });
      }
    });
    tablo.querySelectorAll("tbody tr").forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(hucre && Array.from(hucre.querySelectorAll(".p-isim")).some(el => isimSayaci[el.innerText.trim()] > 1)) hucre.classList.add("conflict");
    });
  }
}

document.getElementById("prevWeek").onclick = () => { mevcutPazartesi.setDate(mevcutPazartesi.getDate() - 7); tabloyuOlustur(false); };
document.getElementById("sonrakiHaftaBtn").onclick = () => { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + 7); tabloyuOlustur(true); };
document.getElementById("yeniListeBtn").onclick = () => { tabloyuOlustur(false); };
document.getElementById("excelBtn").onclick = () => { XLSX.writeFile(XLSX.utils.table_to_book(document.querySelector("table")), `Vardiya_${tarihFormatla(mevcutPazartesi)}.xlsx`); };
document.getElementById("pdfBtn").onclick = () => { html2pdf().from(document.getElementById('print-area')).save(`Vardiya_${tarihFormatla(mevcutPazartesi)}.pdf`); };
document.getElementById("temizleBtn").onclick = () => { localStorage.clear(); location.reload(); };

window.onload = () => { checklistOlustur(); tabloyuOlustur(false); };