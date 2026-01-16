let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

// YENİ HİYERARŞİK SIRALAMA (Belirttiğiniz sırayla)
const birimSiralamasi = [
    "Teknik Yönetmen", 
    "Ses Operatörü", 
    "Playout Operatörü", 
    "KJ Operatörü", 
    "24TV - 360TV INGEST OPERATÖRÜ", 
    "24TV-360TV BİLGİ İŞLEM", 
    "24TV-360TV YAYIN SİSTEMLERİ", 
    "24TV MCR OPERATÖRÜ", 
    "360TV MCR OPERATÖRÜ"
];

const personeller = [
    { isim: "YUNUS EMRE YAYLA", birim: "Teknik Yönetmen" },
    { isim: "HASAN CAN SAĞLAM", birim: "Teknik Yönetmen" },
    { isim: "MEHMET BERKMAN", birim: "Teknik Yönetmen" },
    { isim: "EKREM FİDAN", birim: "Teknik Yönetmen" },
    { isim: "CAN ŞENTUNALI", birim: "Teknik Yönetmen" },
    { isim: "BARIŞ İNCE", birim: "Teknik Yönetmen" },
    { isim: "ZAFER AKAR", birim: "Ses Operatörü" },
    { isim: "ENES KALE", birim: "Ses Operatörü" },
    { isim: "ANIL RİŞVAN", birim: "Ses Operatörü" },
    { isim: "ERSAN TİLBE", birim: "Ses Operatörü" },
    { isim: "ULVİ MUTLUBAŞ", birim: "Ses Operatörü" },
    { isim: "OSMAN DİNÇER", birim: "Ses Operatörü" },
    { isim: "DOĞUŞ MALGIL", birim: "Ses Operatörü" },
    { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "Ses Operatörü" },
    { isim: "SENA MİNARECİ", birim: "Playout Operatörü" },
    { isim: "MEHMET TUNÇ", birim: "Playout Operatörü" },
    { isim: "KADİR ÇAÇAN", birim: "Playout Operatörü" },
    { isim: "İBRAHİM SERİNSÖZ", birim: "Playout Operatörü" },
    { isim: "YUSUF ALPKILIÇ", birim: "Playout Operatörü" },
    { isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "Playout Operatörü" },
    { isim: "NEHİR KAYGUSUZ", birim: "Playout Operatörü" },
    { isim: "YUSUF İSLAM TORUN", birim: "KJ Operatörü" },
    { isim: "OĞUZHAN YALAZAN", birim: "KJ Operatörü" },
    { isim: "UĞUR AKBABA", birim: "KJ Operatörü" },
    { isim: "SENA BAYDAR", birim: "KJ Operatörü" },
    { isim: "CEMREHAN SUBAŞI", birim: "KJ Operatörü" },
    { isim: "YEŞİM KİREÇ", birim: "KJ Operatörü" },
    { isim: "PINAR ÖZENÇ", birim: "KJ Operatörü" },
    { isim: "RAMAZAN KOÇAK", birim: "24TV - 360TV INGEST OPERATÖRÜ" },
    { isim: "Selin", birim: "Uplink" },
    { isim: "VOLKAN DEMİRBAŞ", birim: "24TV-360TV BİLGİ İŞLEM" },
    { isim: "GÖKHAN BAĞIŞ", birim: "24TV-360TV BİLGİ İŞLEM" },
    { isim: "HAKAN ELİPEK", birim: "24TV-360TV BİLGİ İşLEM" },
    { isim: "ÖZKAN KAYA", birim: "24TV-360TV BİLGİ İŞLEM" },
    { isim: "YİĞİT DAYI", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "FERDİ TOPUZ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "BEYHAN KARAKAŞ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "FATİH AYBEK", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "AKİF KOÇ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "MUSAB YAKUB DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" }
];

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function checklistOlustur() {
    const container = document.getElementById("personelChecklist");
    const sirali = [...personeller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    container.innerHTML = sirali.map(p => `
        <div class="check-item">
            <input type="checkbox" id="check_${p.isim.replace(/\s+/g, '_')}" onchange="tabloyuOlustur()">
            <label><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası Planı`;
    haftalikProgram = {};
    personeller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.isim.replace(/\s+/g, '_')}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();

    let bGec = 0; while(bGec < 2) {
        let r = Math.floor(Math.random() * 7);
        if(!haftalikProgram["BARIŞ İNCE"][r]) { haftalikProgram["BARIŞ İNCE"][r] = "00:00–07:00"; bGec++; }
    }
    for(let i=0; i<7; i++) { if(haftalikProgram["BARIŞ İNCE"][i] !== "00:00–07:00") haftalikProgram["EKREM FİDAN"][i] = "00:00–07:00"; }

    for(let i=0; i<5; i++) haftalikProgram["ZAFER AKAR"][i] = "06:30–16:00";
    haftalikProgram["ZAFER AKAR"][5] = "İZİN"; haftalikProgram["ZAFER AKAR"][6] = "İZİN";

    const pS = setDegisken("Playout Operatörü");
    const kS = setDegisken("KJ Operatörü");

    personeller.forEach(p => {
        if(["BARIŞ İNCE", "ZAFER AKAR", pS, kS].includes(p.isim) || p.birim.includes("MCR") || p.birim.includes("INGEST")) return;
        let c = 0; while(c < 2) {
            let r = Math.floor(Math.random() * 7);
            if(!haftalikProgram[p.isim][r]) { haftalikProgram[p.isim][r] = "İZİN"; c++; }
        }
    });

    renderTable();
    ozetTablosuGuncelle();
}

function applyIngestRota() {
    const ekip = personeller.filter(p => p.birim === "24TV - 360TV INGEST OPERATÖRÜ");
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let f = Math.floor((d - ref) / 86400000);
            let rI = (f + (idx * 2)) % 6; if(rI < 0) rI += 6;
            haftalikProgram[p.isim][i] = rota[rI];
            if (i === 0 && rota[rI] === "İZİN") { haftalikProgram[p.isim][5] = "İZİN"; haftalikProgram[p.isim][6] = "İZİN"; }
        }
    });
}

function applyMCRRota(birim) {
    const ekip = personeller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let f = Math.floor((d - ref) / 86400000);
            let rI = (f + (idx * 2)) % 8; if(rI < 0) rI += 8;
            haftalikProgram[p.isim][i] = rota[rI];
        }
    });
}

function setDegisken(birim) {
    const ekip = personeller.filter(p => p.birim === birim);
    const s = ekip[Math.floor(Math.random() * ekip.length)].isim;
    for(let i=0; i<5; i++) haftalikProgram[s][i] = "09:00–18:00";
    haftalikProgram[s][5] = "İZİN"; haftalikProgram[s][6] = "İZİN";
    return s;
}

function renderTable() {
    let h = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');
    document.getElementById("tableHeader").innerHTML = h;

    let b = "";
    saatler.forEach(s => {
        b += `<tr><td>${s}</td>`;
        for(let i=0; i<7; i++) { b += `<td>${hucreDoldur(i, s)}</td>`; }
        b += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = b;
}

function hucreDoldur(gun, saat) {
    let res = "";
    const siraliPersoneller = [...personeller].sort((a, b) => {
        let ai = birimSiralamasi.indexOf(a.birim);
        let bi = birimSiralamasi.indexOf(b.birim);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    siraliPersoneller.forEach(p => {
        if(haftalikProgram[p.isim][gun] === saat) {
            res += `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`;
        }
    });

    if(saat === "00:00–07:00" || saat === "İZİN") return res;

    birimSiralamasi.forEach(birim => {
        if(birim.includes("MCR") || birim.includes("INGEST")) return;
        let kap = 0; const isHS = (gun >= 5);
        if (birim === "Playout Operatörü" || birim === "KJ Operatörü") {
            if (isHS) kap = (saat === "06:30–16:00") ? 1 : (saat === "16:00–00:00" ? 2 : 0);
            else kap = (saat === "06:30–16:00" || saat === "16:00–00:00") ? 2 : 0;
        }
        else if(birim === "Teknik Yönetmen") kap = !isHS ? (saat === "06:30–16:00" ? 2 : (saat === "16:00–00:00" ? 1 : 0)) : 1;
        else if(birim === "Ses Operatörü") kap = !isHS ? (saat === "06:30–16:00" ? 4 : (saat === "16:00–00:00" ? 2 : 0)) : 2;
        else if(birim.includes("BİLGİ") || birim.includes("YAYIN")) kap = (saat === "09:00–18:00" ? 1 : 0);
        else if(saat === "06:30–16:00") kap = 1;

        let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][gun]);
        let suan = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        for(let k=0; k < (kap-suan); k++) {
            if(adaylar.length > 0) {
                let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                haftalikProgram[p.isim][gun] = saat;
                res += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${p.isim}</span></div>`;
            }
        }
    });
    return res;
}

function ozetTablosuGuncelle() {
    let h = `<table class="stats-table"><thead><tr><th>Personel</th><th>Birim</th><th>Mesai</th><th>Gece</th></tr></thead><tbody>`;
    const siraliPersoneller = [...personeller].sort((a, b) => {
        let ai = birimSiralamasi.indexOf(a.birim);
        let bi = birimSiralamasi.indexOf(b.birim);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    
    siraliPersoneller.forEach(p => {
        const mesai = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const gece = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        h += `<tr><td><strong>${p.isim}</strong></td><td><small>${p.birim}</small></td><td class="${mesai >= 6 ? 'tehlike-mesai' : ''}">${mesai} G</td><td>${gece} Gece</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + "</tbody></table>";
}

function whatsappMesajiOlustur() {
    let m = `📋 *HAFTALIK VARDİYA PLANI*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let p = personeller.filter(p => haftalikProgram[p.isim][i] === s).map(x => x.isim);
            if(p.length > 0) m += `▫️ ${s}: ${p.join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("Kopyalandı!"));
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }
function sifirla() { localStorage.clear(); location.reload(); }
window.onload = () => { checklistOlustur(); tabloyuOlustur(); };