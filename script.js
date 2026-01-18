// --- 1. VERİ HAVUZU ---
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = {
    "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71",
    "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e",
    "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400"
};

const DEFAULT_STAFF = [
    {ad: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN"}, {ad: "M.BERKMAN", birim: "TEKNİK YÖNETMEN"}, {ad: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN"},
    {ad: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN"}, {ad: "H.CAN SAĞLAM", birim: "TEKNİK YÖNETMEN"}, {ad: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN"},
    {ad: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ"}, {ad: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ"}, {ad: "ZAFER AKAR", birim: "SES OPERATÖRÜ"},
    {ad: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ"}, {ad: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ"}, {ad: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ"},
    {ad: "ENES KALE", birim: "SES OPERATÖRÜ"}, {ad: "ERSAN TİLBE", birim: "SES OPERATÖRÜ"}, {ad: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ"},
    {ad: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ"}, {ad: "M.ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ"}, {ad: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ"},
    {ad: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ"}, {ad: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ"}, {ad: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ"},
    {ad: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ"}, {ad: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ"}, {ad: "DEMET CENGİZ", birim: "KJ OPERATÖRÜ"},
    {ad: "SENA BAYDAR", birim: "KJ OPERATÖRÜ"}, {ad: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ"}, {ad: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ"},
    {ad: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ"}, {ad: "ERCAN PALABIYIK", birim: "INGEST OPERATÖRÜ"}, {ad: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ"},
    {ad: "UĞUR AKBABA", birim: "INGEST OPERATÖRÜ"}, {ad: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM"}, {ad: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM"},
    {ad: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM"}, {ad: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM"}, {ad: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ"},
    {ad: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ"}, {ad: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ"}, {ad: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ"},
    {ad: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ"}, {ad: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ"}, {ad: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ"},
    {ad: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ"}, {ad: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ"}, {ad: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ"},
    {ad: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ"}, {ad: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ"}, {ad: "MUSAB YAKUP DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ"}
];

// --- 2. DURUM YÖNETİMİ ---
let state = {
    birimler: JSON.parse(localStorage.getItem("v32_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v32_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v32_personeller")) || DEFAULT_STAFF.map((p,i) => ({...p, id: 100+i})),
    sabitAtamalar: JSON.parse(localStorage.getItem("v32_sabitAtamalar")) || [],
    kapasite: JSON.parse(localStorage.getItem("v32_kapasite")) || {}
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { localStorage.setItem("v32_birimler", JSON.stringify(state.birimler)); localStorage.setItem("v32_saatler", JSON.stringify(state.saatler)); localStorage.setItem("v32_personeller", JSON.stringify(state.personeller)); localStorage.setItem("v32_sabitAtamalar", JSON.stringify(state.sabitAtamalar)); localStorage.setItem("v32_kapasite", JSON.stringify(state.kapasite)); }

// --- 3. ANA MOTOR ---
function tabloyuOlustur() {
    if(document.getElementById("tarihAraligi")) document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    let program = {};
    let calismaSayisi = {}; 
    const haftaSeed = currentMonday.getTime();

    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        calismaSayisi[p.ad] = 0;
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ");
    });

    state.sabitAtamalar.forEach(a => {
        if(program[a.p]) {
            if(a.g === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[a.p][i] !== "İZİNLİ") { program[a.p][i] = a.s; calismaSayisi[a.p]++; }
                program[a.p][5] = program[a.p][6] = "İZİNLİ";
            } else {
                let g = parseInt(a.g); if(program[a.p][g] !== "İZİNLİ") { program[a.p][g] = a.s; calismaSayisi[a.p]++; }
            }
        }
    });

    for(let i=0; i<7; i++) {
        let gececi = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if(program[gececi] && program[gececi][i] === null) { program[gececi][i] = "00:00–07:00"; calismaSayisi[gececi]++; }
    }

    for(let i=0; i<7; i++) {
        let isWeekend = (i >= 5);
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let capKey = `${birim}_${saat}`;
                let hedef = state.kapasite[capKey] ? (isWeekend ? state.kapasite[capKey].hs : state.kapasite[capKey].h) : 0;
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                
                if(mevcut < hedef) {
                    let adaylar = state.personeller.filter(p => {
                        if(p.birim !== birim || program[p.ad][i] !== null) return false;
                        if(calismaSayisi[p.ad] >= 5) return false; 
                        if(i > 0 && program[p.ad][i-1] === "00:00–07:00" && saat.startsWith("06:30")) return false;
                        return true;
                    }).sort((a, b) => {
                        if(calismaSayisi[a.ad] !== calismaSayisi[b.ad]) return calismaSayisi[a.ad] - calismaSayisi[b.ad];
                        return Math.sin(haftaSeed + a.id) - Math.sin(haftaSeed + b.id);
                    });

                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) {
                        program[adaylar[j].ad][i] = saat;
                        calismaSayisi[adaylar[j].ad]++;
                    }
                }
            });
        });
    }
    render(program, calismaSayisi);
}

// --- 4. GÖRSELLEŞTİRME ---
function render(program, calismaSayisi) {
    const body = document.getElementById("tableBody"); if(!body) return;
    let html = "";
    state.saatler.forEach(s => {
        html += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let list = state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                let color = UNIT_COLORS[p.birim] || "#666";
                return `<div class="birim-card" style="border-left: 5px solid ${color}">
                            <span class="birim-tag" style="background:${color}">${p.birim}</span>${p.ad}
                        </div>`;
            }).join('');
            html += `<td>${list}</td>`;
        }
        html += `</tr>`;
    });
    body.innerHTML = html;

    let footHtml = `<tr><td><strong>İZİNLİ / YEDEK</strong></td>`;
    for(let i=0; i<7; i++) {
        let iz = state.personeller.filter(p => program[p.ad][i] === "İZİNLİ" || program[p.ad][i] === null)
            .map(p => `<div class="birim-card izinli-kart" style="opacity:0.7"><span class="birim-tag" style="background:#7f8c8d">${p.birim}</span>${p.ad}</div>`).join('');
        footHtml += `<td>${iz}</td>`;
    }
    document.getElementById("tableFooter").innerHTML = footHtml + "</tr>";

    // --- ÖZET SATIRI: SADECE SAYILAR ---
    let statHtml = `<tr><td style="background:#f2f2f2"><strong>HAFTALIK ÖZET</strong></td>`;
    for(let i=0; i<7; i++) {
        let dailyStats = state.personeller.filter(p => program[p.ad][i] !== "İZİNLİ" && program[p.ad][i] !== null)
            .map(p => {
                let izinSayisi = 0;
                for(let g=0; g<7; g++) { if(program[p.ad][g] === "İZİNLİ" || program[p.ad][g] === null) izinSayisi++; }
                
                return `<div style="font-size:11px; margin-bottom:4px; border-bottom:1px solid #eee; padding-bottom:2px">
                            ${p.ad}<br>
                            <span style="color:#27ae60"><strong>${calismaSayisi[p.ad]}G</strong></span> | 
                            <span style="color:#c0392b">İzin: ${izinSayisi}</span>
                        </div>`;
            }).join('');
        statHtml += `<td style="vertical-align:top; background:#f9f9f9">${dailyStats}</td>`;
    }
    document.getElementById("tableFooter").innerHTML += statHtml + "</tr>";
}

function refreshUI() {
    if(document.getElementById("persListesiAdmin")) document.getElementById("persListesiAdmin").innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    if(document.getElementById("yeniPersBirimSec")) document.getElementById("yeniPersBirimSec").innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');
    if(document.getElementById("sabitPersSec")) document.getElementById("sabitPersSec").innerHTML = state.personeller.map(p => `<option value="${p.ad}">${p.ad}</option>`).join('');
    if(document.getElementById("sabitSaatSec")) document.getElementById("sabitSaatSec").innerHTML = state.saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        tabSistem.innerHTML = `<h4>Birim Yönetimi</h4><div class="admin-input-group"><input type="text" id="yInpB" placeholder="Birim Adı"><button onclick="birimEkle()">EKLE</button></div>${state.birimler.map((b,i) => `<div class="admin-list-item">${b} <button onclick="sil('birimler',i)">SİL</button></div>`).join('')}<hr><h4>Saat Yönetimi</h4><div class="admin-input-group"><input type="text" id="yInpS" placeholder="00:00-00:00"><button onclick="saatEkle()">EKLE</button></div>${state.saatler.map((s,i) => `<div class="admin-list-item">${s} <button onclick="sil('saatler',i)">SİL</button></div>`).join('')}<hr><button class="btn-reset" onclick="sifirla()">SİSTEMİ SIFIRLA</button>`;
    }
    checklistOlustur(); kapasiteCiz(); sabitAtamaListele();
}
function checklistOlustur() { const box = document.getElementById("personelChecklist"); if(box) box.innerHTML = state.personeller.sort((a,b) => state.birimler.indexOf(a.birim) - state.birimler.indexOf(b.birim)).map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label for="check_${p.id}">${p.ad}</label></div>`).join(''); }
function kapasiteCiz() { const kTab = document.getElementById("kapasiteTable"); if(!kTab) return; let h = `<div class="cap-table-header"><div>Birimler</div>${state.saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`; state.birimler.forEach(b => { h += `<div class="cap-row"><strong>${b}</strong>`; state.saatler.forEach(s => { let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0}; h += `<div class="cap-input-group"><input type="number" value="${v.h}" onchange="capSave('${k}','h',this.value)"><input type="number" class="input-hs" value="${v.hs}" onchange="capSave('${k}','hs',this.value)"></div>`; }); h += `</div>`; }); kTab.innerHTML = h; }
function capSave(k, t, v) { if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0}; state.kapasite[k][t] = parseInt(v) || 0; save(); tabloyuOlustur(); }
function birimEkle() { let v = document.getElementById("yInpB").value.toUpperCase(); if(v){ state.birimler.push(v); save(); refreshUI(); } }
function saatEkle() { let v = document.getElementById("yInpS").value; if(v){ state.saatler.push(v); save(); refreshUI(); tabloyuOlustur(); } }
function personelEkle() { let ad = document.getElementById("yeniPersInp").value.toUpperCase(); let birim = document.getElementById("yeniPersBirimSec").value; if(ad){ state.personeller.push({ad, birim, id: Date.now()}); save(); refreshUI(); tabloyuOlustur(); } }
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); refreshUI(); }
function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); refreshUI(); }
function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + (v * 7)); tabloyuOlustur(); }
function sifirla() { if(confirm("Tüm veriler silinecek!")) { localStorage.clear(); location.reload(); } }
function sabitAtamaEkle() { state.sabitAtamalar.push({p: document.getElementById("sabitPersSec").value, g: document.getElementById("sabitGunSec").value, s: document.getElementById("sabitSaatSec").value}); save(); refreshUI(); tabloyuOlustur(); }
function sabitAtamaListele() { if(document.getElementById("sabitAtamaListesi")) document.getElementById("sabitAtamaListesi").innerHTML = state.sabitAtamalar.map((a,i) => `<div class="admin-list-item">${a.p} | ${a.g} | ${a.s} <button onclick="sil('sabitAtamalar',i)">SİL</button></div>`).join(''); }
window.onload = () => { refreshUI(); tabloyuOlustur(); };