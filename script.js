// --- 1. VERİ HAVUZU ---
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = {
    "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71",
    "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e",
    "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400"
};

// --- 2. DURUM YÖNETİMİ (KALICI HAFIZA) ---
let state = {
    birimler: JSON.parse(localStorage.getItem("v34_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v34_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v34_personeller")) || [],
    sabitAtamalar: JSON.parse(localStorage.getItem("v34_sabitAtamalar")) || [],
    kapasite: JSON.parse(localStorage.getItem("v34_kapasite")) || {},
    // YENİ: Manuel değişimleri saklayan depo
    manuelAtamalar: JSON.parse(localStorage.getItem("v34_manuelAtamalar")) || {} 
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

function save() { 
    localStorage.setItem("v34_birimler", JSON.stringify(state.birimler)); 
    localStorage.setItem("v34_saatler", JSON.stringify(state.saatler)); 
    localStorage.setItem("v34_personeller", JSON.stringify(state.personeller)); 
    localStorage.setItem("v34_sabitAtamalar", JSON.stringify(state.sabitAtamalar)); 
    localStorage.setItem("v34_kapasite", JSON.stringify(state.kapasite));
    localStorage.setItem("v34_manuelAtamalar", JSON.stringify(state.manuelAtamalar));
}

// --- 3. ANA MOTOR ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    let program = {};
    let calismaSayisi = {};
    let uyarilar = [];

    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        calismaSayisi[p.ad] = 0;
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ");
    });

    // A. ÖNCELİK: Manuel Atamalar (Hafızadan yükle)
    state.personeller.forEach(p => {
        for(let i=0; i<7; i++) {
            let key = `${haftaKey}_${p.ad}_${i}`;
            if(state.manuelAtamalar[key]) {
                program[p.ad][i] = state.manuelAtamalar[key];
                if(program[p.ad][i] !== "BOŞALT") calismaSayisi[p.ad]++;
            }
        }
    });

    // B. Sabit Atamalar (Sadece boş olanlara)
    state.sabitAtamalar.forEach(a => {
        if(program[a.p]) {
            if(a.g === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[a.p][i] === null) { program[a.p][i] = a.s; calismaSayisi[a.p]++; }
            } else {
                let g = parseInt(a.g); if(program[a.p][g] === null) { program[a.p][g] = a.s; calismaSayisi[a.p]++; }
            }
        }
    });

    // C. Algoritma Dağıtımı (Sadece kalan boşluklara)
    for(let i=0; i<7; i++) {
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let capKey = `${birim}_${saat}`;
                let hedef = state.kapasite[capKey] ? ((i >= 5) ? state.kapasite[capKey].hs : state.kapasite[capKey].h) : 0;
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                
                if(mevcut < hedef) {
                    let adaylar = state.personeller.filter(p => {
                        return p.birim === birim && program[p.ad][i] === null && calismaSayisi[p.ad] < 5;
                    }).sort((a,b) => calismaSayisi[a.ad] - calismaSayisi[b.ad]);

                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) {
                        program[adaylar[j].ad][i] = saat;
                        calismaSayisi[adaylar[j].ad]++;
                    }
                }
            });
        });
    }

    render(program, calismaSayisi);
}

// --- 4. MANUEL DEĞİŞİM FONKSİYONU ---
function vardiyaDegistir(personelAd, gunIndis) {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const key = `${haftaKey}_${personelAd}_${gunIndis}`;
    
    let secenekler = state.saatler.join("\n");
    let yeniSaat = prompt(`${personelAd} için yeni vardiya (Veya 'BOŞALT' yazın):\n\n${secenekler}`, state.saatler[0]);

    if (yeniSaat !== null) {
        state.manuelAtamalar[key] = yeniSaat.toUpperCase();
        save();
        tabloyuOlustur();
    }
}

// Manuel atamaları temizleme butonu için
function manuelTemizle() {
    if(confirm("Tüm manuel değişiklikler silinecek. Emin misiniz?")) {
        state.manuelAtamalar = {};
        save();
        tabloyuOlustur();
    }
}

// Render fonksiyonunda tıklama özelliğini koruyoruz
function render(program, calismaSayisi) {
    // ... (Önceki render kodları aynı, kartlara onclick="vardiyaDegistir" eklendi)
}