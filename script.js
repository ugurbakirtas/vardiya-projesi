/**
 * PRO-Vardiya v26.0 | Alt İzin Satırı & Manuel Yönetim
 */

const birimSiralamasi = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];

const varsayilanPersoneller = [
    { isim: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN" }, { isim: "M.BERKMAN", birim: "TEKNİK YÖNETMEN" },
    { isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN" }, { isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN" },
    { isim: "H.CAN SAĞLAM", birim: "TEKNİK YÖNETMEN" }, { isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN" },
    { isim: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ" }, { isim: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ" },
    { isim: "ZAFER AKAR", birim: "SES OPERATÖRÜ" }, { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ" },
    { isim: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ" }, { isim: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ" },
    { isim: "ENES KALE", birim: "SES OPERATÖRÜ" }, { isim: "ERSAN TİLBE", birim: "SES OPERATÖRÜ" },
    { isim: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ" }, { isim: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ" }, { isim: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ" }, { isim: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ" }, { isim: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ" },
    { isim: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ" }, { isim: "DEMET CENGİZ", birim: "KJ OPERATÖRÜ" },
    { isim: "SENA BAYDAR", birim: "KJ OPERATÖRÜ" }, { isim: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ" },
    { isim: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ" }, { isim: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ" },
    { isim: "ERCAN PALABIYIK", birim: "INGEST OPERATÖRÜ" }, { isim: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ" },
    { isim: "UĞUR AKBABA", birim: "INGEST OPERATÖRÜ" }, { isim: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM" },
    { isim: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM" }, { isim: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM" },
    { isim: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM" }, { isim: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ" },
    { isim: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ" }, { isim: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ" },
    { isim: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ" }, { isim: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ" },
    { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" }, { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" }, { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" }, { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" }, { isim: "MUSAB YAKUP DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" }
];

let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || varsayilanPersoneller.map((p, i) => ({...p, id: i+1}));
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];
const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

function baslat() {
    birimSiralamasi.forEach(b => {
        if (!kapasiteAyarlari[b]) {
            kapasiteAyarlari[b] = {};
            saatler.forEach(s => {
                let hi = 1, hs = 1;
                if (b === "TEKNİK YÖNETMEN") {
                    if (s === "06:30–16:00") { hi = 2; hs = 1; }
                    else if (s === "16:00–00:00" || s === "00:00–07:00") { hi = 1; hs = 1; }
                    else { hi = 0; hs = 0; }
                }
                kapasiteAyarlari[b][s] = { haftaici: hi, haftasonu: hs };
            });
        }
    });
    document.getElementById("yeniPersonelBirim").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
    checklistOlustur();
    tabloyuOlustur();
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    sabitPersoneller.forEach(p => {
        haftalikProgram[p.isim] = Array(7).fill(null);
        if (document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİNLİ");
        sabitAtamalar.forEach(s => {
            if (s.isim === p.isim) {
                if (s.gun === "all") { for(let i=0; i<7; i++) { if(haftalikProgram[p.isim][i] === null) haftalikProgram[p.isim][i] = s.saat; } }
                else { haftalikProgram[p.isim][parseInt(s.gun)] = s.saat; }
            }
        });
    });

    const weekNum = Math.floor(mevcutPazartesi.getTime() / (7 * 24 * 60 * 60 * 1000));
    const sorumluGece = (weekNum % 2 === 0) ? "BARIŞ İNCE" : "EKREM FİDAN";
    [0, 1].forEach(gun => { if (haftalikProgram[sorumluGece] && haftalikProgram[sorumluGece][gun] === null) haftalikProgram[sorumluGece][gun] = "00:00–07:00"; });
    renderTable();
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    birimSiralamasi.forEach(birim => {
        let kap = (kapasiteAyarlari[birim] && kapasiteAyarlari[birim][saat]) ? (isHS ? kapasiteAyarlari[birim][saat].haftasonu : kapasiteAyarlari[birim][saat].haftaici) : 0;
        let adaylar = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === null);
        let suan = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        for (let k = 0; k < (kap - suan); k++) {
            if (adaylar.length > 0) {
                let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                haftalikProgram[p.isim][gun] = saat;
            }
        }
    });

    let html = sabitPersoneller.filter(p => haftalikProgram[p.isim][gun] === saat)
        .sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
        .map(p => `<div class="birim-card" onclick="manuelSil('${p.isim}', ${gun})"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
    
    return html + `<button class="btn-mini-add no-print" onclick="manuelEklePencere(${gun}, '${saat}')">+</button>`;
}

function manuelSil(isim, gun) {
    if(confirm(`${isim} vardiyadan çıkarılsın mı?`)) { haftalikProgram[isim][gun] = null; renderTable(); }
}

function manuelEklePencere(gun, saat) {
    let adaylar = sabitPersoneller.filter(p => haftalikProgram[p.isim][gun] === null);
    if(adaylar.length === 0) return alert("Boşta personel yok!");
    let liste = adaylar.map((p, i) => `${i+1}- ${p.isim} (${p.birim})`).join('\n');
    let secim = prompt("Personel No yazın:\n" + liste);
    if(secim && adaylar[secim-1]) { haftalikProgram[adaylar[secim-1].isim][gun] = saat; renderTable(); }
}

function renderTable() {
    const head = document.getElementById("tableHeader");
    head.innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');
    
    let body = "";
    saatler.forEach(s => {
        body += `<tr><td><strong>${s}</strong></td>`;
        for (let i = 0; i < 7; i++) body += `<td>${hucreDoldur(i, s)}</td>`;
        body += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = body;

    // ALT İZİNLİ SATIRI
    let footer = `<tr class="izinli-satiri"><td><strong>İZİNLİ</strong></td>`;
    for (let i = 0; i < 7; i++) {
        let izinliler = sabitPersoneller.filter(p => haftalikProgram[p.isim][i] === "İZİNLİ")
            .map(p => `<div class="birim-card izinli-kart"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
        footer += `<td>${izinliler}</td>`;
    }
    footer += `</tr>`;
    document.getElementById("tableFooter").innerHTML = footer;
}

function checklistOlustur() {
    const cont = document.getElementById("personelChecklist");
    cont.innerHTML = sabitPersoneller.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim))
        .map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label for="check_${p.id}"><strong>${p.isim}</strong></label></div>`).join('');
}

function manuelPersonelEkle() {
    const ad = document.getElementById("yeniPersonelAd").value.trim().toUpperCase();
    const birim = document.getElementById("yeniPersonelBirim").value;
    if(!ad) return;
    sabitPersoneller.push({ isim: ad, birim: birim, id: Date.now() });
    localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
    alert("Personel Eklendi"); location.reload();
}

function personelSil(id) {
    if(confirm("Silinsin mi?")) {
        sabitPersoneller = sabitPersoneller.filter(p => p.id !== id);
        localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
        personelYonetimiCiz(); checklistOlustur(); tabloyuOlustur();
    }
}

function toggleAdminPanel() { 
    const p = document.getElementById("adminPanel"); p.classList.toggle("hidden"); 
    if(!p.classList.contains("hidden")) { kapasitePaneliniCiz(); personelYonetimiCiz(); sabitAtamaListesiCiz(); } 
}

function tabDegistir(name) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + name).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function sabitAtamaEkle() {
    sabitAtamalar.push({ isim: document.getElementById("sabitPersSec").value, gun: document.getElementById("sabitGunSec").value, saat: document.getElementById("sabitSaatSec").value });
    localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
    sabitAtamaListesiCiz(); tabloyuOlustur();
}

function sabitAtamaSil(idx) { 
    sabitAtamalar.splice(idx, 1); localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar)); 
    sabitAtamaListesiCiz(); tabloyuOlustur(); 
}

function personelYonetimiCiz() {
    document.getElementById("personelYonetimListesi").innerHTML = sabitPersoneller.sort((a,b) => a.birim.localeCompare(b.birim))
        .map(p => `<div class="admin-list-item"><span><b>[${p.birim}]</b> ${p.isim}</span><button onclick="personelSil(${p.id})">Sil</button></div>`).join('');
}

function sabitAtamaListesiCiz() {
    document.getElementById("sabitPersSec").innerHTML = sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
    document.getElementById("sabitSaatSec").innerHTML = saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById("sabitListesi").innerHTML = sabitAtamalar.map((s, idx) => `<div class="admin-list-item"><span>${s.isim} (${s.gun === 'all' ? 'HER GÜN' : gunler[s.gun]}) -> ${s.saat}</span><button onclick="sabitAtamaSil(${idx})">Sil</button></div>`).join('');
}

function kapasitePaneliniCiz() {
    const cont = document.getElementById("kapasiteListesi");
    let html = `<div class="cap-table-header"><div>Birimler</div>${saatler.map(s => `<div>${s.slice(0,5)}</div>`).join('')}</div>`;
    birimSiralamasi.forEach(b => {
        html += `<div class="cap-row"><strong>${b}</strong>`;
        saatler.forEach(s => {
            html += `<div class="cap-input-group"><input type="number" value="${kapasiteAyarlari[b][s].haftaici}" onchange="guncelleK('${b}','${s}','haftaici',this.value)"><input type="number" class="input-hs" value="${kapasiteAyarlari[b][s].haftasonu}" onchange="guncelleK('${b}','${s}','haftasonu',this.value)"></div>`;
        });
        html += `</div>`;
    });
    cont.innerHTML = html;
}

function guncelleK(b,s,t,v) { kapasiteAyarlari[b][s][t] = parseInt(v) || 0; localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari)); }
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function sifirla() { if(confirm("Tüm veriler temizlensin mi?")) { localStorage.clear(); location.reload(); } }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya_Raporu.xlsx"); }

window.onload = baslat;