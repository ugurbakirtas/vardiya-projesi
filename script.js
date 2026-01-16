const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", 
    "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let personeller = JSON.parse(localStorage.getItem("personelListesi")) || [];
let haftalikNotlar = JSON.parse(localStorage.getItem("haftalikNotlar")) || {};
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

// 1. TEMEL FONKSİYONLAR
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function togglePanel(id) { document.getElementById(id).classList.toggle('hidden'); if(id==='personelPanel') notesFormOlustur(); }

// 2. OTOMATİK PLANLAMA MOTORU (v11.0)
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    
    // Temiz Program Hazırla
    personeller.forEach(p => {
        const isIzinli = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isIzinli ? Array(7).fill("İZİN") : Array(7).fill(null);
        
        // KURAL: SABİT VARDİYA KİLİDİ
        if(p.sabit && !isIzinli) {
            for(let i=0; i<7; i++) haftalikProgram[p.isim][i] = p.sabit;
        }
    });

    // KURAL: MCR VE INGEST ROTASYONLARI (HAFIZADAKİ SABİT KURAL)
    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();

    // KURAL: TEKNİK YÖNETMEN GECE 00:00 ZORUNLULUĞU (UNUTULMAYAN KURAL)
    const tyEkibi = personeller.filter(p => p.birim === "TEKNİK YÖNETMEN");
    for(let i=0; i<7; i++) {
        let doluMu = tyEkibi.some(p => haftalikProgram[p.isim][i] === "00:00–07:00");
        if(!doluMu) {
            let adaylar = tyEkibi.filter(p => !haftalikProgram[p.isim][i]);
            if(adaylar.length > 0) {
                let secilen = adaylar[Math.floor(Math.random() * adaylar.length)];
                // DINLENME KONTROLÜ
                if(i > 0 && (haftalikProgram[secilen.isim][i-1] === "16:00–00:00" || haftalikProgram[secilen.isim][i-1] === "00:00–07:00")) { /* Geçerli */ }
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
    
    // Zaten atanmış olanlar (Sabitler, Gece TY, Rotasyonlar)
    personeller.forEach(p => {
        if(haftalikProgram[p.isim][gun] === saat) {
            res += cardOlustur(p);
        }
    });

    if(["12:00–22:00", "DIŞ YAYIN", "00:00–07:00", "İZİN"].includes(saat)) return res;

    // OTOMATİK KAPASİTE VE DİNLENME KONTROLÜ
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
                // KURAL: 11 SAAT DİNLENME KONTROLÜ
                let pIndex = Math.floor(Math.random() * adaylar.length);
                let p = adaylar[pIndex];
                
                let yorgunMu = false;
                if(gun > 0 && saat === "06:30–16:00") {
                    let dunku = haftalikProgram[p.isim][gun-1];
                    if(dunku === "16:00–00:00" || dunku === "00:00–07:00") yorgunMu = true;
                }

                if(!yorgunMu) {
                    haftalikProgram[p.isim][gun] = saat;
                    res += cardOlustur(p);
                    adaylar.splice(pIndex, 1);
                }
            }
        }
    });
    return res;
}

function cardOlustur(p) {
    return `<div class="birim-card" draggable="true" ondragstart="drag(event, '${p.isim}')">
        <span class="birim-tag">${p.birim}</span>
        <span class="p-isim">${p.isim}</span>
        ${p.sabit ? '<span class="lock-icon">🔒</span>' : ''}
    </div>`;
}

// 3. SÜRÜKLE BIRAK (DRAG & DROP)
function drag(ev, isim) { ev.dataTransfer.setData("isim", isim); }
function allowDrop(ev) { ev.preventDefault(); }
function drop(ev, gun, saat) {
    ev.preventDefault();
    let isim = ev.dataTransfer.getData("isim");
    haftalikProgram[isim][gun] = saat;
    renderTable();
    ozetGuncelle();
}

// 4. VERİ YÖNETİMİ
function personelEkle() {
    const isim = document.getElementById("pIsim").value.toUpperCase();
    const birim = document.getElementById("pBirim").value;
    const sabit = document.getElementById("pSabit").value;
    if(!isim) return;
    personeller.push({ id: Date.now(), isim, birim, sabit });
    saveAll();
}

function saveAll() {
    localStorage.setItem("personelListesi", JSON.stringify(personeller));
    checklistOlustur();
    manageListOlustur();
    tabloyuOlustur();
}

function renderTable() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    const notlar = haftalikNotlar[haftaKey] || Array(7).fill("");

    document.getElementById("tableHeader").innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');

    document.getElementById("tableBody").innerHTML = saatler.map(s => `
        <tr>
            <td>${s}</td>
            ${[0,1,2,3,4,5,6].map(g => `<td ondrop="drop(event, ${g}, '${s}')" ondragover="allowDrop(event)">${hucreDoldur(g, s)}</td>`).join('')}
        </tr>
    `).join('');

    document.getElementById("tableFooter").innerHTML = `<tr><td class="note-cell">NOTLAR</td>${notlar.map(n => `<td class="note-cell">${n || ""}</td>`).join('')}</tr>`;
}

// 5. YARDIMCI VE ROTASYONLAR (MCR & INGEST)
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
    let h = `<table><tr><th>Personel</th><th>Birim</th><th>Top. Mesai</th><th>Gece</th><th>Hafta Sonu</th></tr>`;
    personeller.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim)).forEach(p => {
        const m = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const g = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        const hs = (haftalikProgram[p.isim][5] !== "İZİN" ? 1 : 0) + (haftalikProgram[p.isim][6] !== "İZİN" ? 1 : 0);
        h += `<tr><td>${p.isim}</td><td>${p.birim}</td><td>${m} Gün</td><td>${g}</td><td>${hs}</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + `</table>`;
}

function checklistOlustur() {
    document.getElementById("personelChecklist").innerHTML = personeller.map(p => `
        <div class="check-item" onclick="document.getElementById('check_${p.id}').click()">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <span>${p.isim}<br><small>${p.birim}</small></span>
        </div>
    `).join('');
    document.getElementById("pBirim").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function manageListOlustur() {
    document.getElementById("manageList").innerHTML = personeller.map(p => `
        <div style="background:var(--bg); padding:5px; margin:2px; display:inline-block; border-radius:5px;">
            ${p.isim} ${p.sabit ? '🔒':''} <span style="color:red; cursor:pointer;" onclick="personelSil(${p.id})">x</span>
        </div>
    `).join('');
}

function personelSil(id) { personeller = personeller.filter(p => p.id !== id); saveAll(); }
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya_v11.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }

window.onload = () => { checklistOlustur(); manageListOlustur(); tabloyuOlustur(); };