// --- 1. VERİ HAVUZU ---
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
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
    birimler: JSON.parse(localStorage.getItem("v28_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v28_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v28_personeller")) || DEFAULT_STAFF.map((p,i) => ({...p, id: 100+i})),
    sabitAtamalar: JSON.parse(localStorage.getItem("v28_sabitAtamalar")) || [],
    kapasite: JSON.parse(localStorage.getItem("v28_kapasite")) || {},
    manuelIzinler: JSON.parse(localStorage.getItem("v28_manuelIzinler")) || {} // Personel ID -> [gün indisleri]
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { 
    localStorage.setItem("v28_birimler", JSON.stringify(state.birimler)); 
    localStorage.setItem("v28_saatler", JSON.stringify(state.saatler)); 
    localStorage.setItem("v28_personeller", JSON.stringify(state.personeller)); 
    localStorage.setItem("v28_sabitAtamalar", JSON.stringify(state.sabitAtamalar)); 
    localStorage.setItem("v28_kapasite", JSON.stringify(state.kapasite));
    localStorage.setItem("v28_manuelIzinler", JSON.stringify(state.manuelIzinler));
}

// --- 3. ANA MOTOR (KENDİNİ DÜZELTEN ALGORİTMA) ---
function tabloyuOlustur() {
    if(document.getElementById("tarihAraligi")) document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let puanlar = {};
    const haftaSeed = currentMonday.getTime();

    // Personelleri hazırla
    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        puanlar[p.ad] = 0;
        
        // Checklist'ten gelen genel izin kontrolü
        let chk = document.getElementById(`check_${p.id}`);
        if(chk && chk.checked) {
            program[p.ad].fill("İZİNLİ");
        }
    });

    // 1. Sabit Atamalar (Öncelikli)
    state.sabitAtamalar.forEach(a => {
        if(program[a.p]) {
            if(a.g === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[a.p][i] !== "İZİNLİ") { program[a.p][i] = a.s; puanlar[a.p]++; }
                program[a.p][5] = program[a.p][6] = "İZİNLİ";
            } else {
                let g = parseInt(a.g); if(program[a.p][g] !== "İZİNLİ") { program[a.p][g] = a.s; puanlar[a.p]++; }
            }
        }
    });

    // 2. Teknik Yönetmen Gece Rotasyonu
    for(let i=0; i<7; i++) {
        let gececi = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if(program[gececi] && program[gececi][i] === null) {
            program[gececi][i] = "00:00–07:00";
            puanlar[gececi]++;
        }
    }

    // 3. Dinamik Dağıtım (Boşlukları Otomatik Doldurur)
    for(let i=0; i<7; i++) {
        let isWeekend = (i >= 5);
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let capKey = `${birim}_${saat}`;
                let hedef = state.kapasite[capKey] ? (isWeekend ? state.kapasite[capKey].hs : state.kapasite[capKey].h) : 0;
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                
                if(mevcut < hedef) {
                    let adaylar = state.personeller
                        .filter(p => p.birim === birim && program[p.ad][i] === null)
                        .sort((a, b) => {
                            if(puanlar[a.ad] !== puanlar[b.ad]) return puanlar[a.ad] - puanlar[b.ad];
                            return Math.sin(haftaSeed + a.id) - Math.sin(haftaSeed + b.id);
                        });

                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) {
                        program[adaylar[j].ad][i] = saat;
                        puanlar[adaylar[j].ad]++;
                    }
                }
            });
        });
    }
    render(program);
}

// --- 4. GÖRSELLEŞTİRME VE KAYIT ---
function render(program) {
    const body = document.getElementById("tableBody");
    if(!body) return;
    let html = "";
    state.saatler.forEach(s => {
        html += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let list = state.personeller.filter(p => program[p.ad][i] === s)
                .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.ad}</div>`).join('');
            html += `<td>${list}</td>`;
        }
        html += `</tr>`;
    });
    body.innerHTML = html;

    let footHtml = `<tr><td><strong>İZİNLİ / YEDEK</strong></td>`;
    for(let i=0; i<7; i++) {
        let iz = state.personeller.filter(p => program[p.ad][i] === "İZİNLİ" || program[p.ad][i] === null)
            .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.ad}</div>`).join('');
        footHtml += `<td>${iz}</td>`;
    }
    document.getElementById("tableFooter").innerHTML = footHtml + "</tr>";
}

// --- 5. YÖNETİM VE ETKİLEŞİM ---
function refreshUI() {
    if(document.getElementById("persListesiAdmin")) document.getElementById("persListesiAdmin").innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    if(document.getElementById("yeniPersBirimSec")) document.getElementById("yeniPersBirimSec").innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');
    if(document.getElementById("sabitPersSec")) document.getElementById("sabitPersSec").innerHTML = state.personeller.map(p => `<option value="${p.ad}">${p.ad}</option>`).join('');
    if(document.getElementById("sabitSaatSec")) document.getElementById("sabitSaatSec").innerHTML = state.saatler.map(s => `<option value="${s}">${s}</option>`).join('');

    const tabSistem = document.getElementById("tab-sistem");
    if(tabSistem) {
        let bHtml = `<h4>Birimler</h4><div class="admin-input-group"><input type="text" id="yInpB" placeholder="Birim Adı"><button onclick="birimEkle()">EKLE</button></div>`;
        bHtml += state.birimler.map((b,i) => `<div class="admin-list-item">${b} <button onclick="sil('birimler',${i})">SİL</button></div>`).join('');
        let sHtml = `<h4>Saatler</h4><div class="admin-input-group"><input type="text" id="yInpS" placeholder="00:00-00:00"><button onclick="saatEkle()">EKLE</button></div>`;
        sHtml += state.saatler.map((s,i) => `<div class="admin-list-item">${s} <button onclick="sil('saatler',${i})">SİL</button></div>`).join('');
        tabSistem.innerHTML = bHtml + "<hr>" + sHtml + `<hr><button class="btn-reset" onclick="sifirla()">SIFIRLA</button>`;
    }
    checklistOlustur(); kapasiteCiz(); sabitAtamaListele();
}

function checklistOlustur() {
    const box = document.getElementById("personelChecklist");
    if(box) box.innerHTML = state.personeller.sort((a,b) => state.birimler.indexOf(a.birim) - state.birimler.indexOf(b.birim)).map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join('');
}

function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable"); if(!kTab) return;
    let h = `<div class="cap-table-header"><div>Birimler</div>${state.saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        h += `<div class="cap-row"><strong>${b}</strong>`;
        state.saatler.forEach(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            h += `<div class="cap-input-group"><input type="number" value="${v.h}" onchange="capSave('${k}','h',this.value)"><input type="number" class="input-hs" value="${v.hs}" onchange="capSave('${k}','hs',this.value)"></div>`;
        });
        h += `</div>`;
    });
    kTab.innerHTML = h;
}

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
function sabitAtamaListele() { if(document.getElementById("sabitAtamaListesi")) document.getElementById("sabitAtamaListesi").innerHTML = state.sabitAtamalar.map((a,i) => `<div class="admin-list-item">${a.p} | ${a.g} | ${a.s} <button onclick="sil('sabitAtamalar',${i})">SİL</button></div>`).join(''); }

window.onload = () => { refreshUI(); tabloyuOlustur(); };