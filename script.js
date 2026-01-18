// --- 1. AYARLAR VE TAM PERSONEL LİSTESİ ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

// Görüntülediğin personel listesinin tamamı sisteme işlendi
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
    birimler: JSON.parse(localStorage.getItem("v90_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v90_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v90_personeller")) || INITIAL_STAFF,
    kapasite: JSON.parse(localStorage.getItem("v90_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v90_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`v90_${k}`, JSON.stringify(state[k]))); }

// --- 2. ANA TABLO MOTORU ---

function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const tarihLabel = document.getElementById("tarihAraligi");
    if (tarihLabel) tarihLabel.innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let ihlaller = [];

    // Personel Başlatma
    state.personeller.forEach(p => { 
        program[p.ad] = Array(7).fill(null); 
        // İzinli işaretlenenleri doldur
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ"); 
    });

    // Manuel ve Sürükle-Bırak Atamaları Yükle
    state.personeller.forEach(p => { 
        for(let i=0; i<7; i++) { 
            let mK = `${haftaKey}_${p.ad}_${i}`; 
            if(state.manuelAtamalar[mK]) program[p.ad][i] = state.manuelAtamalar[mK]; 
        } 
    });

    // 11 Saat Kuralı Kontrolü
    state.personeller.forEach(p => {
        for(let i=1; i<7; i++) {
            if(program[p.ad][i-1] === "00:00–07:00" && (program[p.ad][i] === "06:30–16:00" || program[p.ad][i] === "09:00–18:00")) {
                ihlaller.push(`${p.ad}_${i}`);
            }
        }
    });

    render(program, ihlaller);
}

function render(program, ihlaller) {
    const body = document.getElementById("tableBody");
    if(!body) return;

    body.innerHTML = state.saatler.map(s => `
        <tr>
            <td class="shift-name"><strong>${s}</strong></td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td class="${i > 4 ? 'weekend' : ''}" ondragover="event.preventDefault()" ondrop="handleDrop(event, '${s}', ${i})">
                    ${state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                        const isIhlal = ihlaller.includes(`${p.ad}_${i}`);
                        return `
                            <div class="birim-card" draggable="true" 
                                 ondragstart="handleDragStart(event, '${p.ad}', ${i})"
                                 onclick="vardiyaMenu('${p.ad}', ${i})"
                                 style="border-left:5px solid ${UNIT_COLORS[p.birim]}; ${isIhlal ? 'border:2px solid red; background:#ffebee;' : ''}">
                                <span class="birim-tag" style="background:${UNIT_COLORS[p.birim]}">${p.birim}</span>
                                ${isIhlal ? '⚠️ ' : ''}${p.ad}
                            </div>`;
                    }).join('')}
                </td>`).join('')}
        </tr>`).join('');
}

// --- 3. SÜRÜKLE BIRAK VE ARAÇLAR ---

let draggedData = null;
function handleDragStart(e, pAd, gunIdx) { draggedData = { pAd, gunIdx }; }

function handleDrop(e, targetVardiya, targetGun) {
    e.preventDefault();
    if (!draggedData) return;
    const haftaKey = currentMonday.toISOString().split('T')[0];
    state.manuelAtamalar[`${haftaKey}_${draggedData.pAd}_${targetGun}`] = targetVardiya;
    save(); tabloyuOlustur();
    draggedData = null;
}

function vardiyaMenu(p, i) {
    let s = prompt(`${p} - Yeni Vardiya:`, state.saatler[0]);
    if(s !== null) {
        const haftaKey = currentMonday.toISOString().split('T')[0];
        if(s === "") delete state.manuelAtamalar[`${haftaKey}_${p}_${i}`];
        else state.manuelAtamalar[`${haftaKey}_${p}_${i}`] = s;
        save(); tabloyuOlustur();
    }
}

// --- 4. YÖNETİM PANELİ ---

function refreshUI() {
    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div class="system-grid">
                <button onclick="whatsappKopyala()" class="btn-wp">🟢 WHATSAPP KOPYALA</button>
                <button onclick="verileriYedekle()" class="btn-sec">💾 YEDEK AL</button>
                <button onclick="sifirla()" class="btn-danger">🔄 TÜMÜNÜ SIFIRLA</button>
            </div>
            <div style="margin-top:20px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                <div class="box">
                    <h4>Birimler</h4>
                    <div class="flex"><input id="yInpB"><button onclick="birimEkle()">+</button></div>
                    <div class="scroll-list">${state.birimler.map((b,i)=>`<div>${b} <span onclick="sil('birimler',${i})">×</span></div>`).join('')}</div>
                </div>
                <div class="box">
                    <h4>Saatler</h4>
                    <div class="flex"><input id="yInpS"><button onclick="saatEkle()">+</button></div>
                    <div class="scroll-list">${state.saatler.map((s,i)=>`<div>${s} <span onclick="sil('saatler',${i})">×</span></div>`).join('')}</div>
                </div>
            </div>`;
    }
    checklistOlustur();
}

function checklistOlustur() {
    const list = document.getElementById("personelChecklist");
    if(list) list.innerHTML = state.personeller.map(p => `
        <div class="check-item">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <label>${p.ad}</label>
        </div>`).join('');
}

function toggleAdminPanel() { 
    const p = document.getElementById("adminPanel"); 
    if(p.classList.contains("hidden")){ 
        if(prompt("Şifre:") === ADMIN_PASSWORD){ p.classList.remove("hidden"); refreshUI(); } 
    } else { p.classList.add("hidden"); } 
}

function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + (v*7)); tabloyuOlustur(); }
function tabDegistir(n) { 
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); 
    document.getElementById('tab-'+n).classList.remove('hidden'); 
}

function birimEkle() { let v = document.getElementById("yInpB").value.toUpperCase(); if(v){ state.birimler.push(v); save(); refreshUI(); } }
function saatEkle() { let v = document.getElementById("yInpS").value; if(v){ state.saatler.push(v); save(); refreshUI(); tabloyuOlustur(); } }
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function sifirla() { if(confirm("Tüm planlama silinsin mi?")) { state.manuelAtamalar = {}; save(); tabloyuOlustur(); } }

function whatsappKopyala() {
    let text = `*TEKNİK VARDİYA | ${currentMonday.toLocaleDateString('tr-TR')}*\n`;
    state.saatler.forEach(s => {
        let pList = state.personeller.filter(p => state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p.ad}_0`] === s).map(p=>p.ad);
        if(pList.length) text += `\n*${s}:* ${pList.join(", ")}`;
    });
    navigator.clipboard.writeText(text).then(()=>alert("Kopyalandı!"));
}

function verileriYedekle() {
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const a = document.createElement('a'); a.href = data; a.download = "vardiya_yedek.json"; a.click();
}

// BAŞLATMA
window.onload = () => {
    tabloyuOlustur();
    setTimeout(refreshUI, 200);
};