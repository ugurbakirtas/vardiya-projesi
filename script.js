/**
 * PRO-Vardiya v26.0 | Excel ve Personel Analizli Motor
 */

const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const varsayilanPersoneller = [
    { isim: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN" },
    { isim: "M.BERKMAN", birim: "TEKNİK YÖNETMEN" },
    { isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN" },
    { isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN" },
    { isim: "H.CAN SAĞLAM", birim: "TEKNİK YÖNETMEN" },
    { isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN" },
    { isim: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ" },
    { isim: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ" },
    { isim: "ZAFER AKAR", birim: "SES OPERATÖRÜ" },
    { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ" },
    { isim: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ" },
    { isim: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ" },
    { isim: "ENES KALE", birim: "SES OPERATÖRÜ" },
    { isim: "ERSAN TİLBE", birim: "SES OPERATÖRÜ" },
    { isim: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ" },
    { isim: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ" },
    { isim: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ" },
    { isim: "DEMET CENGİZ", birim: "KJ OPERATÖRÜ" },
    { isim: "SENA BAYDAR", birim: "KJ OPERATÖRÜ" },
    { isim: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ" },
    { isim: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ" },
    { isim: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ" },
    { isim: "ERCAN PALABIYIK", birim: "INGEST OPERATÖRÜ" },
    { isim: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ" },
    { isim: "UĞUR AKBABA", birim: "INGEST OPERATÖRÜ" },
    { isim: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM" },
    { isim: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM" },
    { isim: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM" },
    { isim: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM" },
    { isim: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ" },
    { isim: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ" },
    { isim: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ" },
    { isim: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ" },
    { isim: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ" },
    { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "MUSAB YAKUP DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" }
];

let sabitPersoneller = JSON.parse(localStorage.getItem("sabitPersoneller")) || varsayilanPersoneller.map((p, i) => ({...p, id: i+1}));
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let sabitAtamalar = JSON.parse(localStorage.getItem("sabitAtamalar")) || [];
const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

function excelYukle(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        if (jsonData.length > 0) {
            sabitPersoneller = jsonData.map((p, i) => ({
                isim: (p.İsim || p.isim || p.Name || "").trim().toUpperCase(),
                birim: (p.Birim || p.birim || p.Unit || "").trim().toUpperCase(),
                id: i + 1
            }));
            localStorage.setItem("sabitPersoneller", JSON.stringify(sabitPersoneller));
            alert("Liste Güncellendi!");
            location.reload();
        }
    };
    reader.readAsArrayBuffer(file);
}

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
                if ((b.includes("MCR")) && s === "00:00–07:00") { hi = 1; hs = 1; }
                kapasiteAyarlari[b][s] = { haftaici: hi, haftasonu: hs };
            });
        }
    });
    checklistOlustur();
    tabloyuOlustur();
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    sabitPersoneller.forEach(p => {
        haftalikProgram[p.isim] = Array(7).fill(null);
        if (document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİN");
        sabitAtamalar.forEach(s => { if (s.isim === p.isim) haftalikProgram[p.isim][s.gun] = s.saat; });
    });
    
    // Teknik Yönetmen Gece Rotasyonu
    const weekNum = Math.floor(mevcutPazartesi.getTime() / (7 * 24 * 60 * 60 * 1000));
    const sorumluGece = (weekNum % 2 === 0) ? "BARIŞ İNCE" : "EKREM FİDAN";
    [0, 1].forEach(gun => { 
        if (haftalikProgram[sorumluGece] && haftalikProgram[sorumluGece][gun] === null) 
            haftalikProgram[sorumluGece][gun] = "00:00–07:00"; 
    });

    renderTable();
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    birimSiralamasi.forEach(birim => {
        let kap = (kapasiteAyarlari[birim] && kapasiteAyarlari[birim][saat]) ? (isHS ? kapasiteAyarlari[birim][saat].haftasonu : kapasiteAyarlari[birim][saat].haftaici) : 0;
        let adaylar = sabitPersoneller.filter(p => {
            if (p.birim !== birim || haftalikProgram[p.isim][gun] !== null) return false;
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
    cont.innerHTML = s.map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><label for="check_${p.id}"><strong>${p.isim}</strong><br><small>${p.birim}</small></label></div>`).join('');
}

function toggleAdminPanel() { 
    const p = document.getElementById("adminPanel"); 
    p.classList.toggle("hidden"); 
    if(!p.classList.contains("hidden")) { kapasitePaneliniCiz(); personelYonetimiCiz(); sabitAtamaListesiCiz(); } 
}

function tabDegistir(name) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + name).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function sabitAtamaEkle() {
    sabitAtamalar.push({ isim: document.getElementById("sabitPersSec").value, gun: parseInt(document.getElementById("sabitGunSec").value), saat: document.getElementById("sabitSaatSec").value });
    localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar));
    sabitAtamaListesiCiz(); tabloyuOlustur();
}

function sabitAtamaSil(idx) { 
    sabitAtamalar.splice(idx, 1); localStorage.setItem("sabitAtamalar", JSON.stringify(sabitAtamalar)); 
    sabitAtamaListesiCiz(); tabloyuOlustur(); 
}

function sabitAtamaListesiCiz() {
    document.getElementById("sabitPersSec").innerHTML = sabitPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
    document.getElementById("sabitSaatSec").innerHTML = saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById("sabitListesi").innerHTML = sabitAtamalar.map((s, idx) => `<div class="admin-list-item"><span>${s.isim} (${gunler[s.gun]})</span><button onclick="sabitAtamaSil(${idx})">Sil</button></div>`).join('');
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
function personelYonetimiCiz() { document.getElementById("personelYonetimListesi").innerHTML = sabitPersoneller.map(p => `<div class="admin-list-item"><span>${p.isim} - ${p.birim}</span></div>`).join(''); }
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function sifirla() { if(confirm("Tüm veriler temizlensin mi?")) { localStorage.clear(); location.reload(); } }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya_Raporu.xlsx"); }

window.onload = baslat;