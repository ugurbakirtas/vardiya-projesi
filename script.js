/**
 * PRO-Vardiya v23.0 | AI ve Adalet Algoritması
 */

const birimSiralamasi = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
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

let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let algoritmaKurallari = JSON.parse(localStorage.getItem("algoritmaKurallari")) || [];
let autoRules = JSON.parse(localStorage.getItem("autoRules")) || { geceSonrasiIzin: true, adaletPuani: true };
let gecmisVeri = JSON.parse(localStorage.getItem("gecmisVeri")) || {}; // Personel bazlı puanlar
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function baslat() {
    birimSiralamasi.forEach(b => {
        if(!kapasiteAyarlari[b]) {
            kapasiteAyarlari[b] = {};
            saatler.forEach(s => { kapasiteAyarlari[b][s] = { haftaici: 0, haftasonu: 0 }; });
        }
    });
    initDragAndDrop();
    tabloyuOlustur();
}

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    sabitPersoneller.forEach(p => {
        haftalikProgram[p.isim] = Array(7).fill(null);
        if(document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİN");
    });
    
    // Rotalar
    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();
    
    renderTable();
    asistanAnalizYap();
    isiHaritasiCiz();
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
        for(let i=0; i<7; i++) {
            b += `<td ondragover="allowDrop(event)" ondrop="handleDrop(event, ${i}, '${s}')">${hucreDoldur(i, s)}</td>`;
        }
        b += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = b;
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    birimSiralamasi.forEach(birim => {
        if(birim.includes("MCR") || birim.includes("INGEST")) return;
        let kap = kapasiteAyarlari[birim]?.[saat]?.[isHS ? 'haftasonu' : 'haftaici'] || 0;
        if(birim === "SES OPERATÖRÜ" && saat === "00:00–07:00") kap = 0;

        let adaylar = sabitPersoneller.filter(p => {
            if(p.birim !== birim || haftalikProgram[p.isim][gun] !== null) return false;
            if(autoRules.geceSonrasiIzin && gun > 0 && haftalikProgram[p.isim][gun-1] === "00:00–07:00") return false;
            return true;
        });

        // ADALET PUANI: Geçmişte az çalışanlara öncelik ver
        if(autoRules.adaletPuani) {
            adaylar.sort((a,b) => (gecmisVeri[a.isim] || 0) - (gecmisVeri[b.isim] || 0));
        }

        let suan = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        for(let k=0; k < (kap-suan); k++) {
            if(adaylar.length > 0) {
                let p = adaylar.shift();
                haftalikProgram[p.isim][gun] = saat;
                // Puanı güncelle (Gece vardiyası +2, Normal +1 puan)
                gecmisVeri[p.isim] = (gecmisVeri[p.isim] || 0) + (saat === "00:00–07:00" ? 2 : 1);
            }
        }
    });
    
    let list = sabitPersoneller.filter(p => haftalikProgram[p.isim][gun] === saat).sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    return list.map(p => `
        <div class="birim-card" draggable="true" ondragstart="handleDragStart(event, '${p.isim}', ${gun}, '${saat}')">
            <span class="birim-tag">${p.birim}</span>${p.isim}
            <span class="adalet-badge">${gecmisVeri[p.isim] || 0}</span>
        </div>
    `).join('');
}

// SÜRÜKLE BIRAK MANTIĞI
let draggedPerson = null;
let sourceGun = null;
let sourceSaat = null;

function handleDragStart(e, isim, gun, saat) {
    draggedPerson = isim;
    sourceGun = gun;
    sourceSaat = saat;
}

function allowDrop(e) { e.preventDefault(); }

function handleDrop(e, targetGun, targetSaat) {
    e.preventDefault();
    if(draggedPerson) {
        haftalikProgram[draggedPerson][sourceGun] = null;
        haftalikProgram[draggedPerson][targetGun] = targetSaat;
        renderTable();
        asistanAnalizYap();
    }
}

// HATA DEDEKTÖRÜ (ANALİZ)
function asistanAnalizYap() {
    const uyariPaneli = document.getElementById("uyariPaneli");
    let hatalar = [];

    gunler.forEach((g, i) => {
        saatler.forEach(s => {
            birimSiralamasi.forEach(b => {
                if(b.includes("MCR") || b.includes("INGEST")) return;
                let kap = kapasiteAyarlari[b]?.[s]?.[i >= 5 ? 'haftasonu' : 'haftaici'] || 0;
                let suan = sabitPersoneller.filter(p => p.birim === b && haftalikProgram[p.isim][i] === s).length;
                if(suan < kap) hatalar.push(`⚠️ <b>${g} ${s}:</b> ${b} biriminde <b>${kap - suan}</b> kişi eksik!`);
            });
        });
    });

    if(hatalar.length > 0) {
        uyariPaneli.innerHTML = `<strong>Kritik Uyarılar (${hatalar.length}):</strong>` + hatalar.map(h => `<div class="alert-item">${h}</div>`).join('');
        uyariPaneli.classList.remove("hidden");
    } else {
        uyariPaneli.classList.add("hidden");
    }
}

// ISI HARİTASI
function isiHaritasiCiz() {
    const cont = document.getElementById("heatmapContainer");
    let html = "";
    gunler.forEach((g, i) => {
        let calisanSayisi = sabitPersoneller.filter(p => haftalikProgram[p.isim][i] && haftalikProgram[p.isim][i] !== "İZİN").length;
        let renk = calisanSayisi > 15 ? "#ef4444" : (calisanSayisi > 10 ? "#f59e0b" : "#10b981");
        html += `
            <div class="heatmap-day" style="border-bottom: 4px solid ${renk}">
                <small>${g}</small>
                <div style="font-weight:700">${calisanSayisi} Kişi</div>
            </div>
        `;
    });
    cont.innerHTML = html;
}

// Yardımcılar
function checklistOlustur() {
    const s = [...sabitPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    document.getElementById("personelChecklist").innerHTML = s.map(p => `
        <div class="check-item">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <span>${p.isim}</span>
        </div>
    `).join('');
}

function applyIngestRota() {
    const ekip = sabitPersoneller.filter(p => p.birim === "INGEST OPERATÖRÜ");
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "İZİN", "İZİN"];
    ekip.forEach((p, idx) => { for(let i=0; i<7; i++) { let d = new Date(mevcutPazartesi.getTime() + (i * 86400000)); let rI = (Math.floor((d - new Date(2025, 0, 6)) / 86400000) + (idx * 2)) % 6; if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 6 : rI]; } });
}
function applyMCRRota(birim) {
    const ekip = sabitPersoneller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    ekip.forEach((p, idx) => { for(let i=0; i<7; i++) { let d = new Date(mevcutPazartesi.getTime() + (i * 86400000)); let rI = (Math.floor((d - new Date(2025, 0, 6)) / 86400000) + (idx * 2)) % 8; if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 8 : rI]; } });
}

window.onload = () => { baslat(); checklistOlustur(); };