/**
 * PRO-Vardiya v19.0 | Dark Mode & Dinamik Koşullar
 */

let birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

// Personel Listesi
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
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

// AYARLAR & KOŞULLAR
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let ozelKosullar = JSON.parse(localStorage.getItem("ozelKosullar")) || [];

function baslat() {
    birimSiralamasi.forEach(b => {
        if(!kapasiteAyarlari[b]) {
            kapasiteAyarlari[b] = {};
            saatler.forEach(s => {
                kapasiteAyarlari[b][s] = { haftaici: 0, haftasonu: 0 };
            });
        }
    });
    // Dark mode tercihi
    if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
    updateThemeIcon();
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
        kosullariCiz();
    }
}

function kapasitePaneliniCiz() {
    const cont = document.getElementById("kapasiteListesi");
    cont.innerHTML = birimSiralamasi.filter(b => !b.includes("MCR") && !b.includes("INGEST")).map(b => `
        <div class="cap-row">
            <strong>${b}</strong>
            ${saatler.map(s => `
                <div class="cap-input-group">
                    <span>${s.split('–')[0]}</span>
                    <input type="number" value="${kapasiteAyarlari[b][s].haftaici}" onchange="guncelleK('${b}','${s}','haftaici',this.value)">
                    <input type="number" class="input-hs" value="${kapasiteAyarlari[b][s].haftasonu}" onchange="guncelleK('${b}','${s}','haftasonu',this.value)">
                </div>
            `).join('')}
        </div>
    `).join('');
}

function guncelleK(b, s, t, v) {
    kapasiteAyarlari[b][s][t] = parseInt(v) || 0;
    localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
}

// KOŞUL EKLEME SİSTEMİ
function ozelKosulEkle() {
    const k = prompt("Yeni Kural/Koşul Giriniz: (Örn: Reji ekibi 12:00 toplantısı)");
    if(k) {
        ozelKosullar.push(k);
        localStorage.setItem("ozelKosullar", JSON.stringify(ozelKosullar));
        kosullariCiz();
        tabloyuOlustur();
    }
}

function kosullariCiz() {
    const cont = document.getElementById("aktifKosullar");
    const footer = document.getElementById("kosulNotlari");
    cont.innerHTML = ozelKosullar.map((k, i) => `<div>📌 ${k} <button onclick="kosulSil(${i})" style="color:red; background:none; border:none; cursor:pointer">×</button></div>`).join('');
    footer.innerHTML = ozelKosullar.map(k => `• ${k}`).join('<br>');
}

function kosulSil(i) {
    ozelKosullar.splice(i, 1);
    localStorage.setItem("ozelKosullar", JSON.stringify(ozelKosullar));
    kosullariCiz();
    tabloyuOlustur();
}

// TEMA YÖNETİMİ
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
    updateThemeIcon();
}

function updateThemeIcon() {
    document.getElementById("themeBtn").innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

// PLANLAMA MOTORU
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    tumPersoneller.forEach(p => {
        const check = document.getElementById(`check_${p.id}`);
        haftalikProgram[p.isim] = (check && check.checked) ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // Barış & Ekrem Sabit Gece (Değiştirilemez)
    if(haftalikProgram["BARIŞ İNCE"] && !haftalikProgram["BARIŞ İNCE"].includes("İZİN")) {
        haftalikProgram["BARIŞ İNCE"][0] = "00:00–07:00"; haftalikProgram["BARIŞ İNCE"][1] = "00:00–07:00";
    }
    if(haftalikProgram["EKREM FİDAN"] && !haftalikProgram["EKREM FİDAN"].includes("İZİN")) {
        for(let i=2; i<7; i++) haftalikProgram["EKREM FİDAN"][i] = "00:00–07:00";
    }

    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();
    renderTable();
    ozetGuncelle();
    kosullariCiz();
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
        if(kapasiteAyarlari[birim] && kapasiteAyarlari[birim][saat]) {
            kap = isHS ? kapasiteAyarlari[birim][saat].haftasonu : kapasiteAyarlari[birim][saat].haftaici;
        }
        if(birim === "SES OPERATÖRÜ" && saat === "00:00–07:00") kap = 0;

        let adaylar = tumPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === null);
        let suan = tumPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        for(let k=0; k < (kap-suan); k++) {
            if(adaylar.length > 0) {
                let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                haftalikProgram[p.isim][gun] = saat;
            }
        }
    });
    let list = tumPersoneller.filter(p => haftalikProgram[p.isim][gun] === saat);
    list.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    return list.map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`).join('');
}

// Rotalar ve Yardımcılar
function applyIngestRota() {
    const ekip = tumPersoneller.filter(p => p.birim === "INGEST OPERATÖRÜ");
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "İZİN", "İZİN"];
    ekip.forEach((p, idx) => {
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rI = (Math.floor((d - new Date(2025, 0, 6)) / 86400000) + (idx * 2)) % 6;
            if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 6 : rI];
        }
    });
}
function applyMCRRota(birim) {
    const ekip = tumPersoneller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    ekip.forEach((p, idx) => {
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rI = (Math.floor((d - new Date(2025, 0, 6)) / 86400000) + (idx * 2)) % 8;
            if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 8 : rI];
        }
    });
}

function checklistOlustur() {
    const c = document.getElementById("personelChecklist");
    const s = [...tumPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    c.innerHTML = s.map(p => `<div class="check-item" data-isim="${p.isim}" onclick="toggleCb('${p.id}')"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"><div><span style="font-size:8px; color:blue; display:block">${p.birim}</span><strong>${p.isim}</strong></div></div>`).join('');
}
function toggleCb(id) { const el = document.getElementById('check_'+id); if(el){ el.checked = !el.checked; tabloyuOlustur(); } }
function checklistFiltrele() {
    const q = document.getElementById("personelAra").value.toUpperCase();
    document.querySelectorAll(".check-item").forEach(i => i.style.display = i.getAttribute("data-isim").includes(q) ? "flex" : "none");
}
function ozetGuncelle() {
    let h = `<table style="width:100%; border-collapse:collapse; margin-top:20px; font-size:10px"><tr><th>Personel</th><th>Mesai</th></tr>`;
    [...tumPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim)).forEach(p => {
        const calis = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        h += `<tr><td>${p.isim}</td><td>${calis} Gün</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + "</table>";
}
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function birimEkle() { const v = prompt("Birim Adı:"); if(v) { birimSiralamasi.push(v.toUpperCase()); localStorage.setItem("ekBirimler", JSON.stringify(birimSiralamasi)); location.reload(); } }
function personelEkle() { const n = prompt("İsim:"); if(n) { ekPersoneller.push({id:Date.now(), isim:n.toUpperCase(), birim:birimSiralamasi[0]}); localStorage.setItem("ekPersoneller", JSON.stringify(ekPersoneller)); location.reload(); } }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save('Vardiya.pdf'); }
function sifirla() { if(confirm("Tüm veriler temizlensin mi?")) { localStorage.clear(); location.reload(); } }
function whatsappMesajiOlustur() {
    let m = `📋 *VARDİYA PLANI*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let list = tumPersoneller.filter(p => haftalikProgram[p.isim][i] === s);
            if(list.length > 0) m += `▫️ ${s}: ${list.map(x => x.isim).join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("Kopyalandı!"));
}
window.onload = () => { baslat(); checklistOlustur(); tabloyuOlustur(); };