// --- 1. AYARLAR VE VERİ YAPISI ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

let state = {
    birimler: JSON.parse(localStorage.getItem("v55_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v55_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v55_personeller")) || [],
    kapasite: JSON.parse(localStorage.getItem("v55_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v55_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());
let draggedData = null;

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`v55_${k}`, JSON.stringify(state[k]))); }

// --- 2. SÜRÜKLE BIRAK MOTORU ---
function handleDragStart(e, pAd, gunIdx) {
    draggedData = { pAd, gunIdx };
    e.target.style.opacity = "0.4";
}

function handleDragEnd(e) { e.target.style.opacity = "1"; }

function handleDragOver(e) { e.preventDefault(); }

function handleDrop(e, targetVardiya, targetGun) {
    e.preventDefault();
    if (!draggedData) return;

    const haftaKey = currentMonday.toISOString().split('T')[0];
    // Sürüklenen personelin yeni yerini manuel atamalara kaydet
    state.manuelAtamalar[`${haftaKey}_${draggedData.pAd}_${targetGun}`] = targetVardiya;
    
    save();
    tabloyuOlustur();
    draggedData = null;
}

// --- 3. ANA MOTOR VE KURALLAR ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    const tarihLabel = document.getElementById("tarihAraligi");
    if (tarihLabel) tarihLabel.innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let calismaSayisi = {};
    let ihlaller = [];

    // Personel Hazırlığı
    state.personeller.forEach(p => { 
        program[p.ad] = Array(7).fill(null); 
        calismaSayisi[p.ad] = 0; 
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ"); 
    });

    // Manuel Atamalar (Sürükle bırak dahil)
    state.personeller.forEach(p => { 
        for(let i=0; i<7; i++) { 
            let mK = `${haftaKey}_${p.ad}_${i}`; 
            if(state.manuelAtamalar[mK]) { 
                program[p.ad][i] = state.manuelAtamalar[mK]; 
                if(!["İZİNLİ","BOŞALT"].includes(program[p.ad][i])) calismaSayisi[p.ad]++; 
            } 
        } 
    });

    // Teknik Yönetmen Rotasyon Kuralı
    for(let i=0; i<7; i++) { 
        let g = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN"; 
        if(program[g] && program[g][i] === null) { 
            program[g][i] = "00:00–07:00"; 
            calismaSayisi[g]++; 
        } 
    }

    // 11 Saat Dinlenme Kontrolü (Gece'den Sabah'a)
    state.personeller.forEach(p => {
        for(let i=1; i<7; i++) {
            if(program[p.ad][i-1] === "00:00–07:00" && (program[p.ad][i] === "06:30–16:00" || program[p.ad][i] === "09:00–18:00")) {
                ihlaller.push(`${p.ad}_${i}`);
            }
        }
    });

    render(program, ihlaller);
}

// --- 4. GÖRSELLEŞTİRME ---
function render(program, ihlaller) {
    const body = document.getElementById("tableBody");
    if(!body) return;

    body.innerHTML = state.saatler.map(s => `
        <tr>
            <td class="shift-label"><strong>${s}</strong></td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td ondragover="handleDragOver(event)" ondrop="handleDrop(event, '${s}', ${i})">
                    ${state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                        const ihlalMi = ihlaller.includes(`${p.ad}_${i}`);
                        return `
                            <div class="birim-card" draggable="true" 
                                 ondragstart="handleDragStart(event, '${p.ad}', ${i})"
                                 ondragend="handleDragEnd(event)"
                                 onclick="vardiyaMenu('${p.ad}', ${i})"
                                 style="border-left:5px solid ${UNIT_COLORS[p.birim]}; ${ihlalMi ? 'background:#ffebee; border:2px solid red;' : ''}">
                                <span class="birim-tag" style="background:${UNIT_COLORS[p.birim]}">${p.birim}</span>
                                ${ihlalMi ? '⚠️ ' : ''}${p.ad}
                            </div>`;
                    }).join('')}
                </td>`).join('')}
        </tr>`).join('');
    
    dashboardGuncelle(program);
}

// --- 5. YÖNETİM PANELİ VE SİSTEM ---
function refreshUI() {
    // Personel Listesi
    const pList = document.getElementById("persListesiAdmin");
    if(pList) pList.innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    
    // Birim Seçenekleri
    const bSec = document.getElementById("yeniPersBirimSec");
    if(bSec) bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');

    // Sistem Sekmesi İçeriği
    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div class="system-tools">
                <div class="action-bar">
                    <button onclick="whatsappKopyala()" class="btn-wp">🟢 WP KOPYALA</button>
                    <button onclick="verileriYedekle()" class="btn-sec">💾 YEDEKLE</button>
                    <button onclick="sifirla()" class="btn-warn">🔄 SIFIRLA</button>
                </div>
                <div class="grid-config">
                    <div>
                        <h4>Birimler</h4>
                        <div class="input-group"><input id="yInpB" placeholder="Birim Adı..."><button onclick="birimEkle()">+</button></div>
                        <div class="mini-list">${state.birimler.map((b,i)=>`<div>${b} <span onclick="sil('birimler',${i})">×</span></div>`).join('')}</div>
                    </div>
                    <div>
                        <h4>Vardiya Saatleri</h4>
                        <div class="input-group"><input id="yInpS" placeholder="00:00-00:00"><button onclick="saatEkle()">+</button></div>
                        <div class="mini-list">${state.saatler.map((s,i)=>`<div>${s} <span onclick="sil('saatler',${i})">×</span></div>`).join('')}</div>
                    </div>
                </div>
            </div>`;
    }
    checklistOlustur();
    kapasiteCiz();
}

// --- 6. YARDIMCI ARAÇLAR ---
function vardiyaMenu(p, i) {
    let s = prompt(`${p} için manuel vardiya girin (Örn: 09:00–18:00, İZİNLİ, BOŞALT):`);
    if(s !== null) {
        state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p}_${i}`] = s;
        save(); tabloyuOlustur();
    }
}

function dashboardGuncelle(program) {
    const dash = document.getElementById("tab-analiz");
    if(!dash) return;
    let html = `<h4>📊 Haftalık Doluluk</h4><table class="dash-table"><tr><th>Birim</th><th>Çalışan Sayısı</th></tr>`;
    state.birimler.forEach(b => {
        let count = state.personeller.filter(p => p.birim === b).length;
        html += `<tr><td>${b}</td><td>${count} Personel</td></tr>`;
    });
    dash.innerHTML = html + `</table>`;
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
function toggleAdminPanel() { const p = document.getElementById("adminPanel"); if(p.classList.contains("hidden")){ if(prompt("Şifre:")===ADMIN_PASSWORD){ p.classList.remove("hidden"); refreshUI(); } } else p.classList.add("hidden"); }
function checklistOlustur() { const b = document.getElementById("personelChecklist"); if(b) b.innerHTML = state.personeller.map(p=>`<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join(''); }
function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable"); if(!kTab) return;
    let h = `<div class="cap-header"><div>Birim / Saat</div>${state.saatler.map(s => `<div>${s}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        h += `<div class="cap-row"><strong>${b}</strong>${state.saatler.map(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            return `<div class="cap-inputs"><input type="number" value="${v.h}" onchange="capSave('${k}','h',this.value)"><input type="number" class="hs-input" value="${v.hs}" onchange="capSave('${k}','hs',this.value)"></div>`;
        }).join('')}</div>`;
    });
    kTab.innerHTML = h;
}
function sifirla() { if(confirm("Tüm manuel atamalar silinecek?")) { state.manuelAtamalar = {}; save(); tabloyuOlustur(); } }
function verileriYedekle() { const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state)); const a = document.createElement('a'); a.href = data; a.download = "yedek.json"; a.click(); }
function whatsappKopyala() {
    let text = `*Vardiya: ${currentMonday.toLocaleDateString()}*\n`;
    state.saatler.forEach(s => {
        let pList = state.personeller.filter(p => state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p.ad}_0`] === s).map(p=>p.ad);
        if(pList.length) text += `\n*${s}:* ${pList.join(", ")}`;
    });
    navigator.clipboard.writeText(text).then(()=>alert("Kopyalandı!"));
}

window.onload = () => { 
    tabloyuOlustur(); 
    refreshUI(); 
};