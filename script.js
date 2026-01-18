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

let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || asilPersonelListesi.map((p, i) => ({ ...p, id: i + 1 }));
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function getMonday(d) {
  d = new Date(d);
  let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function baslat() {
  const defaultKapasite = {
    "TEKNİK YÖNETMEN": {
      "06:30–16:00": { haftaici: 2, haftasonu: 1 },
      "09:00–18:00": { haftaici: 0, haftasonu: 1 },
      "12:00–22:00": { haftaici: 0, haftasonu: 0 },
      "16:00–00:00": { haftaici: 1, haftasonu: 1 },
      "00:00–07:00": { haftaici: 1, haftasonu: 1 },
      "DIŞ YAYIN": { haftaici: 0, haftasonu: 0 }
    }
  };

  // Diğer birimler için varsayılan kapasiteleri ata
  birimSiralamasi.slice(1).forEach(birim => {
    if(!defaultKapasite[birim]) {
      defaultKapasite[birim] = {};
      saatler.forEach(s => {
        let hici = 0, hsonu = 0;
        if (birim.includes("MCR")) {
            if(["06:30–16:00", "16:00–00:00", "00:00–07:00"].includes(s)) { hici = 1; hsonu = 1; }
        } else if (birim === "SES OPERATÖRÜ") {
            if(s === "06:30–16:00") { hici = 4; hsonu = 2; }
            if(s === "16:00–00:00") { hici = 2; hsonu = 2; }
        }
        defaultKapasite[birim][s] = { haftaici: hici, haftasonu: hsonu };
      });
    }
  });

  kapasiteAyarlari = { ...defaultKapasite, ...JSON.parse(localStorage.getItem("kapasiteAyarlari") || "{}") };
  tabloyuOlustur();
  adminPaneliGuncelle();
}

function tabloyuOlustur() {
  document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
  haftalikProgram = {};
  
  sabitPersoneller.forEach(p => {
    haftalikProgram[p.isim] = Array(7).fill(null);
    if (document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİNLİ");
  });

  // 1. MCR OTOMATİK DÖNGÜ (2 Sabah - 2 Akşam - 2 Gece - 2 İzin)
  const refDate = new Date("2026-01-19");
  const gunFarki = Math.floor((mevcutPazartesi - refDate) / (1000 * 60 * 60 * 24));
  
  ["24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"].forEach(birim => {
    let mcrP = sabitPersoneller.filter(p => p.birim === birim);
    mcrP.forEach((p, idx) => {
      let offset = idx * 2; 
      for (let i = 0; i < 7; i++) {
        let cycle = (gunFarki + i + offset) % 8;
        if (cycle < 0) cycle += 8;
        let atama = (cycle < 2) ? "06:30–16:00" : (cycle < 4) ? "16:00–00:00" : (cycle < 6) ? "00:00–07:00" : "İZİNLİ";
        if (haftalikProgram[p.isim][i] !== "İZİNLİ") haftalikProgram[p.isim][i] = atama;
      }
    });
  });

  // 2. TEKNİK YÖNETMEN GECE ROTASYONU (Barış 2 Gün, Ekrem 5 Gün)
  for (let i = 0; i < 7; i++) {
    let sorumlu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
    if (haftalikProgram[sorumlu] && haftalikProgram[sorumlu][i] !== "İZİNLİ") {
      haftalikProgram[sorumlu][i] = "00:00–07:00";
    }
  }

  // 3. ADİL DAĞILIM (Boşlukları Doldur)
  const calismaSayilari = {};
  sabitPersoneller.forEach(p => calismaSayilari[p.isim] = haftalikProgram[p.isim].filter(x => x && x !== "İZİNLİ").length);

  for (let gun = 0; gun < 7; gun++) {
    const isHS = (gun >= 5);
    saatler.forEach(s => {
      birimSiralamasi.forEach(birim => {
        if (birim.includes("MCR")) return; // MCR zaten döngüde doldu

        let kap = isHS ? (kapasiteAyarlari[birim]?.[s]?.haftasonu || 0) : (kapasiteAyarlari[birim]?.[s]?.haftaici || 0);
        let suanAtananlar = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === s).length;
        
        let ihtiyac = kap - suanAtananlar;
        if (ihtiyac <= 0) return;

        let adaylar = sabitPersoneller.filter(p => {
          if (p.birim !== birim || haftalikProgram[p.isim][gun] !== null) return false;
          // Teknik Yönetmen Gece Kısıtlaması (Sadece Barış ve Ekrem'e atanan günler dışında geceye kimse giremez)
          if (birim === "TEKNİK YÖNETMEN" && s === "00:00–07:00") return false;
          return true;
        });

        adaylar.sort((a, b) => calismaSayilari[a.isim] - calismaSayilari[b.isim]);

        for (let k = 0; k < ihtiyac && adaylar.length > 0; k++) {
          let p = adaylar.shift();
          haftalikProgram[p.isim][gun] = s;
          calismaSayilari[p.isim]++;
        }
      });
    });
  }

  renderTable();
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
      let hucreIcerik = sabitPersoneller
        .filter(p => haftalikProgram[p.isim][i] === s)
        .sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
        .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
      body += `<td>${hucreIcerik}</td>`;
    }
    body += `</tr>`;
  });
  document.getElementById("tableBody").innerHTML = body;

  let footer = `<tr class="izinli-satiri"><td><strong>İZİNLİ</strong></td>`;
  for (let i = 0; i < 7; i++) {
    let izinliler = sabitPersoneller
      .filter(p => haftalikProgram[p.isim][i] === "İZİNLİ")
      .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
    footer += `<td>${izinliler}</td>`;
  }
  document.getElementById("tableFooter").innerHTML = footer + "</tr>";
}

function adminPaneliGuncelle() {
  const cont = document.getElementById("personelChecklist");
  if(cont) {
    cont.innerHTML = sabitPersoneller
      .sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
      .map(p => `
        <div class="check-item">
          <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
          <label for="check_${p.id}">${p.isim}</label>
        </div>
      `).join('');
  }
}

function haftaDegistir(g) {
  mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g);
  tabloyuOlustur();
}

function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }

window.onload = baslat;