const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", 
    "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const varsayilanPersoneller = [
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

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let personeller = [...varsayilanPersoneller];
let haftalikProgram = {};
let mevcutPazartesi = getMonday(new Date());

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function hiyerarsikSirala(liste) { return [...liste].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim) || a.isim.localeCompare(b.isim)); }

function tabloyuOlustur() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    const gecenHaftaKey = new Date(mevcutPazartesi.getTime() - 7 * 86400000).toISOString().split('T')[0];
    const hafiza = JSON.parse(localStorage.getItem("v12_hafiza")) || {};

    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};

    personeller.forEach(p => {
        const isIzinli = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isIzinli ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // 1. TY HAFTA SONU SABİTLEME (GÜVENLİ KADRO)
    const tyEkibi = personeller.filter(p => p.birim === "TEKNİK YÖNETMEN");
    [5, 6].forEach(gun => {
        let adaylar = tyEkibi.filter(p => !haftalikProgram[p.isim][gun]);
        if(adaylar.length >= 2) {
            haftalikProgram[adaylar[0].isim][gun] = "06:30–16:00";
            haftalikProgram[adaylar[1].isim][gun] = "16:00–00:00";
        }
    });

    // 2. TY GECE VE MCR ROTASYONU
    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");
    for(let g=0; g<7; g++) {
        let tyAday = tyEkibi.find(p => !haftalikProgram[p.isim][g]);
        if(tyAday) haftalikProgram[tyAday.isim][g] = "00:00–07:00";
    }

    // 3. GENEL ATAMA MOTORU (ADALETLİ ROTASYON)
    for(let g=0; g<7; g++) {
        saatler.forEach(s => {
            if(["00:00–07:00", "İZİN"].includes(s)) return;
            birimSiralamasi.forEach(birim => {
                if(birim.includes("MCR") || birim === "TEKNİK YÖNETMEN") return;
                
                // Hafta sonu 09:00 kapalılık kuralı
                if(g >= 5 && s === "09:00–18:00") return;

                let kap = (g >= 5) ? (birim === "SES OPERATÖRÜ" ? 2 : 1) : (birim === "SES OPERATÖRÜ" ? 3 : 2);
                if(birim === "BİLGİ İŞLEM" || birim === "YAYIN SİSTEMLERİ") kap = (g >= 5) ? 0 : 1;

                let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][g]);
                
                // HAFIZA KONTROLÜ: Geçen hafta 6 gün çalışanı bul, bu hafta geriye çek
                adaylar.sort((a, b) => {
                    let aGecen = (hafiza[gecenHaftaKey] && hafiza[gecenHaftaKey][a.isim]) || 5;
                    let bGecen = (hafiza[gecenHaftaKey] && hafiza[gecenHaftaKey][b.isim]) || 5;
                    return aGecen - bGecen;
                });

                let suan = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][g] === s).length;
                for(let k=0; k < (kap-suan); k++) {
                    if(adaylar.length > 0) {
                        let p = adaylar.find(x => haftalikProgram[x.isim].filter(v => v && v !== "İZİN").length < 5);
                        if(!p) p = adaylar[0];
                        if(p) {
                            haftalikProgram[p.isim][g] = s;
                            adaylar = adaylar.filter(x => x.isim !== p.isim);
                        }
                    }
                }
            });
        });
    }

    // BOŞLUKLARI İZİN YAP VE HAFIZAYA İŞLE
    let buHaftaYuk = {};
    personeller.forEach(p => {
        for(let i=0; i<7; i++) if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = "İZİN";
        buHaftaYuk[p.isim] = haftalikProgram[p.isim].filter(v => v !== "İZİN").length;
    });
    hafiza[haftaKey] = buHaftaYuk;
    localStorage.setItem("v12_hafiza", JSON.stringify(hafiza));

    renderTable();
    ozetGuncelle(gecenHaftaKey, hafiza);
}

function renderTable() {
    document.getElementById("tableHeader").innerHTML = `<th>Vardiya</th>` + gunler.map(g => `<th>${g}</th>`).join('');
    document.getElementById("tableBody").innerHTML = saatler.map(s => `<tr><td>${s}</td>${[0,1,2,3,4,5,6].map(g => `<td>${hucreDoldur(g, s)}</td>`).join('')}</tr>`).join('');
}

function hucreDoldur(gun, saat) {
    let list = personeller.filter(p => haftalikProgram[p.isim][gun] === saat);
    return hiyerarsikSirala(list).map(p => `
        <div class="birim-card">
            <span class="birim-tag">${p.birim}</span>
            <span class="p-isim">${p.isim}</span>
        </div>
    `).join('');
}

function applyMCRRota(birim) {
    const ekip = personeller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        if(document.getElementById(`check_${p.id}`)?.checked) return;
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rI = (Math.floor((d - ref) / 86400000) + (idx * 2)) % 8;
            haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 8 : rI];
        }
    });
}

function ozetGuncelle(gecenKey, hafiza) {
    let h = `<table><tr><th>Personel</th><th>Birim</th><th>Geçen Hafta</th><th>Bu Hafta</th><th>Sonuç</th></tr>`;
    hiyerarsikSirala(personeller).forEach(p => {
        const m = haftalikProgram[p.isim].filter(v => v !== "İZİN").length;
        const g = (hafiza[gecenKey] && hafiza[gecenKey][p.isim]) || 5;
        h += `<tr class="${m<=5?'izinli-row':'mesai-row'}"><td>${p.isim}</td><td>${p.birim}</td><td>${g} Gün</td><td>${m} Gün</td><td>${m<=5?'✅ 2 İzin':'1 İzin'}</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + `</table>`;
}

function checklistOlustur() {
    document.getElementById("personelChecklist").innerHTML = hiyerarsikSirala(personeller).map(p => `
        <label class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> ${p.isim}</label>
    `).join('');
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function temizleHafiza() { localStorage.removeItem("v12_hafiza"); location.reload(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }

function whatsappMesajiOlustur() {
    let m = `📋 *${mevcutPazartesi.toLocaleDateString('tr-TR')} VARDİYA LİSTESİ*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let n = personeller.filter(p => haftalikProgram[p.isim][i] === s).map(x => x.isim);
            if(n.length > 0) m += `▫️ ${s}: ${n.join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("Kopyalandı!"));
}

window.onload = () => { checklistOlustur(); tabloyuOlustur(); };