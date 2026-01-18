// --- VERİ MODELİ ---
const VARSAYILAN_BIRIMLER = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const VARSAYILAN_SAATLER = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let veriler = {
    birimler: JSON.parse(localStorage.getItem("birimler")) || VARSAYILAN_BIRIMLER,
    saatler: JSON.parse(localStorage.getItem("saatler")) || VARSAYILAN_SAATLER,
    personeller: JSON.parse(localStorage.getItem("personeller")) || [],
    sabitAtamalar: JSON.parse(localStorage.getItem("sabitAtamalar")) || [],
    kapasite: JSON.parse(localStorage.getItem("kapasite")) || {}
};

let mevcutPazartesi = getMonday(new Date());

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// --- KAYIT ---
function kaydet() { localStorage.setItem("veriler_v2", JSON.stringify(veriler)); localStorage.setItem("birimler", JSON.stringify(veriler.birimler)); localStorage.setItem("saatler", JSON.stringify(veriler.saatler)); localStorage.setItem("personeller", JSON.stringify(veriler.personeller)); localStorage.setItem("sabitAtamalar", JSON.stringify(veriler.sabitAtamalar)); localStorage.setItem("kapasite", JSON.stringify(veriler.kapasite)); }

// --- YÖNETİM PANELİ FONKSİYONLARI ---
function birimEkle() {
    let inp = document.getElementById("yeniBirimInput");
    if(!inp.value) return;
    veriler.birimler.push(inp.value.toUpperCase());
    inp.value = ""; kaydet(); panelGuncelle();
}

function personelEkle() {
    let ad = document.getElementById("yeniPersInput");
    let birim = document.getElementById("yeniPersBirim");
    if(!ad.value) return;
    veriler.personeller.push({ id: Date.now(), ad: ad.value.toUpperCase(), birim: birim.value });
    ad.value = ""; kaydet(); panelGuncelle(); checklistOlustur();
}

function saatEkle() {
    let inp = document.getElementById("yeniSaatInput");
    if(!inp.value) return;
    veriler.saatler.push(inp.value);
    inp.value = ""; kaydet(); panelGuncelle();
}

function panelGuncelle() {
    // Birim Listesi
    document.getElementById("birimListesiAdmin").innerHTML = veriler.birimler.map((b,i) => `<div class="admin-list-item">${b} <button onclick="sil('birimler',${i})">SİL</button></div>`).join('');
    // Personel Listesi
    document.getElementById("personelListesiAdmin").innerHTML = veriler.personeller.map((p,i) => `<div class="admin-list-item">${p.ad} (${p.birim}) <button onclick="sil('personeller',${i})">SİL</button></div>`).join('');
    // Saat Listesi
    document.getElementById("saatYonetimListesi").innerHTML = veriler.saatler.map((s,i) => `<div class="admin-list-item">${s} <button onclick="sil('saatler',${i})">SİL</button></div>`).join('');
    // Select kutuları
    document.getElementById("yeniPersBirim").innerHTML = veriler.birimler.map(b => `<option value="${b}">${b}</option>`).join('');
    document.getElementById("sabitPersSec").innerHTML = veriler.personeller.map(p => `<option value="${p.ad}">${p.ad}</option>`).join('');
    document.getElementById("sabitSaatSec").innerHTML = veriler.saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    
    kapasiteTablosuCiz();
}

function sil(key, index) { veriler[key].splice(index, 1); kaydet(); panelGuncelle(); }

function kapasiteTablosuCiz() {
    let html = `<div class="cap-table-header"><div>Birimler</div>${veriler.saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    veriler.birimler.forEach(b => {
        html += `<div class="cap-row"><strong>${b}</strong>`;
        veriler.saatler.forEach(s => {
            let key = `${b}_${s}`;
            let v = veriler.kapasite[key] || {h:0, hs:0};
            html += `<div class="cap-input-group">
                <input type="number" value="${v.h}" onchange="kapasiteGuncelle('${key}','h',this.value)">
                <input type="number" class="input-hs" value="${v.hs}" onchange="kapasiteGuncelle('${key}','hs',this.value)">
            </div>`;
        });
        html += `</div>`;
    });
    document.getElementById("kapasiteTabloAlani").innerHTML = html;
}

function kapasiteGuncelle(key, tip, val) {
    if(!veriler.kapasite[key]) veriler.kapasite[key] = {h:0, hs:0};
    veriler.kapasite[key][tip] = parseInt(val);
    kaydet();
}

function sabitAtamaEkle() {
    let p = document.getElementById("sabitPersSec").value;
    let g = document.getElementById("sabitGunSec").value;
    let s = document.getElementById("sabitSaatSec").value;
    veriler.sabitAtamalar.push({p, g, s});
    kaydet(); sabitAtamaListele();
}

function sabitAtamaListele() {
    document.getElementById("sabitAtamaListesi").innerHTML = veriler.sabitAtamalar.map((a,i) => `<div class="admin-list-item">${a.p} | ${a.g} | ${a.s} <button onclick="sil('sabitAtamalar',${i});sabitAtamaListele();">SİL</button></div>`).join('');
}

// --- VARDİYA OLUŞTURMA MOTORU ---
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    let program = {};
    veriler.personeller.forEach(p => {
        program[p.ad] = Array(7).fill(null);
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ");
    });

    // 1. Sabit Atamaları İşle
    veriler.sabitAtamalar.forEach(atama => {
        if(program[atama.p]) {
            if(atama.g === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[atama.p][i] !== "İZİNLİ") program[atama.p][i] = atama.s;
                program[atama.p][5] = program[atama.p][6] = "İZİNLİ";
            } else {
                program[atama.p][parseInt(atama.g)] = atama.s;
            }
        }
    });

    // 2. Özel Kurallar (Barış/Ekrem Gece Rotasyonu)
    for(let i=0; i<7; i++) {
        let geceSorumlusu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if(program[geceSorumlusu] && program[geceSorumlusu][i] === null) program[geceSorumlusu][i] = "00:00–07:00";
    }

    render(program);
}

function render(program) {
    let gunlerEtiket = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    document.getElementById("tableHeader").innerHTML = `<tr><th>SAATLER</th>${gunlerEtiket.map(g => `<th>${g}</th>`).join('')}</tr>`;

    let body = "";
    veriler.saatler.forEach(s => {
        body += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let pList = veriler.personeller.filter(p => program[p.ad][i] === s)
                .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.ad}</div>`).join('');
            body += `<td>${pList}</td>`;
        }
        body += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = body;

    let foot = `<tr><td><strong>İZİNLİ</strong></td>`;
    for(let i=0; i<7; i++) {
        let iz = veriler.personeller.filter(p => program[p.ad][i] === "İZİNLİ")
            .map(p => `<div class="birim-card izinli-kart">${p.ad}</div>`).join('');
        foot += `<td>${iz}</td>`;
    }
    document.getElementById("tableFooter").innerHTML = foot + "</tr>";
}

function checklistOlustur() {
    document.getElementById("personelChecklist").innerHTML = veriler.personeller.map(p => `
        <div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.ad}</label></div>
    `).join('');
}

// --- UTILS ---
function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); panelGuncelle(); sabitAtamaListele(); }
function tabDegistir(n) { document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); document.getElementById('tab-'+n).classList.remove('hidden'); }
function haftaDegistir(v) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + v); tabloyuOlustur(); }
function sifirla() { localStorage.clear(); location.reload(); }

window.onload = () => { panelGuncelle(); checklistOlustur(); tabloyuOlustur(); };