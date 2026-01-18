const birimSiralamasi = [
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
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

function getMonday(d) {
  d = new Date(d);
  let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// --- PANEL VE SEKME YÖNETİMİ ---
function setupPanelEvents() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
    };
  });
}

function birimSelectDoldur() {
  const sel = document.getElementById("yeniPersonelBirim");
  if(sel) sel.innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function manuelPersonelEkle() {
  const ad = document.getElementById("yeniPersonelAd").value.trim().toUpperCase();
  const birim = document.getElementById("yeniPersonelBirim").value;
  if(!ad) return alert("İsim giriniz!");
  sabitPersoneller.push({ isim: ad, birim: birim, id: Date.now() });
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  document.getElementById("yeniPersonelAd").value = "";
  personelListesiniCiz();
  checklistOlustur();
  tabloyuOlustur();
}

function personelSil(id) {
  sabitPersoneller = sabitPersoneller.filter(p => p.id !== id);
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  personelListesiniCiz();
  checklistOlustur();
  tabloyuOlustur();
}

function personelListesiniCiz() {
  const cont = document.getElementById("personelYonetimListesi");
  if(cont) cont.innerHTML = sabitPersoneller.map(p => `
    <div class="admin-list-item">
      <span><strong>${p.birim}</strong>: ${p.isim}</span>
      <button onclick="personelSil(${p.id})" class="btn-reset" style="padding:2px 8px; margin:0;">SİL</button>
    </div>
  `).join('');
}

function kapasitePaneliniCiz() {
  const cont = document.getElementById("kapasiteListesi");
  if(!cont) return;
  cont.innerHTML = birimSiralamasi.map(birim => `
    <div class="cap-unit-section">
      <h3>${birim}</h3>
      ${saatler.map(s => `
        <div class="cap-input-group">
          <small>${s}</small>
          <input type="number" value="${kapasiteAyarlari[birim][s]?.haftaici || 0}" onchange="kapasiteGuncelle('${birim}','${s}','haftaici',this.value)">
          <input type="number" class="input-hs" value="${kapasiteAyarlari[birim][s]?.haftasonu || 0}" onchange="kapasiteGuncelle('${birim}','${s}','haftasonu',this.value)">
        </div>
      `).join('')}
    </div>
  `).join('');
}

function kapasiteGuncelle(birim, saat, tip, deger) {
  if(!kapasiteAyarlari[birim]) kapasiteAyarlari[birim] = {};
  if(!kapasiteAyarlari[birim][saat]) kapasiteAyarlari[birim][saat] = {haftaici:0, haftasonu:0};
  kapasiteAyarlari[birim][saat][tip] = parseInt(deger) || 0;
  localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
  tabloyuOlustur();
}

// --- VARDİYA MOTORU ---
function tabloyuOlustur() {
  document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
  haftalikProgram = {};
  
  sabitPersoneller.forEach(p => {
    haftalikProgram[p.isim] = Array(7).fill(null);
    if (document.getElementById(`check_${p.id}`)?.checked) {
        haftalikProgram[p.isim].fill("İZİNLİ");
    }
  });

  // 1. MCR Döngüsü (2-2-2-2)
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
        if (haftalikProgram[p.isim][i] !== "İZİNLİ") haftalikProgram[p.isim][i] = atama;
      }
    });
  });

  // 2. Teknik Yönetmen Gece Rotasyonu
  for (let i = 0; i < 7; i++) {
    let sorumlu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
    if (haftalikProgram[sorumlu] && haftalikProgram[sorumlu][i] !== "İZİNLİ") {
      haftalikProgram[sorumlu][i] = "00:00–07:00";
    }
  }

  // 3. Adil Atama
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
        let kap = isHS ? (kapasiteAyarlari[birim][s]?.haftasonu || 0) : (kapasiteAyarlari[birim][s]?.haftaici || 0);
        let suan = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === s).length;
        
        let adaylar = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === null);
        if (birim === "TEKNİK YÖNETMEN" && s === "00:00–07:00") return; // Sadece Barış/Ekrem geceye girebilir

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
  const head = document.getElementById("tableHeader");
  head.innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
    let t = new Date(mevcutPazartesi);
    t.setDate(t.getDate() + i);
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

  // İzinli Satırı Geri Geldi
  let footerHtml = `<tr><td style="background:#f1f5f9"><strong>İZİNLİ</strong></td>`;
  for (let i = 0; i < 7; i++) {
    let izinliler = sabitPersoneller.filter(p => haftalikProgram[p.isim][i] === "İZİNLİ")
      .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>