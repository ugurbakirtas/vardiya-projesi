// --- 1. AYARLAR VE HAFIZADAKİ TÜM PERSONELLER ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

// Hafızadaki tam personel listesi
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
    birimler: JSON.parse(localStorage.getItem("vFinal_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("vFinal_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("vFinal_personeller")) || INITIAL_STAFF,
    kapasite: JSON.parse(localStorage.getItem("vFinal_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("vFinal_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`vFinal_${k}`, JSON.stringify(state[k]))); }

// --- 2. KAPASİTE VE OTOMATİK OLUŞTURMA MOTORU ---

function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable");
    if(!kTab) return;
    let html = `<div class="cap-header" style="display:grid; grid-template-columns: 150px repeat(${state.saatler.length}, 1fr); background:#eee; padding:5px; font-weight:bold; font-size:11px;"><div>Birim / Saat</div>${state.saatler.map(s => `<div>${s}</div>`).join('')}</div>`;
    
    state.birimler.forEach(b => {
        html += `<div class="cap-row" style="display:grid; grid-template-columns: 150px repeat(${state.saatler.length}, 1fr); border-bottom:1px solid #ddd; padding:5px; align-items:center;"><strong>${b}</strong>${state.saatler.map(s => {
            let k = `${b}_${s}`; 
            let v = state.kapasite[k] || {h:0, hs:0};
            return `<div style="display:flex; gap:2px;"><input type="number" title="H.İçi" value="${v.h}" onchange="capSave('${k}','h',this.value)" style="width:25px;"><input type="number" title="H.Sonu" value="${v.hs}" onchange="capSave('${k}','hs',this.value)" style="width:25px; background:#fff3e0;"></div>`;
        }).join('')}</div>`;
    });
    kTab.innerHTML = html;
}

function capSave(k, type, val) {
    if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0};
    state.kapasite[k][type] = parseInt(val) || 0;
    save();
}

function vardiyaOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    
    // Teknik Yönetmen Gece Vardiyası Rotasyonu
    for(let i=0; i<7; i++) {
        let sorumlular = ["BARIŞ İNCE", "EKREM FİDAN"];
        let geceSorumlusu = (i < 2) ? sorumlular[0] : sorumlular[1];
        state.manuelAtamalar[`${haftaKey}_${geceSorumlusu}_${i}`] = "00:00–07:00";
    }

    // Diğer birimler için kapasiteye göre basit atama
    state.birimler.forEach(birim => {
        let birimPersonelleri = state.personeller.filter(p => p.birim === birim);
        for(let gun=0; gun<7; gun++) {
            state.saatler.forEach(saat => {
                let kKey = `${birim}_${saat}`;
                let hedef = (gun < 5) ? (state.kapasite[kKey]?.h || 0) : (state.kapasite[kKey]?.hs || 0);
                
                let mevcutAtananlar = birimPersonelleri.filter(p => state.manuelAtamalar[`${haftaKey}_${p.ad}_${gun}`] === saat);
                
                if(mevcutAtananlar.length < hedef) {
                    let musait = birimPersonelleri.find(p => !state.manuelAtamalar[`${haftaKey}_${p.ad}_${gun}`]);
                    if(musait) state.manuelAtamalar[`${haftaKey}_${musait.ad}_${gun}`] = saat;
                }
            });
        }
    });

    save();
    tabloyuOlustur();
    alert("Kapasiteye göre temel vardiya oluşturuldu!");
}

// --- 3. ANA TABLO VE UI ---

function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const tarihLabel = document.getElementById("tarihAraligi");
    if (tarihLabel) tarihLabel.innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    const body = document.getElementById("tableBody");
    if(!body) return;

    body.innerHTML = state.saatler.map(s => `
        <tr>
            <td style="background:#2c3e50; color:white; font-weight:bold; width:110px; text-align:center;">${s}</td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td ondragover="event.preventDefault()" ondrop="handleDrop(event, '${s}', ${i})" style="background:${i>4?'#fcf3cf':'#fff'}; vertical-align:top; min-height:80px;">
                    ${state.personeller.filter(p => state.manuelAtamalar[`${haftaKey}_${p.ad}_${i}`] === s).map(p => `
                        <div class="birim-card" draggable="true" ondragstart="handleDragStart(event, '${p.ad}', ${i})" onclick="vardiyaMenu('${p.ad}', ${i})"
                             style="border-left:5px solid ${UNIT_COLORS[p.birim]}; padding:5px; margin:3px; font-size:10px; border-radius:3px; background:white; box-shadow:1px 1px 2px #ddd; cursor:grab;">
                            <b style="color:${UNIT_COLORS[p.birim]}">${p.birim}</b><br>${p.ad}
                        </div>
                    `).join('')}
                </td>`).join('')}
        </tr>`).join('');
}

function refreshUI() {
    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div style="background:#f9f9f9; padding:15px; border-radius:10px; border:1px solid #ddd;">
                <button onclick="vardiyaOlustur()" style="background:#3498db; color:white; width:100%; padding:15px; font-weight:bold; margin-bottom:15px; border:none; border-radius:5px; cursor:pointer;">⚡ KAPASİTEYE GÖRE VARDİYA OLUŞTUR</button>
                <div style="display:flex; gap:10px;">
                    <button onclick="whatsappKopyala()" style="background:#25D366; color:white; flex:1;">🟢 KOPYALA</button>
                    <button onclick="verileriYedekle()" style="background:#555; color:white; flex:1;">💾 YEDEK</button>
                    <button onclick="sifirla()" style="background:#e74c3c; color:white; flex:1;">🔄 SIFIRLA</button>
                </div>
            </div>`;
    }
    checklistOlustur();
    kapasiteCiz();
}

// --- 4. SÜRÜKLE BIRAK VE DİĞERLERİ ---

let draggedData = null;
function handleDragStart(e, pAd, gun) { draggedData = { pAd, gun }; }
function handleDrop(e, vardiya, gun) {
    e.preventDefault();
    if (!draggedData) return;
    state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${draggedData.pAd}_${gun}`] = vardiya;
    save(); tabloyuOlustur();
}

function vardiyaMenu(p, i) {
    let s = prompt(`${p} için vardiya (06:30–16:00, İZİNLİ, vb.):`);
    if(s !== null) {
        if(s === "") delete state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p}_${i}`];
        else state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p}_${i}`] = s;
        save(); tabloyuOlustur();
    }
}

function checklistOlustur() {
    const box = document.getElementById("personelChecklist");
    if(box) box.innerHTML = state.personeller.map(p => `<div style="display:inline-block; margin-right:10px;"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> <small>${p.ad}</small></div>`).join('');
}

function toggleAdminPanel() { 
    const p = document.getElementById("adminPanel"); 
    if(p && p.classList.contains("hidden")){ 
        if(prompt("Şifre:") === ADMIN_PASSWORD){ p.classList.remove("hidden"); refreshUI(); } 
    } else if(p) { p.classList.add("hidden"); } 
}

function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + (v*7)); tabloyuOlustur(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }
function sifirla() { if(confirm("Emin misiniz?")) { state.manuelAtamalar = {}; save(); tabloyuOlustur(); } }

window.onload = () => { 
    tabloyuOlustur(); 
    setTimeout(refreshUI, 300); 
};