/**
 * PRO-Vardiya v17.5 | Dynamic Engine
 */

let varsayilanBirimler = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

let ekBirimler = JSON.parse(localStorage.getItem("ekBirimler")) || [];
let birimSiralamasi = [...varsayilanBirimler, ...ekBirimler];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

// Personel Sabit Listesi
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

// Dinamik Kapasite Mantığı
let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};

function kapasiteBaslat() {
    birimSiralamasi.forEach(b => {
        if(!kapasiteAyarlari[b]) {
            kapasiteAyarlari[b] = {};
            saatler.forEach(s => {
                // Varsayılan değerler
                let val = 0;
                if(b === "SES OPERATÖRÜ" && s !== "00:00–07:00") val = 2;
                if(b === "TEKNİK YÖNETMEN" && s === "06:30–16:00") val = 1;
                kapasiteAyarlari[b][s] = { haftaici: val, haftasonu: val };
            });
        }
    });
}

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// UI YÖNETİMİ
function toggleAdminPanel() {
    const p = document.getElementById("adminPanel");
    p.classList.toggle("hidden");
    if(!p.classList.contains("hidden")) kapasiteCiz();
}

function kapasiteCiz() {
    const container = document.getElementById("kapasiteAyarlari");
    container.innerHTML = birimSiralamasi.filter(b => !b.includes("MCR") && !b.includes("INGEST")).map(b => `
        <div class="cap-row">
            <strong>${b}</strong>
            ${saatler.map(s => `
                <div class="cap-input-box">
                    <span>${s.split('–')[0]}</span>
                    <input type="number" value="${kapasiteAyarlari[b][s].haftaici}" 
                           onchange="kaydetKapasite('${b}','${s}','haftaici',this.value)" title="Hafta İçi">
                    <input type="number" value="${kapasiteAyarlari[b][s].haftasonu}" 
                           onchange="kaydetKapasite('${b}','${s}','haftasonu',this.value)" title="Hafta Sonu" style="background:#fff5f5">
                </div>
            `).join('')}
        </div>
    `).join('');
    document.getElementById("birimSec").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function kaydetKapasite(birim, saat, tip, deger) {
    kapasiteAyarlari[birim][saat][tip] = parseInt(deger) || 0;
    localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari));
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    tumPersoneller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // Özel Gece Kuralları (Bozulamaz)
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
}

function renderTable() {
    const header = document.getElementById("tableHeader");
    header.innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
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

        // SES Gece Yasağı (Sabit Kural)
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

    let final = tumPersoneller.filter(p => haftalikProgram[p.isim][gun] === saat);
    final.sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    return final.map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`).join('');
}

// ROTA FONKSİYONLARI (INGEST & MCR)
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

// YARDIMCI ARAÇLAR
function checklistOlustur() {
    const container = document.getElementById("personelChecklist");
    const sirali = [...tumPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    container.innerHTML = sirali.map(p => `
        <div class="check-item" data-isim="${p.isim}" onclick="toggleCheckbox('${p.id}')">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <div><span style="font-size:8px; color:blue; display:block">${p.birim}</span><strong>${p.isim}</strong></div>
        </div>
    `).join('');
}

function toggleCheckbox(id) {
    const cb = document.getElementById('check_' + id);
    if(cb) { cb.checked = !cb.checked; tabloyuOlustur(); }
}

function checklistFiltrele() {
    const ara = document.getElementById("personelAra").value.toUpperCase();
    document.querySelectorAll(".check-item").forEach(item => {
        item.style.display = item.getAttribute("data-isim").includes(ara) ? "flex" : "none";
    });
}

function ozetGuncelle() {
    let h = `<table class="stats-table" style="width:100%; border-collapse:collapse; margin-top:20px">
             <thead><tr style="background:#0f172a; color:white"><th>Ad Soyad</th><th>Birim</th><th>Çalışma</th><th>Gece</th></tr></thead><tbody>`;
    [...tumPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim)).forEach(p => {
        const calis = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const gece = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        const style = calis >= 6 ? 'style="color:red; font-weight:bold"' : '';
        h += `<tr><td>${p.isim}</td><td>${p.birim}</td><td ${style}>${calis} GÜN</td><td>${gece}</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + "</tbody></table>";
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function birimEkle() { const v = document.getElementById("yeniBirim").value.toUpperCase().trim(); if(v && !birimSiralamasi.includes(v)) { ekBirimler.push(v); localStorage.setItem("ekBirimler", JSON.stringify(ekBirimler)); location.reload(); } }
function personelEkle() { const isim = document.getElementById("yeniIsim").value.toUpperCase().trim(); const birim = document.getElementById("birimSec").value; if(isim) { ekPersoneller.push({ id: Date.now(), isim, birim }); localStorage.setItem("ekPersoneller", JSON.stringify(ekPersoneller)); location.reload(); } }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save('Vardiya.pdf'); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function sifirla() { if(confirm("Her şey silinsin mi?")) { localStorage.clear(); location.reload(); } }

function whatsappMesajiOlustur() {
    let m = `📋 *${mevcutPazartesi.toLocaleDateString('tr-TR')} VARDİYA PLANI*\n\n`;
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

window.onload = () => { kapasiteBaslat(); checklistOlustur(); tabloyuOlustur(); };