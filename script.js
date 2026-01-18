// --- VERİ HAVUZU VE DURUM ---
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let state = {
    birimler: JSON.parse(localStorage.getItem("v26_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v26_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v26_personeller")) || [],
    sabitAtamalar: JSON.parse(localStorage.getItem("v26_sabitAtamalar")) || [],
    kapasite: JSON.parse(localStorage.getItem("v26_kapasite")) || {}
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { localStorage.setItem("v26_birimler", JSON.stringify(state.birimler)); localStorage.setItem("v26_saatler", JSON.stringify(state.saatler)); localStorage.setItem("v26_personeller", JSON.stringify(state.personeller)); localStorage.setItem("v26_sabitAtamalar", JSON.stringify(state.sabitAtamalar)); localStorage.setItem("v26_kapasite", JSON.stringify(state.kapasite)); }

// --- VARDIYA OLUŞTURMA MOTORU (ROTASYONLU) ---
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    let program = {};
    let calismaPuani = {}; // Her personelin o haftaki toplam çalışma gününü tutar

    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        calismaPuani[p.ad] = 0;
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ");
    });

    // 1. ADIM: Sabit Atamaları Yerleştir
    state.sabitAtamalar.forEach(a => {
        if(program[a.p]) {
            if(a.g === "pzt_cum") {
                for(let i=0; i<5; i++) { if(program[a.p][i] !== "İZİNLİ") { program[a.p][i] = a.s; calismaPuani[a.p]++; } }
                program[a.p][5] = program[a.p][6] = "İZİNLİ";
            } else {
                let g = parseInt(a.g);
                if(program[a.p][g] !== "İZİNLİ") { program[a.p][g] = a.s; calismaPuani[a.p]++; }
            }
        }
    });

    // 2. ADIM: Teknik Yönetmen Gece Rotasyonu (Barış & Ekrem)
    for(let i=0; i<7; i++) {
        let geceSorumlusu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if(program[geceSorumlusu] && program[geceSorumlusu][i] === null) {
            program[geceSorumlusu][i] = "00:00–07:00";
            calismaPuani[geceSorumlusu]++;
        }
    }

    // 3. ADIM: Kapasiteye Göre Adil (Rotasyonlu) Doldurma
    for(let i=0; i<7; i++) {
        let isWeekend = (i >= 5);
        
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let capKey = `${birim}_${saat}`;
                let hedef = state.kapasite[capKey] ? (isWeekend ? state.kapasite[capKey].hs : state.kapasite[capKey].h) : 0;
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;

                if(mevcut < hedef) {
                    // ADALETLİ SEÇİM: Sadece o gün boş olan ve o ana kadar EN AZ çalışmış kişileri bul
                    let adaylar = state.personeller
                        .filter(p => p.birim === birim && program[p.ad][i] === null)
                        .sort((a, b) => calismaPuani[a.ad] - calismaPuani[b.ad]); // Az çalışandan çok çalışana sırala

                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) {
                        let secilen = adaylar[j];
                        program[secilen.ad][i] = saat;
                        calismaPuani[secilen.ad]++; // Puanını artır ki sonraki seçimlerde geriye düşsün
                    }
                }
            });
        });
    }
    render(program);
}

function render(program) {
    const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    document.getElementById("tableHeader").innerHTML = `<tr><th>SAATLER</th>${gunler.map(g => `<th>${g}</th>`).join('')}</tr>`;
    let bodyHtml = "";
    state.saatler.forEach(s => {
        bodyHtml += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let list = state.personeller.filter(p => program[p.ad][i] === s)
                .sort((a,b) => state.birimler.indexOf(a.birim) - state.birimler.indexOf(b.birim))
                .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.ad}</div>`).join('');
            bodyHtml += `<td>${list}</td>`;
        }
        bodyHtml += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = bodyHtml;

    let footHtml = `<tr><td><strong>İZİNLİ / YEDEK</strong></td>`;
    for(let i=0; i<7; i++) {
        let iz = state.personeller.filter(p => program[p.ad][i] === "İZİNLİ" || program[p.ad][i] === null)
            .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.ad}</div>`).join('');
        footHtml += `<td>${iz}</td>`;
    }
    document.getElementById("tableFooter").innerHTML = footHtml + "</tr>";
}

// --- DİĞER FONKSİYONLAR ---
function refreshUI() {
    document.getElementById("persListesiAdmin").innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    document.getElementById("yeniPersBirimSec").innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');
    document.getElementById("sabitPersSec").innerHTML = state.personeller.map(p => `<option value="${p.ad}">${p.ad}</option>`).join('');
    document.getElementById("sabitSaatSec").innerHTML = state.saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    checklistOlustur(); kapasiteCiz(); sabitAtamaListele();
}
function checklistOlustur() { document.getElementById("personelChecklist").innerHTML = state.personeller.sort((a,b) => state.birimler.indexOf(a.birim) - state.birimler.indexOf(b.birim)).map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join(''); }
function kapasiteCiz() {
    let html = `<div class="cap-table-header"><div>Birimler</div>${state.saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        html += `<div class="cap-row"><strong>${b}</strong>`;
        state.saatler.forEach(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            html += `<div class="cap-input-group"><input type="number" value="${v.h}" onchange="capSave('${k}','h',this.value)"><input type="number" class="input-hs" value="${v.hs}" onchange="capSave('${k}','hs',this.value)"></div>`;
        });
        html += `</div>`;
    });
    document.getElementById("kapasiteTable").innerHTML = html;
}
function capSave(k, t, v) { if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0}; state.kapasite[k][t] = parseInt(v) || 0; save(); }
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function personelEkle() { let ad = document.getElementById("yeniPersInp").value.toUpperCase(); let birim = document.getElementById("yeniPersBirimSec").value; if(ad) { state.personeller.push({ad, birim, id: Date.now()}); save(); refreshUI(); tabloyuOlustur(); } }
function sabitAtamaEkle() { state.sabitAtamalar.push({p: document.getElementById("sabitPersSec").value, g: document.getElementById("sabitGunSec").value, s: document.getElementById("sabitSaatSec").value}); save(); refreshUI(); tabloyuOlustur(); }
function sabitAtamaListele() { document.getElementById("sabitAtamaListesi").innerHTML = state.sabitAtamalar.map((a,i) => `<div class="admin-list-item">${a.p} | ${a.g} | ${a.s} <button onclick="sil('sabitAtamalar',${i})">SİL</button></div>`).join(''); }
function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); refreshUI(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }
function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + v); tabloyuOlustur(); }
function sifirla() { localStorage.clear(); location.reload(); }
window.onload = () => { refreshUI(); tabloyuOlustur(); };