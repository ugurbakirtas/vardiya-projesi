// --- VERİ HAVUZU ---
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

let state = {
    birimler: JSON.parse(localStorage.getItem("v26_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v26_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v26_personeller")) || DEFAULT_STAFF.map((p,i) => ({...p, id: 100+i})),
    sabitAtamalar: JSON.parse(localStorage.getItem("v26_sabitAtamalar")) || [],
    kapasite: JSON.parse(localStorage.getItem("v26_kapasite")) || {}
};

let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { localStorage.setItem("v26_birimler", JSON.stringify(state.birimler)); localStorage.setItem("v26_saatler", JSON.stringify(state.saatler)); localStorage.setItem("v26_personeller", JSON.stringify(state.personeller)); localStorage.setItem("v26_sabitAtamalar", JSON.stringify(state.sabitAtamalar)); localStorage.setItem("v26_kapasite", JSON.stringify(state.kapasite)); }

// --- VARDIYA MOTORU (HAFTALIK KAYDIRMALI) ---
function tabloyuOlustur() {
    const tarihArea = document.getElementById("tarihAraligi");
    if(tarihArea) tarihArea.innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let calismaPuani = {};
    
    // HAFTAYA GÖRE KAYDIRMA DEĞERİ (Her hafta liste farklı birinden başlasın)
    const haftaKaydirma = Math.floor(currentMonday.getTime() / (1000 * 60 * 60 * 24 * 7)) % 10;

    state.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        calismaPuani[p.ad] = 0;
        let chk = document.getElementById(`check_${p.id}`);
        if(chk && chk.checked) program[p.ad].fill("İZİNLİ");
    });

    // 1. Sabit Atamalar
    state.sabitAtamalar.forEach(a => {
        if(program[a.p]) {
            if(a.g === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[a.p][i] !== "İZİNLİ") { program[a.p][i] = a.s; calismaPuani[a.p]++; }
                program[a.p][5] = program[a.p][6] = "İZİNLİ";
            } else {
                let g = parseInt(a.g);
                if(program[a.p][g] !== "İZİNLİ") { program[a.p][g] = a.s; calismaPuani[a.p]++; }
            }
        }
    });

    // 2. Teknik Yönetmen Gece Rotasyonu (Haftalık değişir)
    for(let i=0; i<7; i++) {
        let gececi = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if(program[gececi] && program[gececi][i] === null) {
            program[gececi][i] = "00:00–07:00";
            calismaPuani[gececi]++;
        }
    }

    // 3. Dinamik ve Kaydırmalı Dağıtım
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
                            // Önce çalışma puanına bak, puanlar eşitse hafta kaydırmasına göre karıştır
                            if(calismaPuani[a.ad] !== calismaPuani[b.ad]) return calismaPuani[a.ad] - calismaPuani[b.ad];
                            return (state.personeller.indexOf(a) + haftaKaydirma) % state.personeller.length - (state.personeller.indexOf(b) + haftaKaydirma) % state.personeller.length;
                        });

                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) {
                        program[adaylar[j].ad][i] = saat;
                        calismaPuani[adaylar[j].ad]++;
                    }
                }
            });
        });
    }
    render(program);
}

function render(program) {
    const body = document.getElementById("tableBody");
    const foot = document.getElementById("tableFooter");
    if(!body) return;
    let bodyHtml = "";
    state.saatler.forEach(s => {
        bodyHtml += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let list = state.personeller.filter(p => program[p.ad][i] === s)
                .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.ad}</div>`).join('');
            bodyHtml += `<td>${list}</td>`;
        }
        bodyHtml += `</tr>`;
    });
    body.innerHTML = bodyHtml;
    let footHtml = `<tr><td><strong>İZİNLİ / YEDEK</strong></td>`;
    for(let i=0; i<7; i++) {
        let iz = state.personeller.filter(p => program[p.ad][i] === "İZİNLİ" || program[p.ad][i] === null)
            .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.ad}</div>`).join('');
        footHtml += `<td>${iz}</td>`;
    }
    if(foot) foot.innerHTML = footHtml + "</tr>";
}

// --- DİĞER FONKSİYONLAR ---
function refreshUI() {
    const pList = document.getElementById("persListesiAdmin");
    if(pList) pList.innerHTML = state.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    const bSec = document.getElementById("yeniPersBirimSec");
    if(bSec) bSec.innerHTML = state.birimler.map(b => `<option value="${b}">${b}</option>`).join('');
    const sPers = document.getElementById("sabitPersSec");
    if(sPers) sPers.innerHTML = state.personeller.map(p => `<option value="${p.ad}">${p.ad}</option>`).join('');
    const sSaat = document.getElementById("sabitSaatSec");
    if(sSaat) sSaat.innerHTML = state.saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    checklistOlustur(); kapasiteCiz(); sabitAtamaListele();
}
function checklistOlustur() {
    const cont = document.getElementById("personelChecklist");
    if(cont) cont.innerHTML = state.personeller.sort((a,b) => state.birimler.indexOf(a.birim) - state.birimler.indexOf(b.birim)).map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>`).join('');
}
function kapasiteCiz() {
    const kTab = document.getElementById("kapasiteTable");
    if(!kTab) return;
    let html = `<div class="cap-table-header"><div>Birimler</div>${state.saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    state.birimler.forEach(b => {
        html += `<div class="cap-row"><strong>${b}</strong>`;
        state.saatler.forEach(s => {
            let k = `${b}_${s}`; let v = state.kapasite[k] || {h:0, hs:0};
            html += `<div class="cap-input-group"><input type="number" value="${v.h}" onchange="capSave('${k}','h',this.value)"><input type="number" class="input-hs" value="${v.hs}" onchange="capSave('${k}','hs',this.value)"></div>`;
        });
        html += `</div>`;
    });
    kTab.innerHTML = html;
}
function capSave(k, t, v) { if(!state.kapasite[k]) state.kapasite[k] = {h:0, hs:0}; state.kapasite[k][t] = parseInt(v) || 0; save(); }
function sil(k, i) { state[k].splice(i, 1); save(); refreshUI(); tabloyuOlustur(); }
function personelEkle() { let ad = document.getElementById("yeniPersInp").value.toUpperCase(); let birim = document.getElementById("yeniPersBirimSec").value; if(ad) { state.personeller.push({ad, birim, id: Date.now()}); save(); refreshUI(); tabloyuOlustur(); } }
function sabitAtamaEkle() { state.sabitAtamalar.push({p: document.getElementById("sabitPersSec").value, g: document.getElementById("sabitGunSec").value, s: document.getElementById("sabitSaatSec").value}); save(); refreshUI(); tabloyuOlustur(); }
function sabitAtamaListele() { const sList = document.getElementById("sabitAtamaListesi"); if(sList) sList.innerHTML = state.sabitAtamalar.map((a,i) => `<div class="admin-list-item">${a.p} | ${a.g} | ${a.s} <button onclick="sil('sabitAtamalar',${i})">SİL</button></div>`).join(''); }
function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); refreshUI(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }
function haftaDegistir(v) { currentMonday.setDate(currentMonday.getDate() + v); tabloyuOlustur(); }
function sifirla() { localStorage.clear(); location.reload(); }
window.onload = () => { refreshUI(); tabloyuOlustur(); };