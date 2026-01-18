// --- 1. AYARLAR VE VERİ DURUMU ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

let state = {
    birimler: JSON.parse(localStorage.getItem("v50_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v50_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v50_personeller")) || [], // Personel listesini yönetici ekler
    kapasite: JSON.parse(localStorage.getItem("v50_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v50_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());
let draggedElement = null;

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`v50_${k}`, JSON.stringify(state[k]))); }

// --- 2. SÜRÜKLE BIRAK (DRAG & DROP) MOTORU ---
function handleDragStart(e) {
    draggedElement = e.target;
    e.dataTransfer.setData("pAd", e.target.getAttribute("data-pad"));
    e.dataTransfer.setData("gun", e.target.getAttribute("data-gun"));
    e.dataTransfer.setData("vardiya", e.target.getAttribute("data-vardiya"));
    e.target.style.opacity = "0.5";
}

function handleDragOver(e) { e.preventDefault(); }

function handleDrop(e) {
    e.preventDefault();
    const sourceP = e.dataTransfer.getData("pAd");
    const sourceG = e.dataTransfer.getData("gun");
    const sourceV = e.dataTransfer.getData("vardiya");

    // Hedef bilgileri (Hücreye bırakıldığında)
    let targetCell = e.target.closest("td");
    if (!targetCell) return;

    const targetG = targetCell.cellIndex - 1; 
    const targetV = targetCell.parentElement.querySelector("td").innerText.trim();
    const haftaKey = currentMonday.toISOString().split('T')[0];

    // Manuel atamayı güncelle
    state.manuelAtamalar[`${haftaKey}_${sourceP}_${targetG}`] = targetV;
    
    // Eğer sürüklendiği yer eski bir vardiyaysa orayı temizle veya takas mantığı kur
    save();
    tabloyuOlustur();
    draggedElement.style.opacity = "1";
}

// --- 3. ANA MOTOR VE KURALLAR ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const tarihAraligi = document.getElementById("tarihAraligi");
    if(tarihAraligi) tarihAraligi.innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let calismaSayisi = {};
    let ihlaller = [];

    state.personeller.forEach(p => { 
        program[p.ad] = Array(7).fill(null); 
        calismaSayisi[p.ad] = 0; 
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ"); 
    });

    // Manuel Atamalar
    state.personeller.forEach(p => { 
        for(let i=0; i<7; i++) { 
            let mK = `${haftaKey}_${p.ad}_${i}`; 
            if(state.manuelAtamalar[mK]) { 
                program[p.ad][i] = state.manuelAtamalar[mK]; 
                if(!["İZİNLİ","BOŞALT"].includes(program[p.ad][i])) calismaSayisi[p.ad]++; 
            } 
        } 
    });

    // Teknik Yönetmen Gece Vardiyası (Kural: 00:00 vardiyası rotasyonlu)
    for(let i=0; i<7; i++) { 
        let g = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN"; 
        if(program[g] && program[g][i] === null) { 
            program[g][i] = "00:00–07:00"; 
            calismaSayisi[g]++; 
        } 
    }

    // 11 Saat Dinlenme Kontrolü (Gece'den Sabah'a geçiş yasağı)
    state.personeller.forEach(p => {
        for(let i=1; i<7; i++) {
            if(program[p.ad][i-1] === "00:00–07:00" && (program[p.ad][i] === "06:30–16:00" || program[p.ad][i] === "09:00–18:00")) {
                ihlaller.push(`${p.ad}_${i}`);
            }
        }
    });

    render(program, ihlaller);
}

// --- 4. GÖRSELLEŞTİRME VE DASHBOARD ---
function render(program, ihlaller) {
    const body = document.getElementById("tableBody");
    if(!body) return;

    body.innerHTML = state.saatler.map(s => `
        <tr ondragover="handleDragOver(event)" ondrop="handleDrop(event)">
            <td><strong>${s}</strong></td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td data-gun="${i}" data-vardiya="${s}">
                    ${state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                        const ihlalMi = ihlaller.includes(`${p.ad}_${i}`);
                        return `
                            <div class="birim-card" draggable="true" 
                                 ondragstart="handleDragStart(event)"
                                 data-pad="${p.ad}" data-gun="${i}" data-vardiya="${s}"
                                 onclick="vardiyaDegistir('${p.ad}', ${i})"
                                 style="border-left:5px solid ${UNIT_COLORS[p.birim]}; ${ihlalMi ? 'background:#ffebee; border:2px solid red;' : ''}">
                                <span class="birim-tag" style="background:${UNIT_COLORS[p.birim]}">${p.birim}</span>
                                ${ihlalMi ? '⚠️ ' : ''}${p.ad}
                            </div>`;
                    }).join('')}
                </td>`).join('')}
        </tr>`).join('');
}

function refreshUI() {
    // Personel Listesi
    const pList = document.getElementById("persListesiAdmin");
    if(pList) pList.innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    
    // Birim Seçimi
    const bSec = document.getElementById("yeniPersBirimSec");
    if(bSec) bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');

    // Sistem Ayarları (WhatsApp, Yedekleme vb.)
    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div class="system-tools">
                <div style="display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap;">
                    <button onclick="whatsappKopyala()" style="background:#25D366; color:white;">🟢 WP KOPYALA</button>
                    <button onclick="verileriYedekle()" style="background:#6c757d; color:white;">💾 YEDEKLE (JSON)</button>
                    <button onclick="sifirla()" class="btn-warning">🔄 TABLOYU SIFIRLA</button>
                </div>
                <hr>
                <h4>Birim Tanımları</h4>
                <div class="admin-input-group"><input id="yInpB" placeholder="Yeni Birim..."><button onclick="birimEkle()">EKLE</button></div>
                <div class="list-container">${state.birimler.map((b,i) => `<div class="admin-list-item">${b} <button onclick="sil('birimler',${i})">SİL</button></div>`).join('')}</div>
                <hr>
                <h4>Saat Tanımları</h4>
                <div class="admin-input-group"><input id="yInpS" placeholder="06:30–16:00"><button onclick="saatEkle()">EKLE</button></div>
                <div class="list-container">${state.saatler.map((s,i) => `<div class="admin-list-item">${s} <button onclick="sil('saatler',${i})">SİL</button></div>`).join('')}</div>
            </div>`;
    }
    checklistOlustur();
    kapasiteCiz();
}

function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable");
    if(!kTab) return;
    let h = `<div class="cap-table-header"><div>Birim / Saat</div>${state.saatler.map(s => `<div>${s}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        h += `<div class="cap-row"><strong>${b}</strong>${state.saatler.map(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            return `<div class="cap-input-pair">
                <input type="number" title="Hafta İçi" value="${v.h}" onchange="capSave('${k}','h',this.value)">
                <input type="number" title="Hafta Sonu" style="background:#fff3e0" value="${v.hs}" onchange="capSave('${k}','hs',this.value)">
            </div>`;
        }).join('')}</div>`;
    });
    kTab.innerHTML = h;
}

// --- 5. DİĞER FONKSİYONLAR ---
function toggleAdminPanel() {
    const panel = document.getElementById("adminPanel");
    if (panel.classList.contains("hidden")) {
        const pass = prompt("Yönetici Şifresini Girin:");
        if (pass === ADMIN_PASSWORD) { panel.classList.remove("hidden"); refreshUI(); } 
        else { alert("Hatalı Şifre!"); }
    } else { panel.classList.add("hidden"); }
}

function vardiyaDegistir(p, i) {
    let s = prompt(`${p} için yeni vardiya (Örn: 16:00–00:00 veya İZİNLİ):`);
    if(s) {
        state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p}_${i}`] = s;
        save(); tabloyuOlustur();
    }
}

function checklistOlustur() {
    const box = document.getElementById("personelChecklist");
    if(box) box.innerHTML = state.personeller.map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join('');
}

function personelEkle() { 
    let ad = document.getElementById("yeniPersInp").value.toUpperCase(); 
    let b = document.getElementById("yeniPersBirimSec").value;
    if(ad) { state.personeller.push({ad, birim:b, id:Date.now()}); save(); refreshUI(); tabloyuOlustur(); }
}

function capSave(k, t, v) { if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0}; state.kapasite[k][t] = parseInt(v) || 0; save(); tabloyuOlustur(); }
function birimEkle() { let v = document.getElementById("yInpB").value.toUpperCase(); if(v){ state.birimler.push(v); save(); refreshUI(); } }
function saatEkle() { let v = document.getElementById("yInpS").value; if(v){ state.saatler.push(v); save(); refreshUI(); tabloyuOlustur(); } }
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + (v*7)); tabloyuOlustur(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }
function sifirla() { if(confirm("Tüm manuel değişimler silinecek. Emin misiniz?")) { state.manuelAtamalar = {}; save(); tabloyuOlustur(); } }
function verileriYedekle() { const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state)); const dl = document.createElement('a'); dl.setAttribute("href", dataStr); dl.setAttribute("download", "vardiya_yedek.json"); dl.click(); }

window.onload = () => { 
    tabloyuOlustur(); 
    refreshUI(); 
};