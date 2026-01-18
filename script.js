// --- HAFIZA VE AYARLAR ---
let birimSiralamasi = JSON.parse(localStorage.getItem("birimSiralamasi")) || [
  "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ",
  "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ",
  "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const asilPersonelListesi = [
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

let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || asilPersonelListesi.map((p, i) => ({ ...p, id: Date.now() + i }));
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];
let saatler = JSON.parse(localStorage.getItem("saatler")) || ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

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

function birimSelectGuncelle() {
  const pBirimSel = document.getElementById("yeniPersonelBirim");
  if(pBirimSel) pBirimSel.innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

// --- YÖNETİM PANELİ SEKME YÖNETİMİ ---
function toggleAdminPanel() {
  const panel = document.getElementById("adminPanel");
  panel.classList.toggle("hidden");
  if (!panel.classList.contains("hidden")) tabDegistir('sabit');
}

function tabDegistir(name) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const target = document.getElementById('tab-' + name);
  if (target) target.classList.remove('hidden');

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(`'${name}'`)) btn.classList.add('active');
  });

  if (name === 'personel') { personelYonetimiCiz(); birimYonetimiCiz(); }
  if (name === 'kapasite') kapasitePaneliniCiz();
  if (name === 'sabit') sabitAtamaListesiCiz();
  if (name === 'saatler') saatYonetimiCiz();
}

// --- BİRİM YÖNETİMİ (YENİ) ---
function birimYonetimiCiz() {
  const cont = document.getElementById("birimYonetimListesi");
  if(!cont) return;
  cont.innerHTML = birimSiralamasi.map((b, idx) => `
    <div class="admin-list-item">
      <span>${b}</span>
      <button onclick="birimSil(${idx})" class="btn-reset" style="width:auto; padding:2px 8px;">SİL</button>
    </div>
  `).join('');
}

function birimEkle() {
  const input = document.getElementById("yeniBirimInput");
  const yeniBirim = input.value.trim().toUpperCase();
  if(!yeniBirim) return;
  if(birimSiralamasi.includes(yeniBirim)) return alert("Bu birim zaten var.");
  
  birimSiralamasi.push(yeniBirim);
  localStorage.setItem("birimSiralamasi", JSON.stringify(birimSiralamasi));
  input.value = "";
  birimYonetimiCiz();
  birimSelectGuncelle();
}

function birimSil(idx) {
  if(confirm("Birimi silmek bu birimdeki personellerin görünümünü etkileyebilir. Emin misiniz?")) {
    birimSiralamasi.splice(idx, 1);
    localStorage.setItem("birimSiralamasi", JSON.stringify(birimSiralamasi));
    birimYonetimiCiz();
    birimSelectGuncelle();
  }
}

// --- SABİT ATAMALAR (TÜM HAFTA ÖZELLİĞİ EKLENDİ) ---
function sabitAtamaEkle() {
  const isim = document.getElementById("sabitPersSec").value;
  const gunVal = document.getElementById("sabitGunSec").value;
  const saat = document.getElementById("sabitSaatSec").value;

  if (gunVal === "all") {
    // 0'dan 6'ya tüm günleri ekle
    for (let i = 0; i < 7; i++) {
      // Mükerrer kaydı önlemek için önce temizle (isteğe bağlı)
      sabitAtamalar = sabitAtamalar.filter(a => !(a.isim === isim && a.gun === i));
      sabitAtamalar.push({ isim, gun: i, saat });
    }
  } else {
    const gun = parseInt(gunVal);
    sabitAtamalar = sabitAtamalar.filter(a => !(a.isim === isim && a.gun === gun));
    sabitAtamalar.push({ isim, gun, saat });
  }

  localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
  sabitAtamaListesiCiz();
  tabloyuOlustur();
}

function sabitAtamaListesiCiz() {
  document.getElementById("sabitPersSec").innerHTML = sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
  document.getElementById("sabitSaatSec").innerHTML = saatler.map(s => `<option value="${s}">${s}</option>`).join('');
  document.getElementById("sabitListesi").innerHTML = sabitAtamalar.sort((a,b) => a.gun - b.gun).map((s, idx) => `
    <div class="admin-list-item">
      <span>${s.isim} | ${gunler[s.gun]} | ${s.saat}</span>
      <button onclick="sabitAtamaSil(${idx})" class="btn-reset" style="width:auto; padding:2px 8px;">SİL</button>
    </div>
  `).join('');
}

function sabitAtamaSil(idx) {
  sabitAtamalar.splice(idx, 1);
  localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
  sabitAtamaListesiCiz();
  tabloyuOlustur();
}

// --- DİĞER YÖNETİM FONKSİYONLARI ---
function personelYonetimiCiz() {
  document.getElementById("personelYonetimListesi").innerHTML = sabitPersoneller.map(p => `
    <div class="admin-list-item">
      <span><strong>${p.birim}</strong>: ${p.isim}</span>
      <button onclick="personelSil(${p.id})" class="btn-reset" style="width:auto; padding:2px 8px;">SİL</button>
    </div>
  `).join('');
}

function manuelPersonelEkle() {
  const ad = document.getElementById("yeniPersonelAd").value.trim().toUpperCase();
  const birim = document.getElementById("yeniPersonelBirim").value;
  if (!ad) return;
  sabitPersoneller.push({ isim: ad, birim: birim, id: Date.now() });
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  document.getElementById("yeniPersonelAd").value = "";
  personelYonetimiCiz();
  checklistOlustur();
  tabloyuOlustur();
}

function personelSil(id) {
  sabitPersoneller = sabitPersoneller.filter(p => p.id !== id);
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  personelYonetimiCiz();
  checklistOlustur();
  tabloyuOlustur();
}

function saatYonetimiCiz() {
  document.getElementById("saatYonetimListesi").innerHTML = saatler.map((s, idx) => `
    <div class="admin-list-item">
      <span>${s}</span>
      <button onclick="saatSil(${idx})" class="btn-reset" style="width:auto; padding:2px 8px;">SİL</button>
    </div>
  `).join('');
}

function saatEkle() {
  const input = document.getElementById("yeniSaatInput");
  if(!input.value) return;
  saatler.push(input.value);
  localStorage.setItem("saatler", JSON.stringify(saatler));
  input.value = "";
  saatYonetimiCiz();
  tabloyuOlustur();
}

function saatSil(idx) {
  saatler.splice(idx, 1);
  localStorage.setItem("saatler", JSON.stringify(saatler));
  saatYonetimiCiz();
  tabloyuOlustur();
}

function kapasitePaneliniCiz() {
  const cont = document.getElementById("kapasiteListesi");
  if(!cont) return;
  let html = `<div class="cap-table-header"><div>Birimler</div>${saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
  birimSiralamasi.forEach(b => {
    html += `<div class="cap-row"><strong>${b}</strong>`;
    saatler.forEach(s => {
      html += `
        <div class="cap-input-group">
          <input type="number" value="${kapasiteAyarlari[b]?.[s]?.haftaici || 0}" onchange="gK('${b}','${s}','haftaici',this.value)">
          <input type="number" class="input-hs" value="${kapasiteAyarlari[b]?.[s]?.haftasonu || 0}" onchange="gK('${b}','${s}','haftasonu',this.value)">
        </div>`;
    });
    html += `</div>`;
  });
  cont.innerHTML = html;
}

function gK(b, s, t, v) {
  if (!kapasiteAyarlari[b]) kapasiteAyarlari[b] = {};
  if (!kapasiteAyarlari[b][s]) kapasiteAyarlari[b][s] = {};
  kapasiteAyarlari[b][s][t] = parseInt(v) || 0;
  localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
  tabloyuOlustur();
}

// --- VARDİYA MOTORU ---
function tabloyuOlustur() {
  document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
  haftalikProgram = {};

  sabitPersoneller.forEach(p => {
    haftalikProgram[p.isim] = Array(7).fill(null);
    if (document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİNLİ");
  });

  sabitAtamalar.forEach(s => {
    if (haftalikProgram[s.isim] && haftalikProgram[s.isim][s.gun] !== "İZİNLİ") haftalikProgram[s.isim][s.gun] = s.saat;
  });

  // MCR Döngüsü
  const refDate = new Date("2026-01-19");
  const diff = Math.floor((mevcutPazartesi - refDate) / (1000 * 60 * 60 * 24));
  ["24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"].forEach(birim => {
    let mcrP = sabitPersoneller.filter(p => p.birim === birim);
    mcrP.forEach((p, idx) => {
      let offset = idx * 2;
      for (let i = 0; i < 7; i++) {
        let cycle = (diff + i + offset) % 8;
        if(cycle < 0) cycle += 8;
        let atama = cycle < 2 ? "06:30–16:00" : cycle < 4 ? "16:00–00:00" : cycle < 6 ? "00:00–07:00" : "İZİNLİ";
        if (haftalikProgram[p.isim][i] === null) haftalikProgram[p.isim][i] = atama;
      }
    });
  });

  // Teknik Yönetmen Gece
  for (let i = 0; i < 7; i++) {
    let sorumlu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
    if (haftalikProgram[sorumlu] && haftalikProgram[sorumlu][i] === null) haftalikProgram[sorumlu][i] = "00:00–07:00";
  }

  adilAtamaYap();
  renderTable();
}

function adilAtamaYap() {
  const counts = {};
  sabitPersoneller.forEach(p => counts[p.isim] = haftalikProgram[p.isim].filter(x => x && x !== "İZİNLİ").length);

  for (let gun = 0; gun < 7; gun++) {
    const isHS = gun >= 5;
    saatler.forEach(s => {
      birimSiralamasi.forEach(birim => {
        if (birim.includes("MCR")) return;
        let kap = isHS ? (kapasiteAyarlari[birim]?.[s]?.haftasonu || 0) : (kapasiteAyarlari[birim]?.[s]?.haftaici || 0);
        let suan = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === s).length;
        let adaylar = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === null);
        
        if (birim === "TEKNİK YÖNETMEN" && s === "00:00–07:00") return;

        adaylar.sort((a, b) => counts[a.isim] - counts[b.isim]);
        for (let k = 0; k < (kap - suan) && adaylar.length > 0; k++) {
          let p = adaylar.shift();
          haftalikProgram[p.isim][gun] = s;
          counts[p.isim]++;
        }
      });
    });
  }
}

function renderTable() {
  document.getElementById("tableHeader").innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
    let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
    return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
  }).join('');

  let body = "";
  saatler.forEach(s => {
    body += `<tr><td><strong>${s}</strong></td>`;
    for (let i = 0; i < 7; i++) {
      let html = sabitPersoneller.filter(p => haftalikProgram[p.isim][i] === s)
        .sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
        .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
      body += `<td>${html}</td>`;
    }
    body += `</tr>`;
  });
  document.getElementById("tableBody").innerHTML = body;

  let footer = `<tr><td style="background:#f1f5f9"><strong>İZİNLİ</strong></td>`;
  for (let i = 0; i < 7; i++) {
    let izinliler = sabitPersoneller.filter(p => haftalikProgram[p.isim][i] === "İZİNLİ")
      .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
    footer += `<td style="background:#f1f5f9">${izinliler}</td>`;
  }
  document.getElementById("tableFooter").innerHTML = footer + "</tr>";
}

function checklistOlustur() {
  document.getElementById("personelChecklist").innerHTML = sabitPersoneller.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
    .map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label for="check_${p.id}">${p.isim}</label></div>`).join('');
}

// --- YARDIMCI ARAÇLAR ---
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function sifirla() { if(confirm("DİKKAT! Tüm ay