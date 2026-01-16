const gunler = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

const saatler = [
  "06:30–16:00","06:30–16:00","06:30–16:00","06:30–16:00",
  "09:00–18:00",
  "12:00–22:00",
  "16:00–00:00","16:00–00:00","16:00–00:00",
  "00:00–07:00","00:00–07:00",
  "İZİN","İZİN","İZİN",
  "DIŞ YAYIN","DIŞ YAYIN","DIŞ YAYIN"
];

const birimler = [
  "Teknik Yönetmen",
  "Ses Operatörü",
  "Playout Operatörü",
  "KJ Operatörü",
  "Ingest Operatörü",
  "Uplink"
];

// Personel listesi (senin verdiğin şekilde)
const personeller = [ 
// Teknik Yönetmen 
 { isim:"YUNUS EMRE YAYLA", birim:"Teknik Yönetmen", gece:true },
 { isim:"HASAN CAN SAĞLAM", birim:"Teknik Yönetmen", gece:true },
 { isim:"MEHMET BERKMAN", birim:"Teknik Yönetmen", gece:true },
 { isim:"EKREM FİDAN", birim:"Teknik Yönetmen", gece:true },
 { isim:"CAN ŞENTUNALI", birim:"Teknik Yönetmen", gece:true },
 { isim:"BARIŞ İNCE", birim:"Teknik Yönetmen", gece:true },
 // Ses Operatörü 
 { isim:"ZAFER AKAR", birim:"Ses Operatörü", gece:false },
 { isim:"ENES KALE", birim:"Ses Operatörü", gece:false },
 { isim:"ANIL RİŞVAN", birim:"Ses Operatörü", gece:false },
 { isim:"ERSAN TİLBE", birim:"Ses Operatörü", gece:false },
 { isim:"ULVİ MUTLUBAŞ", birim:"Ses Operatörü", gece:false },
 { isim:"OSMAN DİNÇER", birim:"Ses Operatörü", gece:false },
 { isim:"DOĞUŞ MALGIL", birim:"Ses Operatörü", gece:false },
 { isim:"ERDOĞAN KÜÇÜKKAYA", birim:"Ses Operatörü", gece:false },
 // Playout
 { isim:"SENA MİNARECİ", birim:"Playout Operatörü", gece:true },
 { isim:"MEHMET TUNÇ", birim:"Playout Operatörü", gece:true },
 { isim:"KADİR ÇAÇAN", birim:"Playout Operatörü", gece:true },
 { isim:"ÖMER FARUK ÖZBEY", birim:"Playout Operatörü", gece:true },
 { isim:"İBRAHİM SERİNSÖZ", birim:"Playout Operatörü", gece:true },
 { isim:"YUSUF ALPKILIÇ", birim:"Playout Operatörü", gece:true },
 { isim:"MUSTAFA ERCÜMENT KILIÇ", birim:"Playout Operatörü", gece:true },
 { isim:"NEHİR KAYGUSUZ", birim:"Playout Operatörü", gece:true },
 // KJ
 { isim:"YUSUF İSLAM TORUN", birim:"KJ Operatörü", gece:false },
 { isim:"OĞUZHAN YALAZAN", birim:"KJ Operatörü", gece:false },
 { isim:"UĞUR AKBABA", birim:"KJ Operatörü", gece:false },
 { isim:"SENA BAYDAR", birim:"KJ Operatörü", gece:false },
 { isim:"CEMREHAN SUBAŞI", birim:"KJ Operatörü", gece:false },
 { isim:"YEŞİM KİREÇ", birim:"KJ Operatörü", gece:false },
 { isim:"PINAR ÖZENÇ", birim:"KJ Operatörü", gece:true },
 // Ingest
 { isim:"RAMAZAN KOÇAK", birim:"Ingest Operatörü", gece:true },
 { isim:"DEMET CENGİZ", birim:"Ingest Operatörü", gece:true },
 { isim:"ERCAN PALABIYIK", birim:"Ingest Operatörü", gece:true },
 // Uplink
 { isim:"Selin", birim:"Uplink", gece:true },
 { isim:"Derya", birim:"Uplink", gece:true }
 ];

function uygunPersonel(birim, saat) {
  if (saat === "İZİN" || saat === "DIŞ YAYIN") return saat;
  const geceMi = saat === "00:00–07:00";
  const uygunlar = personeller.filter(p => p.birim === birim && (!geceMi || p.gece));
  if (uygunlar.length === 0) return "İZİN";
  const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
  return secilen.isim;
}

function tabloyuOlustur() {
  const container = document.getElementById("tablolar");
  birimler.forEach(birim => {
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent = birim;
    table.appendChild(caption);

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    trHead.innerHTML = "<th>Saat</th>" + gunler.map(g => `<th>${g}</th>`).join("");
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    saatler.forEach(saat => {
      const tr = document.createElement("tr");
      const tdSaat = document.createElement("td");
      tdSaat.textContent = saat;
      tr.appendChild(tdSaat);

      gunler.forEach(gun => {
        const td = document.createElement("td");
        td.classList.add("editable");
        td.textContent = uygunPersonel(birim, saat);
        td.addEventListener("click", () => elleDegistir(td));
        tr.appendChild(td);
      });

      // Renk sınıfları
      if (saat.startsWith("06:30")) tr.classList.add("saat-0630");
      else if (saat.startsWith("09:00")) tr.classList.add("saat-0900");
      else if (saat.startsWith("12:00")) tr.classList.add("saat-1200");
      else if (saat.startsWith("16:00")) tr.classList.add("saat-1600");
      else if (saat.startsWith("00:00")) tr.classList.add("saat-0000");
      else if (saat === "İZİN") tr.classList.add("izin");
      else if (saat === "DIŞ YAYIN") tr.classList.add("disyayin");

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  });
}

function elleDegistir(td) {
  const yeni = prompt("Yeni isim girin:", td.textContent);
  if (yeni) td.textContent = yeni;
}

document.querySelector("#excelBtn").addEventListener("click", () => {
  const tables = document.querySelectorAll("#tablolar table");
  const wb = XLSX.utils.book_new();
  tables.forEach((table, i) => {
    const ws = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(wb, ws, birimler[i]);
  });
  XLSX.writeFile(wb, "vardiya-listesi.xlsx");
});

tabloyuOlustur();
