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

// --- PERSONEL LİSTESİ (Yeni Birimlerle) ---
const personeller = [
  // Mevcutlar
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
  
  // YENİ BİRİMLER VE ÖRNEK İSİMLER (İsimleri değiştirebilirsiniz)
  { isim: "BİLGİ İŞLEM 1", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
  { isim: "BİLGİ İŞLEM 2", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
  { isim: "YAYIN SİST 1", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
  { isim: "YAYIN SİST 2", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
  { isim: "24 MCR OP 1", birim: "24TV MCR OPERATÖRÜ", gece: true },
  { isim: "24 MCR OP 2", birim: "24TV MCR OPERATÖRÜ", gece: true },
  { isim: "360 MCR OP 1", birim: "360TV MCR OPERATÖRÜ", gece: true },
  { isim: "360 MCR OP 2", birim: "360TV MCR OPERATÖRÜ", gece: true },
  
  { isim: "SENA MİNARECİ", birim: "Playout", gece: true },
  { isim: "RAMAZAN KOÇAK", birim: "Ingest", gece: true },
  { isim: "Selin", birim: "Uplink", gece: true }
];

const birimler = [...new Set(personeller.map(p => p.birim))];
let haftalikProgram = {};

function checklistOlustur() {
  const container = document.getElementById("personelChecklist");
  personeller.sort((a,b) => a.birim.localeCompare(b.birim));
  container.innerHTML = personeller.map(p => `
    <div class="check-item">
      <input type="checkbox" id="check_${p.isim}">
      <label for="check_${p.isim}"><strong>${p.isim}</strong><br>${p.birim}</label>
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
        let izinHakki = 2;
        if(p.isim === "ZAFER AKAR") { haftalikProgram[p.isim][5] = "İZİN"; haftalikProgram[p.isim][6] = "İZİN"; }
        else {
            while(izinHakki > 0) {
                let r = Math.floor(Math.random() * 7);
                if(haftalikProgram[p.isim][r] === null) { haftalikProgram[p.isim][r] = "İZİN"; izinHakki--; }
            }
        }
    }
  });
}

function uygunlukKontrol(personel, gunIdx, saat, oncekiHaftaVerisi) {
  const program = haftalikProgram[personel.isim];
  if (program[gunIdx] === "İZİN" || program[gunIdx] !== null) return false;
  if (personel.isim === "ZAFER AKAR" && (gunIdx >= 5 || saat !== "06:30–16:00")) return false;

  // Dinlenme kontrolü
  if (gunIdx === 0 && oncekiHaftaVerisi?.[personel.isim]) {
    const pz = oncekiHaftaVerisi[personel.isim][6];
    if (saat === "06:30–16:00" && (pz === "16:00–00:00" || pz === "00:00–07:00")) return false;
  } else if (gunIdx > 0) {
    const dun = program[gunIdx - 1];
    if (saat === "06:30–16:00" && (dun === "16:00–00:00" || dun === "00:00–07:00")) return false;
  }

  if (saat === "00:00–07:00" && (!personel.gece || program.filter(v => v === "00:00–07:00").length >= 2)) return false;
  return true;
}

function tabloyuOlustur(devirModu = false) {
  let storageKey = "vardiya_" + tarihFormatla(mevcutPazartesi);
  document.getElementById("tabloBaslik").innerText = `${tarihFormatla(mevcutPazartesi)} Haftası`;
  let gecmisTarih = new Date(mevcutPazartesi);
  gecmisTarih.setDate(gecmisTarih.getDate() - 7);
  let oncekiVeri = JSON.parse(localStorage.getItem("vardiya_" + tarihFormatla(gecmisTarih)));

  programiSifirla();
  const container = document.getElementById("tablolar");
  let html = `<table><thead><tr><th style="width:80px">Saat</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr></thead><tbody>`;

  saatler.forEach(saat => {
    html += `<tr><td><strong>${saat}</strong></td>`;
    gunler.forEach((_, gIdx) => {
      let hucreContent = "";
      birimler.forEach(birim => {
        let kapasite = 0;
        
        // --- BİRİM KURALLARI ---
        if (birim.includes("MCR OPERATÖRÜ")) {
          if (["06:30–16:00", "16:00–00:00", "00:00–07:00"].includes(saat)) kapasite = 1;
        } 
        else if (birim.includes("BİLGİ İŞLEM") || birim.includes("YAYIN SİSTEMLERİ")) {
          if (saat === "09:00–18:00") kapasite = 1;
        }
        else if (birim === "Teknik Yönetmen") {
          if (saat === "00:00–07:00") kapasite = 1;
          else if (["06:30–16:00", "16:00–00:00"].includes(saat)) kapasite = 2;
        } 
        else if (birim === "Ses Operatörü") {
          if (gIdx >= 5) { if (["06:30–16:00", "09:00–18:00", "16:00–00:00"].includes(saat)) kapasite = 2; }
          else { if (saat === "06:30–16:00") kapasite = 4; else if (saat === "16:00–00:00") kapasite = 2; }
        }
        else if (saat === "06:30–16:00") kapasite = 1;

        let atananlar = [];
        let adaylar = personeller.filter(p => p.birim === birim && uygunlukKontrol(p, gIdx, saat, devirModu ? oncekiVeri : null));
        while(atananlar.length < kapasite && adaylar.length > 0) {
          const secilen = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
          haftalikProgram[secilen.isim][gIdx] = saat;
          atananlar.push(secilen.isim);
        }

        atananlar.forEach(isim => {
          hucreContent += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${isim}</span></div>`;
        });
      });
      html += `<td contenteditable="true">${hucreContent}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
  localStorage.setItem(storageKey, JSON.stringify(haftalikProgram));
  ozetTabloGuncelle();
}

function ozetTabloGuncelle() {
  let html = `<table style="font-size:10px; border-collapse:collapse; width:100%"><thead><tr><th>Personel</th><th>Birim</th><th>Mesai</th><th>Gece</th></tr></thead><tbody>`;
  personeller.forEach(p => {
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