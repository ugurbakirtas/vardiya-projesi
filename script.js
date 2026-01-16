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

// --- PERSONEL VE BİRİM LİSTESİ ---
const personeller = [
  // Bilgi İşlem
  { isim: "VOLKAN DEMİRBAŞ", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
  { isim: "GÖKHAN BAĞIŞ", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
  { isim: "HAKAN ELİPEK", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
  { isim: "ÖZKAN KAYA", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },

  // Yayın Sistemleri
  { isim: "YİĞİT DAYI", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
  { isim: "FERDİ TOPUZ", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
  { isim: "BEYHAN KARAKAŞ", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
  { isim: "FATİH AYBEK", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
  { isim: "AKİF KOÇ", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },

  // 24 MCR
  { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ", gece: true },
  { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ", gece: true },
  { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ", gece: true },
  { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ", gece: true },

  // 360 MCR
  { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ", gece: true },
  { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ", gece: true },
  { isim: "MUSAB YAKUB DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ", gece: true },
  { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ", gece: true },

  // Teknik Yönetmenler
  { isim: "YUNUS EMRE YAYLA", birim: "Teknik Yönetmen", gece: true },
  { isim: "HASAN CAN SAĞLAM", birim: "Teknik Yönetmen", gece: true },
  { isim: "MEHMET BERKMAN", birim: "Teknik Yönetmen", gece: true },
  { isim: "EKREM FİDAN", birim: "Teknik Yönetmen", gece: true },
  { isim: "CAN ŞENTUNALI", birim: "Teknik Yönetmen", gece: true },
  { isim: "BARIŞ İNCE", birim: "Teknik Yönetmen", gece: true },

  // Ses Operatörleri
  { isim: "ZAFER AKAR", birim: "Ses Operatörü", gece: false },
  { isim: "ENES KALE", birim: "Ses Operatörü", gece: false },
  { isim: "ANIL RİŞVAN", birim: "Ses Operatörü", gece: false },
  { isim: "ERSAN TİLBE", birim: "Ses Operatörü", gece: false },
  { isim: "ULVİ MUTLUBAŞ", birim: "Ses Operatörü", gece: false },
  { isim: "OSMAN DİNÇER", birim: "Ses Operatörü", gece: false },
  { isim: "DOĞUŞ MALGIL", birim: "Ses Operatörü", gece: false },
  { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "Ses Operatörü", gece: false },

  // Diğerleri
  { isim: "SENA MİNARECİ", birim: "Playout Operatörü", gece: true },
  { isim: "YUSUF İSLAM TORUN", birim: "KJ Operatörü", gece: false },
  { isim: "RAMAZAN KOÇAK", birim: "Ingest Operatörü", gece: true },
  { isim: "Selin", birim: "Uplink", gece: true }
];

const birimler = [...new Set(personeller.map(p => p.birim))];
let haftalikProgram = {};

function checklistOlustur() {
  const container = document.getElementById("personelChecklist");
  const sirali = [...personeller].sort((a,b) => a.birim.localeCompare(b.birim));
  container.innerHTML = sirali.map(p => `
    <div class="check-item">
      <input type="checkbox" id="check_${p.isim}">
      <label for="check_${p.isim}"><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
    </div>
  `).join('');
}

function programiSifirla() {
  haftalikProgram = {};
  personeller.forEach(p => { 
    const isSelected = document.getElementById(`check_${p.isim}`)?.checked;
    haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null); 
  });
  
  personeller.forEach(p => {
    if(haftalikProgram[p.isim][0] !== "İZİN") {
        if(p.isim === "ZAFER AKAR") { 
            haftalikProgram[p.isim][5] = "İZİN"; haftalikProgram[p.isim][6] = "İZİN"; 
        } else {
            let izinSayisi = 0;
            while(izinSayisi < 2) {
                let r = Math.floor(Math.random() * 7);
                if(haftalikProgram[p.isim][r] === null) { haftalikProgram[p.isim][r] = "İZİN"; izinSayisi++; }
            }
        }
    }
  });
}

function uygunlukKontrol(p, gunIdx, saat, oncekiVeri) {
  if (haftalikProgram[p.isim][gunIdx] !== null) return false;

  // 11 Saat Kuralı
  if (gunIdx === 0 && oncekiVeri?.[p.isim]) {
    const pz = oncekiVeri[p.isim][6];
    if (saat === "06:30–16:00" && (pz === "16:00–00:00" || pz === "00:00–07:00")) return false;
  } else if (gunIdx > 0) {
    const dun = haftalikProgram[p.isim][gunIdx-1];
    if (saat === "06:30–16:00" && (dun === "16:00–00:00" || dun === "00:00–07:00")) return false;
  }

  // Gece Sınırı
  if (saat === "00:00–07:00" && (!p.gece || haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length >= 2)) return false;
  
  return true;
}

function tabloyuOlustur(devirModu = false) {
  let storageKey = "vardiya_" + tarihFormatla(mevcutPazartesi);
  document.getElementById("tabloBaslik").innerText = `${tarihFormatla(mevcutPazartesi)} Haftası Vardiya Planı`;
  
  let gecmisTarih = new Date(mevcutPazartesi);
  gecmisTarih.setDate(gecmisTarih.getDate() - 7);
  let oncekiVeri = JSON.parse(localStorage.getItem("vardiya_" + tarihFormatla(gecmisTarih)));

  programiSifirla();
  const container = document.getElementById("tablolar");
  let html = `<table><thead><tr><th style="width:70px">Saat</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr></thead><tbody>`;

  saatler.forEach(saat => {
    html += `<tr><td><strong>${saat}</strong></td>`;
    gunler.forEach((_, gIdx) => {
      let cellHtml = "";
      birimler.forEach(birim => {
        let kapasite = 0;
        
        // --- BİRİM KURALLARI ---
        if (birim.includes("MCR OPERATÖRÜ")) {
          if (["06:30–16:00", "16:00–00:00", "00:00–07:00"].includes(saat)) kapasite = 1;
        } else if (birim.includes("BİLGİ İŞLEM") || birim.includes("YAYIN SİSTEMLERİ")) {
          if (saat === "09:00–18:00") kapasite = 1; // Genelde ofis saatleri
        } else if (birim === "Teknik Yönetmen") {
          if (saat === "00:00–07:00") kapasite = 1;
          else if (["06:30–16:00", "16:00–00:00"].includes(saat)) kapasite = 2;
        } else if (birim === "Ses Operatörü") {
          if (gIdx >= 5) { if (["06:30–16:00", "16:00–00:00"].includes(saat)) kapasite = 2; }
          else { if (saat === "06:30–16:00") kapasite = 4; else if (saat === "16:00–00:00") kapasite = 2; }
        } else if (saat === "06:30–16:00") kapasite = 1;

        let atananlar = [];
        let adaylar = personeller.filter(p => p.birim === birim && uygunlukKontrol(p, gIdx, saat, devirModu ? oncekiVeri : null));
        
        while(atananlar.length < kapasite && adaylar.length > 0) {
          const secilen = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
          haftalikProgram[secilen.isim][gIdx] = saat;
          atananlar.push(secilen.isim);
        }

        atananlar.forEach(isim => {
          cellHtml += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${isim}</span></div>`;
        });
      });
      html += `<td contenteditable="true">${cellHtml}</td>`;
    });
    html += `</tr>`;
  });

  html += `<tr style="background:#f8fafc"><td><strong>İZİNLİ</strong></td>`;
  gunler.forEach((_, gIdx) => {
    let izinler = "";
    personeller.forEach(p => {
      if(haftalikProgram[p.isim][gIdx] === "İZİN") izinler += `<div class="birim-card" style="border-left-color:#94a3b8"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`;
    });
    html += `<td>${izinler}</td>`;
  });
  html += `</tr></tbody></table>`;

  container.innerHTML = html;
  localStorage.setItem(storageKey, JSON.stringify(haftalikProgram));
  ozetTabloGuncelle();
}

function ozetTabloGuncelle() {
  let html = `<table style="font-size:9px; border-collapse:collapse; width:100%"><thead><tr><th>Personel</th><th>Birim</th><th>Mesai</th><th>Gece</th></tr></thead><tbody>`;
  [...personeller].sort((a,b) => a.birim.localeCompare(b.birim)).forEach(p => {
    const calisma = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
    const gece = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
    html += `<tr><td>${p.isim}</td><td>${p.birim}</td><td>${calisma} G</td><td>${gece} G</td></tr>`;
  });
  html += `</tbody></table>`;
  document.getElementById("ozetTablo").innerHTML = html;
}

document.getElementById("yeniListeBtn").onclick = () => tabloyuOlustur(false);
document.getElementById("sonrakiHaftaBtn").onclick = () => { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + 7); tabloyuOlustur(true); };
document.getElementById("prevWeek").onclick = () => { mevcutPazartesi.setDate(mevcutPazartesi.getDate() - 7); tabloyuOlustur(false); };
document.getElementById("excelBtn").onclick = () => XLSX.writeFile(XLSX.utils.table_to_book(document.querySelector("table")), "Vardiya.xlsx");
document.getElementById("pdfBtn").onclick = () => html2pdf().from(document.getElementById('print-area')).save("Vardiya.pdf");
document.getElementById("temizleBtn").onclick = () => { localStorage.clear(); location.reload(); };

window.onload = () => { checklistOlustur(); tabloyuOlustur(false); };