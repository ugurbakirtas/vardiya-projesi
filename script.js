// --- 1. AYARLAR VE VERİ DURUMU ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

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

let state = {
    birimler: JSON.parse(localStorage.getItem("v42_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v42_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v42_personeller")) || DEFAULT_STAFF.map((p,i) => ({...p, id: 900+i})),
    kapasite: JSON.parse(localStorage.getItem("v42_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v42_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`v42_${k}`, JSON.stringify(state[k]))); }

// --- 2. GÜVENLİK ---
function toggleAdminPanel() {
    const panel = document.getElementById("adminPanel");
    if (panel.classList.contains("hidden")) {
        const pass = prompt("Yönetici Şifresini Girin:");
        if (pass === ADMIN_PASSWORD) { panel.classList.remove("hidden"); refreshUI(); } 
        else { alert("Hatalı Şifre!"); }
    } else { panel.classList.add("hidden"); }
}

// --- 3. ANA MOTOR ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let calismaSayisi = {};
    let uyarilar = [];

    state.personeller.forEach(p => { 
        program[p.ad] = Array(7).fill(null); 
        calismaSayisi[p.ad] = 0; 
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ"); 
    });

    // Manuel Değişimler ve Teknik Yönetmen Rotasyonu
    state.personeller.forEach(p => { 
        for(let i=0; i<7; i++) { 
            let mK = `${haftaKey}_${p.ad}_${i}`; 
            if(state.manuelAtamalar[mK]) { 
                program[p.ad][i] = state.manuelAtamalar[mK]; 
                if(!["İZİNLİ","BOŞALT"].includes(program[p.ad][i])) calismaSayisi[p.ad]++; 
            } 
        } 
    });
    
    for(let i=0; i<7; i++) { 
        let g = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN"; 
        if(program[g] && program[g][i] === null) { program[g][i] = "00:00–07:00"; calismaSayisi[g]++; } 
    }

    // Kapasite Dağıtımı
    for(let i=0; i<7; i++) {
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let k = `${birim}_${saat}`; 
                let hedef = state.kapasite[k] ? ((i >= 5) ? state.kapasite[k].hs : state.kapasite[k].h) : 0;
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                
                if(mevcut < hedef) {
                    let adaylar = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === null && calismaSayisi[p.ad] < 5).sort((a,b) => calismaSayisi[a.ad] - calismaSayisi[b.ad]);
                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) { program[adaylar[j].ad][i] = saat; calismaSayisi[adaylar[j].ad]++; }
                }
                
                let sonDurum = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                if(sonDurum < hedef) uyarilar.push(`${birim} (${saat})`);
            });
        });
    }
    uyariPaneliniGuncelle(uyarilar);
    render(program, calismaSayisi);
}

// --- 4. YÖNETİM VE REFRESH ---
function refreshUI() {
    const pList = document.getElementById("persListesiAdmin");
    if(pList) pList.innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    
    const bSec = document.getElementById("yeniPersBirimSec");
    if(bSec) bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');

    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div class="system-tools">
                <div style="background:#fff3cd; padding:10px; border-radius:5px; margin-bottom:15px; border:1px solid #ffeeba;">
                    <strong>Bilgi:</strong> "Sıfırla" butonu sadece vardiya planını temizler. Personel ve Kapasite ayarlarınız <u>korunur</u>.
                </div>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button onclick="sifirla()" class="btn-warning">🔄 TABLOYU SIFIRLA (Ayarları Korur)</button>
                    <button onclick="pdfIndir()" class="btn-pdf">📄 PDF ÇIKTISI</button>
                    <button onclick="fabrikaAyari()" class="btn-danger" style="background:#000">⚠️ HER ŞEYİ SİL (Fabrika Ayarı)</button>
                </div>
                <hr>
                <h4>Birim ve Saat Tanımları</h4>
                <div class="admin-input-group"><input id="yInpB" placeholder="Yeni Birim..."><button onclick="birimEkle()">EKLE</button></div>
                <div class="list-container">${state.birimler.map((b,i) => `<div class="admin-list-item">${b} <button onclick="sil('birimler',${i})">SİL</button></div>`).join('')}</div>
                <hr>
                <div class="admin-input-group"><input id="yInpS" placeholder="06:30–16:00"><button onclick="saatEkle()">EKLE</button></div>
                <div class="list-container">${state.saatler.map((s,i) => `<div class="admin-list-item">${s} <button onclick="sil('saatler',${i})">SİL</button></div>`).join('')}</div>
            </div>`;
    }
    checklistOlustur(); kapasiteCiz();
}

function vardiyaDegistir(p, i) { 
    const sirali = [...state.saatler].sort(); 
    let m = `${p} Vardiya Seç:\n` + sirali.map((s, idx) => `${idx + 1}- ${s}`).join("\n") + "\n\n(Veya İZİNLİ/BOŞALT)";
    let s = prompt(m, sirali[0]); 
    if(s) {
        let res = s.toUpperCase();
        if(!isNaN(s) && sirali[parseInt(s)-1]) res = sirali[parseInt(s)-1];
        state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p}_${i}`] = res; 
        save(); tabloyuOlustur(); 
    } 
}

// --- 5. ÖZEL SIFIRLAMA FONKSİYONLARI ---
function sifirla() { 
    if(confirm("Bu haftaki tüm manuel vardiya seçimleri ve izinler temizlenecek. Personel listeniz ve kapasite ayarlarınız DEĞİŞMEYECEK. Emin misiniz?")) { 
        state.manuelAtamalar = {}; 
        // İzin checkboxlarını temizle
        state.personeller.forEach(p => {
            let el = document.getElementById(`check_${p.id}`);
            if(el) el.checked = false;
        });
        save(); 
        tabloyuOlustur(); 
        alert("Tablo sıfırlandı. Ayarlarınız korundu.");
    } 
}

function fabrikaAyari() {
    if(confirm("DİKKAT! Tüm personeller, tüm birimler ve tüm kapasite ayarları kalıcı olarak silinecek. Uygulama ilk günkü haline dönecek. Emin misiniz?")) {
        localStorage.clear();
        location.reload();
    }
}

function uyariPaneliniGuncelle(uyarilar) {
    const p = document.getElementById("alertPanel"); if(!p) return;
    p.innerHTML = uyarilar.length > 0 ? `⚠️ <b>Kapasite Eksik:</b> ${[...new Set(uyarilar)].slice(0,2).join(", ")}...` : "✅ Planlama Tamam";
    p.className = uyarilar.length > 0 ? "alert-danger" : "alert-success";
}

function render(program, calismaSayisi) {
    const body = document.getElementById("tableBody"); if(!body) return;
    body.innerHTML = state.saatler.map(s => `<tr><td><strong>${s}</strong></td>${[0,1,2,3,4,5,6].map(i => `<td>${state.personeller.filter(p => program[p.ad][i] === s).map(p => `<div class="birim-card" onclick="vardiyaDegistir('${p.ad}',${i})" style="border-left:5px solid ${UNIT_COLORS[p.birim]}"><span class="birim-tag" style="background:${UNIT_COLORS[p.birim]}">${p.birim}</span>${p.ad}</div>`).join('')}</td>`).join('')}</tr>`).join('');
    
    const foot = document.getElementById("tableFooter");
    foot.innerHTML = `<tr><td><strong>İZİNLİ/YEDEK</strong></td>${[0,1,2,3,4,5,6].map(i => `<td>${state.personeller.filter(p => ["İZİNLİ",null].includes(program[p.ad][i])).map(p => `<div class="birim-card izinli-kart" onclick="vardiyaDegistir('${p.ad}',${i})">${p.ad}</div>`).join('')}</td>`).join('')}</tr>`;
}

function pdfIndir() { const el = document.getElementById('mainTableContainer'); if(el) html2pdf().from(el).set({margin:1, filename:'vardiya_plani.pdf', jsPDF:{orientation:'landscape'}}).save(); }
function checklistOlustur() { const box = document.getElementById("personelChecklist"); if(box) box.innerHTML = state.personeller.map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join(''); }
function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable"); if(!kTab) return;
    let h = `<div class="cap-table-header"><div>Birim / Saat</div>${state.saatler.map(s => `<div>${s}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        h += `<div class="cap-row"><strong>${b}</strong>${state.saatler.map(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            return `<div class="cap-input-pair"><input type="number" value="${v.h}" onchange="capSave('${k}','h',this.value)"><input type="number" class="hs-input" value="${v.hs}" onchange="capSave('${k}','hs',this.value)"></div>`;
        }).join('')}</div>`;
    });
    kTab.innerHTML = h;
}
function capSave(k, t, v) { if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0}; state.kapasite[k][t] = parseInt(v) || 0; save(); tabloyuOlustur(); }
function birimEkle() { let v = document.getElementById("yInpB").value.toUpperCase(); if(v){ state.birimler.push(v); save(); refreshUI(); } }
function saatEkle() { let v = document.getElementById("yInpS").value; if(v){ state.saatler.push(v); save(); refreshUI(); tabloyuOlustur(); } }
function personelEkle() { let ad = document.getElementById("yeniPersInp").value.toUpperCase(); let b = document.getElementById("yeniPersBirimSec").value; if(ad){ state.personeller.push({ad, birim:b, id:Date.now()}); save(); refreshUI(); tabloyuOlustur(); } }
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + (v*7)); tabloyuOlustur(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }

window.onload = () => { tabloyuOlustur(); };