// --- VERİLER ---
const defaultBirimler = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const defaultSaatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let birimSiralamasi = JSON.parse(localStorage.getItem("birimSiralamasi")) || defaultBirimler;
let saatler = JSON.parse(localStorage.getItem("saatler")) || defaultSaatler;
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
window.onload = function() {
    if(sabitPersoneller.length === 0) {
        // İlk açılışta personeller yoksa boş kalmasın diye sistemi temizle ve yükle
        console.log("Sistem boş, veriler bekleniyor...");
    }
    checklistOlustur();
    tabloyuOlustur();
};

function toggleAdminPanel() {
    document.getElementById("adminPanel").classList.toggle("hidden");
    tabDegistir('sabit');
}

function tabDegistir(name) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const target = document.getElementById('tab-' + name);
    if(target) target.classList.remove('hidden');

    if(name === 'sabit') sabitListesiCiz();
    if(name === 'kapasite') kapasiteCiz();
}

// --- KAPASİTE MOTORU (DÜZELTİLDİ) ---
function kapasiteCiz() {
    const container = document.getElementById("kapasiteListesi");
    if(!container) return;

    let html = `<div class="cap-table-header"><div>Birimler</div>${saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    
    birimSiralamasi.forEach(birim => {
        html += `<div class="cap-row"><strong>${birim}</strong>`;
        saatler.forEach(saat => {
            const hVal = kapasiteAyarlari[birim]?.[saat]?.h || 0;
            const hsVal = kapasiteAyarlari[birim]?.[saat]?.hs || 0;
            html += `
                <div class="cap-input-group">
                    <input type="number" value="${hVal}" onchange="kapasiteKaydet('${birim}','${saat}','h',this.value)">
                    <input type="number" class="input-hs" value="${hsVal}" onchange="kapasiteKaydet('${birim}','${saat}','hs',this.value)">
                </div>`;
        });
        html += `</div>`;
    });
    container.innerHTML = html;
}

function kapasiteKaydet(b, s, t, v) {
    if(!kapasiteAyarlari[b]) kapasiteAyarlari[b] = {};
    if(!kapasiteAyarlari[b][s]) kapasiteAyarlari[b][s] = {};
    kapasiteAyarlari[b][s][t] = parseInt(v) || 0;
    localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
}

// --- TABLO OLUŞTURMA (VARDİYA OLUŞTUR BUTONU) ---
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    sabitPersoneller.forEach(p => {
        program[p.isim] = Array(7).fill(null);
        const chk = document.getElementById(`check_${p.id}`);
        if(chk && chk.checked) program[p.isim].fill("İZİNLİ");
    });

    // Sabit Atama Kuralları
    sabitAtamalar.forEach(atama => {
        if(program[atama.isim]) {
            if(atama.gun === "pzt_cum") {
                for(let i=0; i<5; i++) if(program[atama.isim][i] !== "İZİNLİ") program[atama.isim][i] = atama.saat;
                program[atama.isim][5] = "İZİNLİ";
                program[atama.isim][6] = "İZİNLİ";
            } else {
                let g = parseInt(atama.gun);
                if(program[atama.isim][g] !== "İZİNLİ") program[atama.isim][g] = atama.saat;
            }
        }
    });

    // MCR ve Teknik Yönetmen Otomatik Kurallar
    const refDate = new Date("2026-01-19");
    const diff = Math.floor((mevcutPazartesi - refDate) / (1000*60*60*24));

    sabitPersoneller.forEach(p => {
        for(let i=0; i<7; i++) {
            if(program[p.isim][i] !== null) continue;

            if(p.birim.includes("MCR")) {
                let idx = sabitPersoneller.filter(x => x.birim === p.birim).indexOf(p);
                let cycle = (diff + i + (idx * 2)) % 8;
                if(cycle < 0) cycle += 8;
                program[p.isim][i] = cycle < 2 ? "06:30–16:00" : cycle < 4 ? "16:00–00:00" : cycle < 6 ? "00:00–07:00" : "İZİNLİ";
            }
            
            if(p.birim === "TEKNİK YÖNETMEN" && (p.isim === "BARIŞ İNCE" || p.isim === "EKREM FİDAN")) {
                let sorumlu = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN";
                if(p.isim === sorumlu) program[p.isim][i] = "00:00–07:00";
            }
        }
    });

    render(program);
}

function render(program) {
    const header = document.getElementById("tableHeader");
    const body = document.getElementById("tableBody");
    const footer = document.getElementById("tableFooter");

    header.innerHTML = `<tr><th>SAATLER</th>${gunler.map((g,i) => {
        let d = new Date(mevcutPazartesi); d.setDate(d.getDate()+i);
        return `<th>${g}<br><small>${d.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('')}</tr>`;

    let bodyHtml = "";
    saatler.forEach(s => {
        bodyHtml += `<tr><td><strong>${s}</strong></td>`;
        for(let i=0; i<7; i++) {
            let list = sabitPersoneller.filter(p => program[p.isim][i] === s)
                .map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
            bodyHtml += `<td>${list}</td>`;
        }
        bodyHtml += `</tr>`;
    });
    body.innerHTML = bodyHtml;

    footer.innerHTML = `<tr><td><strong>İZİNLİ</strong></td>${[0,1,2,3,4,5,6].map(i => {
        let iz = sabitPersoneller.filter(p => program[p.isim][i] === "İZİNLİ")
            .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
        return `<td>${iz}</td>`;
    }).join('')}</tr>`;
}

function checklistOlustur() {
    const cont = document.getElementById("personelChecklist");
    if(!cont) return;
    cont.innerHTML = sabitPersoneller.map(p => `
        <div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label>${p.isim}</label></div>
    `).join('');
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
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
        <div class="admin-list-item"><span>${s.isim} | ${s.gun}</span><button onclick="sabitSil(${i})">SİL</button></div>
    `).join('');
}
function sabitSil(i) {
    sabitAtamalar.splice(i, 1);
    localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
    sabitListesiCiz(); tabloyuOlustur();
}

function sifirla() { localStorage.clear(); location.reload(); }