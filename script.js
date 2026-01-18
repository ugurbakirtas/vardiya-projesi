// --- 1. AYARLAR VE SABİT PERSONEL LİSTESİ ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

// Hafızadaki tam personel listesi (ID'leri ile birlikte)
const INITIAL_STAFF = [
    {ad: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN", id: 101}, {ad: "M.BERKMAN", birim: "TEKNİK YÖNETMEN", id: 102}, {ad: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN", id: 103},
    {ad: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN", id: 104}, {ad: "H.CAN SAĞLAM", birim: "TEKNİK YÖNETMEN", id: 105}, {ad: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN", id: 106},
    {ad: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ", id: 107}, {ad: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ", id: 108}, {ad: "ZAFER AKAR", birim: "SES OPERATÖRÜ", id: 109},
    {ad: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ", id: 110}, {ad: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ", id: 111}, {ad: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ", id: 112},
    {ad: "ENES KALE", birim: "SES OPERATÖRÜ", id: 113}, {ad: "ERSAN TİLBE", birim: "SES OPERATÖRÜ", id: 114}, {ad: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ", id: 115},
    {ad: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ", id: 116}, {ad: "M.ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ", id: 117}, {ad: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ", id: 118},
    {ad: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ", id: 119}, {ad: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ", id: 120}, {ad: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ", id: 121},
    {ad: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ", id: 122}, {ad: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ", id: 123}, {ad: "DEMET CENGİZ", birim: "KJ OPERATÖRÜ", id: 124},
    {ad: "SENA BAYDAR", birim: "KJ OPERATÖRÜ", id: 125}, {ad: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ", id: 126}, {ad: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ", id: 127},
    {ad: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ", id: 128}, {ad: "ERCAN PALABIYIK", birim: "INGEST OPERATÖRÜ", id: 129}, {ad: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ", id: 130},
    {ad: "UĞUR AKBABA", birim: "INGEST OPERATÖRÜ", id: 131}, {ad: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM", id: 132}, {ad: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM", id: 133},
    {ad: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM", id: 134}, {ad: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM", id: 135}, {ad: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ", id: 136},
    {ad: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ", id: 137}, {ad: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ", id: 138}, {ad: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ", id: 139},
    {ad: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ", id: 140}, {ad: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ", id: 141}, {ad: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ", id: 142},
    {ad: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ", id: 143}, {ad: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ", id: 144}, {ad: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ", id: 145},
    {ad: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ", id: 146}, {ad: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ", id: 147}, {ad: "MUSAB YAKUP DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ", id: 148}
];

let state = {
    birimler: JSON.parse(localStorage.getItem("v70_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v70_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v70_personeller")) || INITIAL_STAFF,
    kapasite: JSON.parse(localStorage.getItem("v70_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v70_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());
let draggedData = null;

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`v70_${k}`, JSON.stringify(state[k]))); }

// --- 2. ANA FONKSİYONLAR (SIRALAMA ÖNEMLİ) ---

function refreshUI() {
    const pList = document.getElementById("persListesiAdmin");
    if(pList) pList.innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    
    const bSec = document.getElementById("yeniPersBirimSec");
    if(bSec) bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');

    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div class="system-box" style="padding:15px; background:#f9f9f9; border-radius:8px;">
                <button onclick="whatsappKopyala()" style="background:#25D366; color:white; width:100%; padding:12px; margin-bottom:15px; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">🟢 WHATSAPP KOPYALA</button>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div>
                        <h4 style="margin-top:0">Birimler</h4>
                        <div style="display:flex; gap:5px;"><input id="yInpB" style="flex:1"><button onclick="birimEkle()">+</button></div>
                        <div style="max-height:150px; overflow-y:auto; margin-top:10px; border:1px solid #ddd; padding:5px;">${state.birimler.map((b,i)=>`<div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:3px;">${b} <span onclick="sil('birimler',${i})" style="color:red; cursor:pointer;">×</span></div>`).join('')}</div>
                    </div>
                    <div>
                        <h4 style="margin-top:0">Saatler</h4>
                        <div style="display:flex; gap:5px;"><input id="yInpS" style="flex:1"><button onclick="saatEkle()">+</button></div>
                        <div style="max-height:150px; overflow-y:auto; margin-top:10px; border:1px solid #ddd; padding:5px;">${state.saatler.map((s,i)=>`<div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:3px;">${s} <span onclick="sil('saatler',${i})" style="color:red; cursor:pointer;">×</span></div>`).join('')}</div>
                    </div>
                </div>
                <div style="margin-top:20px; display:flex; gap:10px;">
                    <button onclick="verileriYedekle()" style="flex:1; background:#555; color:white;">💾 YEDEKLE</button>
                    <button onclick="sifirla()" style="flex:1; background:#e67e22; color:white;">🔄 SIFIRLA</button>
                </div>
            </div>`;
    }
    checklistOlustur();
    kapasiteCiz();
}

function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const tarihLabel = document.getElementById("tarihAraligi");
    if (tarihLabel) tarihLabel.innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let calismaSayisi = {};
    let ihlaller = [];

    state.personeller.forEach(p => { 
        program[p.ad] = Array(7).fill(null); 
        calismaSayisi[p.ad] = 0; 
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ"); 
    });

    state.personeller.forEach(p => { 
        for(let i=0; i<7; i++) { 
            let mK = `${haftaKey}_${p.ad}_${i}`; 
            if(state.manuelAtamalar[mK]) { 
                program[p.ad][i] = state.manuelAtamalar[mK]; 
                if(!["İZİNLİ","BOŞALT"].includes(program[p.ad][i])) calismaSayisi[p.ad]++; 
            } 
        } 
    });

    // 11 Saat Dinlenme Kuralı
    state.personeller.forEach(p => {
        for(let i=1; i<7; i++) {
            if(program[p.ad][i-1] === "00:00–07:00" && (program[p.ad][i] === "06:30–16:00" || program[p.ad][i] === "09:00–18:00")) {
                ihlaller.push(`${p.ad}_${i}`);
            }
        }
    });

    renderTable(program, ihlaller);
}

function renderTable(program, ihlaller) {
    const body = document.getElementById("tableBody");
    if(!body) return;

    body.innerHTML = state.saatler.map(s => `
        <tr>
            <td style="background:#f4f4f4; font-weight:bold; width:120px; text-align:center;">${s}</td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td ondragover="event.preventDefault()" ondrop="handleDrop(event, '${s}', ${i})" style="min-height:60px; vertical-align:top;">
                    ${state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                        const ihlalMi = ihlaller.includes(`${p.ad}_${i}`);
                        return `
                            <div class="birim-card" draggable="true" 
                                 ondragstart="handleDragStart(event, '${p.ad}', ${i})"
                                 onclick="vardiyaMenu('${p.ad}', ${i})"
                                 style="border-left:5px solid ${UNIT_COLORS[p.birim]}; ${ihlalMi ? 'background:#ffebee; border:2px solid red;' : ''}; margin:3px; padding:5px; font-size:11px; cursor:move; border-radius:3px; box-shadow: 1px 1px 3px rgba(0,0,0,0.1);">
                                <strong style="color:${UNIT_COLORS[p.birim]}">${p.birim}</strong><br>
                                ${ihlalMi ? '⚠️ ' : ''}${p.ad}
                            </div>`;
                    }).join('')}
                </td>`).join('')}
        </tr>`).join('');
}

// --- 3. SÜRÜKLE BIRAK VE DİĞER FONKSİYONLAR ---

function handleDragStart(e, pAd, sourceGunIdx) { draggedData = { pAd, sourceGunIdx }; e.target.style.opacity = "0.4"; }

function handleDrop(e, targetVardiya, targetGunIdx) {
    e.preventDefault();
    if (!draggedData) return;
    const haftaKey = currentMonday.toISOString().split('T')[0];
    state.manuelAtamalar[`${haftaKey}_${draggedData.pAd}_${targetGunIdx}`] = targetVardiya;
    save(); tabloyuOlustur(); draggedData = null;
}

function vardiyaMenu(p, i) {
    let s = prompt(`${p} için manuel vardiya (Örn: 06:30–16:00, İZİNLİ, BOŞALT):`);
    if(s !== null) {
        state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p}_${i}`] = s;
        save(); tabloyuOlustur();
    }
}

function birimEkle() { let v = document.getElementById("yInpB").value.toUpperCase(); if(v){ state.birimler.push(v); save(); refreshUI(); } }
function saatEkle() { let v = document.getElementById("yInpS").value; if(v){ state.saatler.push(v); save(); refreshUI(); tabloyuOlustur(); } }
function personelEkle() { 
    let ad = document.getElementById("yeniPersInp").value.toUpperCase(); 
    let b = document.getElementById("yeniPersBirimSec").value;
    if(ad) { state.personeller.push({ad, birim:b, id:Date.now()}); save(); refreshUI(); tabloyuOlustur(); }
}
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function capSave(k, t, v) { if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0}; state.kapasite[k][t] = parseInt(v) || 0; save(); tabloyuOlustur(); }
function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + (v*7)); tabloyuOlustur(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }
function checklistOlustur() { const b = document.getElementById("personelChecklist"); if(b) b.innerHTML = state.personeller.map(p=>`<div class="check-item" style="margin-bottom:5px;"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> <label style="font-size:12px;">${p.ad}</label></div>`).join(''); }

function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable"); if(!kTab) return;
    let h = `<div class="cap-header" style="display:grid; grid-template-columns: 150px repeat(${state.saatler.length}, 1fr); background:#eee; padding:5px; font-weight:bold; font-size:11px;"><div>Birim / Saat</div>${state.saatler.map(s => `<div>${s}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        h += `<div class="cap-row" style="display:grid; grid-template-columns: 150px repeat(${state.saatler.length}, 1fr); border-bottom:1px solid #eee; padding:5px; align-items:center;"><strong>${b}</strong>${state.saatler.map(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            return `<div style="display:flex; gap:2px;"><input type="number" title="Hafta İçi" value="${v.h}" onchange="capSave('${k}','h',this.value)" style="width:30px;"><input type="number" title="Hafta Sonu" value="${v.hs}" onchange="capSave('${k}','hs',this.value)" style="width:30px; background:#fff3e0;"></div>`;
        }).join('')}</div>`;
    });
    kTab.innerHTML = h;
}

function toggleAdminPanel() { 
    const p = document.getElementById("adminPanel"); 
    if(p.classList.contains("hidden")){ 
        if(prompt("Şifre:") === ADMIN_PASSWORD){ p.classList.remove("hidden"); refreshUI(); } 
    } else { p.classList.add("hidden"); } 
}

function whatsappKopyala() {
    let t = `*VARDİYA PROGRAMI - ${currentMonday.toLocaleDateString('tr-TR')}*\n`;
    state.saatler.forEach(s => {
        let p = state.personeller.filter(x => state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${x.ad}_0`] === s).map(y=>y.ad);
        if(p.length) t += `\n*${s}:* ${p.join(", ")}`;
    });
    navigator.clipboard.writeText(t).then(() => alert("Kopyalandı!"));
}

function verileriYedekle() {
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const link = document.createElement('a'); link.href = data; link.download = "vardiya_yedek.json"; link.click();
}

function sifirla() { if(confirm("Tüm manuel atamalar temizlensin mi?")) { state.manuelAtamalar = {}; save(); tabloyuOlustur(); } }

// --- 4. SAYFA YÜKLENME TETİKLEYİCİSİ ---
window.onload = () => {
    // Fonksiyonların tanımlı olduğundan emin olmak için çok kısa bekleme ve çalıştırma
    tabloyuOlustur();
    setTimeout(refreshUI, 100);
};