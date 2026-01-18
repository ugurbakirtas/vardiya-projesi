// --- 1. AYARLAR VE VERİ DURUMU ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

let state = {
    birimler: JSON.parse(localStorage.getItem("v45_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v45_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v45_personeller")) || [],
    kapasite: JSON.parse(localStorage.getItem("v45_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v45_manuelAtamalar")) || {}
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`v45_${k}`, JSON.stringify(state[k]))); }

// --- 2. GÜVENLİK VE WHATSAPP ---
function toggleAdminPanel() {
    const panel = document.getElementById("adminPanel");
    if (panel.classList.contains("hidden")) {
        const pass = prompt("Yönetici Şifresini Girin:");
        if (pass === ADMIN_PASSWORD) { panel.classList.remove("hidden"); refreshUI(); } 
        else { alert("Hatalı Şifre!"); }
    } else { panel.classList.add("hidden"); }
}

function whatsappKopyala() {
    let metin = `*${currentMonday.toLocaleDateString('tr-TR')} Haftası Vardiyası*\n\n`;
    state.saatler.forEach(s => {
        let kisiler = state.personeller.filter(p => {
            let mK = `${currentMonday.toISOString().split('T')[0]}_${p.ad}_0`; // Örnek: Pazartesi
            return state.manuelAtamalar[mK] === s;
        }).map(p => p.ad);
        if(kisiler.length > 0) metin += `*${s}*: ${kisiler.join(", ")}\n`;
    });
    navigator.clipboard.writeText(metin).then(() => alert("Vardiya kopyalandı!"));
}

// --- 3. MESİ ANALİZİ (DASHBOARD) ---
function dashboardCiz(program, calismaSayisi) {
    const dash = document.getElementById("tab-analiz");
    if(!dash) return;

    let html = `<h4>📊 Haftalık Mesai Analizi (${currentMonday.toLocaleDateString()})</h4>`;
    html += `<table class="dash-table">
                <thead>
                    <tr>
                        <th>Personel</th>
                        <th>Birim</th>
                        <th>Çalışma</th>
                        <th>İzinli/Boş</th>
                        <th>Yük (%)</th>
                    </tr>
                </thead>
                <tbody>`;

    state.personeller.sort((a,b) => a.birim.localeCompare(b.birim)).forEach(p => {
        let calis = calismaSayisi[p.ad] || 0;
        let bos = 7 - calis;
        let yuzde = Math.round((calis / 5) * 100);
        let renk = yuzde > 100 ? "#e74c3c" : (yuzde === 100 ? "#27ae60" : "#3498db");

        html += `<tr>
                    <td><b>${p.ad}</b></td>
                    <td><small>${p.birim}</small></td>
                    <td>${calis} Gün</td>
                    <td>${bos} Gün</td>
                    <td><div class="progress-bar"><div style="width:${Math.min(yuzde, 100)}%; background:${renk}"></div></div> ${yuzde}%</td>
                 </tr>`;
    });

    html += `</tbody></table>`;
    dash.innerHTML = html;
}

// --- 4. ANA MOTOR ---
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
    
    // Teknik Yönetmen Gece Vardiyası (Kurala Uygun)
    for(let i=0; i<7; i++) { 
        let g = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN"; 
        if(program[g] && program[g][i] === null) { program[g][i] = "00:00–07:00"; calismaSayisi[g]++; } 
    }

    // Kapasite Dağıtımı ve Smart Alert
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
    dashboardCiz(program, calismaSayisi);
}

// --- 5. YÖNETİM VE KAPASİTE ---
function refreshUI() {
    const pList = document.getElementById("persListesiAdmin");
    if(pList) pList.innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    
    const bSec = document.getElementById("yeniPersBirimSec");
    if(bSec) bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');

    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `
            <div class="system-tools">
                <div style="display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap;">
                    <button onclick="whatsappKopyala()" style="background:#25D366; color:white;">🟢 WP KOPYALA</button>
                    <button onclick="sifirla()" class="btn-warning">🔄 TABLOYU SIFIRLA</button>
                    <button onclick="pdfIndir()" class="btn-pdf">📄 PDF ÇIKTISI</button>
                    <button onclick="verileriYedekle()" style="background:#6c757d; color:white;">💾 YEDEKLE (JSON)</button>
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

function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable"); if(!kTab) return;
    let h = `<div class="cap-table-header"><div>Birim / Saat</div>${state.saatler.map(s => `<div>${s}<br><small>(H.İçi | <span style="color:#e67e22">H.Sonu</span>)</small></div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        h += `<div class="cap-row"><strong>${b}</strong>${state.saatler.map(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            return `<div class="cap-input-pair">
                <input type="number" title="Hafta İçi" value="${v.h}" onchange="capSave('${k}','h',this.value)">
                <input type="number" title="Hafta Sonu" class="hs-input" style="background:#fff3e0; border:1px solid #ffcc80;" value="${v.hs}" onchange="capSave('${k}','hs',this.value)">
            </div>`;
        }).join('')}</div>`;
    });
    kTab.innerHTML = h;
}

// --- 6. YARDIMCI FONKSİYONLAR ---
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

function sifirla() { if(confirm("Tüm manuel müdahaleler temizlenecek. Ayarlarınız korunacak. Emin misiniz?")) { state.manuelAtamalar = {}; save(); tabloyuOlustur(); } }
function uyariPaneliniGuncelle(uyarilar) {
    const p = document.getElementById("alertPanel"); if(!p) return;
    p.innerHTML = uyarilar.length > 0 ? `⚠️ <b>Eksik:</b> ${[...new Set(uyarilar)].slice(0,2).join(", ")}...` : "✅ Planlama Tamam";
    p.className = uyarilar.length > 0 ? "alert-danger" : "alert-success";
}

function render(program, calismaSayisi) {
    const body = document.getElementById("tableBody"); if(!body) return;
    body.innerHTML = state.saatler.map(s => `<tr><td><strong>${s}</strong></td>${[0,1,2,3,4,5,6].map(i => `<td>${state.personeller.filter(p => program[p.ad][i] === s).map(p => `<div class="birim-card" onclick="vardiyaDegistir('${p.ad}',${i})" style="border-left:5px solid ${UNIT_COLORS[p.birim]}"><span class="birim-tag" style="background:${UNIT_COLORS[p.birim]}">${p.birim}</span>${p.ad}</div>`).join('')}</td>`).join('')}</tr>`).join('');
    
    const foot = document.getElementById("tableFooter");
    foot.innerHTML = `<tr><td><strong>İZİNLİ/YEDEK</strong></td>${[0,1,2,3,4,5,6].map(i => `<td>${state.personeller.filter(p => ["İZİNLİ",null].includes(program[p.ad][i])).map(p => `<div class="birim-card izinli-kart" onclick="vardiyaDegistir('${p.ad}',${i})">${p.ad}</div>`).join('')}</td>`).join('')}</tr>`;
}

function verileriYedekle() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const dl = document.createElement('a'); dl.setAttribute("href", dataStr); dl.setAttribute("download", "vardiya_ayarlar.json"); dl.click();
}

function pdfIndir() { const el = document.getElementById('mainTableContainer'); if(el) html2pdf().from(el).set({margin:1, filename:'vardiya.pdf', jsPDF:{orientation:'landscape'}}).save(); }
function checklistOlustur() { const box = document.getElementById("personelChecklist"); if(box) box.innerHTML = state.personeller.map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join(''); }
function capSave(k, t, v) { if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0}; state.kapasite[k][t] = parseInt(v) || 0; save(); tabloyuOlustur(); }
function birimEkle() { let v = document.getElementById("yInpB").value.toUpperCase(); if(v){ state.birimler.push(v); save(); refreshUI(); } }
function saatEkle() { let v = document.getElementById("yInpS").value; if(v){ state.saatler.push(v); save(); refreshUI(); tabloyuOlustur(); } }
function personelEkle() { let ad = document.getElementById("yeniPersInp").value.toUpperCase(); let b = document.getElementById("yeniPersBirimSec").value; if(ad){ state.personeller.push({ad, birim:b, id:Date.now()}); save(); refreshUI(); tabloyuOlustur(); } }
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + (v*7)); tabloyuOlustur(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }

window.onload = () => { tabloyuOlustur(); };