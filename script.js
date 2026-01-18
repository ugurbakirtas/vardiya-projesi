// --- 1. AYARLAR VE VERİ YAPISI ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

let state = {
    birimler: JSON.parse(localStorage.getItem("v60_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v60_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v60_personeller")) || [],
    kapasite: JSON.parse(localStorage.getItem("v60_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v60_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());
let draggedData = null;

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`v60_${k}`, JSON.stringify(state[k]))); }

// --- 2. SÜRÜKLE BIRAK SİSTEMİ ---
function handleDragStart(e, pAd, sourceGunIdx) {
    draggedData = { pAd, sourceGunIdx };
    e.target.classList.add('dragging');
}

function handleDragOver(e) { e.preventDefault(); }

function handleDrop(e, targetVardiya, targetGunIdx) {
    e.preventDefault();
    if (!draggedData) return;

    const haftaKey = currentMonday.toISOString().split('T')[0];
    // Sürüklenen personeli yeni hücreye ata
    state.manuelAtamalar[`${haftaKey}_${draggedData.pAd}_${targetGunIdx}`] = targetVardiya;
    
    save();
    tabloyuOlustur();
    draggedData = null;
}

// --- 3. ANA MOTOR ---
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

    // 11 Saat Dinlenme Kontrolü
    state.personeller.forEach(p => {
        for(let i=1; i<7; i++) {
            if(program[p.ad][i-1] === "00:00–07:00" && (program[p.ad][i] === "06:30–16:00" || program[p.ad][i] === "09:00–18:00")) {
                ihlaller.push(`${p.ad}_${i}`);
            }
        }
    });

    renderTable(program, ihlaller);
    dashboardGuncelle(program, calismaSayisi);
}

// --- 4. GÖRÜNÜM VE DASHBOARD ---
function renderTable(program, ihlaller) {
    const body = document.getElementById("tableBody");
    if(!body) return;

    body.innerHTML = state.saatler.map(s => `
        <tr>
            <td class="shift-name"><strong>${s}</strong></td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td ondragover="handleDragOver(event)" ondrop="handleDrop(event, '${s}', ${i})">
                    ${state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                        const ihlalMi = ihlaller.includes(`${p.ad}_${i}`);
                        return `
                            <div class="birim-card" draggable="true" 
                                 ondragstart="handleDragStart(event, '${p.ad}', ${i})"
                                 onclick="vardiyaMenu('${p.ad}', ${i})"
                                 style="border-left:5px solid ${UNIT_COLORS[p.birim]}; ${ihlalMi ? 'background:#ffebee; border:2px solid red;' : ''}">
                                <span class="birim-tag" style="background:${UNIT_COLORS[p.birim]}">${p.birim}</span>
                                ${ihlalMi ? '⚠️ ' : ''}${p.ad}
                            </div>`;
                    }).join('')}
                </td>`).join('')}
        </tr>`).join('');
}

function dashboardGuncelle(program, calismaSayisi) {
    const dash = document.getElementById("tab-analiz");
    if(!dash) return;
    let html = `<h4>📊 Haftalık Analiz</h4><table class="dash-table"><thead><tr><th>İsim</th><th>Birim</th><th>Gün</th><th>Yük</th></tr></thead><tbody>`;
    state.personeller.sort((a,b) => a.birim.localeCompare(b.birim)).forEach(p => {
        let gun = calismaSayisi[p.ad] || 0;
        let yuk = Math.round((gun / 5) * 100);
        html += `<tr><td>${p.ad}</td><td>${p.birim}</td><td>${gun}</td><td>%${yuk}</td></tr>`;
    });
    dash.innerHTML = html + `</tbody></table>`;
}

// --- 5. YÖNETİM VE SİSTEM ---
function refreshUI() {
    const pList = document.getElementById("persListesiAdmin");
    if(pList) pList.innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    
    const bSec = document.getElementById("yeniPersBirimSec");
    if(bSec) bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');

    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div class="system-box">
                <div class="action-buttons">
                    <button onclick="whatsappKopyala()" style="background:#25D366">🟢 WP KOPYALA</button>
                    <button onclick="verileriYedekle()" style="background:#555">💾 YEDEKLE</button>
                    <button onclick="sifirla()" style="background:#d35400">🔄 SIFIRLA</button>
                </div>
                <div class="config-grid">
                    <div>
                        <h5>Birim Ekle</h5>
                        <div class="mini-form"><input id="yInpB"><button onclick="birimEkle()">+</button></div>
                        <div class="scroll-list">${state.birimler.map((b,i)=>`<div>${b} <small onclick="sil('birimler',${i})">Sil</small></div>`).join('')}</div>
                    </div>
                    <div>
                        <h5>Saat Ekle</h5>
                        <div class="mini-form"><input id="yInpS"><button onclick="saatEkle()">+</button></div>
                        <div class="scroll-list">${state.saatler.map((s,i)=>`<div>${s} <small onclick="sil('saatler',${i})">Sil</small></div>`).join('')}</div>
                    </div>
                </div>
            </div>`;
    }
    checklistOlustur();
    kapasiteCiz();
}

function vardiyaMenu(p, i) {
    let s = prompt(`${p} için vardiya (Örn: 06:30–16:00, İZİNLİ, BOŞALT):`);
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
function checklistOlustur() { const b = document.getElementById("personelChecklist"); if(b) b.innerHTML = state.personeller.map(p=>`<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join(''); }
function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable"); if(!kTab) return;
    let h = `<div class="cap-header"><div>Birim / Saat</div>${state.saatler.map(s => `<div>${s}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        h += `<div class="cap-row"><strong>${b}</strong>${state.saatler.map(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            return `<div class="cap-inputs"><input type="number" title="Hafta İçi" value="${v.h}" onchange="capSave('${k}','h',this.value)"><input type="number" title="Hafta Sonu" style="background:#fff3e0" value="${v.hs}" onchange="capSave('${k}','hs',this.value)"></div>`;
        }).join('')}</div>`;
    });
    kTab.innerHTML = h;
}

function toggleAdminPanel() { 
    const p = document.getElementById("adminPanel"); 
    if(p.classList.contains("hidden")){ 
        if(prompt("Yönetici Şifresi:") === ADMIN_PASSWORD){ 
            p.classList.remove("hidden"); 
            refreshUI(); 
        } 
    } else { p.classList.add("hidden"); } 
}

function whatsappKopyala() {
    let t = `*TEKNİK VARDİYA - ${currentMonday.toLocaleDateString('tr-TR')}*\n`;
    state.saatler.forEach(s => {
        let p = state.personeller.filter(p => state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p.ad}_0`] === s).map(x=>x.ad);
        if(p.length) t += `\n*${s}:* ${p.join(", ")}`;
    });
    navigator.clipboard.writeText(t).then(() => alert("WhatsApp metni kopyalandı!"));
}

function verileriYedekle() {
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const link = document.createElement('a'); link.href = data; link.download = "vardiya_ayarlar.json"; link.click();
}

function sifirla() { if(confirm("Tüm manuel düzenlemeler temizlenecek. Emin misiniz?")) { state.manuelAtamalar = {}; save(); tabloyuOlustur(); } }

// --- SAYFA YÜKLENDİĞİNDE ---
window.addEventListener('DOMContentLoaded', () => {
    tabloyuOlustur();
    // refreshUI sadece admin paneli açıldığında değil, her zaman hazır olmalı
    setTimeout(refreshUI, 100); 
});