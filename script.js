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
  personeller.forEach(p => {
    haftalikProgram[p.isim] = Array(7).fill(null);
  });

  // Zafer Akar Hafta Sonu İzin
  haftalikProgram["ZAFER AKAR"][5] = "İZİN";
  haftalikProgram["ZAFER AKAR"][6] = "İZİN";

  // İZİN ATAMA (Birim Bazlı)
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

function uygunlukKontrol(personel, gunIdx, saat) {
  const isim = personel.isim;
  const program = haftalikProgram[isim];

  // Zafer Akar Sabit Kuralı
  if (isim === "ZAFER AKAR") {
    if (gunIdx < 5) {
      if (saat !== "06:30–16:00") return false;
    } else return false;
  }

  // Zaten atama yapılmış mı?
  if (program[gunIdx] !== null) return false;

  // DİNLENME KURALLARI (Kritik Bölüm)
  if (gunIdx > 0) {
    const dunkuVardiya = program[gunIdx - 1];
    
    // KURAL: 16:00-00:00 çalışan ertesi gün 06:30 gelemez
    if (saat === "06:30–16:00" && dunkuVardiya === "16:00–00:00") return false;
    
    // KURAL: Gece çalışan ertesi gün (izin yapmadan) 06:30 gelemez
    if (saat === "06:30–16:00" && dunkuVardiya === "00:00–07:00") return false;
  }

  // Gece Sınırı
  if (saat === "00:00–07:00") {
    const geceSayisi = program.filter(v => v === "00:00–07:00").length;
    if (geceSayisi >= 2 || !personel.gece) return false;
  }

  return true;
}

function tabloyuOlustur() {
  programiSifirla();
  const container = document.getElementById("tablolar");
  let html = `<table><thead><tr><th>Saat / Gün</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr></thead><tbody>`;

  saatler.forEach(saat => {
    const sCls = saat.split('–')[0].replace(':', '').replace('DIŞ YAYIN', 'disyayin');
    html += `<tr class="saat-${sCls}"><td><strong>${saat}</strong></td>`;
    
    const manuelSaatler = ["12:00–22:00", "DIŞ YAYIN"];

    gunler.forEach((_, gIdx) => {
      let hucreContent = "";
      const haftaSonuMu = (gIdx >= 5);

      birimler.forEach(birim => {
        let kapasite = 1;
        const isSesVeyaTY = (birim === "Ses Operatörü" || birim === "Teknik Yönetmen");

        // Kapasite ve Atama Şartları
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
          else if (saat === "00:00–07:00") kapasite = 1; // Her gün 1 kişi
          else kapasite = 0;
        }

        let otomatikAtamaAktif = (kapasite > 0);
        // Hafta içi 09:00 vardiyası TY ve Ses için manuel
        if (!haftaSonuMu && saat === "09:00–18:00" && isSesVeyaTY) otomatikAtamaAktif = false;

        let atananlar = [];

        // Zafer Akar Sabitleme
        if (birim === "Ses Operatörü" && saat === "06:30–16:00" && !haftaSonuMu) {
          if (uygunlukKontrol({isim: "ZAFER AKAR"}, gIdx, saat)) {
             haftalikProgram["ZAFER AKAR"][gIdx] = saat;
             atananlar.push("ZAFER AKAR");
          }
        }

        if (otomatikAtamaAktif) {
          let adaylar = personeller.filter(p => p.birim === birim && p.isim !== "ZAFER AKAR" && uygunlukKontrol(p, gIdx, saat));
          while(atananlar.length < kapasite && adaylar.length > 0) {
            const secilen = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
            haftalikProgram[secilen.isim][gIdx] = saat;
            atananlar.push(secilen.isim);
          }
        }

        let gosterilecekKutu = (isSesVeyaTY && (saat === "09:00–18:00" && !haftaSonuMu)) ? 1 : Math.max(kapasite, 1);
        for(let i=0; i < gosterilecekKutu; i++) {
          let isim = atananlar[i] || "-";
          hucreContent += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${isim}</span></div>`;
        }
      });
      html += `<td class="editable" contenteditable="true">${hucreContent}</td>`;
    });
    html += `</tr>`;
  });

  // İZİN Satırı
  html += `<tr class="saat-izin-row"><td><strong>İZİN</strong></td>`;
  gunler.forEach((_, gIdx) => {
    let izinIcerik = "";
    birimler.forEach(birim => {
      const izinliler = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][gIdx] === "İZİN");
      if(izinliler.length > 0) {
        izinIcerik += `<div class="birim-card" style="border-color:#ccc; background:#fff">
          <span class="birim-tag" style="color:#2980b9">${birim}</span>
          ${izinliler.map(p => p.isim).join('<br>')}
        </div>`;
      }
    });
    html += `<td>${izinIcerik || "-"}</td>`;
  });
  html += `</tr></tbody></table>`;

  container.innerHTML = html;
  document.querySelectorAll("td.editable").forEach(td => td.addEventListener("input", cakismaKontroluYap));
  cakismaKontroluYap();
}

function cakismaKontroluYap() {
  const tablo = document.querySelector("table");
  for (let gIdx = 1; gIdx <= 7; gIdx++) {
    const isimSayaci = {};
    const satirlar = tablo.querySelectorAll("tbody tr");
    satirlar.forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(!hucre) return;
      hucre.classList.remove("conflict");
      const isimler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      const izinMetni = hucre.innerText.split('\n').filter(t => t.trim().length > 3 && !birimler.includes(t.trim()));
      [...isimler, ...izinMetni].forEach(m => { 
        if(m !== "-" && m !== "") isimSayaci[m] = (isimSayaci[m] || 0) + 1; 
      });
    });
    satirlar.forEach(satir => {
      const hucre = satir.cells[gIdx];
      if(!hucre) return;
      const isimler = Array.from(hucre.querySelectorAll(".p-isim")).map(el => el.innerText.trim());
      if(isimler.some(m => isimSayaci[m] > 1)) hucre.classList.add("conflict");
    });
  }
}

document.getElementById("excelBtn").onclick = () => {
  XLSX.writeFile(XLSX.utils.table_to_book(document.querySelector("table")), "Teknik_Vardiya_Programi.xlsx");
};
window.onload = tabloyuOlustur;