const gunler = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
const saatler = ["08:00–16:00","16:00–00:00","00:00–08:00"];
const birimler = [
  "Teknik Yönetmen",
  "Ses Operatörü",
  "Playout Operatörü",
  "JK Operatörü",
  "Ingest Operatörü",
  "Uplink"
];

const personeller = [
  { isim: "Ahmet", birim: "Teknik Yönetmen", gece: true },
  { isim: "Kemal", birim: "Teknik Yönetmen", gece: true },
  { isim: "Ayşe", birim: "Ses Operatörü", gece: false },
  { isim: "Elif", birim: "Ses Operatörü", gece: false },
  { isim: "Mehmet", birim: "Playout Operatörü", gece: true },
  { isim: "Can", birim: "Playout Operatörü", gece: true },
  { isim: "Zeynep", birim: "JK Operatörü", gece: false },
  { isim: "Ece", birim: "JK Operatörü", gece: false },
  { isim: "Ali", birim: "Ingest Operatörü", gece: true },
  { isim: "Burak", birim: "Ingest Operatörü", gece: true },
  { isim: "Selin", birim: "Uplink", gece: true },
  { isim: "Derya", birim: "Uplink", gece: true }
];

const kullanımlar = {};
personeller.forEach(p => kullanımlar[p.isim] = { sabah: 0, aksam: 0, gece: 0 });

function uygunPersonel(birim, saat, gunIndex, oncekiSaat) {
  const geceMi = (saat === "00:00–08:00");
  const sabahMi = (saat === "08:00–16:00");
  const aksamMi = (saat === "16:00–00:00");

  let uygunlar = personeller.filter(p => p.birim === birim && (!geceMi || p.gece));

  if (oncekiSaat === "16:00–00:00" && saat === "00:00–08:00") {
    uygunlar = uygunlar.filter(p => kullanımlar[p.isim].aksam === 0);
  }

  uygunlar = uygunlar.filter(p =>
    (!sabahMi || kullanımlar[p.isim].sabah < 3) &&
    (!aksamMi || kullanımlar[p.isim].aksam < 3)
  );

  if (uygunlar.length === 0) return "İZİN";

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
  const container = document.querySelector("#tablolar");
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
    saatler.forEach((saat, sIndex) => {
      const tr = document.createElement("tr");
      const tdSaat = document.createElement("td");
      tdSaat.textContent = saat;
      tr.appendChild(tdSaat);

      gunler.forEach((gun, gIndex) => {
        const td = document.createElement("td");
        const oncekiSaat = sIndex > 0 ? saatler[sIndex - 1] : null;
        td.textContent = uygunPersonel(birim, saat, gIndex, oncekiSaat);
        td.classList.add("editable");
        td.addEventListener("click", () => elleDegistir(td, birim, saat));
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  });
}

function elleDegistir(td, birim, saat) {
  const yeniIsim = prompt(`${birim} (${saat}) için yeni personel adı girin:`, td.textContent);
  if (yeniIsim) td.textContent = yeniIsim;
}

document.querySelector("#excelBtn").addEventListener("click", () => {
  const container = document.getElementById("tablolar");
  const tables = container.querySelectorAll("table");
  const wb = XLSX.utils.book_new();

  tables.forEach((table, i) => {
    const ws = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(wb, ws, birimler[i]);
  });

  XLSX.writeFile(wb, "teknik-personel-vardiya-listesi.xlsx");
});

tabloyuOlustur();
