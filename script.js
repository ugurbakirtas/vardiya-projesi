let mevcutPazartesi = getMonday(new Date());

function getMonday(d) {
  d = new Date(d);
  let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
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

function programiSifirla() {
  haftalikProgram = {};
  personeller.forEach(p => { haftalikProgram[p.isim] = Array(7).fill(null); });
  haftalikProgram["ZAFER AKAR"][5] = "İZİN";
  haftalikProgram["ZAFER AKAR"][6] = "İZİN";

  gunler.forEach((_, gIdx) => {
    birimler.forEach(birim => {
      let adaylar = personeller.filter(p => p.birim === birim);
      let limit = (birim === "Ses Operatörü" || birim === "Teknik Yönetmen") ? 2 : 1;
      let zatenAtanan = adaylar.filter(p => haftalikProgram[p.isim][gIdx] === "İZİN").length;
      let kalanLimit = limit - zatenAtanan;

      if(kalanLimit > 0) {
        let izinAdaylari = adaylar.filter(p => haftalikProgram[p.isim][gIdx] === null);
        izinAdaylari.sort(() => Math.random() - 0.5);
        for (let p of izinAdaylari) {
          if (kalanLimit > 0) {
            const toplamIzin = haftalikProgram[p.isim].filter(v => v === "İZİN").length;
            if (toplamIzin < 2) { 
               haftalikProgram[p.isim][gIdx] = "İZİN";
               kalanLimit--;
            }
          }
        }
      }
    });
  });
}

function uygunlukKontrol(personel, gunIdx, saat, oncekiHaftaVerisi) {
  const isim = personel.isim;
  const program = haftalikProgram[isim];
  if (isim === "ZAFER AKAR" && gunIdx < 5 && saat !== "06:30–16:00") return false;
  if (program[gunIdx] !== null) return false;

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

function ozetTabloGuncelle() {
  let html = `<table class='ozet-tablo'><thead><tr><th>Personel</th><th>Birim</th><th>Çalıştığı Gün</th><th>İzinli Gün</th><th>Gece Vardiyası</th></tr></thead><tbody>`;
  
  personeller.forEach(p => {
    const calisma = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
    const izin = haftalikProgram[p.isim].filter(v => v === "İZİN").length;
    const gece = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
    
    html += `<tr>
      <td><strong>${p.isim}</strong></td>
      <td>${p.birim}</td>
      <td>${calisma} Gün</td>
      <td>${izin} Gün</td>
      <td><span class="${gece > 0 ? 'badge-gece' : ''}">${gece} Gece</span></td>
    </tr>`;
  });
  html += `</tbody></table>`;
  document.getElementById("ozetTablo").innerHTML = html;
}

function tabloyuOlustur(devirModu = false) {
  let storageKey = "vardiya_" + tarihFormatla(mevcutPazartesi);
  document.getElementById("tabloBaslik").innerText = `${tarihFormatla(mevcutPazartesi)} Haftası Vardiya Planı`;
  
  let gecmisTarih = new Date(mevcutPazartesi);
  gecmisTarih.setDate(gecmisTarih.getDate() - 7);
  let oncekiHaftaKey = "vardiya_" + tarihFormatla(gecmisTarih);
  let oncekiHaftaVerisi = JSON.parse(localStorage.getItem(oncekiHaftaKey));

  programiSifirla();
  const container = document.getElementById("tablolar");
  let html = `<table><thead><tr><th>Vardiya</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr></thead><tbody>`;

  saatler.forEach(saat => {
    const sCls = saat.split('–')[0].replace(':', '').replace('DIŞ YAYIN', 'disyayin');
    html += `<tr class="saat-${sCls}"><td><strong>${saat}</strong></td>`;
    
    gunler.forEach((_, gIdx) => {
      let hucreContent = "";
      const haftaSonuMu = (gIdx >= 5);
      birimler.forEach(birim => {
        let kapasite = 0;
        const isSesVeyaTY = (birim === "Ses Operatörü" || birim === "Teknik Yönetmen");
        
        if (birim === "Ses Operatörü") {
          if (haftaSonuMu) {
            if (["06:30–16:00", "09:00–18:00", "16:00–00:00"].includes(saat)) kapasite = 2;
          } else {
            if (saat === "06:30–16:00") kapasite = 4;
            else if (saat === "16:00–00:00") kapasite = 2;
          }
        } else if (birim === "Teknik Yönetmen") {
          if (["06:30–16:00", "16:00–00:00"].includes(saat)) kapasite = 2;
          else if (saat === "00:00–07:00") kapasite = 1;
        } else if (!["KJ Operatörü", "Playout Operatörü"].includes(birim)) {
           if (!["12:00–22:00", "00:00–07:00", "DIŞ YAYIN"].includes(saat)) kapasite = 1;
        } else if (["KJ Operatörü", "Playout Operatörü"].includes(birim)) {
           if (!["12:00–22:00", "00:00–07:00", "DIŞ YAYIN"].includes(saat)) kapasite = 1;
        }

        let atananlar = [];
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

        let kutuSayisi = Math.max(kapasite, 1);
        for(let i=0; i < kutuSayisi; i++) {
          let isim = atananlar[i] || "-";
          hucreContent += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${isim}</span></div>`;
        }
      });
      html += `<td class="editable" contenteditable="true">${hucreContent}</td>`;
    });
    html += `</tr>`;
  });

  html += `<tr class="saat-izin-row"><td><strong>İZİN</strong></td>`;
  gunler.forEach((_, gIdx) => {
    let izinIcerik = "";
    birimler.forEach(birim => {
      const izinliler = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][gIdx] === "İZİN");
      if(izinliler.length > 0) izinIcerik += `<div class="birim-card"><span class="birim-tag">${birim}</span>${izinliler.map(p => p.isim).join('<br>')}</div>`;
    });
    html += `<td>${izinIcerik || "-"}</td>`;
  });
  html += `</tr></tbody></table>`;

  container.innerHTML = html;
  localStorage.setItem(storageKey, JSON.stringify(haftalikProgram));
  ozetTabloGuncelle();
  document.querySelectorAll("td.editable").forEach(td => td.addEventListener("input", cakismaKontroluYap));
}

function cakismaKontroluYap() {
  const tablo = document.querySelector("table");
  for (let gIdx = 1; gIdx <= 7; gIdx++) {
    const isimSayaci = {};
    tablo.querySelectorAll("tbody tr").forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(!hucre) return;
      hucre.classList.remove("conflict");
      const isimler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      isimler.forEach(m => { if(m !== "-" && m !== "") isimSayaci[m] = (isimSayaci[m] || 0) + 1; });
    });
    tablo.querySelectorAll("tbody tr").forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(hucre && Array.from(hucre.querySelectorAll(".p-isim")).some(m => isimSayaci[m.innerText.trim()] > 1)) hucre.classList.add("conflict");
    });
  }
}

document.getElementById("prevWeek").onclick = () => { mevcutPazartesi.setDate(mevcutPazartesi.getDate() - 7); tabloyuOlustur(false); };
document.getElementById("sonrakiHaftaBtn").onclick = () => { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + 7); tabloyuOlustur(true); };
document.getElementById("yeniListeBtn").onclick = () => { tabloyuOlustur(false); };
document.getElementById("temizleBtn").onclick = () => { if(confirm("Tüm kayıtlar silinecek. Emin misiniz?")) { localStorage.clear(); location.reload(); } };
document.getElementById("excelBtn").onclick = () => { XLSX.writeFile(XLSX.utils.table_to_book(document.querySelector("table")), `Vardiya_${tarihFormatla(mevcutPazartesi)}.xlsx`); };

window.onload = () => { tabloyuOlustur(false); };