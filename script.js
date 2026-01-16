// --- TARİH VE TAKVİM AYARLARI ---
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

function baslikGuncelle() {
  let pzt = new Date(mevcutPazartesi);
  let pzr = new Date(mevcutPazartesi);
  pzr.setDate(pzr.getDate() + 6);
  document.getElementById("tabloBaslik").innerText = `${tarihFormatla(pzt)} - ${tarihFormatla(pzr)} Haftalık Vardiya Listesi`;
}

// --- PERSONEL VE BİRİM VERİLERİ ---
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

  if (isim === "ZAFER AKAR") {
    if (gunIdx < 5) { if (saat !== "06:30–16:00") return false; } else return false;
  }
  if (program[gunIdx] !== null) return false;

  // GERÇEK DEVİR KONTROLÜ
  if (gunIdx === 0 && oncekiHaftaVerisi && oncekiHaftaVerisi[isim]) {
    const pazarVardiyasi = oncekiHaftaVerisi[isim][6];
    if (saat === "06:30–16:00" && (pazarVardiyasi === "16:00–00:00" || pazarVardiyasi === "00:00–07:00")) return false;
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
  baslikGuncelle();
  let storageKey = "vardiya_" + tarihFormatla(mevcutPazartesi);
  
  // Önceki haftanın anahtarını bul (Devir için)
  let gecmisTarih = new Date(mevcutPazartesi);
  gecmisTarih.setDate(gecmisTarih.getDate() - 7);
  let oncekiHaftaKey = "vardiya_" + tarihFormatla(gecmisTarih);
  let oncekiHaftaVerisi = JSON.parse(localStorage.getItem(oncekiHaftaKey));

  programiSifirla();
  const container = document.getElementById("tablolar");
  let html = `<table><thead><tr><th>Saat / Gün</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr></thead><tbody>`;

  saatler.forEach(saat => {
    const sCls = saat.split('–')[0].replace(':', '').replace('DIŞ YAYIN', 'disyayin');
    html += `<tr class="saat-${sCls}"><td><strong>${saat}</strong></td>`;
    
    gunler.forEach((_, gIdx) => {
      let hucreContent = "";
      const haftaSonuMu = (gIdx >= 5);
      birimler.forEach(birim => {
        let kapasite = 1;
        const isSesVeyaTY = (birim === "Ses Operatörü" || birim === "Teknik Yönetmen");
        const isKJveyaPlayout = (birim === "KJ Operatörü" || birim === "Playout Operatörü");

        if (birim === "Ses Operatörü") {
          if (haftaSonuMu) {
            if (saat === "06:30–16:00") kapasite = 2;
            else if (saat === "09:00–18:00") kapasite = 2;
            else if (saat === "16:00–00:00") kapasite = 2;
            else kapasite = 0;
          } else {
            if (saat === "06:30–16:00") kapasite = 4;
            else if (saat === "16:00–00:00") kapasite = 2;
            else kapasite = 0;
          }
        } else if (birim === "Teknik Yönetmen") {
          if (saat === "06:30–16:00" || saat === "16:00–00:00") kapasite = 2;
          else if (saat === "00:00–07:00") kapasite = 1;
          else kapasite = 0;
        } else if (isKJveyaPlayout) {
          if (saat === "12:00–22:00" || saat === "00:00–07:00" || saat === "DIŞ YAYIN") kapasite = 0;
        }

        let otomatikAktif = (kapasite > 0);
        if (!haftaSonuMu && saat === "09:00–18:00" && isSesVeyaTY) otomatikAktif = false;

        let atananlar = [];
        if (birim === "Ses Operatörü" && saat === "06:30–16:00" && !haftaSonuMu) {
          if (uygunlukKontrol({isim: "ZAFER AKAR"}, gIdx, saat, devirModu ? oncekiHaftaVerisi : null)) {
             haftalikProgram["ZAFER AKAR"][gIdx] = saat;
             atananlar.push("ZAFER AKAR");
          }
        }

        if (otomatikAktif) {
          let adaylar = personeller.filter(p => p.birim === birim && p.isim !== "ZAFER AKAR" && uygunlukKontrol(p, gIdx, saat, devirModu ? oncekiHaftaVerisi : null));
          while(atananlar.length < kapasite && adaylar.length > 0) {
            const secilen = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
            haftalikProgram[secilen.isim][gIdx] = saat;
            atananlar.push(secilen.isim);
          }
        }

        let gosterilecekKutu = otomatikAktif ? Math.max(kapasite, 1) : 1;
        for(let i=0; i < gosterilecekKutu; i++) {
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
      if(izinliler.length > 0) {
        izinIcerik += `<div class="birim-card" style="border:none; background:transparent"><span class="birim-tag">${birim}</span>${izinliler.map(p => p.isim).join('<br>')}</div>`;
      }
    });
    html += `<td>${izinIcerik || "-"}</td>`;
  });
  html += `</tr></tbody></table>`;

  container.innerHTML = html;
  localStorage.setItem(storageKey, JSON.stringify(haftalikProgram));
  cakismaKontroluYap();
}

function cakismaKontroluYap() {
  const tablo = document.querySelector("table");
  if(!tablo) return;
  for (let gIdx = 1; gIdx <= 7; gIdx++) {
    const isimSayaci = {};
    const satirlar = tablo.querySelectorAll("tbody tr");
    satirlar.forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(!hucre) return;
      hucre.classList.remove("conflict");
      const isimler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      const izinMetni = hucre.innerText.split('\n').filter(t => t.trim().length > 3 && !birimler.includes(t.trim()));
      [...isimler, ...izinMetni].forEach(m => { if(m !== "-" && m !== "") isimSayaci[m] = (isimSayaci[m] || 0) + 1; });
    });
    satirlar.forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(!hucre) return;
      const isimler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      if(isimler.some(m => isimSayaci[m] > 1)) hucre.classList.add("conflict");
    });
  }
}

// --- BUTON OLAYLARI ---
document.getElementById("prevWeek").onclick = () => {
  mevcutPazartesi.setDate(mevcutPazartesi.getDate() - 7);
  tabloyuOlustur(false);
};

document.getElementById("sonrakiHaftaBtn").onclick = () => {
  mevcutPazartesi.setDate(mevcutPazartesi.getDate() + 7);
  tabloyuOlustur(true); // Gerçek devir aktif
};

document.getElementById("yeniListeBtn").onclick = () => { tabloyuOlustur(false); };
document.getElementById("temizleBtn").onclick = () => { localStorage.clear(); location.reload(); };
document.getElementById("excelBtn").onclick = () => { XLSX.writeFile(XLSX.utils.table_to_book(document.querySelector("table")), `Vardiya_${tarihFormatla(mevcutPazartesi)}.xlsx`); };

window.onload = () => { tabloyuOlustur(false); };