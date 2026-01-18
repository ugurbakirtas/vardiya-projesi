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

// Başlangıç kapasite değerleri (gerçekçi başlangıç için ayarlandı)
const DEFAULT_KAPASITE = {
    "TEKNİK YÖNETMEN_06:30–16:00":   {h:1, hs:1},
    "TEKNİK YÖNETMEN_09:00–18:00":   {h:1, hs:1},
    "TEKNİK YÖNETMEN_12:00–22:00":   {h:1, hs:1},
    "TEKNİK YÖNETMEN_16:00–00:00":   {h:1, hs:1},
    "TEKNİK YÖNETMEN_00:00–07:00":   {h:1, hs:1},

    "SES OPERATÖRÜ_06:30–16:00":     {h:4, hs:3},
    "SES OPERATÖRÜ_09:00–18:00":     {h:2, hs:2},
    "SES OPERATÖRÜ_12:00–22:00":     {h:2, hs:2},
    "SES OPERATÖRÜ_16:00–00:00":     {h:3, hs:2},
    "SES OPERATÖRÜ_00:00–07:00":     {h:1, hs:1},

    "PLAYOUT OPERATÖRÜ_06:30–16:00": {h:3, hs:2},
    "PLAYOUT OPERATÖRÜ_09:00–18:00": {h:2, hs:1},
    "PLAYOUT OPERATÖRÜ_12:00–22:00": {h:2, hs:1},
    "PLAYOUT OPERATÖRÜ_16:00–00:00": {h:3, hs:2},

    "KJ OPERATÖRÜ_06:30–16:00":      {h:3, hs:2},
    "KJ OPERATÖRÜ_16:00–00:00":      {h:2, hs:2},
    "KJ OPERATÖRÜ_00:00–07:00":      {h:1, hs:1},
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

function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;

    const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    document.getElementById("tableHeader").innerHTML = `<tr><th>Saat</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr>`;

    let program = {};
    let calismaSayisi = {};

    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        calismaSayisi[p.ad] = 0;

        if (document.getElementById(`check_${p.id}`)?.checked) {
            program[p.ad].fill("İZİNLİ");
        }
    });

    // 1. Manuel atamalar
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

    // 2. Gece Teknik Yönetmen rotasyonu (Barış & Ekrem)
    for (let i = 0; i < 7; i++) {
        let geceSorumlusu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if (program[geceSorumlusu]?.[i] === null) {
            program[geceSorumlusu][i] = "00:00–07:00";
            calismaSayisi[geceSorumlusu]++;
        }
    }

    // 3. Otomatik atama
    for (let gun = 0; gun < 7; gun++) {
        const haftaSonu = gun >= 5;
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                const key = `${birim}_${saat}`;
                const kapasite = state.kapasite[key] || {h:0, hs:0};
                const hedef = haftaSonu ? kapasite.hs : kapasite.h;

                let mevcut = state.personeller.filter(p => 
                    p.birim === birim && program[p.ad][gun] === saat
                ).length;

                if (mevcut < hedef) {
                    let adaylar = state.personeller
                        .filter(p => 
                            p.birim === birim &&
                            program[p.ad][gun] === null &&
                            calismaSayisi[p.ad] < 6  // Haftalık max 6 gün
                        )
                        .sort((a,b) => calismaSayisi[a.ad] - calismaSayisi[b.ad]);

                    let eklenecek = hedef - mevcut;
                    for (let j = 0; j < eklenecek && adaylar[j]; j++) {
                        if (birim === "TEKNİK YÖNETMEN" && saat === "00:00–07:00" && 
                            !["BARIŞ İNCE", "EKREM FİDAN"].includes(adaylar[j].ad)) {
                            continue;
                        }
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

// Diğer fonksiyonlar (vardiyaDegistir, personelEkle, refreshUI, kapasiteCiz, capSave, checklistOlustur, toggleAdminPanel, tabDegistir, haftaDegistir, sil, sifirla, whatsappKopyala) aynı kalıyor

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
    if (state.personeller.some(p => p.ad === ad)) {
        return alert("Bu isimde bir personel zaten mevcut!");
    }

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
                                     onchange="capSave('${key}','h',this.value)" style="width:40px">
                            S:<input type="number" min="0" value="${v.hs}" 
                                     onchange="capSave('${key}','hs',this.value)" style="width:40px">
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
    if (confirm("TÜM VERİLER SİLİNECEK!\nDevam etmek istiyor musunuz?")) {
        localStorage.clear();
        location.reload();
    }
}

function whatsappKopyala() {
    alert("Henüz tam çalışmıyor.\nŞimdilik tabloyu ekran görüntüsü alarak paylaşabilirsiniz.");
}

// BAŞLANGIÇ - SADECE senin verdiğin 28 kişi
window.onload = () => {
    if (state.personeller.length === 0) {
        state.personeller = [
            // TEKNİK YÖNETMEN
            {ad: "CAN ŞENTUNALI",     birim: "TEKNİK YÖNETMEN", id: Date.now() + 1},
            {ad: "M. BERKMAN",        birim: "TEKNİK YÖNETMEN", id: Date.now() + 2},
            {ad: "YUNUS EMRE YAYLA",  birim: "TEKNİK YÖNETMEN", id: Date.now() + 3},
            {ad: "H. CAN SAĞLAM",     birim: "TEKNİK YÖNETMEN", id: Date.now() + 4},
            {ad: "BARIŞ İNCE",        birim: "TEKNİK YÖNETMEN", id: Date.now() + 5},
            {ad: "EKREM FİDAN",       birim: "TEKNİK YÖNETMEN", id: Date.now() + 6},

            // SES OPERATÖRÜ
            {ad: "ANIL RİŞVAN",       birim: "SES OPERATÖRÜ", id: Date.now() + 7},
            {ad: "ULVİ MUTLUBAŞ",     birim: "SES OPERATÖRÜ", id: Date.now() + 8},
            {ad: "ZAFER AKAR",        birim: "SES OPERATÖRÜ", id: Date.now() + 9},
            {ad: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ", id: Date.now() + 10},
            {ad: "OSMAN DİNÇER",      birim: "SES OPERATÖRÜ", id: Date.now() + 11},
            {ad: "DOĞUŞ MALGIL",      birim: "SES OPERATÖRÜ", id: Date.now() + 12},
            {ad: "ENES KALE",         birim: "SES OPERATÖRÜ", id: Date.now() + 13},
            {ad: "ERSAN TİLBE",       birim: "SES OPERATÖRÜ", id: Date.now() + 14},

            // PLAYOUT OPERATÖRÜ
            {ad: "NEHİR KAYGUSUZ",         birim: "PLAYOUT OPERATÖRÜ", id: Date.now() + 15},
            {ad: "KADİR ÇAÇAN",            birim: "PLAYOUT OPERATÖRÜ", id: Date.now() + 16},
            {ad: "MUSTAFA ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ", id: Date.now() + 17},
            {ad: "İBRAHİM SERİNSÖZ",       birim: "PLAYOUT OPERATÖRÜ", id: Date.now() + 18},
            {ad: "YUSUF ALPKILIÇ",         birim: "PLAYOUT OPERATÖRÜ", id: Date.now() + 19},
            {ad: "SENA MİNARECİ",          birim: "PLAYOUT OPERATÖRÜ", id: Date.now() + 20},
            {ad: "MEHMET TUNÇ",            birim: "PLAYOUT OPERATÖRÜ", id: Date.now() + 21},

            // KJ OPERATÖRÜ
            {ad: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ", id: Date.now() + 22},
            {ad: "CEMREHAN SUBAŞI",   birim: "KJ OPERATÖRÜ", id: Date.now() + 23},
            {ad: "UĞUR AKBABA",       birim: "KJ OPERATÖRÜ", id: Date.now() + 24},
            {ad: "SENA BAYDAR",       birim: "KJ OPERATÖRÜ", id: Date.now() + 25},
            {ad: "OĞUZHAN YALAZAN",   birim: "KJ OPERATÖRÜ", id: Date.now() + 26},
            {ad: "YEŞİM KİREÇ",       birim: "KJ OPERATÖRÜ", id: Date.now() + 27},
            {ad: "PINAR ÖZENÇ",       birim: "KJ OPERATÖRÜ", id: Date.now() + 28},
        ];
        save();
    }

    tabloyuOlustur();
};