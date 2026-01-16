const personeller = [
  { isim: "Ahmet", bolum: "Güvenlik", gece: true, sonIzin: 0 },
  { isim: "Ayşe", bolum: "Muhasebe", gece: false, sonIzin: 0 },
  { isim: "Mehmet", bolum: "IT", gece: true, sonIzin: 0 },
  { isim: "Zeynep", bolum: "Güvenlik", gece: true, sonIzin: 0 },
  { isim: "Ali", bolum: "Muhasebe", gece: false, sonIzin: 0 },
  { isim: "Selin", bolum: "IT", gece: true, sonIzin: 0 }
];

const bolumler = [
  { isim: "Güvenlik", gece: true },
  { isim: "Muhasebe", gece: false },
  { isim: "IT", gece: true }
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

function haftalikVardiyaOlustur() {
  const hafta = [];
  for (let gun = 1; gun <= 7; gun++) {
    const gunluk = {};
    bolumler.forEach(bolum => {
      let uygunlar = personeller.filter(p =>
        p.bolum === bolum.isim &&
        (!bolum.gece || p.gece) &&
        (gun - p.sonIzin <= 5)
      );
      if (uygunlar.length > 0) {
        const secilen = uygunlar[Math.floor(Math.random() * uygunlar.length)];
        gunluk[bolum.isim] = secilen.isim;
        secilen.sonIzin = gun;
      } else {
        gunluk[bolum.isim] = "İzin";
      }
    });
    hafta.push(gunluk);
  }
  return hafta;
}

function tabloyuYazdir() {
  const tbody = document.querySelector("#vardiyaTablosu tbody");
  const vardiyaListesi = haftalikVardiyaOlustur();

  vardiyaListesi.forEach((gunluk, index) => {
    const tr = document.createElement("tr");
    const tdGun = document.createElement("td");
    tdGun.textContent = gunler[index];
    tr.appendChild(tdGun);

    bolumler.forEach(bolum => {
      const td = document.createElement("td");
      td.textContent = gunluk[bolum.isim];
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

tabloyuYazdir();
