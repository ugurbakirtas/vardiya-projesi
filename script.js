// --- 1. PERSONEL VERİSİ VE AYARLAR ---
const ADMIN_PASSWORD = "admin123";
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

const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };
const SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNITS = Object.keys(UNIT_COLORS);

let state = {
    personeller: JSON.parse(localStorage.getItem("vV_pers")) || INITIAL_STAFF,
    kapasite: JSON.parse(localStorage.getItem("vV_cap")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("vV_man")) || {}
};

let currentMonday = getMonday(new Date());

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { localStorage.setItem("vV_pers", JSON.stringify(state.personeller)); localStorage.setItem("vV_cap", JSON.stringify(state.kapasite)); localStorage.setItem("vV_man", JSON.stringify(state.manuelAtamalar)); }

// --- 2. ANA TABLO MOTORU ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const tarihLabel = document.getElementById("tarihAraligi");
    if (tarihLabel) tarihLabel.innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    const body = document.getElementById("tableBody");
    if(!body) return;

    body.innerHTML = SHIFTS.map(s => `
        <tr>
            <td style="background:#2c3e50; color:white; font-weight:bold; width:120px; text-align:center; padding:10px;">${s}</td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td ondragover="event.preventDefault()" ondrop="handleDrop(event, '${s}', ${i})" style="background:${i>4?'#fcf3cf':'#fff'}; border:1px solid #eee; vertical-align:top; height:80px;">
                    ${state.personeller.filter(p => state.manuelAtamalar[`${haftaKey}_${p.ad}_${i}`] === s).map(p => `
                        <div class="birim-card" draggable="true" ondragstart="handleDragStart(event, '${p.ad}', ${i})" onclick="manuelGiris('${p.ad}', ${i})"
                             style="border-left:5px solid ${UNIT_COLORS[p.birim]}; padding:5px; margin:3px; font-size:10px; border-radius:4px; background:white; box-shadow:0 2px 4px rgba(0,0,0,0.1); cursor:grab;">
                            <strong style="color:${UNIT_COLORS[p.birim]}">${p.birim}</strong><br>${p.ad}
                        </div>
                    `).join('')}
                </td>`).join('')}
        </tr>`).join('');
}

// --- 3. KAPASİTE VE OTOMATİK OLUŞTURMA ---
function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable");
    if(!kTab) return;
    let html = `<div style="display:grid; grid-template-columns: 150px repeat(${SHIFTS.length}, 1fr); background:#34495e; color:white; padding:10px; font-size:11px;"><div>Birim / Saat</div>${SHIFTS.map(s => `<div>${s}</div>`).join('')}</div>`;
    
    UNITS.forEach(b => {
        html += `<div style="display:grid; grid-template-columns: 150px repeat(${SHIFTS.length}, 1fr); border-bottom:1px solid #ddd; padding:8px; align-items:center;"><strong>${b}</strong>${SHIFTS.map(s => {
            let k = `${b}_${s}`; 
            let v = state.kapasite[k] || {h:0, hs:0};
            return `<div style="display:flex; gap:2px;"><input type="number" value="${v.h}" onchange="capSave('${k}','h',this.value)" style="width:30px; border:1px solid #ccc;" title="H.İçi"></div>`;
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
    state.manuelAtamalar = {}; // Temizle

    // 1. Teknik Yönetmen Gece Vardiyası Sabit Kurallar
    for(let i=0; i<7; i++) {
        let sorumlular = ["BARIŞ İNCE", "EKREM FİDAN"];
        let geceSorumlusu = (i < 2) ? sorumlular[0] : sorumlular[1];
        state.manuelAtamalar[`${haftaKey}_${geceSorumlusu}_${i}`] = "00:00–07:00"; //
    }

    // 2. Kapasiteye Göre Otomatik Dağıtım
    UNITS.forEach(birim => {
        let personeller = state.personeller.filter(p => p.birim === birim);
        for(let gun=0; gun<7; gun++) {
            SHIFTS.forEach(saat => {
                let hedef = state.kapasite[`${birim}_${saat}`]?.h || 0;
                let atananCount = personeller.filter(p => state.manuelAtamalar[`${haftaKey}_${p.ad}_${gun}`] === saat).length;
                
                while(atananCount < hedef) {
                    let musait = personeller.find(p => !state.manuelAtamalar[`${haftaKey}_${p.ad}_${gun}`]);
                    if(!musait) break;
                    state.manuelAtamalar[`${haftaKey}_${musait.ad}_${gun}`] = saat;
                    atananCount++;
                }
            });
        }
    });

    save();
    tabloyuOlustur();
    alert("Vardiya kapasiteye göre başarıyla oluşturuldu!");
}

// --- 4. ARAÇLAR ---
let draggedData = null;
function handleDragStart(e, pAd, gun) { draggedData = { pAd, gun }; }
function handleDrop(e, vardiya, gun) {
    e.preventDefault();
    if (!draggedData) return;
    state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${draggedData.pAd}_${gun}`] = vardiya;
    save(); tabloyuOlustur();
}

function manuelGiris(p, i) {
    let s = prompt(`${p} için saat (Örn: 09:00–18:00, İZİNLİ) veya silmek için boş bırakın:`);
    if(s !== null) {
        const k = `${currentMonday.toISOString().split('T')[0]}_${p}_${i}`;
        if(s === "") delete state.manuelAtamalar[k];
        else state.manuelAtamalar[k] = s;
        save(); tabloyuOlustur();
    }
}

function toggleAdminPanel() { 
    const p = document.getElementById("adminPanel"); 
    if(p && p.classList.contains("hidden")){ 
        if(prompt("Şifre:") === ADMIN_PASSWORD){ p.classList.remove("hidden"); refreshUI(); } 
    } else if(p) { p.classList.add("hidden"); } 
}

function refreshUI() {
    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                <button onclick="vardiyaOlustur()" style="background:#e67e22; color:white; width:100%; padding:15px; font-size:16px; border:none; border-radius:5px; cursor:pointer; margin-bottom:20px;">⚡ VARDİYA OLUŞTUR (KAPASİTEYE GÖRE)</button>
                <div style="display:flex; gap:10px;">
                    <button onclick="sifirla()" style="background:#c0392b; color:white; flex:1; padding:10px; border:none; border-radius:5px;">Sıfırla</button>
                    <button onclick="tabloyuOlustur()" style="background:#2c3e50; color:white; flex:1; padding:10px; border:none; border-radius:5px;">Yenile</button>
                </div>
            </div>`;
    }
    kapasiteCiz();
}

function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + (v*7)); tabloyuOlustur(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }
function sifirla() { if(confirm("Tüm tabloyu temizlemek istediğine emin misin?")) { state.manuelAtamalar = {}; save(); tabloyuOlustur(); } }

// Başlatıcı
document.addEventListener("DOMContentLoaded", () => {
    tabloyuOlustur();
    setTimeout(refreshUI, 500);
});