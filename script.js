// --- VARSAYILANLAR ---
const defaultBirimler = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const defaultSaatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

// HAFIZA KONTROLÜ
let birimSiralamasi = JSON.parse(localStorage.getItem("birimSiralamasi"));
if(!birimSiralamasi || birimSiralamasi.length === 0) birimSiralamasi = defaultBirimler;

let saatler = JSON.parse(localStorage.getItem("saatler"));
if(!saatler || saatler.length === 0) saatler = defaultSaatler;

let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || [];
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
let mevcutPazartesi = getMonday(new Date());

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// --- BAŞLATMA ---
function baslat() {
    birimSelectGuncelle();
    checklistOlustur();
    tabloyuOlustur();
}

function toggleAdminPanel() {
    document.getElementById("adminPanel").classList.toggle("hidden");
    tabDegistir('sabit');
}

function tabDegistir(name) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('tab-' + name);
    if(target) target.classList.remove('hidden');

    if(name === 'personel') { birimListesiCiz(); personelListesiCiz(); }
    if(name === 'sabit') sabitListesiCiz();
    if(name === 'saatler') saatListesiCiz();
    if(name === 'kapasite') kapasiteCiz();
}

// --- BİRİM VE PERSONEL ---
function birimSelectGuncelle() {
    const sel = document.getElementById("yeniPersonelBirim");
    if(sel) sel.innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function birimEkle() {
    const val = document.getElementById("yeniBirimInput").value.trim().toUpperCase();
    if(!val) return;
    birimSiralamasi.push(val);
    localStorage.setItem("birimSiralamasi", JSON.stringify(birimSiralamasi));
    document.getElementById("yeniBirimInput").value = "";
    birimListesiCiz(); birimSelectGuncelle();
}

function birimListesiCiz() {
    document.getElementById("birimYonetimListesi").innerHTML = birimSiralamasi.map((b, i) => `
        <div class="admin-list-item"><span>${b}</span><button onclick="birimSil(${i})">SİL</button></div>
    `).join('');
}

function birimSil(i) {
    birimSiralamasi.splice(i, 1);
    localStorage.setItem("birimSiralamasi", JSON.stringify(birimSiralamasi));
    birimListesiCiz(); birimSelectGuncelle();
}

function manuelPersonelEkle() {
    const isim = document.getElementById("yeniPersonelAd").value.trim().toUpperCase();
    const birim = document.getElementById("yeniPersonelBirim").value;
    if(!isim) return;
    sabitPersoneller.push({ isim, birim, id: Date.now() });
    localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
    document.getElementById("yeniPersonelAd").value = "";
    personelListesiCiz(); checklistOlustur(); tabloyuOlustur();
}

function personelListesiCiz() {
    document.getElementById("personelYonetimListesi").innerHTML = sabitPersoneller.map(p => `
        <div class="admin-list-item"><span>${p.isim} (${p.birim})</span><button onclick="personelSil(${p.id})">SİL</button></div>
    `).join('');
}

function personelSil(id) {
    sabitPersoneller = sabitPersoneller.filter(p => p.id !== id);
    localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
    personelListesiCiz(); checklistOlustur(); tabloyuOlustur();
}

// --- SABİT ATAMALAR (PZT-CUM ÖZEL MODU) ---
function sabitAtamaEkle() {
    const isim = document.getElementById("sabitPersSec").value;
    const gun = document.getElementById("sabitGunSec").value;
    const saat = document.getElementById("sabitSaatSec").value;
    sabitAtamalar.push({ isim, gun, saat });
    localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
    sabitListesiCiz(); tabloyuOlustur();
}

function sabitListesiCiz() {
    document.getElementById("sabitPersSec").innerHTML = sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
    document.getElementById("sabitSaatSec").innerHTML = saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById("sabitListesi").innerHTML = sabitAtamalar.map((s, i) => `
        <div class="admin-list-item"><span>${s.isim} | ${s.gun === 'pzt_cum' ? 'PZT-CUM' : gunler[s.gun]} | ${s.saat}</span><button onclick="sabitSil(${i})">SİL</button></div>
    `).join('');
}

function sabitSil(i) {
    sabitAtamalar.splice(i, 1);
    localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
    sabitListesiCiz(); tabloyuOlustur();
}

// --- SAATLER ---
function saatEkle() {
    const s = document.getElementById("yeniSaatInput").value.trim();
    if(!s) return;
    saatler.push(s);
    localStorage.setItem("saatler", JSON.stringify(saatler));
    document.getElementById("yeniSaatInput").value = "";
    saatListesiCiz(); tabloyuOlustur();
}

function saatListesiCiz() {
    document.getElementById("saatYonetimListesi").innerHTML = saatler.map((s, i) => `
        <div class="admin-list-item"><span>${s}</span><button onclick="saatSil(${i})">SİL</button></div>
    `).join('');
}

function saatSil(i) {
    saatler.splice(i, 1);
    localStorage.setItem("saatler", JSON.stringify(saatler));
    saatListesiCiz(); tabloyuOlustur();
}

// --- KAPASİTE ---
function kapasiteCiz() {
    let html = `<div class="cap-table-header"><div>Birimler</div>${saatler.map(s => `<div>${s.substring(0,5)}</div>`).join('')}</div>`;
    birimSiralamasi.forEach(b => {
        html += `<div class="cap-row"><strong>${b}</strong>`;
        saatler.forEach(s => {
            html += `<div class="cap-input-group">
                <input type="number" value="${kapasiteAyarlari[b]?.[s]?.h || 0}" onchange="gK('${b}','${s}','h',this.value)">
                <input type="number" class="input-hs" value="${kapasiteAyarlari[b]?.[s]?.hs || 0}" onchange="gK('${b}','${s}','hs',this.value)">
            </div>`;
        });
        html += `</div>`;
    });
    document.getElementById("kapasiteListesi").innerHTML = html;
}

function gK(b, s, t, v) {
    if(!kapasiteAyarlari[b]) kapasiteAyarlari[b] = {};
    if(!kapasiteAyarlari[b][s]) kapasiteAyarlari[b][s] = {};
    kapasiteAyarlari[b][s][t] = parseInt(v) || 0;
    localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
    tabloyuOlustur();
}

// --- VARDİYA MOTORU ---
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    let program = {};
    sabitPersoneller.forEach(p => {
        program[p.isim] = Array(7).fill(null);
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.isim].fill("İZİNLİ");
    });

    // SABİT ATAMALAR (PZT-CUM KURALI BURADA)
    sabitAtamalar.forEach(atama => {
        if(program[atama.isim]) {
            if(atama.gun === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[atama.isim][i] !== "İZİNLİ") program[atama.isim][i] = atama.saat;
                program[atama.isim][5] = "İZİNLİ"; // Cumartesi
                program[atama.isim][6] = "İZİNLİ"; // Pazar
            } else {
                let gIdx = parseInt(atama.gun);
                if(program[atama.isim][gIdx] !== "İZİNLİ") program[atama.isim][gIdx] = atama.saat;
            }
        }
    });

    // MCR Döngüsü
    const refDate = new Date("2026-01-19");
    const diff = Math.floor((mevcutPazartesi - refDate) / (1000*60*60*24));
    ["24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"].forEach(birim => {
        sabitPersoneller.filter(p => p.birim === birim).forEach((p, idx) => {
            for(let i=0; i<7; i++) {
                let cycle = (diff + i + (idx * 2)) % 8;
                if(cycle < 0) cycle += 8;
                let s = cycle < 2 ? "06:30–16:00" : cycle < 4 ? "16:00–00:00" : cycle < 6 ? "00:00–07:00" : "İZİNLİ";
                if (program[p.isim][i] === null) program[p.isim][i] = s;
            }
        });
    });

    // Teknik Yönetmen Gece
    for (let i = 0; i < 7; i++) {
        let sorumlu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
        if (program[sorumlu] && program[sorumlu][i] === null) program[sorumlu][i] = "00:00–07:00";
    }

    render(program);
}

function render(program) {
    document.getElementById("tableHeader").innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');

    let body = "";
    saatler.forEach(s => {
        body += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let pList = sabitPersoneller.filter(p => program[p.isim][i] === s)
                .sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
                .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
            body += `<td>${pList}</td>`;
        }
        body += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = body;

    let foot = `<tr><td><strong>İZİNLİ</strong></td>`;
    for(let i=0; i<7; i++) {
        let iz = sabitPersoneller.filter(p => program[p.isim][i] === "İZİNLİ")
            .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
        foot += `<td>${iz}</td>`;
    }
    document.getElementById("tableFooter").innerHTML = foot + "</tr>";
}

function checklistOlustur() {
    document.getElementById("personelChecklist").innerHTML = sabitPersoneller.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
        .map(p => `
        <div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.isim}</label></div>
    `).join('');
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function sifirla() { if(confirm("Tüm veriler silinecek?")) { localStorage.clear(); location.reload(); } }

window.onload = baslat;