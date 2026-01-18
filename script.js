// --- VERİ TABANI ---
const defaultBirimler = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const defaultPersoneller = [
  { isim: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN" }, { isim: "M.BERKMAN", birim: "TEKNİK YÖNETMEN" },
  { isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN" }, { isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN" },
  { isim: "H.CAN SAĞLAM", birim: "TEKNİK YÖNETMEN" }, { isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN" },
  { isim: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ" }, { isim: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ" },
  { isim: "ZAFER AKAR", birim: "SES OPERATÖRÜ" }, { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ" },
  { isim: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ" }, { isim: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ" },
  { isim: "ENES KALE", birim: "SES OPERATÖRÜ" }, { isim: "ERSAN TİLBE", birim: "SES OPERATÖRÜ" },
  { isim: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ" }, { isim: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ" }, { isim: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ" }, { isim: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ" }, { isim: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ" },
  { isim: "DEMET CENGİZ", birim: "KJ OPERATÖRÜ" }, { isim: "SENA BAYDAR", birim: "KJ OPERATÖRÜ" },
  { isim: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ" }, { isim: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ" },
  { isim: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ" },
  { isim: "ERCAN PALABIYIK", birim: "INGEST OPERATÖRÜ" }, { isim: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ" },
  { isim: "UĞUR AKBABA", birim: "INGEST OPERATÖRÜ" },
  { isim: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM" }, { isim: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM" },
  { isim: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM" }, { isim: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM" },
  { isim: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ" }, { isim: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ" },
  { isim: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ" }, { isim: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ" },
  { isim: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ" },
  { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" }, { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
  { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" }, { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
  { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" }, { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
  { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" }, { isim: "MUSAB YAKUP DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" }
];
const defaultSaatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let birimSiralamasi = JSON.parse(localStorage.getItem("birimSiralamasi")) || defaultBirimler;
let saatler = JSON.parse(localStorage.getItem("saatler")) || defaultSaatler;
let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || defaultPersoneller.map((p, i) => ({ ...p, id: 1000 + i }));
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
let mevcutPazartesi = getMonday(new Date());

function getMonday(d) {
  d = new Date(d);
  let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// --- BAŞLATMA ---
function baslat() {
  birimSelectGuncelle();
  checklistOlustur();
  tabloyuOlustur();
}

// "Vardiya Oluştur" Butonunun Özel Fonksiyonu
function zorlaOlustur() {
  tabloyuOlustur();
  alert("Vardiya Programı Güncellendi!");
}

function toggleAdminPanel() {
  document.getElementById("adminPanel").classList.toggle("hidden");
  tabDegistir('sabit');
}

function tabDegistir(name) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const target = document.getElementById('tab-' + name);
  if (target) target.classList.remove('hidden');
  if (name === 'personel') { birimListesiCiz(); personelListesiCiz(); }
  if (name === 'sabit') sabitListesiCiz();
  if (name === 'saatler') saatListesiCiz();
  if (name === 'kapasite') kapasiteCiz();
}

// --- BİRİM VE PERSONEL ---
function birimSelectGuncelle() {
  const sel = document.getElementById("yeniPersonelBirim");
  if (sel) sel.innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function manuelPersonelEkle() {
  const isim = document.getElementById("yeniPersonelAd").value.trim().toUpperCase();
  const birim = document.getElementById("yeniPersonelBirim").value;
  if (!isim) return;
  sabitPersoneller.push({ isim, birim, id: Date.now() });
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  document.getElementById("yeniPersonelAd").value = "";
  personelListesiCiz(); checklistOlustur(); tabloyuOlustur();
}

function personelListesiCiz() {
  document.getElementById("personelYonetimListesi").innerHTML = sabitPersoneller.map(p => `
    <div class="admin-list-item"><span><strong>${p.birim}</strong>: ${p.isim}</span><button onclick="personelSil(${p.id})">SİL</button></div>
  `).join('');
}

function personelSil(id) {
  sabitPersoneller = sabitPersoneller.filter(p => p.id !== id);
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  personelListesiCiz(); checklistOlustur(); tabloyuOlustur();
}

// --- SABİT ATAMALAR ---
function sabitAtamaEkle() {
  const isim = document.getElementById("sabitPersSec").value;
  const gun = document.getElementById("sabitGunSec").value;
  const saat = document.getElementById("sabitSaatSec").value;
  sabitAtamalar.push({ isim, gun, saat });
  localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
  sabitListesiCiz(); tabloyuOlustur();
}

function sabitListesiCiz() {
  document.getElementById("sabitPersSec").innerHTML = sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
  document.getElementById("sabitSaatSec").innerHTML = saatler.map(s => `<option value="${s}">${s}</option>`).join('');
  document.getElementById("sabitListesi").innerHTML = sabitAtamalar.map((s, i) => `
    <div class="admin-list-item"><span>${s.isim} | ${s.gun === 'pzt_cum' ? 'PZT-CUM' : gunler[s.gun]} | ${s.saat}</span><button onclick="sabitSil(${i})">SİL</button></div>
  `).join('');
}

function sabitSil(i) {
  sabitAtamalar.splice(i, 1);
  localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
  sabitListesiCiz(); tabloyuOlustur();
}

// --- VARDİYA MOTORU ---
function tabloyuOlustur() {
  const tarihArea = document.getElementById("tarihAraligi");
  if(tarihArea) tarihArea.innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;

  let program = {};
  sabitPersoneller.forEach(p => {
    program[p.isim] = Array(7).fill(null);
    const chk = document.getElementById(`check_${p.id}`);
    if (chk && chk.checked) program[p.isim].fill("İZİNLİ");
  });

  // Sabit Kurallar (Pzt-Cum Dahil)
  sabitAtamalar.forEach(atama => {
    if (program[atama.isim]) {
      if (atama.gun === "pzt_cum") {
        for (let i = 0; i < 5; i++) if (program[atama.isim][i] !== "İZİNLİ") program[atama.isim][i] = atama.saat;
        program[atama.isim][5] = "İZİNLİ";
        program[atama.isim][6] = "İZİNLİ";
      } else {
        let gIdx = parseInt(atama.gun);
        if (program[atama.isim][gIdx] !== "İZİNLİ") program[atama.isim][gIdx] = atama.saat;
      }
    }
  });

  // MCR Otomatik Döngü
  const refDate = new Date("2026-01-19");
  const diff = Math.floor((mevcutPazartesi - refDate) / (1000*60*60*24));
  ["24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"].forEach(birim => {
    sabitPersoneller.filter(p => p.birim === birim).forEach((p, idx) => {
      for (let i = 0; i < 7; i++) {
        if (program[p.isim][i] !== null) continue;
        let cycle = (diff + i + (idx * 2)) % 8;
        if(cycle < 0) cycle += 8;
        program[p.isim][i] = cycle < 2 ? "06:30–16:00" : cycle < 4 ? "16:00–00:00" : cycle < 6 ? "00:00–07:00" : "İZİNLİ";
      }
    });
  });

  // Teknik Yönetmen Gece Rotasyonu
  for (let i = 0; i < 7; i++) {
    let sorumlu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
    if (program[sorumlu] && program[sorumlu][i] === null) program[sorumlu][i] = "00:00–07:00";
  }

  render(program);
}

function render(program) {
  const header = document.getElementById("tableHeader");
  const body = document.getElementById("tableBody");
  const footer = document.getElementById("tableFooter");

  if(!header || !body) return;

  header.innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
    let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
    return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
  }).join('');

  let bodyHtml = "";
  saatler.forEach(s => {
    bodyHtml += `<tr><td><strong>${s}</strong></td>`;
    for (let i = 0; i < 7; i++) {
      let list = sabitPersoneller.filter(p => program[p.isim][i] === s)
        .sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
        .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
      bodyHtml += `<td>${list}</td>`;
    }
    bodyHtml += `</tr>`;
  });
  body.innerHTML = bodyHtml;

  let footHtml = `<tr><td><strong>İZİNLİ</strong></td>`;
  for (let i = 0; i < 7; i++) {
    let iz = sabitPersoneller.filter(p => program[p.isim][i] === "İZİNLİ")
      .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
    footHtml += `<td>${iz}</td>`;
  }
  footer.innerHTML = footHtml + "</tr>";
}

function checklistOlustur() {
  const cont = document.getElementById("personelChecklist");
  if(!cont) return;
  cont.innerHTML = sabitPersoneller.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
    .map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label for="check_${p.id}">${p.isim}</label></div>`).join('');
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function sifirla() { localStorage.clear(); location.reload(); }

window.onload = baslat;