// --- VERİ YAPISI ---
const varsayilanBirimler = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const varsayilanPersoneller = [
  { isim: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN" }, { isim: "M.BERKMAN", birim: "TEKNİK YÖNETMEN" },
  { isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN" }, { isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN" },
  { isim: "H.CAN SAĞLAM", birim: "TEKNİK YÖNETMEN" }, { isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN" },
  { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" }, { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
  { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" }, { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
  { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" }, { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
  { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" }, { isim: "MUSAB YAKUP DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" }
];

// LocalStorage Hafızası
let birimSiralamasi = JSON.parse(localStorage.getItem("birimSiralamasi")) || varsayilanBirimler;
let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || varsayilanPersoneller.map((p, i) => ({ ...p, id: Date.now() + i }));
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];
let saatler = JSON.parse(localStorage.getItem("saatler")) || ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
let mevcutPazartesi = getMonday(new Date());

function getMonday(d) {
  d = new Date(d);
  let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// --- BAŞLATMA ---
function baslat() {
  birimArayuzunuGuncelle();
  checklistOlustur();
  tabloyuOlustur();
}

function birimArayuzunuGuncelle() {
  const pBirimSel = document.getElementById("yeniPersonelBirim");
  if(pBirimSel) pBirimSel.innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

// --- SEKME YÖNETİMİ ---
function tabDegistir(name) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.remove('hidden');
  
  // Buton aktifliği
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => { if(btn.getAttribute('onclick').includes(name)) btn.classList.add('active'); });

  if (name === 'personel') { personelCiz(); birimCiz(); }
  if (name === 'kapasite') kapasiteCiz();
  if (name === 'sabit') sabitCiz();
  if (name === 'saatler') saatCiz();
}

function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); tabDegistir('sabit'); }

// --- BİRİM YÖNETİMİ ---
function birimCiz() {
  document.getElementById("birimListesi").innerHTML = birimSiralamasi.map((b, idx) => `
    <div class="admin-list-item"><span>${b}</span><button onclick="birimSil(${idx})" class="btn-reset" style="width:auto; padding:2px 8px;">SİL</button></div>
  `).join('');
}
function birimEkle() {
  const b = document.getElementById("yeniBirimInput").value.trim().toUpperCase();
  if(!b) return;
  birimSiralamasi.push(b);
  localStorage.setItem("birimSiralamasi", JSON.stringify(birimSiralamasi));
  document.getElementById("yeniBirimInput").value = "";
  birimCiz(); birimArayuzunuGuncelle();
}
function birimSil(idx) {
  birimSiralamasi.splice(idx, 1);
  localStorage.setItem("birimSiralamasi", JSON.stringify(birimSiralamasi));
  birimCiz(); birimArayuzunuGuncelle();
}

// --- PERSONEL YÖNETİMİ ---
function personelCiz() {
  document.getElementById("personelListesi").innerHTML = sabitPersoneller.map(p => `
    <div class="admin-list-item"><span><strong>${p.birim}</strong>: ${p.isim}</span><button onclick="personelSil(${p.id})" class="btn-reset" style="width:auto; padding:2px 8px;">SİL</button></div>
  `).join('');
}
function manuelPersonelEkle() {
  const ad = document.getElementById("yeniPersonelAd").value.trim().toUpperCase();
  const birim = document.getElementById("yeniPersonelBirim").value;
  if(!ad) return;
  sabitPersoneller.push({ isim: ad, birim: birim, id: Date.now() });
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  document.getElementById("yeniPersonelAd").value = "";
  personelCiz(); checklistOlustur(); tabloyuOlustur();
}
function personelSil(id) {
  sabitPersoneller = sabitPersoneller.filter(p => p.id !== id);
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  personelCiz(); checklistOlustur(); tabloyuOlustur();
}

// --- SABİT ATAMA (TÜM HAFTA DAHİL) ---
function sabitCiz() {
  document.getElementById("sabitPersSec").innerHTML = sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
  document.getElementById("sabitSaatSec").innerHTML = saatler.map(s => `<option value="${s}">${s}</option>`).join('');
  document.getElementById("sabitListesi").innerHTML = sabitAtamalar.map((s, idx) => `
    <div class="admin-list-item"><span>${s.isim} | ${s.gun === 'all' ? 'TÜM HAFTA' : gunler[s.gun]} | ${s.saat}</span><button onclick="sabitSil(${idx})" class="btn-reset" style="width:auto; padding:2px 8px;">SİL</button></div>
  `).join('');
}
function sabitAtamaEkle() {
  const isim = document.getElementById("sabitPersSec").value;
  const gun = document.getElementById("sabitGunSec").value;
  const saat = document.getElementById("sabitSaatSec").value;
  sabitAtamalar.push({ isim, gun, saat });
  localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
  sabitCiz(); tabloyuOlustur();
}
function sabitSil(idx) {
  sabitAtamalar.splice(idx, 1);
  localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
  sabitCiz(); tabloyuOlustur();
}

// --- SAAT YÖNETİMİ ---
function saatCiz() {
  document.getElementById("saatListesiAdmin").innerHTML = saatler.map((s, idx) => `
    <div class="admin-list-item"><span>${s}</span><button onclick="saatSil(${idx})" class="btn-reset" style="width:auto; padding:2px 8px;">SİL</button></div>
  `).join('');
}
function saatEkle() {
  const s = document.getElementById("yeniSaatInput").value.trim();
  if(!s) return;
  saatler.push(s);
  localStorage.setItem("saatler", JSON.stringify(saatler));
  document.getElementById("yeniSaatInput").value = "";
  saatCiz(); tabloyuOlustur();
}
function saatSil(idx) {
  saatler.splice(idx, 1);
  localStorage.setItem("saatler", JSON.stringify(saatler));
  saatCiz(); tabloyuOlustur();
}

// --- KAPASİTE ---
function kapasiteCiz() {
  const cont = document.getElementById("kapasiteListesi");
  let html = `<div class="cap-table-header"><div>Birimler</div>${saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
  birimSiralamasi.forEach(b => {
    html += `<div class="cap-row"><strong>${b}</strong>`;
    saatler.forEach(s => {
      html += `<div class="cap-input-group">
        <input type="number" value="${kapasiteAyarlari[b]?.[s]?.h || 0}" onchange="gK('${b}','${s}','h',this.value)">
        <input type="number" class="input-hs" value="${kapasiteAyarlari[b]?.[s]?.hs || 0}" onchange="gK('${b}','${s}','hs',this.value)">
      </div>`;
    });
    html += `</div>`;
  });
  cont.innerHTML = html;
}
function gK(b, s, t, v) {
  if(!kapasiteAyarlari[b]) kapasiteAyarlari[b] = {};
  if(!kapasiteAyarlari[b][s]) kapasiteAyarlari[b][s] = {};
  kapasiteAyarlari[b][s][t] = parseInt(v) || 0;
  localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
  tabloyuOlustur();
}

// --- VARDİYA MOTORU ---
function tabloyuOlustur() {
  document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
  let program = {};
  sabitPersoneller.forEach(p => {
    program[p.isim] = Array(7).fill(null);
    if(document.getElementById(`check_${p.id}`)?.checked) program[p.isim].fill("İZİNLİ");
  });

  // Sabit Atamaları İşle
  sabitAtamalar.forEach(atama => {
    if(program[atama.isim]) {
      if(atama.gun === "all") {
        for(let i=0; i<7; i++) if(program[atama.isim][i] !== "İZİNLİ") program[atama.isim][i] = atama.saat;
      } else {
        if(program[atama.isim][atama.gun] !== "İZİNLİ") program[atama.isim][atama.gun] = atama.saat;
      }
    }
  });

  // MCR Döngüsü ve Teknik Yönetmen Rotasyonu (Mevcut mantık korunur)
  const refDate = new Date("2026-01-19");
  const diff = Math.floor((mevcutPazartesi - refDate) / (1000*60*60*24));
  ["24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"].forEach(birim => {
    sabitPersoneller.filter(p => p.birim === birim).forEach((p, idx) => {
      for (let i = 0; i < 7; i++) {
        let cycle = (diff + i + (idx * 2)) % 8;
        if(cycle < 0) cycle += 8;
        let s = cycle < 2 ? "06:30–16:00" : cycle < 4 ? "16:00–00:00" : cycle < 6 ? "00:00–07:00" : "İZİNLİ";
        if (program[p.isim][i] === null) program[p.isim][i] = s;
      }
    });
  });

  for (let i = 0; i < 7; i++) {
    let sorumlu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
    if (program[sorumlu] && program[sorumlu][i] === null) program[sorumlu][i] = "00:00–07:00";
  }

  renderTable(program);
}

function renderTable(program) {
  document.getElementById("tableHeader").innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
    let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
    return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
  }).join('');

  let body = "";
  saatler.forEach(s => {
    body += `<tr><td><strong>${s}</strong></td>`;
    for (let i = 0; i < 7; i++) {
      let content = sabitPersoneller.filter(p => program[p.isim][i] === s)
        .sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
        .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
      body += `<td>${content}</td>`;
    }
    body += `</tr>`;
  });
  document.getElementById("tableBody").innerHTML = body;

  let foot = `<tr><td><strong>İZİNLİ</strong></td>`;
  for (let i = 0; i < 7; i++) {
    let iz = sabitPersoneller.filter(p => program[p.isim][i] === "İZİNLİ")
      .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
    foot += `<td>${iz}</td>`;
  }
  document.getElementById("tableFooter").innerHTML = foot + "</tr>";
}

function checklistOlustur() {
  document.getElementById("personelChecklist").innerHTML = sabitPersoneller.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
    .map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label for="check_${p.id}">${p.isim}</label></div>`).join('');
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function sifirla() { if(confirm("Sıfırlansın mı?")) { localStorage.clear(); location.reload(); } }
function exportExcel() {
  const wb = XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu"), { sheet: "Vardiya" });
  XLSX.writeFile(wb, `Vardiya_${mevcutPazartesi.toLocaleDateString('tr-TR')}.xlsx`);
}

window.onload = baslat;