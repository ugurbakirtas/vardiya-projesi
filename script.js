/**
 * PRO-Vardiya v21.0 | Akıllı Algoritma Motoru
 */

const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

const sabitPersoneller = [
    { id: 1, isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN" },
    { id: 2, isim: "HASAN CAN SAĞLAM", birim: "TEKNİK YÖNETMEN" },
    { id: 3, isim: "MEHMET BERKMAN", birim: "TEKNİK YÖNETMEN" },
    { id: 4, isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN" },
    { id: 5, isim: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN" },
    { id: 6, isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN" },
    { id: 7, isim: "ZAFER AKAR", birim: "SES OPERATÖRÜ" },
    { id: 8, isim: "ENES KALE", birim: "SES OPERATÖRÜ" },
    { id: 9, isim: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ" },
    { id: 10, isim: "ERSAN TİLBE", birim: "SES OPERATÖRÜ" },
    { id: 11, isim: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ" },
    { id: 12, isim: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ" },
    { id: 13, isim: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ" },
    { id: 14, isim: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ" },
    { id: 15, isim: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 16, isim: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 17, isim: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 18, isim: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 19, isim: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 20, isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 21, isim: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 22, isim: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ" },
    { id: 23, isim: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ" },
    { id: 24, isim: "UĞUR AKBABA", birim: "KJ OPERATÖRÜ" },
    { id: 25, isim: "SENA BAYDAR", birim: "KJ OPERATÖRÜ" },
    { id: 26, isim: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ" },
    { id: 27, isim: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ" },
    { id: 28, isim: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ" },
    { id: 29, isim: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ" },
    { id: 31, isim: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM" },
    { id: 32, isim: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM" },
    { id: 33, isim: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM" },
    { id: 34, isim: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM" },
    { id: 35, isim: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ" },
    { id: 36, isim: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ" },
    { id: 37, isim: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ" },
    { id: 38, isim: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ" },
    { id: 39, isim: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ" },
    { id: 40, isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { id: 41, isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { id: 42, isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" },
    { id: 43, isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
    { id: 44, isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
    { id: 45, isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" },
    { id: 46, isim: "MUSAB YAKUB DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" },
    { id: 47, isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" }
];

let ekPersoneller = JSON.parse(localStorage.getItem("ekPersoneller")) || [];
let tumPersoneller = [...sabitPersoneller, ...ekPersoneller];
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let algoritmaKurallari = JSON.parse(localStorage.getItem("algoritmaKurallari")) || [];
let autoRules = JSON.parse(localStorage.getItem("autoRules")) || { geceSonrasiIzin: false, pesPeseGece: false, maksimumGun: false };
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function baslat() {
    birimSiralamasi.forEach(b => {
        if(!kapasiteAyarlari[b]) {
            kapasiteAyarlari[b] = {};
            saatler.forEach(s => { kapasiteAyarlari[b][s] = { haftaici: 0, haftasonu: 0 }; });
        }
    });
    if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
    updateThemeIcon();
    autoRulesYukle();
    checklistOlustur();
    tabloyuOlustur();
}

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// PANEL YÖNETİMİ
function toggleAdminPanel() {
    const p = document.getElementById("adminPanel");
    p.classList.toggle("hidden");
    if(!p.classList.contains("hidden")) {
        kapasitePaneliniCiz();
        kuralArayuzunuHazirla();
    }
}

function tabDegistir(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function kapasitePaneliniCiz() {
    const cont = document.getElementById("kapasiteListesi");
    cont.innerHTML = birimSiralamasi.filter(b => !b.includes("MCR") && !b.includes("INGEST")).map(b => `
        <div class="cap-row">
            <strong>${b}</strong>
            ${saatler.map(s => `
                <div class="cap-input-group">
                    <input type="number" value="${kapasiteAyarlari[b][s].haftaici}" onchange="guncelleK('${b}','${s}','haftaici',this.value)" title="Hafta İçi">
                    <input type="number" class="input-hs" value="${kapasiteAyarlari[b][s].haftasonu}" onchange="guncelleK('${b}','${s}','haftasonu',this.value)" title="Hafta Sonu">
                </div>
            `).join('')}
        </div>
    `).join('');
}

function guncelleK(b, s, t, v) {
    kapasiteAyarlari[b][s][t] = parseInt(v) || 0;
    localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
}

function kuralArayuzunuHazirla() {
    document.getElementById("kuralPersonel").innerHTML = tumPersoneller.map(p => `<option value="${p.isim}">${p.isim}</option>`).join('');
    document.getElementById("kuralSaat").innerHTML = `<option value="Hepsi">Tüm Saatler</option>` + saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    kuralListesiniCiz();
}

function kuralKaydet() {
    const k = { id: Date.now(), personel: document.getElementById("kuralPersonel").value, gun: document.getElementById("kuralGun").value, saat: document.getElementById("kuralSaat").value, tip: document.getElementById("kuralTip").value };
    algoritmaKurallari.push(k);
    localStorage.setItem("algoritmaKurallari", JSON.stringify(algoritmaKurallari));
    kuralListesiniCiz();
}

function kuralListesiniCiz() {
    document.getElementById("aktifKurallarListesi").innerHTML = algoritmaKurallari.map(k => `
        <div class="kural-item" style="padding:8px; border:1px solid #ddd; margin-bottom:5px; display:flex; justify-content:space-between">
            <span>${k.personel} - ${k.gun === 'Hepsi' ? 'Her Gün' : gunler[k.gun]} (${k.tip})</span>
            <button onclick="kuralSil(${k.id})">🗑️</button>
        </div>
    `).join('');
}

function kuralSil(id) {
    algoritmaKurallari = algoritmaKurallari.filter(k => k.id !== id);
    localStorage.setItem("algoritmaKurallari", JSON.stringify(algoritmaKurallari));
    kuralListesiniCiz();
}

function autoRuleKaydet() {
    autoRules = {
        geceSonrasiIzin: document.getElementById("rule_geceSonrasiIzin").checked,
        pesPeseGece: document.getElementById("rule_pesPeseGece").checked,
        maksimumGun: document.getElementById("rule_maksimumGun").checked
    };
    localStorage.setItem("autoRules", JSON.stringify(autoRules));
}

function autoRulesYukle() {
    document.getElementById("rule_geceSonrasiIzin").checked = autoRules.geceSonrasiIzin;
    document.getElementById("rule_pesPeseGece").checked = autoRules.pesPeseGece;
    document.getElementById("rule_maksimumGun").checked = autoRules.maksimumGun;
}

// ANA PLANLAMA ALGORİTMASI
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    tumPersoneller.forEach(p => {
        haftalikProgram[p.isim] = Array(7).fill(null);
        if(document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİN");
        
        // Zorunlu Kurallar (Sabitler)
        algoritmaKurallari.filter(k => k.personel === p.isim && k.tip === 'ZORUNLU').forEach(k => {
            if(k.gun === 'Hepsi') for(let i=0; i<7; i++) { if(haftalikProgram[p.isim][i] !== "İZİN") haftalikProgram[p.isim][i] = k.saat; }
            else if(haftalikProgram[p.isim][k.gun] !== "İZİN") haftalikProgram[p.isim][k.gun] = k.saat;
        });
    });

    // Barış & Ekrem Sabit Gece (Özel Kural)
    if(haftalikProgram["BARIŞ İNCE"] && !haftalikProgram["BARIŞ İNCE"].includes("İZİN")) { haftalikProgram["BARIŞ İNCE"][0] = "00:00–07:00"; haftalikProgram["BARIŞ İNCE"][1] = "00:00–07:00"; }
    if(haftalikProgram["EKREM FİDAN"] && !haftalikProgram["EKREM FİDAN"].includes("İZİN")) { for(let i=2; i<7; i++) haftalikProgram["EKREM FİDAN"][i] = "00:00–07:00"; }

    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();
    renderTable();
    ozetGuncelle();
}

function renderTable() {
    const head = document.getElementById("tableHeader");
    head.innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');

    let b = "";
    saatler.forEach(s => {
        b += `<tr><td>${s}</td>`;
        for(let i=0; i<7; i++) b += `<td>${hucreDoldur(i, s)}</td>`;
        b += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = b;
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    birimSiralamasi.forEach(birim => {
        if(birim.includes("MCR") || birim.includes("INGEST")) return;
        let kap = 0;
        if(kapasiteAyarlari[birim] && kapasiteAyarlari[birim][saat]) kap = isHS ? kapasiteAyarlari[birim][saat].haftasonu : kapasiteAyarlari[birim][saat].haftaici;
        if(birim === "SES OPERATÖRÜ" && saat === "00:00–07:00") kap = 0;

        let adaylar = tumPersoneller.filter(p => {
            if(p.birim !== birim || haftalikProgram[p.isim][gun] !== null) return false;
            // Yasak Kuralı
            if(algoritmaKurallari.some(k => k.personel === p.isim && k.tip === 'YASAK' && (k.gun === 'Hepsi' || parseInt(k.gun) === gun) && (k.saat === 'Hepsi' || k.saat === saat))) return false;
            // Akıllı Kurallar
            if(autoRules.geceSonrasiIzin && gun > 0 && haftalikProgram[p.isim][gun-1] === "00:00–07:00") return false;
            if(autoRules.pesPeseGece && saat === "00:00–07:00") {
               if(haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length >= 2) return false;
               if(gun > 0 && haftalikProgram[p.isim][gun-1] === "00:00–07:00") return false;
            }
            if(autoRules.maksimumGun && haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length >= 5) return false;
            return true;
        });

        let suan = tumPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        for(let k=0; k < (kap-suan); k++) { if(adaylar.length > 0) { let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0]; haftalikProgram[p.isim][gun] = saat; } }
    });
    
    let list = tumPersoneller.filter(p => haftalikProgram[p.isim][gun] === saat).sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    return list.map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`).join('');
}

// Rotalar
function applyIngestRota() {
    const ekip = tumPersoneller.filter(p => p.birim === "INGEST OPERATÖRÜ");
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "İZİN", "İZİN"];
    ekip.forEach((p, idx) => { for(let i=0; i<7; i++) { let d = new Date(mevcutPazartesi.getTime() + (i * 86400000)); let rI = (Math.floor((d - new Date(2025, 0, 6)) / 86400000) + (idx * 2)) % 6; if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 6 : rI]; } });
}
function applyMCRRota(birim) {
    const ekip = tumPersoneller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    ekip.forEach((p, idx) => { for(let i=0; i<7; i++) { let d = new Date(mevcutPazartesi.getTime() + (i * 86400000)); let rI = (Math.floor((d - new Date(2025, 0, 6)) / 86400000) + (idx * 2)) % 8; if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 8 : rI]; } });
}

// UI Yardımcıları
function checklistOlustur() {
    const s = [...tumPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    document.getElementById("personelChecklist").innerHTML = s.map(p => `<div class="check-item" data-isim="${p.isim}"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> <div style="margin-left:5px"><span class="birim-tag">${p.birim}</span><strong>${p.isim}</strong></div></div>`).join('');
}
function checklistFiltrele() { const q = document.getElementById("personelAra").value.toUpperCase(); document.querySelectorAll(".check-item").forEach(i => i.style.display = i.getAttribute("data-isim").includes(q) ? "flex" : "none"); }
function ozetGuncelle() {
    let h = `<table style="width:100%; margin-top:15px; border:1px solid #ddd"><tr><th>Personel</th><th>Mesai</th><th>Gece</th></tr>`;
    [...tumPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim)).forEach(p => {
        h += `<tr><td>${p.isim}</td><td>${haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length} G</td><td>${haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length}</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + "</table>";
}
function toggleTheme() { document.body.classList.toggle("dark-mode"); localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light"); updateThemeIcon(); }
function updateThemeIcon() { document.getElementById("themeBtn").innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙"; }
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "TeknikVardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save('TeknikVardiya.pdf'); }
function sifirla() { if(confirm("Tüm veriler silinecektir?")) { localStorage.clear(); location.reload(); } }
function whatsappMesajiOlustur() {
    let m = `📋 *HAFTALIK VARDİYA PLANI*\n\n`;
    gunler.forEach((g, i) => { m += `*${g.toUpperCase()}*\n`; saatler.forEach(s => { let l = tumPersoneller.filter(p => haftalikProgram[p.isim][i] === s); if(l.length > 0) m += `▫️ ${s}: ${l.map(x => x.isim).join(", ")}\n`; }); m += `\n`; });
    navigator.clipboard.writeText(m).then(() => alert("WhatsApp mesajı kopyalandı!"));
}
window.onload = baslat;