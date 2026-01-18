/**
 * PRO-Vardiya v24.5 Core | Hybrid Engine
 */

let birimSiralamasi = JSON.parse(localStorage.getItem("birimSiralamasi")) || ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || [];
let oncedenIzinliler = JSON.parse(localStorage.getItem("oncedenIzinliler")) || [];
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let taslakProgram = JSON.parse(localStorage.getItem("taslakProgram")) || null;

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

function baslat() {
    birimSiralamasi.forEach(b => {
        if (!kapasiteAyarlari[b]) {
            kapasiteAyarlari[b] = {};
            saatler.forEach(s => { kapasiteAyarlari[b][s] = { haftaici: 0, haftasonu: 0 }; });
        }
    });
    checklistOlustur();
    tabloyuOlustur();
}

// --- VERİ AKTARMA MANTIĞI ---
function veriIceriAktar() {
    try {
        const json = document.getElementById("importJsonText").value;
        const data = JSON.parse(json);
        taslakProgram = data;
        localStorage.setItem("taslakProgram", JSON.stringify(data));
        alert("Taslak başarıyla yüklendi! Algoritma bu veriler üzerine kurulacak.");
        tabloyuOlustur();
    } catch (e) {
        alert("Hatalı veri formatı! Lütfen geçerli bir JSON yapıştırın.");
    }
}

// --- ALGORİTMA ---
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    
    // Eğer dışarıdan yüklenen bir taslak varsa onu temel al, yoksa boşalt
    haftalikProgram = taslakProgram ? JSON.parse(JSON.stringify(taslakProgram)) : {};

    sabitPersoneller.forEach(p => {
        if (!haftalikProgram[p.isim]) haftalikProgram[p.isim] = Array(7).fill(null);
        
        // Checklist İzni
        if (document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİN");
        
        // Sabit Atamalar (Mühürlenmişler)
        sabitAtamalar.forEach(s => { if (s.isim === p.isim) haftalikProgram[p.isim][s.gun] = s.saat; });
    });

    // Teknik Yönetmen Gece Rotasyonu (Barış & Ekrem)
    const weekNum = Math.floor(mevcutPazartesi.getTime() / (7 * 24 * 60 * 60 * 1000));
    const sorumlu = (weekNum % 2 === 0) ? "BARIŞ İNCE" : "EKREM FİDAN";
    if (haftalikProgram[sorumlu] && haftalikProgram[sorumlu][0] === null) {
        haftalikProgram[sorumlu][0] = "00:00–07:00";
        haftalikProgram[sorumlu][1] = "00:00–07:00";
    }

    renderTable();
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    birimSiralamasi.forEach(birim => {
        let kap = (kapasiteAyarlari[birim] && kapasiteAyarlari[birim][saat]) ? (isHS ? kapasiteAyarlari[birim][saat].haftasonu : kapasiteAyarlari[birim][saat].haftaici) : 0;
        
        let adaylar = sabitPersoneller.filter(p => {
            if (p.birim !== birim || haftalikProgram[p.isim][gun] !== null) return false;
            if (haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length >= 6) return false;
            // KURAL: Teknik Yönetmen Gece Vardiyası Yasağı
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

    return sabitPersoneller.filter(p => haftalikProgram[p.isim][gun] === saat)
        .sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
        .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
}

// --- UI / RENDER ---
function renderTable() {
    const head = document.getElementById("tableHeader");
    head.innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');
    let body = "";
    saatler.forEach(s => {
        body += `<tr><td>${s}</td>`;
        for (let i = 0; i < 7; i++) body += `<td>${hucreDoldur(i, s)}</td>`;
        body += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = body;
}

function checklistOlustur() {
    const cont = document.getElementById("personelChecklist");
    const s = [...sabitPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    cont.innerHTML = s.map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> <label for="check_${p.id}"><strong>${p.isim}</strong></label></div>`).join('');
}

function toggleAdminPanel() { 
    const p = document.getElementById("adminPanel"); 
    p.classList.toggle("hidden"); 
    if(!p.classList.contains("hidden")) { kapasitePaneliniCiz(); birimYonetimiCiz(); personelYonetimiCiz(); sabitAtamaListesiCiz(); } 
}

function tabDegistir(name) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + name).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function sabitAtamaEkle() {
    const isim = document.getElementById("sabitPersSec").value;
    const gun = parseInt(document.getElementById("sabitGunSec").value);
    const saat = document.getElementById("sabitSaatSec").value;
    sabitAtamalar.push({ isim, gun, saat });
    localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
    sabitAtamaListesiCiz();
    tabloyuOlustur();
}

function sabitAtamaSil(idx) {
    sabitAtamalar.splice(idx, 1);
    localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
    sabitAtamaListesiCiz();
}

function sabitAtamaListesiCiz() {
    document.getElementById("sabitPersSec").innerHTML = sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
    document.getElementById("sabitSaatSec").innerHTML = saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById("sabitListesi").innerHTML = sabitAtamalar.map((s, idx) => `
        <div class="admin-list-item"><span>${s.isim} (${gunler[s.gun]} - ${s.saat})</span><button onclick="sabitAtamaSil(${idx})" class="btn-sm-danger">Kaldır</button></div>`).join('');
}

function kapasitePaneliniCiz() {
    const cont = document.getElementById("kapasiteListesi");
    let html = `<div class="cap-table-header"><div>Birimler</div>${saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    birimSiralamasi.forEach(b => {
        html += `<div class="cap-row"><strong>${b}</strong>`;
        saatler.forEach(s => {
            html += `<div class="cap-input-group"><input type="number" value="${kapasiteAyarlari[b][s].haftaici}" onchange="guncelleK('${b}','${s}','haftaici',this.value)"><input type="number" class="input-hs" value="${kapasiteAyarlari[b][s].haftasonu}" onchange="guncelleK('${b}','${s}','haftasonu',this.value)"></div>`;
        });
        html += `</div>`;
    });
    cont.innerHTML = html;
}

function guncelleK(b, s, t, v) { kapasiteAyarlari[b][s][t] = parseInt(v) || 0; localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari)); }
function birimYonetimiCiz() { document.getElementById("yeniPersBirim").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join(''); }
function personelEkle() { const isim = document.getElementById("yeniPersIsim").value.trim().toUpperCase(); const birim = document.getElementById("yeniPersBirim").value; if(isim) { sabitPersoneller.push({ id: Date.now(), isim, birim }); localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller)); checklistOlustur(); personelYonetimiCiz(); } }
function personelYonetimiCiz() { document.getElementById("personelYonetimListesi").innerHTML = sabitPersoneller.map(p => `<div class="admin-list-item"><span>${p.isim} (${p.birim})</span><button onclick="personelSil(${p.id})" class="btn-sm-danger">Sil</button></div>`).join(''); }
function personelSil(id) { sabitPersoneller = sabitPersoneller.filter(p => p.id !== id); localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller)); checklistOlustur(); personelYonetimiCiz(); }
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function sifirla() { if(confirm("Sıfırlansın mı?")) { localStorage.clear(); location.reload(); } }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }

window.onload = baslat;