// KRİTİK SIRALAMA VE PERSONEL LİSTESİ
const birimSiralamasi = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", 
    "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const personeller = [
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

let haftalikProgram = {};
let mevcutPazartesi = getMonday(new Date());

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay();
    let diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};

    // 1. Programı temizle ve manuel izinleri kontrol et
    personeller.forEach(p => {
        const isChecked = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isChecked ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // 2. MCR Rotasyonu (Sabit Döngü)
    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");

    // 3. Teknik Yönetmen Hafta Sonu Sabitleme
    const tyEkibi = personeller.filter(p => p.birim === "TEKNİK YÖNETMEN");
    [5, 6].forEach(g => {
        let adaylar = tyEkibi.filter(p => !haftalikProgram[p.isim][g]);
        if(adaylar[0]) haftalikProgram[adaylar[0].isim][g] = "06:30–16:00";
        if(adaylar[1]) haftalikProgram[adaylar[1].isim][g] = "16:00–00:00";
    });

    // 4. Diğer Birimler ve Saatler
    for(let g = 0; g < 7; g++) {
        saatler.forEach(s => {
            if(["00:00–07:00", "İZİN", "DIŞ YAYIN"].includes(s)) return;
            if(g >= 5 && s === "09:00–18:00") return; // Hafta sonu 09:00 yok

            birimSiralamasi.forEach(birim => {
                if(birim.includes("MCR") || birim === "TEKNİK YÖNETMEN") return;
                
                let kap = (g >= 5) ? (birim === "SES OPERATÖRÜ" ? 2 : 1) : (birim === "SES OPERATÖRÜ" ? 3 : 2);
                if(["BİLGİ İŞLEM", "YAYIN SİSTEMLERİ"].includes(birim)) kap = (g >= 5) ? 0 : 1;

                let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][g]);
                let suanCount = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][g] === s).length;

                for(let k = 0; k < (kap - suanCount); k++) {
                    let p = adaylar.find(x => haftalikProgram[x.isim].filter(v => v && v !== "İZİN").length < 5);
                    if(p) {
                        haftalikProgram[p.isim][g] = s;
                        adaylar = adaylar.filter(x => x.isim !== p.isim);
                    }
                }
            });
        });
    }

    // 5. Boşlukları İzinle Doldur
    personeller.forEach(p => {
        for(let i=0; i<7; i++) if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = "İZİN";
    });

    renderUI();
}

function renderUI() {
    // Header
    document.getElementById("tableHeader").innerHTML = `<th>Saatler</th>` + gunler.map(g => `<th>${g}</th>`).join('');
    
    // Body
    let html = "";
    saatler.forEach(s => {
        html += `<tr><td>${s}</td>`;
        for(let g=0; g<7; g++) {
            let hucredekiler = personeller.filter(p => haftalikProgram[p.isim][g] === s);
            hucredekiler.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
            let content = hucredekiler.map(p => `
                <div class="birim-card">
                    <span class="birim-tag">${p.birim}</span>
                    <span class="p-isim">${p.isim}</span>
                </div>
            `).join('');
            html += `<td>${content}</td>`;
        }
        html += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = html;

    // Özet
    let ozetHtml = `<h3>Haftalık Çalışma Gün Sayıları</h3><div style="display:flex; flex-wrap:wrap; gap:10px;">`;
    personeller.forEach(p => {
        let count = haftalikProgram[p.isim].filter(v => v !== "İZİN").length;
        ozetHtml += `<div style="padding:5px 10px; border-radius:5px; background:${count>5?'#f87171':'#4ade80'}; color:#000; font-size:10px;">${p.isim}: ${count}G</div>`;
    });
    document.getElementById("ozetTablo").innerHTML = ozetHtml + "</div>";
}

function applyMCRRota(birim) {
    const ekip = personeller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let diff = Math.floor((d - ref) / 86400000) + (idx * 2);
            let rI = diff % 8;
            haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 8 : rI];
        }
    });
}

function checklistOlustur() {
    const sorted = [...personeller].sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    document.getElementById("personelChecklist").innerHTML = sorted.map(p => `
        <label class="check-item"><input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()"> ${p.isim}</label>
    `).join('');
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function temizleHafiza() { localStorage.clear(); location.reload(); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save('Vardiya_Listesi.pdf'); }
function whatsappMesajiOlustur() {
    let m = `📋 *${mevcutPazartesi.toLocaleDateString('tr-TR')} VARDİYASI*\n\n`;
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