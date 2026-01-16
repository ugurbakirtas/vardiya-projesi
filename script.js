const BIRIM_SIRASI = [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", 
    "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

const PERSONELLER = [
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

const GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const SAATLER = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let program = {};

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay();
    let diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    program = {};
    
    // 1. Programı temizle
    PERSONELLER.forEach(p => {
        const el = document.getElementById(`chk_${p.id}`);
        program[p.isim] = (el && el.checked) ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // 2. MCR Rotasyonu
    applyMCR("24TV MCR OPERATÖRÜ", 0);
    applyMCR("360TV MCR OPERATÖRÜ", 4);

    // 3. TY Hafta Sonu
    const ty = PERSONELLER.filter(p => p.birim === "TEKNİK YÖNETMEN");
    [5, 6].forEach(g => {
        let adaylar = ty.filter(p => !program[p.isim][g]);
        if(adaylar[0]) program[adaylar[0].isim][g] = "06:30–16:00";
        if(adaylar[1]) program[adaylar[1].isim][g] = "16:00–00:00";
    });

    // 4. Genel Dağıtım
    for(let g=0; g<7; g++) {
        SAATLER.forEach(s => {
            if(["00:00–07:00", "İZİN", "DIŞ YAYIN"].includes(s)) return;
            if(g >= 5 && s === "09:00–18:00") return;

            BIRIM_SIRASI.forEach(birim => {
                if(birim.includes("MCR") || birim === "TEKNİK YÖNETMEN") return;
                
                let kap = (g >= 5) ? (birim === "SES OPERATÖRÜ" ? 2 : 1) : (birim === "SES OPERATÖRÜ" ? 3 : 2);
                if(["BİLGİ İŞLEM", "YAYIN SİSTEMLERİ"].includes(birim)) kap = (g >= 5) ? 0 : 1;

                let adaylar = PERSONELLER.filter(p => p.birim === birim && !program[p.isim][g]);
                let dolu = PERSONELLER.filter(p => p.birim === birim && program[p.isim][g] === s).length;

                for(let k=0; k < (kap-dolu); k++) {
                    let p = adaylar.find(x => program[x.isim].filter(v => v && v !== "İZİN").length < 5);
                    if(p) {
                        program[p.isim][g] = s;
                        adaylar = adaylar.filter(x => x.isim !== p.isim);
                    }
                }
            });
        });
    }

    // 5. Boşlukları İzin Yap
    PERSONELLER.forEach(p => {
        for(let i=0; i<7; i++) if(!program[p.isim][i]) program[p.isim][i] = "İZİN";
    });

    render();
}

function applyMCR(birim, offset) {
    const ekip = PERSONELLER.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rIdx = (Math.floor((d - ref) / 86400000) + (idx * 2) + offset) % 8;
            if(!program[p.isim][i]) program[p.isim][i] = rota[rIdx < 0 ? rIdx + 8 : rIdx];
        }
    });
}

function render() {
    document.getElementById("tabloKafa").innerHTML = `<th>SAAT</th>` + GUNLER.map(g => `<th>${g}</th>`).join('');
    
    let html = "";
    SAATLER.forEach(s => {
        html += `<tr><td>${s}</td>`;
        for(let g=0; g<7; g++) {
            let liste = PERSONELLER.filter(p => program[p.isim][g] === s);
            liste.sort((a,b) => BIRIM_SIRASI.indexOf(a.birim) - BIRIM_SIRASI.indexOf(b.birim));
            html += `<td>${liste.map(p => `
                <div class="p-card">
                    <span class="unit-tag">${p.birim}</span>
                    <span class="name-tag">${p.isim}</span>
                </div>
            `).join('')}</td>`;
        }
        html += `</tr>`;
    });
    document.getElementById("tabloGovde").innerHTML = html;
}

function checklist() {
    document.getElementById("checklist").innerHTML = PERSONELLER.map(p => `
        <label class="check-item"><input type="checkbox" id="chk_${p.id}" onchange="tabloyuOlustur()"> ${p.isim}</label>
    `).join('');
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }

window.onload = () => { checklist(); tabloyuOlustur(); };