// 1. HAFIZADAKİ SABİT BİRİM SIRALAMASI (HİYERARŞİ)
const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", 
    "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

// 2. TAM PERSONEL LİSTESİ (47 KİŞİ)
const varsayilanPersoneller = [
    { id: 1, isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN", sabit: "" },
    { id: 2, isim: "HASAN CAN SAĞLAM", birim: "TEKNİK YÖNETMEN", sabit: "" },
    { id: 3, isim: "MEHMET BERKMAN", birim: "TEKNİK YÖNETMEN", sabit: "" },
    { id: 4, isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN", sabit: "" },
    { id: 5, isim: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN", sabit: "" },
    { id: 6, isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN", sabit: "" },
    { id: 7, isim: "ZAFER AKAR", birim: "SES OPERATÖRÜ", sabit: "" },
    { id: 8, isim: "ENES KALE", birim: "SES OPERATÖRÜ", sabit: "" },
    { id: 9, isim: "ANIL RİŞVAN", birim: "SES OPERATÖRÜ", sabit: "" },
    { id: 10, isim: "ERSAN TİLBE", birim: "SES OPERATÖRÜ", sabit: "" },
    { id: 11, isim: "ULVİ MUTLUBAŞ", birim: "SES OPERATÖRÜ", sabit: "" },
    { id: 12, isim: "OSMAN DİNÇER", birim: "SES OPERATÖRÜ", sabit: "" },
    { id: 13, isim: "DOĞUŞ MALGIL", birim: "SES OPERATÖRÜ", sabit: "" },
    { id: 14, isim: "ERDOĞAN KÜÇÜKKAYA", birim: "SES OPERATÖRÜ", sabit: "" },
    { id: 15, isim: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ", sabit: "" },
    { id: 16, isim: "MEHMET TUNÇ", birim: "PLAYOUT OPERATÖRÜ", sabit: "" },
    { id: 17, isim: "KADİR ÇAÇAN", birim: "PLAYOUT OPERATÖRÜ", sabit: "" },
    { id: 18, isim: "İBRAHİM SERİNSÖZ", birim: "PLAYOUT OPERATÖRÜ", sabit: "" },
    { id: 19, isim: "YUSUF ALPKILIÇ", birim: "PLAYOUT OPERATÖRÜ", sabit: "" },
    { id: 20, isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "PLAYOUT OPERATÖRÜ", sabit: "" },
    { id: 21, isim: "NEHİR KAYGUSUZ", birim: "PLAYOUT OPERATÖRÜ", sabit: "" },
    { id: 22, isim: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ", sabit: "" },
    { id: 23, isim: "OĞUZHAN YALAZAN", birim: "KJ OPERATÖRÜ", sabit: "" },
    { id: 24, isim: "UĞUR AKBABA", birim: "KJ OPERATÖRÜ", sabit: "" },
    { id: 25, isim: "SENA BAYDAR", birim: "KJ OPERATÖRÜ", sabit: "" },
    { id: 26, isim: "CEMREHAN SUBAŞI", birim: "KJ OPERATÖRÜ", sabit: "" },
    { id: 27, isim: "YEŞİM KİREÇ", birim: "KJ OPERATÖRÜ", sabit: "" },
    { id: 28, isim: "PINAR ÖZENÇ", birim: "KJ OPERATÖRÜ", sabit: "" },
    { id: 29, isim: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ", sabit: "" },
    { id: 31, isim: "VOLKAN DEMİRBAŞ", birim: "BİLGİ İŞLEM", sabit: "" },
    { id: 32, isim: "GÖKHAN BAĞIŞ", birim: "BİLGİ İŞLEM", sabit: "" },
    { id: 33, isim: "HAKAN ELİPEK", birim: "BİLGİ İŞLEM", sabit: "" },
    { id: 34, isim: "ÖZKAN KAYA", birim: "BİLGİ İŞLEM", sabit: "" },
    { id: 35, isim: "YİĞİT DAYI", birim: "YAYIN SİSTEMLERİ", sabit: "" },
    { id: 36, isim: "FERDİ TOPUZ", birim: "YAYIN SİSTEMLERİ", sabit: "" },
    { id: 37, isim: "BEYHAN KARAKAŞ", birim: "YAYIN SİSTEMLERİ", sabit: "" },
    { id: 38, isim: "FATİH AYBEK", birim: "YAYIN SİSTEMLERİ", sabit: "" },
    { id: 39, isim: "AKİF KOÇ", birim: "YAYIN SİSTEMLERİ", sabit: "" },
    { id: 40, isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ", sabit: "" },
    { id: 41, isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ", sabit: "" },
    { id: 42, isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ", sabit: "" },
    { id: 43, isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ", sabit: "" },
    { id: 44, isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ", sabit: "" },
    { id: 45, isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ", sabit: "" },
    { id: 46, isim: "MUSAB YAKUB DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ", sabit: "" },
    { id: 47, isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ", sabit: "" }
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let personeller = JSON.parse(localStorage.getItem("personelListesi")) || varsayilanPersoneller;
let haftalikNotlar = JSON.parse(localStorage.getItem("haftalikNotlar")) || {};
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

// YARDIMCI: HİYERARŞİK SIRALAMA FONKSİYONU
function hiyerarsikSirala(liste) {
    return [...liste].sort((a, b) => {
        let birimA = birimSiralamasi.indexOf(a.birim);
        let birimB = birimSiralamasi.indexOf(b.birim);
        if (birimA !== birimB) return birimA - birimB;
        return a.isim.localeCompare(b.isim);
    });
}

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function togglePanel(id) { document.getElementById(id).classList.toggle('hidden'); if(id==='personelPanel') notesFormOlustur(); }

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    
    personeller.forEach(p => {
        const isIzinli = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isIzinli ? Array(7).fill("İZİN") : Array(7).fill(null);
        if(p.sabit && !isIzinli) { for(let i=0; i<7; i++) haftalikProgram[p.isim][i] = p.sabit; }
    });

    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();

    // TEKNİK YÖNETMEN GECE ZORUNLULUĞU (UNUTULMADI)
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
    
    // ATANMIŞLARI BUL VE HİYERARŞİK SIRALA
    let hucredekiPersoneller = personeller.filter(p => haftalikProgram[p.isim][gun] === saat);
    let siraliPersoneller = hiyerarsikSirala(hucredekiPersoneller);
    
    siraliPersoneller.forEach(p => { res += cardOlustur(p); });

    if(["12:00–22:00", "DIŞ YAYIN", "00:00–07:00", "İZİN"].includes(saat)) return res;

    // OTOMATİK KAPASİTE PLANLAMA
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
                let pIndex = Math.floor(Math.random() * adaylar.length);
                let p = adaylar[pIndex];
                
                // 11 SAAT DİNLENME KONTROLÜ
                let yorgunMu = false;
                if(gun > 0 && saat === "06:30–16:00") {
                    let dunku = haftalikProgram[p.isim][gun-1];
                    if(dunku === "16:00–00:00" || dunku === "00:00–07:00") yorgunMu = true;
                }

                if(!yorgunMu) {
                    haftalikProgram[p.isim][gun] = saat;
                    // Not: Bu ekleme anlık olduğu için bir sonraki renderTable hiyerarşiyi tam sağlar.
                    adaylar.splice(pIndex, 1);
                }
            }
        }
    });

    // Otomatik atamadan sonra tekrar sıralı listeyi çek
    let guncelHucre = personeller.filter(p => haftalikProgram[p.isim][gun] === saat);
    return hiyerarsikSirala(guncelHucre).map(p => cardOlustur(p)).join('');
}

function cardOlustur(p) {
    return `<div class="birim-card" draggable="true" ondragstart="drag(event, '${p.isim}')">
        <span class="birim-tag">${p.birim}</span>
        <span class="p-isim">${p.isim}</span>
        ${p.sabit ? '<span class="lock-icon">🔒</span>' : ''}
    </div>`;
}

function drag(ev, isim) { ev.dataTransfer.setData("isim", isim); }
function allowDrop(ev) { ev.preventDefault(); }
function drop(ev, gun, saat) {
    ev.preventDefault();
    let isim = ev.dataTransfer.getData("isim");
    haftalikProgram[isim][gun] = saat;
    renderTable(); // renderTable içinde sıralama zaten yapılıyor
    ozetGuncelle();
}

function renderTable() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    const notlar = haftalikNotlar[haftaKey] || Array(7).fill("");

    document.getElementById("tableHeader").innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');

    document.getElementById("tableBody").innerHTML = saatler.map(s => `
        <tr><td>${s}</td>${[0,1,2,3,4,5,6].map(g => `<td ondrop="drop(event, ${g}, '${s}')" ondragover="allowDrop(event)">${hucreDoldur(g, s)}</td>`).join('')}</tr>
    `).join('');

    document.getElementById("tableFooter").innerHTML = `<tr><td class="note-cell">NOTLAR</td>${notlar.map(n => `<td class="note-cell">${n || ""}</td>`).join('')}</tr>`;
}

// ROTASYONLAR (MCR & INGEST)
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
    let h = `<table style="width:100%"><tr><th>Personel</th><th>Birim</th><th>Mesai</th><th>Gece</th><th>HS</th></tr>`;
    let siraliAnaliz = hiyerarsikSirala(personeller);
    siraliAnaliz.forEach(p => {
        const m = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const g = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        const hs = (haftalikProgram[p.isim][5] !== "İZİN" ? 1 : 0) + (haftalikProgram[p.isim][6] !== "İZİN" ? 1 : 0);
        h += `<tr><td>${p.isim}</td><td>${p.birim}</td><td>${m}</td><td>${g}</td><td>${hs}</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + `</table>`;
}

function checklistOlustur() {
    let siraliCheck = hiyerarsikSirala(personeller);
    document.getElementById("personelChecklist").innerHTML = siraliCheck.map(p => `
        <div class="check-item" onclick="document.getElementById('check_${p.id}').click()">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <span>${p.isim}<br><small>${p.birim}</small></span>
        </div>
    `).join('');
    document.getElementById("pBirim").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function manageListOlustur() {
    let siraliManage = hiyerarsikSirala(personeller);
    document.getElementById("manageList").innerHTML = siraliManage.map(p => `
        <div style="background:var(--bg); padding:5px; margin:2px; display:inline-block; border-radius:5px; border:1px solid #ccc;">
            ${p.isim} ${p.sabit?'🔒':''} <span style="color:red; cursor:pointer;" onclick="personelSil(${p.id})">x</span>
        </div>
    `).join('');
}

function personelEkle() {
    const isim = document.getElementById("pIsim").value.toUpperCase();
    const birim = document.getElementById("pBirim").value;
    const sabit = document.getElementById("pSabit").value;
    if(isim) { personeller.push({ id: Date.now(), isim, birim, sabit }); saveAll(); }
}

function personelSil(id) { personeller = personeller.filter(p => p.id !== id); saveAll(); }
function saveAll() { localStorage.setItem("personelListesi", JSON.stringify(personeller)); checklistOlustur(); manageListOlustur(); tabloyuOlustur(); }
function notlariKaydet() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    haftalikNotlar[haftaKey] = Array(7).fill(0).map((_, i) => document.getElementById(`n_${i}`).value);
    localStorage.setItem("haftalikNotlar", JSON.stringify(haftalikNotlar));
    renderTable();
}
function notesFormOlustur() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    if(!haftalikNotlar[haftaKey]) haftalikNotlar[haftaKey] = Array(7).fill("");
    document.getElementById("notesForm").innerHTML = Array(7).fill(0).map((_, i) => `<input type="text" id="n_${i}" value="${haftalikNotlar[haftaKey][i]}" placeholder="${gunler[i]}" style="width:100%; margin-bottom:5px;">`).join('');
}
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }

function whatsappMesajiOlustur() {
    let m = `📋 *${mevcutPazartesi.toLocaleDateString('tr-TR')} HAFTASI*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let hucredekiler = personeller.filter(p => haftalikProgram[p.isim][i] === s);
            let siraliIsimler = hiyerarsikSirala(hucredekiler).map(x => x.isim);
            if(siraliIsimler.length > 0) m += `▫️ ${s}: ${siraliIsimler.join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("Hiyerarşik WhatsApp mesajı kopyalandı!"));
}

window.onload = () => { checklistOlustur(); manageListOlustur(); tabloyuOlustur(); };