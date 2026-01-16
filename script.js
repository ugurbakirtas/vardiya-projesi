const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

// SABİT BİRİM SIRALAMASI
const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", 
    "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

let personeller = JSON.parse(localStorage.getItem("personelListesi")) || []; 
// İlk kurulumda liste boşsa hafızadaki varsayılanları yükleyebilirsiniz.

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};
let haftalikNotlar = JSON.parse(localStorage.getItem("haftalikNotlar")) || {};

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); document.body.classList.toggle('light-mode'); }
function togglePanel(id) { document.getElementById(id).classList.toggle('hidden'); if(!document.getElementById(id).classList.contains('hidden')) notesFormOlustur(); }

function checklistOlustur() {
    const sirali = [...personeller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    document.getElementById("personelChecklist").innerHTML = sirali.map(p => `
        <div class="check-item" onclick="document.getElementById('check_${p.id}').click();">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()" onclick="event.stopPropagation();">
            <label><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
    document.getElementById("newPersonelBirim").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    personeller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // 1. ADIM: MCR VE INGEST ROTASYONLARI
    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();

    // 2. ADIM: TEKNİK YÖNETMEN GECE (00:00) ZORUNLU KURALI
    const tyEkibi = personeller.filter(p => p.birim === "TEKNİK YÖNETMEN");
    for(let i=0; i<7; i++) {
        let doluMu = tyEkibi.some(p => haftalikProgram[p.isim][i] === "00:00–07:00");
        if(!doluMu) {
            let adaylar = tyEkibi.filter(p => !haftalikProgram[p.isim][i]);
            if(adaylar.length > 0) {
                let secilen = adaylar[Math.floor(Math.random() * adaylar.length)];
                haftalikProgram[secilen.isim][i] = "00:00–07:00";
            }
        }
    }

    renderTable();
    ozetGuncelle();
}

function hucreDoldur(gun, saat) {
    let res = "";
    const isHS = (gun >= 5);
    
    // Sabit/Önceden atanmışları göster
    personeller.forEach(p => {
        if(haftalikProgram[p.isim][gun] === saat) {
            res += `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`;
        }
    });

    if(["12:00–22:00", "DIŞ YAYIN", "00:00–07:00", "İZİN"].includes(saat)) return res;

    // Otomatik Kapasite Planlama
    birimSiralamasi.forEach(birim => {
        if(birim.includes("MCR") || birim.includes("INGEST")) return;
        
        let kap = 0;
        if(birim === "TEKNİK YÖNETMEN") kap = isHS ? (saat !== "12:00–22:00" ? 1 : 0) : (saat === "06:30–16:00" ? 2 : (saat === "16:00–00:00" ? 1 : 0));
        else if(birim === "SES OPERATÖRÜ") kap = isHS ? 2 : (saat === "06:30–16:00" ? 4 : (saat === "16:00–00:00" ? 2 : 0));
        else if(birim.includes("PLAYOUT") || birim.includes("KJ")) kap = isHS ? (saat === "16:00–00:00" ? 2 : 1) : 2;
        else if(birim.includes("BİLGİ") || birim.includes("YAYIN")) kap = (saat === "09:00–18:00" ? 1 : 0);

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

function renderTable() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    const notlar = haftalikNotlar[haftaKey] || Array(7).fill("");
    document.getElementById("tableHeader").innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');
    document.getElementById("tableBody").innerHTML = saatler.map(s => `<tr><td>${s}</td>${[0,1,2,3,4,5,6].map(g => `<td>${hucreDoldur(g, s)}</td>`).join('')}</tr>`).join('');
    document.getElementById("tableFooter").innerHTML = `<tr><td>NOTLAR</td>${notlar.map(n => `<td class="note-cell">${n || ""}</td>`).join('')}</tr>`;
}

function applyMCRRota(birim) {
    const ekip = personeller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        if(haftalikProgram[p.isim].includes("İZİN")) return;
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rI = (Math.floor((d - ref) / 86400000) + (idx * 2)) % 8;
            haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 8 : rI];
        }
    });
}

function applyIngestRota() {
    const ekip = personeller.filter(p => p.birim === "INGEST OPERATÖRÜ");
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        if(haftalikProgram[p.isim].includes("İZİN")) return;
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rI = (Math.floor((d - ref) / 86400000) + (idx * 2)) % 6;
            haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 6 : rI];
        }
    });
}

function ozetGuncelle() {
    let h = `<table style="width:100%; text-align:left;"><tr><th>Personel</th><th>Birim</th><th>Mesai</th><th>Gece</th><th>Durum</th></tr>`;
    const sirali = [...personeller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    sirali.forEach(p => {
        const m = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const g = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        h += `<tr><td>${p.isim}</td><td><small>${p.birim}</small></td><td>${m}</td><td>${g}</td><td>${m >= 6 ? '⚠️' : '✅'}</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + `</table>`;
}

function personelEkle() {
    const isim = document.getElementById("newPersonelName").value.toUpperCase();
    const birim = document.getElementById("newPersonelBirim").value;
    if(isim) { personeller.push({ id: Date.now(), isim, birim }); saveAll(); }
}

function personelSil(id) { personeller = personeller.filter(p => p.id !== id); saveAll(); }

function saveAll() {
    localStorage.setItem("personelListesi", JSON.stringify(personeller));
    checklistOlustur();
    tabloyuOlustur();
}

function notlariKaydet() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    haftalikNotlar[haftaKey] = Array(7).fill(0).map((_, i) => document.getElementById(`n_${i}`).value);
    localStorage.setItem("haftalikNotlar", JSON.stringify(haftalikNotlar));
    renderTable();
}

function notesFormOlustur() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    if(!haftalikNotlar[haftaKey]) haftalikNotlar[haftaKey] = Array(7).fill("");
    document.getElementById("notesForm").innerHTML = Array(7).fill(0).map((_, i) => `
        <input type="text" id="n_${i}" value="${haftalikNotlar[haftaKey][i]}" placeholder="${gunler[i]} Notu" style="width:100%; margin-bottom:5px; padding:5px;">
    `).join('');
}

function whatsappMesajiOlustur() {
    let m = `📋 *${mevcutPazartesi.toLocaleDateString('tr-TR')} VARDİYASI*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let pNames = personeller.filter(p => haftalikProgram[p.isim][i] === s).map(x => x.isim);
            if(pNames.length > 0) m += `▫️ ${s}: ${pNames.join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("WhatsApp mesajı kopyalandı!"));
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }

window.onload = () => { checklistOlustur(); tabloyuOlustur(); };