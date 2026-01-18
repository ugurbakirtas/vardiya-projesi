function generateShifts() {
  const dates = ["19 Ocak 2026","20 Ocak 2026","21 Ocak 2026","22 Ocak 2026","23 Ocak 2026","24 Ocak 2026","25 Ocak 2026"];
  const days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

  let html = "";

  // Örnek: Teknik Yönetmenler
  const teknikYonetmenler = {
    "07:00-16:00": [
      ["CAN ŞENTUNALI","M.BERKMAN"],
      ["CAN ŞENTUNALI","M.BERKMAN"],
      ["EKREM FİDAN","YUNUS EMRE YAYLA"],
      ["EKREM FİDAN","H.CAN SAĞLAM"],
      ["H.CAN SAĞLAM","YUNUS EMRE YAYLA"],
      ["H.CAN SAĞLAM"],
      ["CAN ŞENTUNALI"]
    ],
    "16:00-01:00": [
      ["H.CAN SAĞLAM"],["H.CAN SAĞLAM"],["CAN ŞENTUNALI"],["M.BERKMAN"],["M.BERKMAN"],["YUNUS EMRE YAYLA"],["BARIŞ İNCE"]
    ],
    "00:00-07:00": [
      ["BARIŞ İNCE"],["BARIŞ İNCE"],["BARIŞ İNCE"],["BARIŞ İNCE"],["EKREM FİDAN"],["EKREM FİDAN"],["EKREM FİDAN"]
    ]
  };
  html += "<h2>24TV - 360TV TEKNİK YÖNETMENLER</h2>";
  html += buildTable(dates, days, teknikYonetmenler);

  // Örnek: Ses Operatörleri
  const sesOperatorleri = {
    "06:30-16:00": [
      ["ANIL RİŞVAN","ULVİ MUTLUBAŞ","ZAFER AKAR","ERDOĞAN KÜÇÜKKAYA"],
      ["ENES KALE","ERSAN TİLBE","ZAFER AKAR","ERDOĞAN KÜÇÜKKAYA"],
      ["ENES KALE","ERSAN TİLBE","ZAFER AKAR","ERDOĞAN KÜÇÜKKAYA"],
      ["ULVİ MUTLUBAŞ","DOĞUŞ MALGIL","ZAFER AKAR","ERDOĞAN KÜÇÜKKAYA"],
      ["ENES KALE","ULVİ MUTLUBAŞ","ZAFER AKAR","ERDOĞAN KÜÇÜKKAYA"],
      ["ERSAN TİLBE","ENES KALE","ANIL RİŞVAN","ULVİ MUTLUBAŞ"],
      ["ERSAN TİLBE","ANIL RİŞVAN","ENES KALE"]
    ]
  };
  html += "<h2>24TV - 360TV SES OPERATÖRÜ</h2>";
  html += buildTable(dates, days, sesOperatorleri);

  // Burada diğer tüm bölümler aynı mantıkla eklenebilir:
  // Playout, KJ, Ingest, Uplink, Bilgi İşlem, Yayın Sistemleri, Işık, Dekor, Kameramanlar, Reklam Akış, Yayın Yönetmeni, MCR, Resim Seçici, Arşiv, Renk Ayrımı vb.
  // Her bölüm için ayrı bir obje tanımlayıp buildTable ile tabloya dönüştürülür.

  document.getElementById("shiftResult").innerHTML = html;
}

function buildTable(dates, days, shifts) {
  let html = "<table><tr>";
  dates.forEach((d,i) => {
    html += `<th>${d}<br>${days[i]}</th>`;
  });
  html += "</tr>";

  for (const [time, schedule] of Object.entries(shifts)) {
    html += "<tr>";
    schedule.forEach(cell => {
      html += `<td>${time}<br>${cell.join("<br>")}</td>`;
    });
    html += "</tr>";
  }
  html += "</table>";
  return html;
}
