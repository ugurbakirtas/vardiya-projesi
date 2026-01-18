const birimSiralamasi = [
  "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ",
  "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ",
  "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const asilPersonelListesi = [
  { isim: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN" },
  { isim: "M.BERKMAN", birim: "TEKNİK YÖNETMEN" },
  { isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN" },
  { isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN" },
  { isim: "H.CAN SAĞLAM", birim: "TEKNİK YÖNETMEN" },
  { isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN" },
  { isim: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ" },
  { isim: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ" },
  { isim: "ZAFER AKAR", birim: "SES OPERATÖRÜ" },
  { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ" },
  { isim: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ" },
  { isim: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ" },
  { isim: "ENES KALE", birim: "SES OPERATÖRÜ" },
  { isim: "ERSAN TİLBE", birim: "SES OPERATÖRÜ" },
  { isim: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ" },
  { isim: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ" },
  { isim: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ" },
  { isim: "DEMET CENGİZ", birim: "KJ OPERATÖRÜ" },
  { isim: "SENA BAYDAR", birim: "KJ OPERATÖRÜ" },
  { isim: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ" },
  { isim: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ" },
  { isim: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ" },
  { isim: "ERCAN PALABIYIK", birim: "INGEST OPERATÖRÜ" },
  { isim: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ" },
  { isim: "UĞUR AKBABA", birim: "INGEST OPERATÖRÜ" },
  { isim: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM" },
  { isim: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM" },
  { isim: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM" },
  { isim: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM" },
  { isim: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ" },
  { isim: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ" },
  { isim: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ" },
  { isim: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ" },
  { isim: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ" },
  { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
  { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
  { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" },
  { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
  { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" },
  { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
  { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" },
  { isim: "MUSAB YAKUP DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" }
];

let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || asilPersonelListesi.map((p, i) => ({ ...p, id: i + 1 }));
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function getMonday(d) {
  d = new Date(d);
  let day = d.getDay();
  let diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function baslat() {
  birimSiralamasi.forEach(b => {
    if (!kapasiteAyarlari[b]) {
      kapasiteAyarlari[b] = {};
      saatler.forEach(s => {
        let hi = 1, hs = 1;
        if (b === "TEKNİK YÖNETMEN") {
          if (s === "06:30–16:00") { hi = 2; hs = 1; }
          else if (s === "16:00–00:00" || s === "00:00–07:00") { hi = 1; hs = 1; }
          else { hi = 0; hs = 0; }
        }
        kapasiteAyarlari[b][s] = { haftaici: hi, haftasonu: hs };
      });
    }
  });

  document.getElementById("yeniPersonelBirim").innerHTML =
    birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');

  checklistOlustur();
  tabloyuOlustur();
}

function tabloyuOlustur() {
  document.getElementById("tarihAraligi").innerText =
    `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;

  haftalikProgram = {};

  // Herkes için boş başlat + checkbox ile İZİNLİ
  sabitPersoneller.forEach(p => {
    haftalikProgram[p.isim] = Array(7).fill(null);
    if (document.getElementById(`check_${p.id}`)?.checked) {
      haftalikProgram[p.isim].fill("İZİNLİ");
    }
  });

  // Sabit atamalar
  sabitAtamalar.forEach(s => {
    if (haftalikProgram[s.isim]) {
      haftalikProgram[s.isim][s.gun] = s.saat;
    }
  });

  // MCR 2-2-2-2 SABİT SİSTEM
  const refDate = new Date("2026-01-19");
  const diff = Math.floor((mevcutPazartesi - refDate) / (1000 * 60 * 60 * 24));
  ["24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"].forEach(birim => {
    let mcrP = sabitPersoneller.filter(p => p.birim === birim);
    mcrP.forEach((p, idx) => {
      let offset = idx * 2;
      for (let i = 0; i < 7; i++) {
        let cycle = (diff + i + offset) % 8;
        let atama = null;
        if (cycle < 2) atama = "06:30–16:00";
        else if (cycle < 4) atama = "16:00–00:00";
        else if (cycle < 6) atama = "00:00–07:00";
        else atama = "İZİNLİ";

        // Çakışma kontrolü: eğer zaten doluysa atlamıyoruz, çünkü sabit döngü öncelikli
        haftalikProgram[p.isim][i] = atama;
      }
    });
  });

  // TY hariç en az 1 gün izin zorunluluğu
  sabitPersoneller.forEach(p => {
    if (!p.birim.includes("MCR") && p.birim !== "TEKNİK YÖNETMEN") {
      if (!haftalikProgram[p.isim].includes("İZİNLİ")) {
        let empty = [];
        for (let i = 0; i < 7; i++) {
          if (haftalikProgram[p.isim][i] === null) empty.push(i);
        }
        if (empty.length > 0) {
          let randomGun = empty[Math.floor(Math.random() * empty.length)];
          haftalikProgram[p.isim][randomGun] = "İZİNLİ";
        }
      }
    }
  });

  // TY gece rotasyonu
  const weekNum = Math.floor(mevcutPazartesi.getTime() / (7 * 24 * 60 * 60 * 1000));
  const sorumluGece = (weekNum % 2 === 0) ? "BARIŞ İNCE" : "EKREM FİDAN";
  [0, 1].forEach(gun => {
    if (haftalikProgram[sorumluGece] && haftalikProgram[sorumluGece][gun] === null) {
      haftalikProgram[sorumluGece][gun] = "00:00–07:00";
    }
  });

  // ← YENİ: Çakışmaları temizle (aynı gün birden fazla vardiya)
  temizleGunlukCakismalari();

  renderTable();
}

// ← YENİ FONKSİYON: Aynı güne birden fazla vardiya atamasını engelle
function temizleGunlukCakismalari() {
  sabitPersoneller.forEach(p => {
    const gunAtamalari = {};
    for (let gun = 0; gun < 7; gun++) {
      const vardiya = haftalikProgram[p.isim][gun];
      if (vardiya && vardiya !== "İZİNLİ") {
        if (!gunAtamalari[gun]) {
          gunAtamalari[gun] = [];
        }
        gunAtamalari[gun].push(vardiya);
      }
    }

    // Eğer bir günde birden fazla vardiya varsa → sadece ilkini tut, diğerlerini sil
    for (let gun = 0; gun < 7; gun++) {
      if (gunAtamalari[gun] && gunAtamalari[gun].length > 1) {
        // İlk vardiyayı koru, geri kalanları temizle
        const korunacak = gunAtamalari[gun][0];
        for (let g = 0; g < 7; g++) {
          if (haftalikProgram[p.isim][g] !== korunacak && gunAtamalari[gun].includes(haftalikProgram[p.isim][g])) {
            haftalikProgram[p.isim][g] = null;
          }
        }
      }
    }
  });
}

function hucreDoldur(gun, saat) {
  const isHS = (gun >= 5); // Cumartesi ve Pazar

  birimSiralamasi.forEach(birim => {
    if (birim.includes("MCR")) return; // MCR sabit döngüde

    let kap = (kapasiteAyarlari[birim] && kapasiteAyarlari[birim][saat])
      ? (isHS ? kapasiteAyarlari[birim][saat].haftasonu : kapasiteAyarlari[birim][saat].haftaici)
      : 0;

    let adaylar = sabitPersoneller.filter(p => {
      if (p.birim !== birim) return false;
      if (haftalikProgram[p.isim][gun] !== null) return false; // ← ÇOK ÖNEMLİ: zaten atanmışsa geç

      // Max 6 gün çalışma (TY hariç)
      if (birim !== "TEKNİK YÖNETMEN" &&
          haftalikProgram[p.isim].filter(v => v !== null && v !== "İZİNLİ").length >= 6) {
        return false;
      }

      // Gece sadece belirli kişiler
      if (birim === "TEKNİK YÖNETMEN" && saat === "00:00–07:00" &&
          p.isim !== "BARIŞ İNCE" && p.isim !== "EKREM FİDAN") {
        return false;
      }

      return true;
    });

    let suan = sabitPersoneller.filter(p =>
      p.birim === birim && haftalikProgram[p.isim][gun] === saat
    ).length;

    for (let k = 0; k < (kap - suan); k++) {
      if (adaylar.length > 0) {
        let idx = Math.floor(Math.random() * adaylar.length);
        let p = adaylar.splice(idx, 1)[0];
        haftalikProgram[p.isim][gun] = saat;
      }
    }
  });

  // Atananları birim sırasına göre göster
  return sabitPersoneller
    .filter(p => haftalikProgram[p.isim][gun] === saat)
    .sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
    .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`)
    .join('');
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
      body += `<td>${hucreDoldur(i, s)}</td>`;
    }
    body += `</tr>`;
  });
  document.getElementById("tableBody").innerHTML = body;

  let footer = `<tr class="izinli-satiri"><td><strong>İZİNLİ</strong></td>`;
  for (let i = 0; i < 7; i++) {
    let izinliler = sabitPersoneller
      .filter(p => haftalikProgram[p.isim][i] === "İZİNLİ")
      .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`)
      .join('');
    footer += `<td>${izinliler}</td>`;
  }
  footer += `</tr>`;
  document.getElementById("tableFooter").innerHTML = footer;
}

function checklistOlustur() {
  const cont = document.getElementById("personelChecklist");
  cont.innerHTML = sabitPersoneller
    .sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
    .map(p => `
      <div class="check-item">
        <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
        <label for="check_${p.id}">${p.isim}</label>
      </div>
    `).join('');
}

function toggleAdminPanel() {
  const panel = document.getElementById("adminPanel");
  panel.classList.toggle("hidden");
  if (!panel.classList.contains("hidden")) {
    kapasitePaneliniCiz();
    personelYonetimiCiz();
    sabitAtamaListesiCiz();
  }
}

function tabDegistir(name) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.remove('hidden');
  event.currentTarget.classList.add('active');
}

function manuelPersonelEkle() {
  const ad = document.getElementById("yeniPersonelAd").value.trim().toUpperCase();
  const birim = document.getElementById("yeniPersonelBirim").value;
  if (!ad) return;
  sabitPersoneller.push({ isim: ad, birim: birim, id: Date.now() });
  localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
  location.reload();
}

function personelSil(id) {
  if (confirm("Silinsin mi?")) {
    sabitPersoneller = sabitPersoneller.filter(p => p.id !== id);
    localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
    location.reload();
  }
}

function kapasitePaneliniCiz() {
  const cont = document.getElementById("kapasiteListesi");
  let html = `<div class="cap-table-header"><div>Birimler</div>${saatler.map(s => `<div>${s.slice(0,5)}</div>`).join('')}</div>`;
  birimSiralamasi.forEach(b => {
    html += `<div class="cap-row"><strong>${b}</strong>`;
    saatler.forEach(s => {
      html += `
        <div class="cap-input-group">
          <input type="number" value="${kapasiteAyarlari[b][s].haftaici}" onchange="guncelleK('${b}','${s}','haftaici',this.value)">
          <input type="number" class="input-hs" value="${kapasiteAyarlari[b][s].haftasonu}" onchange="guncelleK('${b}','${s}','haftasonu',this.value)">
        </div>`;
    });
    html += `</div>`;
  });
  cont.innerHTML = html;
}

function guncelleK(b, s, t, v) {
  kapasiteAyarlari[b][s][t] = parseInt(v) || 0;
  localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
}

function personelYonetimiCiz() {
  document.getElementById("personelYonetimListesi").innerHTML = sabitPersoneller.map(p => `
    <div class="admin-list-item">
      <span>${p.isim} - ${p.birim}</span>
      <button onclick="personelSil(${p.id})">SİL</button>
    </div>
  `).join('');
}

function sabitAtamaEkle() {
  const isim = document.getElementById("sabitPersSec").value;
  const gun = parseInt(document.getElementById("sabitGunSec").value);
  const saat = document.getElementById("sabitSaatSec").value;
  sabitAtamalar.push({ isim, gun, saat });
  localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
  sabitAtamaListesiCiz();
  tabloyuOlustur();
}

function sabitAtamaSil(idx) {
  sabitAtamalar.splice(idx, 1);
  localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
  sabitAtamaListesiCiz();
  tabloyuOlustur();
}

function sabitAtamaListesiCiz() {
  document.getElementById("sabitPersSec").innerHTML =
    sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');

  document.getElementById("sabitSaatSec").innerHTML =
    saatler.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById("sabitListesi").innerHTML = sabitAtamalar.map((s, idx) => `
    <div class="admin-list-item">
      <span>${s.isim} (${gunler[s.gun]}) - ${s.saat}</span>
      <button onclick="sabitAtamaSil(${idx})">SİL</button>
    </div>
  `).join('');
}

function haftaDegistir(g) {
  mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g);
  tabloyuOlustur();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function sifirla() {
  if (confirm("Tüm veriler silinecek!")) {
    localStorage.clear();
    location.reload();
  }
}

function exportExcel() {
  const wb = XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu"), { sheet: "Vardiya" });
  XLSX.writeFile(wb, `Vardiya_${mevcutPazartesi.toISOString().slice(0,10)}.xlsx`);
}

window.onload = baslat;