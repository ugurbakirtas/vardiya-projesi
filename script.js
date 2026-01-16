const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const vardiyalar = ["08:00–16:00", "16:00–00:00", "00:00–08:00"];
const bolumler = ["Teknik Yönetmen", "Ses Operatörü", "Playout", "JK", "Ingest", "Uplink"];

// Personel listesi (izin günleri eklenebilir)
const personeller = [
  { isim: "Ahmet", bolum: "Teknik Yönetmen", gece: true, izinGunleri: ["Çarşamba"] },
  { isim: "Ayşe", bolum: "Ses Operatörü", gece: false, izinGunleri: [] },
  { isim: "Mehmet", bolum: "Playout", gece: true, izinGunleri: ["Pazar"] },
  { isim: "Zeynep", bolum: "JK", gece: false, izinGunleri: [] },
  { isim: "Ali", bolum: "Ingest", gece: true, izinGunleri: [] },
  { isim: "Selin", bolum: "Uplink", gece: true, izinGunleri: ["Cuma"] },
  { isim: "Kemal", bolum: "Teknik Yönetmen", gece: true, izinGunleri: [] },
  { isim: "Elif", bolum: "Ses Operatörü", gece: false, izinGunleri: [] },
  { isim: "Can", bolum: "Playout", gece: true, izinGunleri: [] },
  { isim: "Ece", bolum: "JK", gece: false, izinGunleri: [] },
  { isim: "Burak", bolum: "Ingest", gece: true, izinGunleri: [] },
  { isim: "Derya", bolum: "Uplink", gece: true, izinGunleri: [] }
];

// Personel kullanım sayacı (denge için)
const kullanımlar = {};
personeller.forEach(p => kullanımlar[p.isim] = 0);

function uygunPersonel(bolum, geceMi, gun) {
  let uygunlar = personeller.filter(p =>
    p.bolum === bolum &&
    (!geceMi || p.gece) &&
    !p.izinGunleri.includes(gun)
  );

  if (uygunlar.length === 0) return "İZİN";

  // Denge için en az kullanılanı seç
  uygunlar.sort((a, b) => kullanımlar[a.isim] - kullanımlar[b.isim]);
  const secilen = uygunlar[0];
  kullanımlar[secilen.isim]++;
  return secilen.isim;
}

function tabloyuOlustur() {
  const tbody = document.querySelector("#vardiyaTablosu tbody");
  gunler.forEach(gun => {
    vardiyalar.forEach(vardiya => {
      const tr = document.createElement("tr");

      const tdGun = document.createElement("td");
      tdGun.textContent = gun;
      tr.appendChild(tdGun);

      const tdVardiya = document.createElement("td");
      tdVardiya.textContent = vardiya;
      tr.appendChild(tdVardiya);

      bolumler.forEach(bolum => {
        const td = document.createElement("td");
        const geceMi = (vardiya === "00:00–08:00");
        td.textContent = uygunPersonel(bolum, geceMi, gun);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  });
}

// Excel çıktısı
document.querySelector("#excelBtn").addEventListener("click", () => {
  const table = document.getElementById("vardiyaTablosu");
  const wb = XLSX.utils.table_to_book(table, {sheet:"Vardiya"});
  XLSX.writeFile(wb, "vardiya-listesi.xlsx");
});

tabloyuOlustur();
