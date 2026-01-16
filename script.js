/**
 * PRO-Vardiya v16.4 | v14.5 Core
 * KURAL: Gece vardiyasında (00:00–07:00) SES OPERATÖRÜ OLMAYACAK.
 * Analiz: Tüm personel haftalık mesai ve gece kontrolü dahil.
 */

const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let personeller = [
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
let tumPersoneller = [...personeller, ...ekPersoneller];
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function toggleAdminPanel() {
    document.getElementById("adminPanel").classList.toggle("hidden");
    document.getElementById("birimSec").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function personelEkle() {
    const isim = document.getElementById("yeniIsim").value.toUpperCase();
    const birim = document.getElementById("birimSec").value;
    if(!isim) return;
    ekPersoneller.push({ id: Date.now(), isim, birim });
    localStorage.setItem("ekPersoneller", JSON.stringify(ekPersoneller));
    location.reload(); 
}

function checklistOlustur() {
    const container = document.getElementById("personelChecklist");
    const sirali = [...tumPersoneller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    container.innerHTML = sirali.map(p => `
        <div class="check-item" onclick="toggleCheckbox('${p.id}')">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <label><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
}

function toggleCheckbox(id) {
    const cb = document.getElementById('check_' + id);
    if(cb) { cb.checked = !cb.checked; tabloyuOlustur(); }
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    tumPersoneller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // Barış & Ekrem Özel Gece Kuralları
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
    if(!["12:00–22:00", "DIŞ YAYIN", "İZİN"].includes(saat)) {
        birimSiralamasi.forEach(birim => {
            if(birim.includes("MCR") || birim.includes("INGEST")) return;
            
            let kap = 0;
            // KRİTİK KURAL: Gece (00:00-07:00) vardiyasında SES (kap = 0) olmayacak.
            if(birim === "SES OPERATÖRÜ") {
                if(saat === "00:00–07:00") kap = 0; 
                else if(saat === "09:00–18:00") kap = isHS ? 2 : 0;
                else kap = isHS ? 2 : (saat === "06:30–16:00" ? 4 : 2);
            } 
            else if(birim === "TEKNİK YÖNETMEN") {
                if(saat === "00:00–07:00") kap = 1;
                else if(!isHS) {
                    if(saat === "06:30–16:00") kap = 2;
                    else if(saat === "16:00–00:00") kap = 1;
                } else {
                    if(saat === "06:30–16:00" || saat === "09:00–18:00" || saat === "16:00–00:00") kap = 1;
                }
            } else if(birim === "PLAYOUT OPERATÖRÜ") {
                if(saat === "06:30–16:00") kap = isHS ? 2 : 3;
                else if(saat === "16:00–00:00") kap = 2;
            } else if(birim === "KJ OPERATÖRÜ") {
                if(saat === "06:30–16:00" || saat === "16:00–00:00") kap = 2;
            } else if(birim === "BİLGİ İŞLEM" || birim === "YAYIN SİSTEMLERİ") {
                kap = (!isHS && saat === "09:00–18:00") ? 1 : 0;
            }

            let adaylar = tumPersoneller.filter(p => p.birim === birim && !haftalikProgram