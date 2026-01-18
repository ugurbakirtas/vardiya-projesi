// --- 1. AYARLAR VE VERİ ---
const ADMIN_PASSWORD = "admin123";
const DEFAULT_UNITS = [
    "TEKNİK YÖNETMEN", 
    "SES OPERATÖRÜ", 
    "PLAYOUT OPERATÖRÜ", 
    "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", 
    "BİLGİ İŞLEM", 
    "YAYIN SİSTEMLERİ", 
    "24TV MCR OPERATÖRÜ", 
    "360TV MCR OPERATÖRÜ"
];

const DEFAULT_SHIFTS = [
    "06:30–16:00",
    "09:00–18:00",
    "12:00–22:00",
    "16:00–00:00",
    "00:00–07:00",
    "DIŞ YAYIN"
];

const UNIT_COLORS = {
    "TEKNİK YÖNETMEN": "#e74c3c",
    "SES OPERATÖRÜ": "#3498db",
    "PLAYOUT OPERATÖRÜ": "#2ecc71",
    "KJ OPERATÖRÜ": "#f1c40f",
    "INGEST OPERATÖRÜ": "#9b59b6",
    "BİLGİ İŞLEM": "#34495e",
    "YAYIN SİSTEMLERİ": "#1abc9c",
    "24TV MCR OPERATÖRÜ": "#e67e22",
    "360TV MCR OPERATÖRÜ": "#d35400"
};

// Varsayılan kapasite (örnek değerler - kendi ihtiyaçlarınıza göre değiştirin)
const DEFAULT_KAPASITE = {
    "TEKNİK YÖNETMEN_06:30–16:00":   {h:1, hs:1},
    "TEKNİK YÖNETMEN_09:00–18:00":   {h:1, hs:1},
    "TEKNİK YÖNETMEN_12:00–22:00":   {h:1, hs:1},
    "TEKNİK YÖNETMEN_16:00–00:00":   {h:1, hs:1},
    "TEKNİK YÖNETMEN_00:00–07:00":   {h:1, hs:1},  // Barış/Ekrem özel rotasyonu var
    "SES OPERATÖRÜ_06:30–16:00":     {h:3, hs:2},
    "SES OPERATÖRÜ_09:00–18:00":     {h:3, hs:2},
    "SES OPERATÖRÜ_12:00–22:00":     {h:2, hs:2},
    "SES OPERATÖRÜ_16:00–00:00":     {h:2, hs:2},
    "PLAYOUT OPERATÖRÜ_06:30–16:00": {h:2, hs:1},
    "PLAYOUT OPERATÖRÜ_16:00–00:00": {h:2, hs:1},
    // İhtiyacınıza göre diğer birim ve saatleri de ekleyin...
    // Örnek:
    // "24TV MCR OPERATÖRÜ_00:00–07:00": {h:1, hs:1},
};

let state = {
    birimler: JSON.parse(localStorage.getItem("v45_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v45_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v45_personeller")) || [],
    kapasite: JSON.parse(localStorage.getItem("v45_kapasite")) || DEFAULT_KAPASITE,
    manuelAtamalar: JSON.parse(localStorage.getItem("v45_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay();
    let diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function save() {
    Object.keys(state).forEach(k => {
        localStorage.setItem(`v45_${k}`, JSON.stringify(state[k]));
    });
}

// --- 2. ANA FONKSİYONLAR ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;

    // Header oluştur (Günler)
    const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    document.getElementById("tableHeader").innerHTML = `<tr><th>Saat</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr>`;

    let program = {};
    let calismaSayisi = {};

    // Her personel için başlangıç durumu
    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        calismaSayisi[p.ad] = 0;

        // İzinli seçiliyse tüm haftayı izinli yap
        if (document.getElementById(`check_${p.id}`)?.checked) {
            program[p.ad].fill("İZİNLİ");
        }
    });

    // 1. Manuel atamaları yerleştir
    state.personeller.forEach(p => {
        for (let i = 0; i < 7; i++) {
            let mK = `${haftaKey}_${p.ad}_${i}`;
            if (state.manuelAtamalar[mK]) {
                program[p.ad][i] = state.manuelAtamalar[mK];
                if (!["İZİNLİ", "BOŞALT"].includes(program[p.ad][i])) {
                    calismaSayisi[p.ad]++;
                }
            }
        }
    });

    // 2. Teknik Yönetmen Gece vardiyası özel rotasyonu (Barış & Ekrem)
    for (let i = 0; i < 7; i++) {
        let geceSorumlusu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";  // İlk 2 gün Barış, sonrası Ekrem
        if (program[geceSorumlusu] && program[geceSorumlusu][i] === null) {
            program[geceSorumlusu][i] = "00:00–07:00";
            calismaSayisi[geceSorumlusu]++;
        }
    }

    // 3. Kapasiteye göre otomatik dağıtım
    for (let gun = 0; gun < 7; gun++) {
        const haftaSonu = gun >= 5;
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                const key = `${birim}_${saat}`;
                const kapasite = state.kapasite[key] || { h: 0, hs: 0 };
                const hedef = haftaSonu ? (kapasite.hs || 0) : (kapasite.h || 0);

                // Mevcut atanan kişi sayısı
                let mevcut = state.personeller.filter(p =>
                    p.birim === birim && program[p.ad][gun] === saat
                ).length;

                if (mevcut < hedef) {
                    // Adaylar: bu gün boş olanlar + çalışma limiti altında olanlar
                    let adaylar = state.personeller
                        .filter(p =>
                            p.birim === birim &&
                            program[p.ad][gun] === null &&
                            calismaSayisi[p.ad] < 5
                        )
                        .sort((a, b) => calismaSayisi[a.ad] - calismaSayisi[b.ad]); // En az çalışana öncelik

                    let eklenecek = hedef - mevcut;
                    for (let j = 0; j < eklenecek && adaylar[j]; j++) {
                        // Teknik Yönetmen gece vardiyası kısıtı (rotasyon dışında)
                        if (birim === "TEKNİK YÖNETMEN" && saat === "00:00–07:00") continue;

                        program[adaylar[j].ad][gun] = saat;
                        calismaSayisi[adaylar[j].ad]++;
                    }
                }
            });
        });
    }

    render(program);
}

function render(program) {
    const body = document.getElementById("tableBody");
    body.innerHTML = state.saatler.map(saat => `
        <tr>
            <td><strong>${saat}</strong></td>
            ${[0,1,2,3,4,5,6].map(gun => `
                <td>
                    ${state.personeller
                        .filter(p => program[p.ad][gun] === saat)
                        .map(p => `
                            <div class="birim-card" onclick="vardiyaDegistir('${p.ad}',${gun})" 
                                 style="border-left:5px solid ${UNIT_COLORS[p.birim] || '#ccc'}">
                                <span class="birim-tag" style="color:${UNIT_COLORS[p.birim]}">${p.birim}</span>
                                ${p.ad}
                            </div>
                        `).join('')}
                </td>
            `).join('')}
        </tr>
    `).join('');

    const foot = document.getElementById("tableFooter");
    foot.innerHTML = `
        <tr class="izinli-satiri">
            <td><strong>İZİNLİ / BOŞ</strong></td>
            ${[0,1,2,3,4,5,6].map(gun => `
                <td>
                    ${state.personeller
                        .filter(p => program[p.ad][gun] === null || program[p.ad][gun] === "İZİNLİ")
                        .map(p => `
                            <div class="birim-card izinli-kart" onclick="vardiyaDegistir('${p.ad}',${gun})">
                                ${p.ad}${program[p.ad][gun] === "İZİNLİ" ? " (İzinli)" : ""}
                            </div>
                        `).join('')}
                </td>
            `).join('')}
        </tr>`;
}

// --- 3. YÖNETİM VE ETKİLEŞİM FONKSİYONLARI ---
function vardiyaDegistir(pAd, gunIndex) {
    const sirali = [...state.saatler];
    let mesaj = `${pAd} için vardiya seç:\n` +
                sirali.map((s, i) => `${i+1}- ${s}`).join("\n") +
                "\n\nVeya: İZİNLİ / BOŞALT";
    
    let secim = prompt(mesaj);
    if (!secim) return;

    let sonuc = secim.toUpperCase().trim();
    if (!isNaN(secim) && sirali[parseInt(secim)-1]) {
        sonuc = sirali[parseInt(secim)-1];
    }

    const key = `${currentMonday.toISOString().split('T')[0]}_${pAd}_${gunIndex}`;
    state.manuelAtamalar[key] = sonuc;
    save();
    tabloyuOlustur();
}

function personelEkle() {
    let ad = document.getElementById("yeniPersInp").value.trim().toUpperCase();
    let birim = document.getElementById("yeniPersBirimSec").value;
    if (!ad || !birim) return alert("Ad ve birim seçmelisiniz!");

    state.personeller.push({ ad, birim, id: Date.now() });
    save();
    refreshUI();
    tabloyuOlustur();
}

function refreshUI() {
    const pList = document.getElementById("persListesiAdmin");
    if (pList) {
        pList.innerHTML = state.personeller.map((p, i) => `
            <div class="admin-list-item">
                ${p.ad} (${p.birim})
                <button onclick="sil('personeller',${i})">SİL</button>
            </div>
        `).join('');
    }

    const bSec = document.getElementById("yeniPersBirimSec");
    if (bSec) {
        bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');
    }

    checklistOlustur();
    kapasiteCiz();
}

function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable");
    let html = `
        <div class="cap-table-header">
            <div>Birim</div>
            ${state.saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}
        </div>`;

    state.birimler.forEach(birim => {
        html += `
            <div class="cap-row">
                <div><strong>${birim}</strong></div>
                ${state.saatler.map(saat => {
                    const key = `${birim}_${saat}`;
                    const v = state.kapasite[key] || {h:0, hs:0};
                    return `
                        <div>
                            H:<input type="number" min="0" value="${v.h}" 
                                     onchange="capSave('${key}','h',this.value)" style="width:35px">
                            S:<input type="number" min="0" value="${v.hs}" 
                                     onchange="capSave('${key}','hs',this.value)" style="width:35px">
                        </div>`;
                }).join('')}
            </div>`;
    });

    kTab.innerHTML = html;
}

function capSave(key, tip, deger) {
    if (!state.kapasite[key]) state.kapasite[key] = {h:0, hs:0};
    state.kapasite[key][tip] = parseInt(deger) || 0;
    save();
}

function checklistOlustur() {
    const box = document.getElementById("personelChecklist");
    if (!box) return;

    box.innerHTML = state.personeller.map(p => `
        <div class="check-item">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <label for="check_${p.id}">${p.ad}</label>
        </div>
    `).join('');
}

function toggleAdminPanel() {
    document.getElementById("adminPanel").classList.toggle("hidden");
    if (!document.getElementById("adminPanel").classList.contains("hidden")) {
        refreshUI();
    }
}

function tabDegistir(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById('tab-' + tabName).classList.remove('hidden');
}

function haftaDegistir(adim) {
    currentMonday.setDate(currentMonday.getDate() + adim);
    tabloyuOlustur();
}

function sil(tur, index) {
    if (confirm("Silmek istediğinize emin misiniz?")) {
        state[tur].splice(index, 1);
        save();
        refreshUI();
        tabloyuOlustur();
    }
}

function sifirla() {
    if (confirm("Tüm veriler kalıcı olarak silinecek!\nDevam etmek istiyor musunuz?")) {
        localStorage.clear();
        location.reload();
    }
}

function whatsappKopyala() {
    alert("WhatsApp kopyalama özelliği henüz tamamlanmadı.\nİsterseniz tabloyu ekran görüntüsü alıp paylaşabilirsiniz.");
}

// Başlangıç
window.onload = () => {
    // İlk seferde örnek personel ekle
    if (state.personeller.length === 0) {
        state.personeller = [
            {ad: "CAN ŞENTUNALI",   birim: "TEKNİK YÖNETMEN", id: 1001},
            {ad: "EKREM FİDAN",     birim: "TEKNİK YÖNETMEN", id: 1002},
            {ad: "BARIŞ İNCE",      birim: "TEKNİK YÖNETMEN", id: 1003},
            {ad: "ANIL RİŞVAN",     birim: "SES OPERATÖRÜ",   id: 1004},
            // İsterseniz buraya daha fazla örnek personel ekleyebilirsiniz
        ];
        save();
    }

    tabloyuOlustur();
};