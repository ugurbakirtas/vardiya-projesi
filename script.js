const gunler = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
const vardiyalar = ["08:00–16:00","16:00–00:00","00:00–08:00"];
const bolumler = ["Teknik Yönetmen","Ses Operatörü","Playout","JK","Ingest","Uplink"];

const personeller = [
  { isim:"Ahmet", bolum:"Teknik Yönetmen", gece:true },
  { isim:"Ayşe", bolum:"Ses Operatörü", gece:false },
  { isim:"Mehmet", bolum:"Playout", gece:true },
  { isim:"Zeynep", bolum:"JK", gece:false },
  { isim:"Ali", bolum:"Ingest", gece:true },
  { isim:"Selin", bolum:"Uplink", gece:true },
  { isim:"Kemal", bolum:"Teknik Yönetmen", gece:true },
  { isim:"Elif", bolum:"Ses Operatörü", gece:false },
  { isim:"Can", bolum:"Playout", gece:true },
  { isim:"Ece", bolum:"JK", gece:false },
  { isim:"Burak", bolum:"Ingest", gece:true },
  { isim:"Derya", bolum:"Uplink", gece:true }
];

// Kullanım sayacı
const kullanımlar = {};
personeller.forEach(p => kullanımlar[p.isim] = { sabah:0, aksam:0, gece:0 });

function uygunPersonel(bolum, vardiya, gunIndex, oncekiVardiya) {
  const geceMi = (vardiya === "00:00–08:00");
  const sabahMi = (vardiya === "08:00–16:00");
  const aksamMi = (vardiya === "16:00–00:00");

  let uygunlar = personeller.filter(p => p.bolum === bolum && (!geceMi || p.gece));

  // Akşamdan sabaha geçişi engelle
  if (oncekiVardiya === "16:00–00:00" && vardiya === "00:00–08:00") {
    uygunlar = uygunlar.filter(p => kullanımlar[p.isim].aksam === 0);
  }

  // En fazla 3 sabah veya 3 akşam
  uygunlar = uygunlar.filter(p =>
    (!sabahMi || kullanımlar[p.isim].sabah < 3) &&
    (!aksamMi || kullanımlar[p.isim].aksam < 3)
  );

  if (uygunlar.length === 0) return "İZİN";

  // En az kullanılanı seç
  uygunlar.sort((a,b) => {
    const aToplam = kullanımlar[a.isim].sabah + kullanımlar[a.isim].aksam + kullanımlar[a.isim].gece;
    const bToplam = kullanımlar[b.isim].sabah + kullanımlar[b.isim].aksam + kullanımlar[b.isim].gece;
    return aToplam - bToplam;
  });

  const secilen = uygunlar[0];
  if (sabahMi) kullanımlar[secilen.isim].sabah++;
  if (aksamMi) kullanımlar[secilen.isim].aksam++;
  if (geceMi) kullanımlar[secilen.isim].gece++;
  return secilen.isim;
}

function tabloyuOlustur() {
  const tbody = document.querySelector("#vardiyaTablosu tbody");
  bolumler.forEach(bolum => {
    vardiyalar.forEach((vardiya, vIndex) => {
      const tr = document.createElement("tr");

      const tdBolum = document.createElement("td");
      tdBolum.textContent = bolum;
      tr.appendChild(tdBolum);

      const tdVardiya = document.createElement("td");
      tdVardiya.textContent = vardiya;
      tr.appendChild(tdVardiya);

      gunler.forEach((gun, gIndex) => {
        const td = document.createElement("td");
        td.classList.add("editable");
        const oncekiVardiya = vIndex > 0 ? vardiyalar[vIndex-1] : null;
        td.textContent = uygunPersonel(bolum,vardiya,gIndex,oncekiVardiya);
        td.addEventListener("click", () => elleDegistir(td, bolum, vardiya));
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  });
}

// Elle değişim
function elleDegistir(td, bolum, vardiya) {
  const yeniIsim = prompt(`${bolum} (${vardiya}) için yeni personel adı girin:`, td.textContent);
  if (yeniIsim) {
    td.textContent = yeniIsim;
  }
}

// Excel çıktısı
document.querySelector("#excelBtn").addEventListener("click", () => {
  const table = document.getElementById("vardiyaTablosu");
  const wb = XLSX.utils.table_to_book(table, {sheet:"Vardiya"});
  XLSX.writeFile(wb, "vardiya-listesi.xlsx");
});

tabloyuOlustur();
