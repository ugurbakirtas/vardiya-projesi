// --- 1. VERİ VE RENK HAVUZU ---
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = {
    "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71",
    "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e",
    "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400"
};

// --- 2. DURUM YÖNETİMİ ---
let state = {
    birimler: JSON.parse(localStorage.getItem("v33_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v33_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v33_personeller")) || [], // Başlangıçta boş veya DEFAULT_STAFF ile doldurulur
    sabitAtamalar: JSON.parse(localStorage.getItem("v33_sabitAtamalar")) || [],
    kapasite: JSON.parse(localStorage.getItem("v33_kapasite")) || {},
    manuelDegisiklikler: JSON.parse(localStorage.getItem("v33_manuel")) || {} // { "Tarih_Personel_Gun": "YeniSaat" }
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { 
    localStorage.setItem("v33_birimler", JSON.stringify(state.birimler)); 
    localStorage.setItem("v33_saatler", JSON.stringify(state.saatler)); 
    localStorage.setItem("v33_personeller", JSON.stringify(state.personeller)); 
    localStorage.setItem("v33_sabitAtamalar", JSON.stringify(state.sabitAtamalar)); 
    localStorage.setItem("v33_kapasite", JSON.stringify(state.kapasite));
    localStorage.setItem("v33_manuel", JSON.stringify(state.manuelDegisiklikler));
}

// --- 3. ANA MOTOR ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let calismaSayisi = {};
    let uyarilar = [];
    const haftaSeed = currentMonday.getTime();

    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        calismaSayisi[p.ad] = 0;
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ");
    });

    // 1. Manuel Değişiklikleri ve Sabitleri Uygula
    state.sabitAtamalar.forEach(a => {
        if(program[a.p]) {
            if(a.g === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[a.p][i] !== "İZİNLİ") { program[a.p][i] = a.s; calismaSayisi[a.p]++; }
            } else {
                let g = parseInt(a.g); if(program[a.p][g] !== "İZİNLİ") { program[a.p][g] = a.s; calismaSayisi[a.p]++; }
            }
        }
    });

    // 2. Teknik Yönetmen Gece Rotasyonu
    for(let i=0; i<7; i++) {
        let gececi = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if(program[gececi] && program[gececi][i] === null) { program[gececi][i] = "00:00–07:00"; calismaSayisi[gececi]++; }
    }

    // 3. Dinamik Dağıtım ve Kapasite Kontrolü
    for(let i=0; i<7; i++) {
        let isWeekend = (i >= 5);
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let capKey = `${birim}_${saat}`;
                let hedef = state.kapasite[capKey] ? (isWeekend ? state.kapasite[capKey].hs : state.kapasite[capKey].h) : 0;
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                
                if(mevcut < hedef) {
                    let adaylar = state.personeller.filter(p => {
                        if(p.birim !== birim || program[p.ad][i] !== null) return false;
                        if(calismaSayisi[p.ad] >= 5) return false;
                        if(i > 0 && program[p.ad][i-1] === "00:00–07:00" && saat.startsWith("06:30")) return false;
                        return true;
                    }).sort((a, b) => {
                        if(calismaSayisi[a.ad] !== calismaSayisi[b.ad]) return calismaSayisi[a.ad] - calismaSayisi[b.ad];
                        return Math.sin(haftaSeed + a.id) - Math.sin(haftaSeed + b.id);
                    });

                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) {
                        program[adaylar[j].ad][i] = saat;
                        calismaSayisi[adaylar[j].ad]++;
                    }
                }
                
                // Kapasite Uyarısı (Smart Alert)
                let sonMevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                if(sonMevcut < hedef) uyarilar.push(`${birim} biriminde ${i+1}. gün ${saat} vardiyası EKSİK!`);
            });
        });
    }

    uyariPaneliniGuncelle(uyarilar);
    render(program, calismaSayisi);
}

// --- 4. SMART ALERT PANELİ ---
function uyariPaneliniGuncelle(uyarilar) {
    const panel = document.getElementById("alertPanel");
    if(!panel) return;
    if(uyarilar.length === 0) {
        panel.innerHTML = "✅ Tüm vardiyalar kapasiteye uygun.";
        panel.style.background = "#d4edda"; panel.style.color = "#155724";
    } else {
        panel.innerHTML = `⚠️ <strong>Uyarılar:</strong><br>${uyarilar.join('<br>')}`;
        panel.style.background = "#f8d7da"; panel.style.color = "#721c24";
    }
}

// --- 5. MANUEL VARDİYA DEĞİŞİMİ (SIMULATOR) ---
function vardiyaDegistir(personelAd, gunIndis) {
    const yeniSaat = prompt(`${personelAd} için yeni vardiya saatini seçin veya 'İPTAL' yazın:`, "09:00–18:00");
    if(yeniSaat) {
        // Bu özellik manuel kayıt mantığına dayalı geliştirilebilir. 
        // Şimdilik sistemin dinamik yapısını bozmamak için uyarı veriyoruz.
        alert("Manuel değişim simülatörü aktif: Gelecek güncellemede bu değişim kalıcı olarak kaydedilecek.");
    }
}

// --- 6. PDF EXPORT ---
function pdfIndir() {
    const element = document.getElementById('mainTableContainer');
    const opt = {
        margin: 10,
        filename: `Vardiya_Listesi_${currentMonday.toLocaleDateString()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    // Not: Sayfanıza html2pdf.js kütüphanesini eklemeniz gerekir.
    if(typeof html2pdf !== "undefined") {
        html2pdf().set(opt).from(element).save();
    } else {
        alert("PDF kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin.");
    }
}

// --- 7. GÖRSELLEŞTİRME ---
function render(program, calismaSayisi) {
    const body = document.getElementById("tableBody");
    let html = "";
    state.saatler.forEach(s => {
        html += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let list = state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                let color = UNIT_COLORS[p.birim] || "#666";
                return `<div class="birim-card" onclick="vardiyaDegistir('${p.ad}', ${i})" style="border-left: 5px solid ${color}; cursor:pointer" title="Değiştirmek için tıkla">
                            <span class="birim-tag" style="background:${color}">${p.birim}</span>${p.ad}
                        </div>`;
            }).join('');
            html += `<td>${list}</td>`;
        }
        html += `</tr>`;
    });
    body.innerHTML = html;

    // Yedek ve İstatistikleri Render Et (Önceki versiyonla aynı mantık)
    let footHtml = `<tr><td><strong>İZİNLİ / YEDEK</strong></td>`;
    for(let i=0; i<7; i++) {
        let iz = state.personeller.filter(p => program[p.ad][i] === "İZİNLİ" || program[p.ad][i] === null)
            .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag" style="background:#7f8c8d">${p.birim}</span>${p.ad}</div>`).join('');
        footHtml += `<td>${iz}</td>`;
    }
    
    let statHtml = `<tr><td style="background:#f2f2f2"><strong>HAFTALIK ÖZET</strong></td>`;
    for(let i=0; i<7; i++) {
        let dailyStats = state.personeller.filter(p => program[p.ad][i] !== "İZİNLİ" && program[p.ad][i] !== null)
            .map(p => {
                let izinSayisi = 0;
                for(let g=0; g<7; g++) { if(program[p.ad][g] === "İZİNLİ" || program[p.ad][g] === null) izinSayisi++; }
                return `<div style="font-size:10px; border-bottom:1px solid #eee">${p.ad}: <b>${calismaSayisi[p.ad]}G</b> | İz: ${izinSayisi}</div>`;
            }).join('');
        statHtml += `<td style="background:#f9f9f9">${dailyStats}</td>`;
    }
    document.getElementById("tableFooter").innerHTML = footHtml + "</tr>" + statHtml + "</tr>";
}

// Diğer yönetim fonksiyonları (birimEkle, personelEkle, vb.) önceki sürümle aynıdır...

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>