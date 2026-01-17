/**
 * PRO-Vardiya v24.1 | Stabil Full Algorithm
 */

const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", 
    "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", 
    "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
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

let kapasiteAyarlari = JSON.parse(localStorage.getItem("kapasiteAyarlari")) || {};
let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function baslat() {
    birimSiralamasi.forEach(b => {
        if(!kapasiteAyarlari[b]) {
            kapasiteAyarlari[b] = {};
            saatler.forEach(s => { kapasiteAyarlari[b][s] = { haftaici: 0, haftasonu: 0 }; });
        }
    });
    checklistOlustur();
    tabloyuOlustur();
}

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    
    // Temizle ve İzinlileri İşle
    sabitPersoneller.forEach(p => {
        haftalikProgram[p.isim] = Array(7).fill(null);
        if(document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİN");
    });
    
    // 1. Rotalı Birimleri Önce Yerleştir (MCR ve INGEST)
    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();
    
    // 2. Diğer Birimleri Kapasiteye Göre Doldur (Önemli: Bu işlem render sırasında değil burada yapılır)
    for(let i=0; i<7; i++) {
        const isHS = (i >= 5);
        saatler.forEach(s => {
            birimSiralamasi.forEach(birim => {
                if(birim.includes("MCR") || birim.includes("INGEST")) return;
                
                let kap = kapasiteAyarlari[birim]?.[s]?.[isHS ? 'haftasonu' : 'haftaici'] || 0;
                if(birim === "SES OPERATÖRÜ" && s === "00:00–07:00") kap = 0;

                let adaylar = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][i] === null);
                let suan = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][i] === s).length;
                
                for(let k=0; k < (kap-suan); k++) {
                    if(adaylar.length > 0) {
                        let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                        haftalikProgram[p.isim][i] = s;
                    }
                }
            });
        });
    }

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
            let list = sabitPersoneller.filter(p => haftalikProgram[p.isim][i] === s)
                                     .sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
            
            let cells = list.map(p => `
                <div class="birim-card" onclick="openPersonelCard('${p.isim}')">
                    <span class="birim-tag">${p.birim}</span>${p.isim}
                </div>
            `).join('');
            b += `<td>${cells}</td>`;
        }
        b += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = b;
}

// PERSONEL KARTI SİSTEMİ
function openPersonelCard(isim) {
    const modal = document.getElementById("personelCardModal");
    const content = document.getElementById("cardContent");
    document.getElementById("cardPersonelName").innerText = isim;
    window.currentCardUser = isim;
    
    let html = "";
    gunler.forEach((g, i) => {
        let v = haftalikProgram[isim][i] || "İZİN";
        html += `<div class="vardiya-gun-row"><strong>${g}</strong><span class="saat-değeri">${v}</span></div>`;
    });
    content.innerHTML = html;
    modal.classList.remove("hidden");
}

function closeCard() { document.getElementById("personelCardModal").classList.add("hidden"); }

function exportToCalendar() {
    const isim = window.currentCardUser;
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\n";
    gunler.forEach((g, i) => {
        let v = haftalikProgram[isim][i];
        if(v && v !== "İZİN") {
            let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
            let ds = t.toISOString().split('T')[0].replace(/-/g, '');
            ics += `BEGIN:VEVENT\nSUMMARY:Vardiya: ${v}\nDTSTART:${ds}T090000\nDTEND:${ds}T180000\nEND:VEVENT\n`;
        }
    });
    ics += "END:VCALENDAR";
    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${isim}_Vardiya.ics`;
    link.click();
}

// ANALİZ VE GÖRSELLER
function asistanAnalizYap() {
    const pan = document.getElementById("uyariPaneli");
    let errs = [];
    gunler.forEach((g, i) => {
        saatler.forEach(s => {
            birimSiralamasi.filter(b => !b.includes("MCR") && !b.includes("INGEST")).forEach(b => {
                let kap = kapasiteAyarlari[b]?.[s]?.[i >= 5 ? 'haftasonu' : 'haftaici'] || 0;
                let suan = sabitPersoneller.filter(p => p.birim === b && haftalikProgram[p.isim][i] === s).length;
                if(suan < kap) errs.push(`⚠️ ${g} ${s}: ${b} eksik!`);
            });
        });
    });
    pan.innerHTML = errs.length ? `<strong>Kapasite Uyarıları:</strong><br>${errs.join('<br>')}` : "";
    pan.classList.toggle("hidden", errs.length === 0);
}

function isiHaritasiCiz() {
    const cont = document.getElementById("heatmapContainer");
    cont.innerHTML = gunler.map((g, i) => {
        let count = sabitPersoneller.filter(p => haftalikProgram[p.isim][i] && haftalikProgram[p.isim][i] !== "İZİN").length;
        let color = count > 15 ? "#ef4444" : (count > 10 ? "#f59e0b" : "#10b981");
        return `<div class="heatmap-day" style="border-bottom-color:${color}"><small>${g}</small><div>${count} Kişi</div></div>`;
    }).join('');
}

// YARDIMCI FONKSİYONLAR
function checklistOlustur() {
    const s = [...sabitPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    document.getElementById("personelChecklist").innerHTML = s.map(p => `
        <div class="check-item">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> ${p.isim}
        </div>`).join('');
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

// UI YÖNETİMİ
function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); kapasitePaneliniCiz(); }
function tabDegistir(t) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + t).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}
function kapasitePaneliniCiz() {
    const cont = document.getElementById("kapasiteListesi");
    let html = `<div class="cap-table-header" style="display:grid; grid-template-columns: 140px repeat(6, 1fr); gap:5px; font-weight:bold"><div>Birimler</div>${saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    birimSiralamasi.filter(b => !b.includes("MCR") && !b.includes("INGEST")).forEach(b => {
        html += `<div class="cap-row" style="display:grid; grid-template-columns: 140px repeat(6, 1fr); gap:5px; margin-top:5px"><strong>${b}</strong>`;
        saatler.forEach(s => {
            html += `<div class="cap-group">
                <input type="number" style="width:100%" value="${kapasiteAyarlari[b][s].haftaici}" onchange="gK('${b}','${s}','haftaici',this.value)">
                <input type="number" style="width:100%; background:#ffecec" value="${kapasiteAyarlari[b][s].haftasonu}" onchange="gK('${b}','${s}','haftasonu',this.value)">
            </div>`;
        });
        html += `</div>`;
    });
    cont.innerHTML = html;
}
function gK(b, s, t, v) { kapasiteAyarlari[b][s][t] = parseInt(v) || 0; localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari)); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function whatsappMesajiOlustur() {
    let m = `📋 *HAFTALIK VARDİYA PLANI*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let l = sabitPersoneller.filter(p => haftalikProgram[p.isim][i] === s);
            if(l.length > 0) m += `▫️ ${s}: ${l.map(x => x.isim).join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("Kopyalandı!"));
}
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save('Vardiya.pdf'); }
function sifirla() { if(confirm("Tüm veriler silinsin mi?")) { localStorage.clear(); location.reload(); } }

window.onload = baslat;