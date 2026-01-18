/**
 * PRO-Vardiya v23.5 | Core Engine
 */

let birimSiralamasi = JSON.parse(localStorage.getItem("birimSiralamasi")) || ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || [];
let oncedenIzinliler = JSON.parse(localStorage.getItem("oncedenIzinliler")) || [];
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function baslat() {
    birimSiralamasi.forEach(b => {
        if (!kapasiteAyarlari[b]) {
            kapasiteAyarlari[b] = {};
            saatler.forEach(s => { kapasiteAyarlari[b][s] = { haftaici: 0, haftasonu: 0 }; });
        }
    });

    if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
    
    checklistOlustur();
    tabloyuOlustur();
}

function toggleAdminPanel() {
    const p = document.getElementById("adminPanel");
    p.classList.toggle("hidden");
    if (!p.classList.contains("hidden")) {
        kapasitePaneliniCiz();
        birimYonetimiCiz();
        personelYonetimiCiz();
        izinListesiCiz();
    }
}

function tabDegistir(tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

// --- KAPASİTE YÖNETİMİ ---
function kapasitePaneliniCiz() {
    const cont = document.getElementById("kapasiteListesi");
    let html = `<div class="cap-table-header"><div>Birimler</div>${saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    birimSiralamasi.forEach(b => {
        html += `<div class="cap-row"><strong>${b}</strong>`;
        saatler.forEach(s => {
            html += `<div class="cap-input-group">
                <input type="number" value="${kapasiteAyarlari[b][s].haftaici}" onchange="guncelleK('${b}','${s}','haftaici',this.value)">
                <input type="number" class="input-hs" value="${kapasiteAyarlari[b][s].haftasonu}" onchange="guncelleK('${b}','${s}','haftasonu',this.value)">
            </div>`;
        });
        html += `</div>`;
    });
    cont.innerHTML = html;
}

function guncelleK(b, s, t, v) {
    kapasiteAyarlari[b][s][t] = parseInt(v) || 0;
    localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
}

// --- BİRİM & PERSONEL ---
function birimEkle() {
    const ad = document.getElementById("yeniBirimAd").value.trim().toUpperCase();
    if (ad && !birimSiralamasi.includes(ad)) {
        birimSiralamasi.push(ad);
        localStorage.setItem("birimSiralamasi", JSON.stringify(birimSiralamasi));
        baslat(); birimYonetimiCiz();
        document.getElementById("yeniBirimAd").value = "";
    }
}

function birimYonetimiCiz() {
    document.getElementById("birimYonetimListesi").innerHTML = birimSiralamasi.map(b => `
        <div class="admin-list-item"><span>${b}</span><button onclick="birimSil('${b}')" class="btn-sm-danger">Sil</button></div>`).join('');
}

function birimSil(b) {
    birimSiralamasi = birimSiralamasi.filter(x => x !== b);
    localStorage.setItem("birimSiralamasi", JSON.stringify(birimSiralamasi));
    baslat(); birimYonetimiCiz();
}

function personelEkle() {
    const isim = document.getElementById("yeniPersIsim").value.trim().toUpperCase();
    const birim = document.getElementById("yeniPersBirim").value;
    if (isim) {
        sabitPersoneller.push({ id: Date.now(), isim, birim });
        localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
        checklistOlustur(); personelYonetimiCiz();
        document.getElementById("yeniPersIsim").value = "";
    }
}

function personelYonetimiCiz() {
    document.getElementById("yeniPersBirim").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
    document.getElementById("personelYonetimListesi").innerHTML = sabitPersoneller.map(p => `
        <div class="admin-list-item"><span>${p.isim} (${p.birim})</span><button onclick="personelSil(${p.id})" class="btn-sm-danger">Sil</button></div>`).join('');
}

function personelSil(id) {
    sabitPersoneller = sabitPersoneller.filter(p => p.id !== id);
    localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
    checklistOlustur(); personelYonetimiCiz();
}

// --- İZİN SİSTEMİ ---
function izinEkle() {
    const isim = document.getElementById("izinPersSec").value;
    const gun = parseInt(document.getElementById("izinGunSec").value);
    oncedenIzinliler.push({ isim, gun });
    localStorage.setItem("oncedenIzinliler", JSON.stringify(oncedenIzinliler));
    izinListesiCiz();
}

function izinListesiCiz() {
    document.getElementById("izinPersSec").innerHTML = sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
    document.getElementById("izinListesi").innerHTML = oncedenIzinliler.map((iz, idx) => `
        <div class="admin-list-item"><span>${iz.isim} - ${gunler[iz.gun]}</span><button onclick="izinSil(${idx})" class="btn-sm-danger">Kaldır</button></div>`).join('');
}

function izinSil(idx) {
    oncedenIzinliler.splice(idx, 1);
    localStorage.setItem("oncedenIzinliler", JSON.stringify(oncedenIzinliler));
    izinListesiCiz();
}

// --- ALGORİTMA ---
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};

    sabitPersoneller.forEach(p => {
        haftalikProgram[p.isim] = Array(7).fill(null);
        // Manuel Checkbox İzni
        if (document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİN");
        // Önceden Tanımlı Günlük İzinler
        oncedenIzinliler.forEach(iz => {
            if (iz.isim === p.isim) haftalikProgram[p.isim][iz.gun] = "İZİN";
        });
    });

    // Teknik Yönetmen Rotasyonu (Barış & Ekrem)
    const weekNum = Math.floor(mevcutPazartesi.getTime() / (7 * 24 * 60 * 60 * 1000));
    const sorumlu = (weekNum % 2 === 0) ? "BARIŞ İNCE" : "EKREM FİDAN";
    if (haftalikProgram[sorumlu] && haftalikProgram[sorumlu][0] !== "İZİN") {
        haftalikProgram[sorumlu][0] = "00:00–07:00";
        haftalikProgram[sorumlu][1] = "00:00–07:00";
    }

    renderTable();
}

function renderTable() {
    const head = document.getElementById("tableHeader");
    head.innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');

    let bBody = "";
    saatler.forEach(s => {
        bBody += `<tr><td>${s}</td>`;
        for (let i = 0; i < 7; i++) bBody += `<td>${hucreDoldur(i, s)}</td>`;
        bBody += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = bBody;
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    birimSiralamasi.forEach(birim => {
        let kap = (kapasiteAyarlari[birim] && kapasiteAyarlari[birim][saat]) ? (isHS ? kapasiteAyarlari[birim][saat].haftasonu : kapasiteAyarlari[birim][saat].haftaici) : 0;
        
        let adaylar = sabitPersoneller.filter(p => {
            if (p.birim !== birim || haftalikProgram[p.isim][gun] !== null) return false;
            if (haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length >= 6) return false;
            // Teknik Yönetmen Gece Kuralı
            if (birim === "TEKNİK YÖNETMEN" && saat === "00:00–07:00" && p.isim !== "BARIŞ İNCE" && p.isim !== "EKREM FİDAN") return false;
            return true;
        });

        let suan = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        for (let k = 0; k < (kap - suan); k++) {
            if (adaylar.length > 0) {
                let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                haftalikProgram[p.isim][gun] = saat;
            }
        }
    });

    let list = sabitPersoneller.filter(p => haftalikProgram[p.isim][gun] === saat).sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    return list.map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
}

function checklistOlustur() {
    const cont = document.getElementById("personelChecklist");
    if(!cont) return;
    const s = [...sabitPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    cont.innerHTML = s.map(p => `
        <div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> <label for="check_${p.id}"><strong>${p.isim}</strong></label></div>`).join('');
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light"); }
function sifirla() { if(confirm("TÜM VERİLER SİLİNECEK!")) { localStorage.clear(); location.reload(); } }

window.onload = baslat;