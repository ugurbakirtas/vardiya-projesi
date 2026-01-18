// --- 1. VERİ HAVUZU ---
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = {
    "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71",
    "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e",
    "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400"
};

const DEFAULT_STAFF = [
    {ad: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN"}, {ad: "M.BERKMAN", birim: "TEKNİK YÖNETMEN"}, {ad: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN"},
    {ad: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN"}, {ad: "H.CAN SAĞLAM", birim: "TEKNİK YÖNETMEN"}, {ad: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN"},
    {ad: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ"}, {ad: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ"}, {ad: "ZAFER AKAR", birim: "SES OPERATÖRÜ"},
    {ad: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ"}, {ad: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ"}, {ad: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ"},
    {ad: "ENES KALE", birim: "SES OPERATÖRÜ"}, {ad: "ERSAN TİLBE", birim: "SES OPERATÖRÜ"}, {ad: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ"},
    {ad: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ"}, {ad: "M.ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ"}, {ad: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ"},
    {ad: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ"}, {ad: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ"}, {ad: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ"},
    {ad: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ"}, {ad: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ"}, {ad: "DEMET CENGİZ", birim: "KJ OPERATÖRÜ"},
    {ad: "SENA BAYDAR", birim: "KJ OPERATÖRÜ"}, {ad: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ"}, {ad: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ"},
    {ad: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ"}, {ad: "ERCAN PALABIYIK", birim: "INGEST OPERATÖRÜ"}, {ad: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ"},
    {ad: "UĞUR AKBABA", birim: "INGEST OPERATÖRÜ"}, {ad: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM"}, {ad: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM"},
    {ad: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM"}, {ad: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM"}, {ad: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ"},
    {ad: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ"}, {ad: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ"}, {ad: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ"},
    {ad: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ"}, {ad: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ"}, {ad: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ"},
    {ad: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ"}, {ad: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ"}, {ad: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ"},
    {ad: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ"}, {ad: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ"}, {ad: "MUSAB YAKUP DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ"}
];

// --- 2. DURUM YÖNETİMİ ---
let state = {
    birimler: JSON.parse(localStorage.getItem("v35_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v35_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v35_personeller")) || DEFAULT_STAFF.map((p,i) => ({...p, id: 200+i})),
    sabitAtamalar: JSON.parse(localStorage.getItem("v35_sabitAtamalar")) || [],
    kapasite: JSON.parse(localStorage.getItem("v35_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v35_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

function save() { 
    localStorage.setItem("v35_birimler", JSON.stringify(state.birimler)); 
    localStorage.setItem("v35_saatler", JSON.stringify(state.saatler)); 
    localStorage.setItem("v35_personeller", JSON.stringify(state.personeller)); 
    localStorage.setItem("v35_sabitAtamalar", JSON.stringify(state.sabitAtamalar)); 
    localStorage.setItem("v35_kapasite", JSON.stringify(state.kapasite));
    localStorage.setItem("v35_manuelAtamalar", JSON.stringify(state.manuelAtamalar));
}

// --- 3. AKILLI DAĞITIM MOTORU ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const headerTarih = document.getElementById("tarihAraligi");
    if(headerTarih) headerTarih.innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let calismaSayisi = {};
    let uyarilar = [];
    const haftaSeed = currentMonday.getTime();

    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        calismaSayisi[p.ad] = 0;
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ");
    });

    // 1. Manuel Değişiklikler (En Yüksek Öncelik)
    state.personeller.forEach(p => {
        for(let i=0; i<7; i++) {
            let mKey = `${haftaKey}_${p.ad}_${i}`;
            if(state.manuelAtamalar[mKey]) {
                program[p.ad][i] = state.manuelAtamalar[mKey];
                if(program[p.ad][i] !== "BOŞALT" && program[p.ad][i] !== "İZİNLİ") calismaSayisi[p.ad]++;
            }
        }
    });

    // 2. Teknik Yönetmen Gece Vardiyası Kuralları
    for(let i=0; i<7; i++) {
        let gececi = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if(program[gececi] && program[gececi][i] === null) { 
            program[gececi][i] = "00:00–07:00"; 
            calismaSayisi[gececi]++; 
        }
    }

    // 3. Sabit Atamalar
    state.sabitAtamalar.forEach(a => {
        if(program[a.p]) {
            if(a.g === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[a.p][i] === null) { program[a.p][i] = a.s; calismaSayisi[a.p]++; }
            } else {
                let g = parseInt(a.g); if(program[a.p][g] === null) { program[a.p][g] = a.s; calismaSayisi[a.p]++; }
            }
        }
    });

    // 4. Dinamik Dağıtım
    for(let i=0; i<7; i++) {
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let capKey = `${birim}_${saat}`;
                let hedef = state.kapasite[capKey] ? ((i >= 5) ? state.kapasite[capKey].hs : state.kapasite[capKey].h) : 0;
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                
                if(mevcut < hedef) {
                    let adaylar = state.personeller.filter(p => {
                        if(p.birim !== birim || program[p.ad][i] !== null) return false;
                        if(calismaSayisi[p.ad] >= 5) return false; // Haftalık limit
                        if(i > 0 && program[p.ad][i-1] === "00:00–07:00" && saat.startsWith("06:30")) return false; // Dinlenme
                        return true;
                    }).sort((a,b) => calismaSayisi[a.ad] - calismaSayisi[b.ad]);

                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) {
                        program[adaylar[j].ad][i] = saat;
                        calismaSayisi[adaylar[j].ad]++;
                    }
                }
                
                // Kapasite Kontrolü (Smart Alert)
                let sonDurum = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                if(sonDurum < hedef) uyarilar.push(`${birim} | ${i+1}. Gün | ${saat} vardiyası EKSİK!`);
            });
        });
    }

    uyariPaneliniGuncelle(uyarilar);
    render(program, calismaSayisi);
}

// --- 4. GÖRSELLEŞTİRME ---
function render(program, calismaSayisi) {
    const body = document.getElementById("tableBody");
    if(!body) return;
    let html = "";
    state.saatler.forEach(s => {
        html += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let list = state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                let color = UNIT_COLORS[p.birim] || "#666";
                return `<div class="birim-card" onclick="vardiyaDegistir('${p.ad}', ${i})" style="border-left: 5px solid ${color}; cursor:pointer">
                            <span class="birim-tag" style="background:${color}">${p.birim}</span>${p.ad}
                        </div>`;
            }).join('');
            html += `<td>${list}</td>`;
        }
        html += `</tr>`;
    });
    body.innerHTML = html;

    // Yedek ve İstatistik Satırları
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
                let izinCount = 0;
                for(let g=0; g<7; g++) { if(program[p.ad][g] === "İZİNLİ" || program[p.ad][g] === null) izinCount++; }
                return `<div style="font-size:10px; border-bottom:1px solid #eee">${p.ad}: <b>${calismaSayisi[p.ad]}G</b> | İz: ${izinCount}</div>`;
            }).join('');
        statHtml += `<td style="background:#f9f9f9">${dailyStats}</td>`;
    }
    document.getElementById("tableFooter").innerHTML = footHtml + "</tr>" + statHtml + "</tr>";
}

// --- 5. EK ÖZELLİKLER ---
function vardiyaDegistir(personelAd, gunIndis) {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const key = `${haftaKey}_${personelAd}_${gunIndis}`;
    let yeniSaat = prompt(`${personelAd} için yeni vardiya (Veya 'BOŞALT' / 'İZİNLİ' yazın):`, state.saatler[0]);
    if (yeniSaat !== null) {
        state.manuelAtamalar[key] = yeniSaat.toUpperCase();
        save(); tabloyuOlustur();
    }
}

function uyariPaneliniGuncelle(uyarilar) {
    const panel = document.getElementById("alertPanel");
    if(!panel) return;
    panel.innerHTML = uyarilar.length === 0 ? "✅ Kapasite Tamam" : `⚠️ <strong>Eksikler:</strong> ${uyarilar.length} vardiya boş.`;
    panel.className = uyarilar.length === 0 ? "alert-success" : "alert-danger";
}

function pdfIndir() {
    const element = document.getElementById('mainTableContainer');
    if(!element) return;
    html2pdf().from(element).save(`Vardiya_${currentMonday.toLocaleDateString()}.pdf`);
}

// --- 6. SAYFA BAŞLANGICI ---
window.onload = () => {
    // Eğer bir buton eksikse veya sayfa yüklenmiyorsa konsolda hata vermemesi için kontrol
    try {
        refreshUI(); 
        tabloyuOlustur();
    } catch(e) {
        console.error("Yükleme hatası:", e);
    }
};

// Diğer yönetim fonksiyonları (birimEkle, kapasiteCiz vb.) aynen devam eder...