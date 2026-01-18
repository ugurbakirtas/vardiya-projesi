// --- 1. AYARLAR VE VERİ ---
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

// --- 2. ANA FONKSİYONLAR ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    // Header oluştur (Günler)
    const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    document.getElementById("tableHeader").innerHTML = `<tr><th>Saat</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr>`;

    let program = {};
    let calismaSayisi = {};

    state.personeller.forEach(p => { 
        program[p.ad] = Array(7).fill(null); 
        calismaSayisi[p.ad] = 0; 
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ"); 
    });

    // 1. Manuel Atamaları Yerleştir
    state.personeller.forEach(p => { 
        for(let i=0; i<7; i++) { 
            let mK = `${haftaKey}_${p.ad}_${i}`; 
            if(state.manuelAtamalar[mK]) { 
                program[p.ad][i] = state.manuelAtamalar[mK]; 
                if(!["İZİNLİ","BOŞALT"].includes(program[p.ad][i])) calismaSayisi[p.ad]++; 
            } 
        } 
    });

    // 2. Teknik Yönetmen Özel Gece Rotasyonu (Barış & Ekrem)
    for(let i=0; i<7; i++) {
        let geceSorumlusu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if (program[geceSorumlusu] && program[geceSorumlusu][i] === null) {
            program[geceSorumlusu][i] = "00:00–07:00";
            calismaSayisi[geceSorumlusu]++;
        }
    }

    // 3. Kapasiteye Göre Otomatik Dağıtım
    for(let i=0; i<7; i++) {
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let k = `${birim}_${saat}`;
                let hedef = state.kapasite[k] ? ((i >= 5) ? state.kapasite[k].hs : state.kapasite[k].h) : 0;
                
                // Mevcut çalışan sayısını say
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                
                if(mevcut < hedef) {
                    let adaylar = state.personeller.filter(p => 
                        p.birim === birim && 
                        program[p.ad][i] === null && 
                        calismaSayisi[p.ad] < 5
                    ).sort((a,b) => calismaSayisi[a.ad] - calismaSayisi[b.ad]);

                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) {
                        // Teknik Yönetmen Gece Vardiyası Kısıtı
                        if(birim === "TEKNİK YÖNETMEN" && saat === "00:00–07:00") continue; 
                        
                        program[adaylar[j].ad][i] = saat;
                        calismaSayisi[adaylar[j].ad]++;
                    }
                }
            });
        });
    }

    render(program);
}

function render(program) {
    const body = document.getElementById("tableBody");
    body.innerHTML = state.saatler.map(s => `
        <tr>
            <td><strong>${s}</strong></td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td>
                    ${state.personeller.filter(p => program[p.ad][i] === s).map(p => `
                        <div class="birim-card" onclick="vardiyaDegistir('${p.ad}',${i})" style="border-left:5px solid ${UNIT_COLORS[p.birim] || '#ccc'}">
                            <span class="birim-tag" style="color:${UNIT_COLORS[p.birim]}">${p.birim}</span>
                            ${p.ad}
                        </div>
                    `).join('')}
                </td>
            `).join('')}
        </tr>
    `).join('');

    const foot = document.getElementById("tableFooter");
    foot.innerHTML = `
        <tr class="izinli-satiri">
            <td><strong>İZİNLİ/YEDEK</strong></td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td>
                    ${state.personeller.filter(p => ["İZİNLİ", null].includes(program[p.ad][i])).map(p => `
                        <div class="birim-card izinli-kart" onclick="vardiyaDegistir('${p.ad}',${i})">${p.ad}</div>
                    `).join('')}
                </td>
            `).join('')}
        </tr>`;
}

// --- 3. YÖNETİM VE ETKİLEŞİM ---
function vardiyaDegistir(p, i) {
    const sirali = [...state.saatler];
    let m = `${p} için Vardiya Seç:\n` + sirali.map((s, idx) => `${idx + 1}- ${s}`).join("\n") + "\n\n(Veya İZİNLİ / BOŞALT)";
    let s = prompt(m);
    if(s) {
        let res = s.toUpperCase();
        if(!isNaN(s) && sirali[parseInt(s)-1]) res = sirali[parseInt(s)-1];
        state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p}_${i}`] = res;
        save(); tabloyuOlustur();
    }
}

function personelEkle() {
    let ad = document.getElementById("yeniPersInp").value.toUpperCase();
    let b = document.getElementById("yeniPersBirimSec").value;
    if(ad) { state.personeller.push({ad, birim:b, id:Date.now()}); save(); refreshUI(); tabloyuOlustur(); }
}

function refreshUI() {
    const pList = document.getElementById("persListesiAdmin");
    if(pList) pList.innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    
    const bSec = document.getElementById("yeniPersBirimSec");
    if(bSec) bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');

    checklistOlustur();
    kapasiteCiz();
}

function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable");
    let h = `<div class="cap-table-header"><div>Birim</div>${state.saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        h += `<div class="cap-row"><div><strong>${b}</strong></div>${state.saatler.map(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            return `<div>H:<input type="number" value="${v.h}" onchange="capSave('${k}','h',this.value)" style="width:25px"> S:<input type="number" value="${v.hs}" onchange="capSave('${k}','hs',this.value)" style="width:25px"></div>`;
        }).join('')}</div>`;
    });
    kTab.innerHTML = h;
}

function capSave(k, t, v) { if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0}; state.kapasite[k][t] = parseInt(v) || 0; save(); }
function checklistOlustur() {
    const box = document.getElementById("personelChecklist");
    if(box) box.innerHTML = state.personeller.map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join('');
}

function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); refreshUI(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }
function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + v); tabloyuOlustur(); }
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function sifirla() { if(confirm("Tüm veriler silinecek?")) { localStorage.clear(); location.reload(); } }

window.onload = () => { 
    if(state.personeller.length === 0) {
        state.personeller = [
            {ad: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN", id: 1}, {ad: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN", id: 2},
            {ad: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN", id: 3}, {ad: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ", id: 4}
        ];
        save();
    }
    tabloyuOlustur(); 
};