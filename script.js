/**
 * PRO-Vardiya v24.6 | TÜM KURALLAR (Eksiksiz)
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

    // TEKNİK YÖNETMEN ÖZEL KAPASİTELERİ (KURAL)
    kapasiteAyarlari["TEKNİK YÖNETMEN"]["06:30–16:00"] = { haftaici: 2, haftasonu: 1 };
    kapasiteAyarlari["TEKNİK YÖNETMEN"]["16:00–00:00"] = { haftaici: 1, haftasonu: 1 };
    kapasiteAyarlari["TEKNİK YÖNETMEN"]["00:00–07:00"] = { haftaici: 1, haftasonu: 1 };
    kapasiteAyarlari["TEKNİK YÖNETMEN"]["09:00–18:00"] = { haftaici: 0, haftasonu: 1 };

    checklistOlustur();
    tabloyuOlustur();
}

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

function canWorkInShift(personel, gunIndex, saat) {
    if (haftalikProgram[personel.isim][gunIndex] !== null) return false;
    
    // SES OPERATÖRÜ GECE YASAĞI
    if (personel.birim === "SES OPERATÖRÜ" && saat === "00:00–07:00") return false;

    // TEKNİK YÖNETMEN GECE ROTASYONU (BARIŞ İNCE & EKREM FİDAN)
    if (personel.birim === "TEKNİK YÖNETMEN" && saat === "00:00–07:00") {
        if (personel.isim !== "BARIŞ İNCE" && personel.isim !== "EKREM FİDAN") return false;
    }

    return true;
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    sabitPersoneller.forEach(p => {
        haftalikProgram[p.isim] = Array(7).fill(null);
        if(document.getElementById(`check_${p.id}`)?.checked) haftalikProgram[p.isim].fill("İZİN");
    });

    // 1. BARIŞ İNCE KURALI (2 GECE + 2 İZİN + KALAN GÜNLER SABAH/AKŞAM)
    const baris = sabitPersoneller.find(p => p.isim === "BARIŞ İNCE");
    let gunIndeksleri = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
    
    let gCount = 0;
    gunIndeksleri.forEach(g => {
        if(gCount < 2) { haftalikProgram[baris.isim][g] = "00:00–07:00"; gCount++; }
    });
    
    let iCount = 0;
    gunIndeksleri.forEach(g => {
        if(haftalikProgram[baris.isim][g] === null && iCount < 2) { haftalikProgram[baris.isim][g] = "İZİN"; iCount++; }
    });

    // 2. MCR VE INGEST ROTALARI
    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    applyIngestRota();

    // 3. GENEL ATAMA
    for(let i=0; i<7; i++) {
        const isHS = (i >= 5);
        saatler.forEach(s => {
            birimSiralamasi.forEach(birim => {
                if(birim.includes("MCR") || birim.includes("INGEST")) return;
                
                let kap = kapasiteAyarlari[birim]?.[s]?.[isHS ? 'haftasonu' : 'haftaici'] || 0;
                let suan = sabitPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][i] === s).length;
                let adaylar = sabitPersoneller.filter(p => p.birim === birim && canWorkInShift(p, i, s));
                
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
            let cells = list.map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span>${p.isim}</div>`).join('');
            b += `<td>${cells}</td>`;
        }
        b += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = b;
}

function toggleAdminPanel() { document.getElementById("adminPanel").classList.toggle("hidden"); kapasitePaneliniCiz(); }
function tabDegistir(t) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + t).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}
function kapasitePaneliniCiz() {
    const cont = document.getElementById("kapasiteListesi");
    let html = `<div style="display:grid; grid-template-columns: 160px repeat(6, 1fr); gap:5px; font-weight:bold; background:#eee; padding:5px"><div>Birimler</div>${saatler.map(s => `<div>${s.split('–')[0]}</div>`).join('')}</div>`;
    birimSiralamasi.filter(b => !b.includes("MCR") && !b.includes("INGEST")).forEach(b => {
        html += `<div style="display:grid; grid-template-columns: 160px repeat(6, 1fr); gap:5px; margin-top:5px; border-bottom:1px solid #eee; padding-bottom:5px"><strong>${b}</strong>`;
        saatler.forEach(s => {
            html += `<div>
                <input type="number" style="width:100%" value="${kapasiteAyarlari[b][s].haftaici}" onchange="gK('${b}','${s}','haftaici',this.value)">
                <input type="number" style="width:100%; background:#fff1f2" value="${kapasiteAyarlari[b][s].haftasonu}" onchange="gK('${b}','${s}','haftasonu',this.value)">
            </div>`;
        });
        html += `</div>`;
    });
    cont.innerHTML = html;
}
function gK(b, s, t, v) { kapasiteAyarlari[b][s][t] = parseInt(v) || 0; localStorage.setItem("kapasiteAyarlari", JSON.stringify(kapasiteAyarlari)); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
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
function checklistOlustur() {
    const s = [...sabitPersoneller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    document.getElementById("personelChecklist").innerHTML = s.map(p => `<div class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> ${p.isim}</div>`).join('');
}
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
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save('Vardiya.pdf'); }
function sifirla() { if(confirm("Tüm veriler silinsin mi?")) { localStorage.clear(); location.reload(); } }
window.onload = baslat;