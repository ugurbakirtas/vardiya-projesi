let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

const birimSiralamasi = [
    "Teknik Yönetmen", "Ses Operatörü", "Playout Operatörü", "KJ Operatörü", 
    "24TV - 360TV INGEST OPERATÖRÜ", "24TV-360TV BİLGİ İŞLEM", 
    "24TV-360TV YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const personeller = [
    { id: 1, isim: "YUNUS EMRE YAYLA", birim: "Teknik Yönetmen" },
    { id: 2, isim: "HASAN CAN SAĞLAM", birim: "Teknik Yönetmen" },
    { id: 3, isim: "MEHMET BERKMAN", birim: "Teknik Yönetmen" },
    { id: 4, isim: "EKREM FİDAN", birim: "Teknik Yönetmen" },
    { id: 5, isim: "CAN ŞENTUNALI", birim: "Teknik Yönetmen" },
    { id: 6, isim: "BARIŞ İNCE", birim: "Teknik Yönetmen" },
    { id: 7, isim: "ZAFER AKAR", birim: "Ses Operatörü" },
    { id: 8, isim: "ENES KALE", birim: "Ses Operatörü" },
    { id: 9, isim: "ANIL RİŞVAN", birim: "Ses Operatörü" },
    { id: 10, isim: "ERSAN TİLBE", birim: "Ses Operatörü" },
    { id: 11, isim: "ULVİ MUTLUBAŞ", birim: "Ses Operatörü" },
    { id: 12, isim: "OSMAN DİNÇER", birim: "Ses Operatörü" },
    { id: 13, isim: "DOĞUŞ MALGIL", birim: "Ses Operatörü" },
    { id: 14, isim: "ERDOĞAN KÜÇÜKKAYA", birim: "Ses Operatörü" },
    { id: 15, isim: "SENA MİNARECİ", birim: "Playout Operatörü" },
    { id: 16, isim: "MEHMET TUNÇ", birim: "Playout Operatörü" },
    { id: 17, isim: "KADİR ÇAÇAN", birim: "Playout Operatörü" },
    { id: 18, isim: "İBRAHİM SERİNSÖZ", birim: "Playout Operatörü" },
    { id: 19, isim: "YUSUF ALPKILIÇ", birim: "Playout Operatörü" },
    { id: 20, isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "Playout Operatörü" },
    { id: 21, isim: "NEHİR KAYGUSUZ", birim: "Playout Operatörü" },
    { id: 22, isim: "YUSUF İSLAM TORUN", birim: "KJ Operatörü" },
    { id: 23, isim: "OĞUZHAN YALAZAN", birim: "KJ Operatörü" },
    { id: 24, isim: "UĞUR AKBABA", birim: "KJ Operatörü" },
    { id: 25, isim: "SENA BAYDAR", birim: "KJ Operatörü" },
    { id: 26, isim: "CEMREHAN SUBAŞI", birim: "KJ Operatörü" },
    { id: 27, isim: "YEŞİM KİREÇ", birim: "KJ Operatörü" },
    { id: 28, isim: "PINAR ÖZENÇ", birim: "KJ Operatörü" },
    { id: 29, isim: "RAMAZAN KOÇAK", birim: "24TV - 360TV INGEST OPERATÖRÜ" },
    { id: 30, isim: "Selin", birim: "Uplink" },
    { id: 31, isim: "VOLKAN DEMİRBAŞ", birim: "24TV-360TV BİLGİ İŞLEM" },
    { id: 32, isim: "GÖKHAN BAĞIŞ", birim: "24TV-360TV BİLGİ İŞLEM" },
    { id: 33, isim: "HAKAN ELİPEK", birim: "24TV-360TV BİLGİ İşLEM" },
    { id: 34, isim: "ÖZKAN KAYA", birim: "24TV-360TV BİLGİ İŞLEM" },
    { id: 35, isim: "YİĞİT DAYI", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { id: 36, isim: "FERDİ TOPUZ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { id: 37, isim: "BEYHAN KARAKAŞ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { id: 38, isim: "FATİH AYBEK", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { id: 39, isim: "AKİF KOÇ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { id: 40, isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { id: 41, isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { id: 42, isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" },
    { id: 43, isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
    { id: 44, isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
    { id: 45, isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" },
    { id: 46, isim: "MUSAB YAKUB DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" },
    { id: 47, isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" }
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
        <div class="check-item" onclick="document.getElementById('check_${p.id}').click();">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()" onclick="event.stopPropagation();">
            <label onclick="event.stopPropagation();"><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    personeller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();

    if(haftalikProgram["BARIŞ İNCE"] && !haftalikProgram["BARIŞ İNCE"].includes("İZİN")) {
        let bGec = 0; while(bGec < 2) {
            let r = Math.floor(Math.random() * 7);
            if(!haftalikProgram["BARIŞ İNCE"][r]) { haftalikProgram["BARIŞ İNCE"][r] = "00:00–07:00"; bGec++; }
        }
    }
    if(haftalikProgram["EKREM FİDAN"] && !haftalikProgram["EKREM FİDAN"].includes("İZİN")) {
        for(let i=0; i<7; i++) { 
            if(haftalikProgram["BARIŞ İNCE"] && haftalikProgram["BARIŞ İNCE"][i] !== "00:00–07:00") 
                haftalikProgram["EKREM FİDAN"][i] = "00:00–07:00"; 
        }
    }

    if(haftalikProgram["ZAFER AKAR"] && !haftalikProgram["ZAFER AKAR"].includes("İZİN")) {
        for(let i=0; i<5; i++) haftalikProgram["ZAFER AKAR"][i] = "06:30–16:00";
        haftalikProgram["ZAFER AKAR"][5] = "İZİN"; haftalikProgram["ZAFER AKAR"][6] = "İZİN";
    }

    const pS = setDegisken("Playout Operatörü");
    const kS = setDegisken("KJ Operatörü");

    personeller.forEach(p => {
        if(["BARIŞ İNCE", "ZAFER AKAR", pS, kS].includes(p.isim) || p.birim.includes("MCR") || p.birim.includes("INGEST")) return;
        if(haftalikProgram[p.isim].includes("İZİN")) return;
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
        if(haftalikProgram[p.isim].includes("İZİN")) return;
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let f = Math.floor((d - ref) / 86400000);
            let rI = (f + (idx * 2)) % 6; if(rI < 0) rI += 6;
            haftalikProgram[p.isim][i] = rota[rI];
        }
    });
}

function applyMCRRota(birim) {
    const ekip = personeller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        if(haftalikProgram[p.isim].includes("İZİN")) return;
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let f = Math.floor((d - ref) / 86400000);
            let rI = (f + (idx * 2)) % 8; if(rI < 0) rI += 8;
            haftalikProgram[p.isim][i] = rota[rI];
        }
    });
}

function setDegisken(birim) {
    const ekip = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim].includes("İZİN"));
    if(ekip.length === 0) return null;
    const s = ekip[Math.floor(Math.random() * ekip.length)].isim;
    for(let i=0; i<5; i++) haftalikProgram[s][i] = "09:00–18:00";
    haftalikProgram[s][5] = "İZİN"; haftalikProgram[s][6] = "İZİN";
    return s;
}

function renderTable() {
    let h = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR', {day:'2-digit', month:'2-digit'})}</small></th>`;
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
    const isHS = (gun >= 5);
    const siraliPersoneller = [...personeller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));

    siraliPersoneller.forEach(p => {
        if(haftalikProgram[p.isim][gun] === saat) {
            res += `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`;
        }
    });

    if(saat === "12:00–22:00" || saat === "DIŞ YAYIN" || saat === "00:00–07:00" || saat === "İZİN") return res;

    birimSiralamasi.forEach(birim => {
        if(birim.includes("MCR") || birim.includes("INGEST")) return;
        let kap = 0;
        if(birim === "Teknik Yönetmen") {
            if(isHS) { kap = (saat === "06:30–16:00" || saat === "09:00–18:00" || saat === "16:00–00:00") ? 1 : 0; } 
            else { kap = (saat === "06:30–16:00") ? 2 : (saat === "16:00–00:00" ? 1 : 0); }
        }
        else if(birim === "Ses Operatörü") {
            if(isHS) { kap = (saat === "06:30–16:00" || saat === "09:00–18:00" || saat === "16:00–00:00") ? 2 : 0; } 
            else { kap = (saat === "06:30–16:00") ? 4 : (saat === "16:00–00:00" ? 2 : 0); }
        }
        else if (birim === "Playout Operatörü" || birim === "KJ Operatörü") {
            if (isHS) kap = (saat === "06:30–16:00") ? 1 : (saat === "16:00–00:00" ? 2 : 0);
            else kap = (saat === "06:30–16:00" || saat === "16:00–00:00") ? 2 : 0;
        }
        else if(birim.includes("BİLGİ") || birim.includes("YAYIN")) {
            kap = (saat === "09:00–18:00" ? 1 : 0);
        }

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
    let h = `<table class="stats-table"><thead><tr><th>Personel</th><th>Mesai</th><th>Gece</th></tr></thead><tbody>`;
    const siraliPersoneller = [...personeller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    siraliPersoneller.forEach(p => {
        const mesai = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const gece = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        h += `<tr><td><strong>${p.isim}</strong><br><small>${p.birim}</small></td><td class="${mesai >= 6 ? 'tehlike-mesai' : ''}">${mesai} G</td><td>${gece}</td></tr>`;
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
    navigator.clipboard.writeText(m).then(() => alert("WhatsApp formatında kopyalandı!"));
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }
function sifirla() { localStorage.clear(); location.reload(); }
window.onload = () => { checklistOlustur(); tabloyuOlustur(); };