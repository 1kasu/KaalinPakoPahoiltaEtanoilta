// Tekijä Kasimir Ilmonen

var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var kentta;

var pisteet = 0;

function preload() {
    // Ladataan resurssit
    game.load.image('etana','kuvat/Ilkea_etana.png');
    game.load.image('kaali','kuvat/cabbage.png');
    game.load.image('kaaliHaukku','kuvat/cabbage_haukku.png');
    game.load.image('kaaliHaukku2','kuvat/cabbage_haukku2.png');
    game.load.image('pohjakupla','kuvat/Pohjakupla.png');
    
    game.load.image('IFE','kuvat/IFE_hoikempi.png');
    game.load.image('IZE','kuvat/PZE.png');
    game.load.image('IHE','kuvat/IHE.png');
    game.load.image('IEE','kuvat/IEE.png');
    game.load.image('IVE','kuvat/IVE.png');
    
    game.load.audio('music', ['Free-bluegrass-music/Free-bluegrass-music.mp3', 'Free-bluegrass-music/Free-bluegrass-music.ogg']);
    game.load.audio('crunch', ['Cartoon-crunching-bite/Cartoon-crunching-bite.mp3', 'Cartoon-crunching-bite/Cartoon-crunching-bite.ogg']);
    
    //Kaalikuplat
    game.load.image('pakokupla','kuvat/pakokupla.png');
    
    //Satunnaisia huutoja kaalille
    game.load.image('KuolemaEtanoille','kuvat/KuolemaEtanoille.png');
    game.load.image('Kaikkien','kuvat/Kaikkien.png');
    game.load.image('Taparalla','kuvat/TuoOli.png');
    game.load.image('Kanaa','kuvat/SyokaaKanaa.png');
    game.load.image('VielaTaytyy','kuvat/VielaTaytyy.png');
    game.load.image('EtteSaa','kuvat/EtteSaa.png');
    
    
    //OsumaKupla
    game.load.image('Lehteni','kuvat/KauniitLehteni.png');
    game.load.image('Onneksi','kuvat/OnneksiPaasin.png');
    game.load.image('AuSattuu','kuvat/AuSattuu.png');
    game.load.image('AlaSyo','kuvat/AlkaaSyoko.png');
    
    //KierrosKupla kaalille
    game.load.image('Miksi','kuvat/MiksiNayttaa.png');
    game.load.image('OlenkoOllut','kuvat/OlenkoOllutKupla.png');
    game.load.image('NuoOvat','kuvat/NuoOvatKupla.png');
    
    //KuolemaKuplat kaalille
    game.load.image('Pimenee','kuvat/KaikkiPimenee.png');
    game.load.image('OlikoTama','kuvat/OlikoTama.png');
    game.load.image('HalusinVain','kuvat/HalusinVain.png');
    
    //Kuplakuvat
    game.load.image('Veitsi','kuvat/AlaValitaVeitsestaKupla.png');
    game.load.image('EnTee','kuvat/EnTeePahaaKupla.png');
    game.load.image('Kaaliseni','kuvat/KaaliseniKupla.png');
    game.load.image('EiSatu','kuvat/TamaEiSatuKupla.png');
    
    game.load.image('AlaPakoon','kuvat/AlkaaPaastakoPakoonkupla.png');
    game.load.image('Napatkaa','kuvat/Napatkaakupla.png');
    game.load.image('Pysayttakaa','kuvat/Pysayttakaakupla.png');
    game.load.image('Karsimaan','kuvat/Karsimaankupla.png');
    
    game.load.image('Nalka','kuvat/NalkaKupla.png');
    game.load.image('HaluanKaalia','kuvat/HaluanKaaliakupla.png');
    game.load.image('Haukkaus','kuvat/VainHaukkausKupla.png');
    game.load.image('Nam','kuvat/NamKaaliaKupla.png');
    
    game.load.image('PPP','kuvat/PPPkupla.png');
    
    
    
}

class Liikkumisjarki{
    constructor(alue_x1, alue_x2, kaytettavaJarkiNmr) {
        this.alue_x1 = alue_x1;//Alue, jolla saa liikkua.
        this.alue_x2 = alue_x2;
        this.jarkiNmr = kaytettavaJarkiNmr;
    }
    
    kaytaJarkea(oma_x, oma_y, jahti_x, jahti_y){
        if (this.jarkiNmr == 0) return this.liikkumislogiikka_jahtaus(oma_x, oma_y, jahti_x, jahti_y);
        if (this.jarkiNmr == 1) return this.liikkumislogiikka_jahtausX(oma_x, oma_y, jahti_x, jahti_y);
        if (this.jarkiNmr == 2) return this.liikkumislogiikka_jahtausY(oma_x, oma_y, jahti_x, jahti_y);
        else return suunnat.PAIKKA;
    }
    
    // Liikkumislogiikka, joka jahtaa kohdetta.
    liikkumislogiikka_jahtaus(oma_x, oma_y, jahti_x, jahti_y){
        var jahdattavan_suhteellinen_suunta_x = jahti_x - oma_x;
        var jahdattavan_suhteellinen_suunta_y = jahti_y - oma_y;
        
        var suunta;
        if (Math.abs(jahdattavan_suhteellinen_suunta_x) <= Math.abs(jahdattavan_suhteellinen_suunta_y)) {
            if (jahdattavan_suhteellinen_suunta_y >= 0) {
                suunta = suunnat.ALAS;
            }
            else {
                suunta = suunnat.YLOS;
            }
        }
        else {
            if (jahdattavan_suhteellinen_suunta_x <= 0){
                if (oma_x - 1 >= this.alue_x1) {
                    suunta = suunnat.VASEN;
                }
                else {
                    suunta = suunnat.PAIKKA;
                }
            }
            else {
                if (oma_x + 1 <= this.alue_x2) {
                    suunta = suunnat.OIKEA;
                }
                else {
                    suunta = suunnat.PAIKKA;
                }
            }
        }
        
        return suunta;
    }
    
    liikkumislogiikka_jahtausX(oma_x, oma_y, jahti_x, jahti_y){
        var jahdattavan_suhteellinen_suunta_x = jahti_x - oma_x;
        var jahdattavan_suhteellinen_suunta_y = jahti_y - oma_y;
        
        var suunta;
        if (jahdattavan_suhteellinen_suunta_x != 0) {
            if (jahdattavan_suhteellinen_suunta_x <= 0){
                if (oma_x - 1 >= this.alue_x1) {
                    suunta = suunnat.VASEN;
                }
                else {
                    suunta = suunnat.PAIKKA;
                }
            }
            else {
                if (oma_x + 1 <= this.alue_x2) {
                    suunta = suunnat.OIKEA;
                }
                else {
                    suunta = suunnat.PAIKKA;
                }
            }
        }
        else {
            if (jahdattavan_suhteellinen_suunta_y >= 0) {
                suunta = suunnat.ALAS;
            }
            else {
                suunta = suunnat.YLOS;
            }
        }
        
        return suunta;
    }
    
    liikkumislogiikka_jahtausY(oma_x, oma_y, jahti_x, jahti_y){
        var jahdattavan_suhteellinen_suunta_x = jahti_x - oma_x;
        var jahdattavan_suhteellinen_suunta_y = jahti_y - oma_y;
        
        var suunta;
        if (jahdattavan_suhteellinen_suunta_y != 0) {
            if (jahdattavan_suhteellinen_suunta_y >= 0) {
                suunta = suunnat.ALAS;
            }
            else {
                suunta = suunnat.YLOS;
            }
        }
        else {
            if (jahdattavan_suhteellinen_suunta_x <= 0){
                if (oma_x - 1 >= this.alue_x1) {
                    suunta = suunnat.VASEN;
                }
                else {
                    suunta = suunnat.PAIKKA;
                }
            }
            else {
                if (oma_x + 1 <= this.alue_x2) {
                    suunta = suunnat.OIKEA;
                }
                else {
                    suunta = suunnat.PAIKKA;
                }
            }
        }
        
        return suunta;
    }
}

class Hahmo {
    
    //Alustaa hahmon
    constructor(kuva, nimi, x, y) {
        this.kuva = kuva;
        this.nimi = nimi;
        this.x = x;
        this.y = y;
        this.s = game.add.sprite(x, y, this.kuva);
        this.aly_aika = game.rnd.integerInRange(10, 100);
    }
    
    skaalaa(xl, yl){
        var h = game.cache.getImage(this.kuva).height;
        var w = game.cache.getImage(this.kuva).width;
        
        if (h < w) {
            var skaalain = (xl - (xl / 10.0)) / w;        
        }
        else {
            var skaalain = (yl - (yl / 10.0)) / h;
        }
        
        if (this.nimi == "kaali") {
            skaalain = skaalain * 0.6;//Kaalit ovat aina pienempiä
        }
        
        
        this.s.scale.setTo(skaalain,skaalain);
        
    }
    
    
    skaalaa_kupla(xl, yl){
        if (typeof this.kupla == 'undefined') return;
        var hk = game.cache.getImage('pohjakupla').height;
        var wk = game.cache.getImage('pohjakupla').width;
        var skaalain;
        
        if (hk < wk) {
            skaalain = (xl - (xl / 100.0)) / wk;        
        }
        else {
            skaalain = (yl - (yl / 10.0)) / hk;
        }
        
        this.kupla.scale.setTo(skaalain,skaalain);
    }
    
    
    //Piirtää hahmon
    piirra(x, y, xl, yl) {
        var h = this.s.height;
        var w = this.s.width;
        
        this.s.x = x + this.x * xl + keskita(w, xl);
        this.s.y = y + this.y * yl + keskita(h, yl);
        
        if (typeof this.kupla == 'undefined') return;
        
        var hk = this.kupla.height;
        var wk = this.kupla.width;
        
        if (this.nimi == "kaali") {
            this.kupla.x = this.s.x;
            this.kupla.y = this.s.y - hk / 2 - h / 2;
        }
        else {
            this.kupla.x = this.s.x - w / 2;
            this.kupla.y = this.s.y - hk / 2.5 - h / 2;
        }
    }
    
    //Asettaa annetun nimisen kuplan hahmolle
    asetaKupla(kupla) {
        this.poista_kupla();
        this.kupla = game.add.sprite(0,0, kupla);
        this.kupla.alpha = 0;
        game.add.tween(this.kupla).from( { alpha: 1 }, 2000, Phaser.Easing.Cubic.None, true, 2000, 0, false);
    }
    
    poista_kupla() {
        if (this.kupla !== undefined) this.kupla.destroy();
        this.kupla = undefined;
    }
}

//Antaa arvo, jolla voidaan siirtää leveyttä niin, että molempiin laitoihin jää yhtäpaljon tilaa.
function keskita(leveys, koko_leveys) {
    return ((koko_leveys - leveys) / 2.0);
}

class Kentta {
    
    //Alustaa kentän suhteelliselle alueelle 
    constructor(alue_x1, alue_x2, alue_y1, alue_y2, leveys, korkeus){
        this.leveys = leveys;
        this.korkeus = korkeus;
        this.hahmot = [];
        
        this.alue_x1 = alue_x1;
        this.alue_x2 = alue_x2;
        this.alue_y1 = alue_y1;
        this.alue_y2 = alue_y2;
        
        this.g = game.add.graphics(0, 0);
        
        //Käynnistää tapahtuma loopin
        game.time.events.loop(Phaser.Timer.SECOND * 0.1, this.paivitaAlya, this);
    }
    
    
    //Asettaa annetun nimiselle hahmolle kuplan.
    asetaKupla(nimi,kupla){
        for(var i = 0; i < this.hahmot.length; i++){
            var hahmo = this.hahmot[i];
            if (hahmo.nimi == nimi) hahmo.asetaKupla(kupla);
        }
    }
    
    
    //Päivittää äly tapahtumia.
    paivitaAlya(){
        for(var i = 0; i < this.hahmot.length; i++){
            var hahmo = this.hahmot[i];
            hahmo.aly_aika--;
            if (typeof this.pelihahmo == 'undefined') return;
            if (hahmo.aly_aika <= 0){
                var suunta = hahmo.aly.kaytaJarkea(hahmo.x,hahmo.y, this.pelihahmo.x, this.pelihahmo.y);
                this.liikuta(hahmo.nimi, suunta);
                hahmo.aly_aika = game.rnd.integerInRange(15, 60);
            }
            
        }
    }
    
    //Lisää hahmon kenttään
    lisaaHahmo(hahmo) {
        this.hahmot.push(hahmo);
    }
    
    //Lisää pelihahmon
    lisaaPelihahmo(hahmo) {
        this.pelihahmo = hahmo;
    }
    
    //Onko etanoita kyseisessä ruudussa.
    onkoEtanoita(x,y){
        for(var i = 0; i < this.hahmot.length; i++){
            var h = this.hahmot[i];
            if (h.x == x && h.y == y) return true;
        }
        return false;
    }
    
    //Skaalaa kentän ja hahmot.
    skaalaa(){
        var ruudun_leveys = Math.min((this.alue_x2 - this.alue_x1) / this.leveys, (this.alue_y2 - this.alue_y1) / this.korkeus);
        
        for(var i = 0; i < this.hahmot.length; i++) {
            this.hahmot[i].skaalaa(ruudun_leveys, ruudun_leveys);
            this.hahmot[i].skaalaa_kupla(ruudun_leveys,ruudun_leveys);
        }
        if (typeof this.pelihahmo == 'undefined') return
        this.pelihahmo.skaalaa(ruudun_leveys,ruudun_leveys);
        this.pelihahmo.skaalaa_kupla(ruudun_leveys,ruudun_leveys);
    }
    
    //Antaa tämän nimisen hahmon
    annaHahmo(nimi){
        for(var i = 0; i < this.hahmot.length; i++){
            var h = this.hahmot[i];
            if (h.nimi == nimi) return h;
        }
    }
    
    
    //Liikuttaa annettua hahmoa annettuun suuntaan.
    liikuta(nimi, suunta){
        for (var i = 0; i < this.hahmot.length; i++){
            var h = this.hahmot[i];
            if (h.nimi == nimi) {
                if (suunta == suunnat.OIKEA) {
                    if (this.onkoEtanoita(h.x + 1,h.y)) return;
                    if (++h.x >= this.leveys) {
                        h.x = 0;
                    }
                }
                if (suunta == suunnat.VASEN) {
                    if (this.onkoEtanoita(h.x - 1,h.y)) return;
                    if (--h.x < 0) {
                        h.x = this.leveys - 1;
                    }
                }
                if (suunta == suunnat.YLOS) {
                    if (this.onkoEtanoita(h.x,h.y - 1)) return;
                    if (--h.y < 0) {
                        h.y = 0;
                    }
                }
                if (suunta == suunnat.ALAS) {
                    if (this.onkoEtanoita(h.x, h.y + 1)) return;
                    if (++h.y >= this.korkeus) {
                        h.y = this.korkeus - 1;
                    }
                }
            }
        }    
        if (typeof this.pelihahmo == 'undefined') return;
        var h = this.pelihahmo;
        if (h.nimi == nimi) {
            if (suunta == suunnat.OIKEA) {
                if (++h.x >= this.leveys) {
                    h.x = 0;
                }
                pisteet++;
            }
            if (suunta == suunnat.VASEN) {
                if (--h.x < 0) {
                    h.x = this.leveys - 1;
                }
                pisteet--;
            }
            if (suunta == suunnat.YLOS) {
                if (--h.y < 0) {
                    h.y = 0;
                }
            }
            if (suunta == suunnat.ALAS) {
                if (++h.y >= this.korkeus) {
                    h.y = this.korkeus - 1;
                }
            }
        }
    }
    
    //Päivittää piirtoalueen.
    paivitaAlue(alue_x1, alue_x2, alue_y1, alue_y2){
        this.alue_x1 = alue_x1;
        this.alue_x2 = alue_x2;
        this.alue_y1 = alue_y1;
        this.alue_y2 = alue_y2;
       
    }
    
    //Piirtää kentän
    piirra() {
        var g = this.g;
        g.clear();
        
        var ruudun_leveys = Math.min((this.alue_x2 - this.alue_x1) / this.leveys, (this.alue_y2 - this.alue_y1) / this.korkeus);
        
        
        var x = this.alue_x1 + keskita(ruudun_leveys * this.leveys, (this.alue_x2 - this.alue_x1));
        var y = this.alue_y1 + keskita(ruudun_leveys * this.korkeus, (this.alue_y2 - this.alue_y1));
        
        g.lineStyle(3, 0x000000, 2)
        for (var i = 0; i < this.leveys; i++){
            for (var j = 0; j < this.korkeus; j++){
                g.drawRect(x + ruudun_leveys * i, y + ruudun_leveys * j, ruudun_leveys, ruudun_leveys);
            }
        }
        
        this.skaalaa();//Tätä ei tarvitsisi tehdä näin usein...
        
        for (var i = 0; i < this.hahmot.length; i++) {
            this.hahmot[i].piirra(x, y, ruudun_leveys, ruudun_leveys);
        }
        
        if (typeof this.pelihahmo !== 'undefined'){
            this.pelihahmo.piirra(x, y, ruudun_leveys, ruudun_leveys);
        }
    }
    
    //Nollaa kentän
    nollaaKentta(){
        this.g.clear();
        for (var i = 0; i < this.hahmot.length; i++){
            this.hahmot[i].poista_kupla();
            this.hahmot[i].s.destroy();
        }
        this.hahmot = [];
        if (typeof this.pelihahmo !== 'undefined') {
            this.pelihahmo.poista_kupla();
            this.pelihahmo.s.destroy();
        }
        this.pelihahmo = undefined;
        
    }
    
    //Tarkistaa onko nimillä a ja b olevat hahmot samassa ruudussa.
    onkoSamassa(){
        if (typeof this.pelihahmo == 'undefined') return (false);

        for (var i = 0; i < this.hahmot.length; i++) {
            var hahmo = this.hahmot[i];
            if (this.pelihahmo.x == hahmo.x && this.pelihahmo.y == hahmo.y){
                tappoi = hahmo.nimi;
                return true;
            }
        }
        
        return false;
    }
    
}

//Luo alkukentän
function luoKentta() {
    var xruutuja = 10;
    var yruutuja = 3;
    
    var kentta = new Kentta(10,window.innerWidth - 10, 0, window.innerHeight, xruutuja,yruutuja);
    var hahmo;
    if (elamat == 2) hahmo = new Hahmo('kaaliHaukku', "kaali", 0, 0);
    else if (elamat == 1) hahmo = new Hahmo('kaaliHaukku2', "kaali", 0, 0);
    else hahmo = new Hahmo('kaali', "kaali", 0, 0);
    hahmo.asetaKupla("pakokupla");
    
    var hahmo2 = new Hahmo('IZE', "Zombi", 3, 0);
    var hahmo3 = new Hahmo('IHE', "H", 3, 1);
    var hahmo4 = new Hahmo('IEE', "EnTiia", 3, 2);
    var hahmo5 = new Hahmo('IFE', "EnSano", 5, 1);
    var hahmo6 = new Hahmo('IVE', "Viikate", 8, 1);
    
    
    hahmo2.aly = new Liikkumisjarki(0,4,0);
    hahmo3.aly = new Liikkumisjarki(0,4,1);
    hahmo4.aly = new Liikkumisjarki(0,4,2);
    hahmo5.aly = new Liikkumisjarki(3,7,2);
    hahmo6.aly = new Liikkumisjarki(5,9,1);
    
    kentta.lisaaPelihahmo(hahmo);
    kentta.lisaaHahmo(hahmo2); 
    kentta.lisaaHahmo(hahmo3);
    kentta.lisaaHahmo(hahmo4);
    kentta.lisaaHahmo(hahmo5);
    kentta.lisaaHahmo(hahmo6);
    
    return kentta;
}


function create() {
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    game.stage.backgroundColor = "#4488AA";// Asetetaan taustaväri
    piste_teksti = game.add.text(game.world.centerX, game.world.top, "Pisteet: 0", {font: "32px Arial", fill: "#ffffff", align: "right"});
    //piste_teksti.anchor.setTo(0.6,0.3);
    
    kentta = luoKentta();
}

var piste_teksti;
var elamat = 3;

// Muistina, että mihin suuntaan ollaan menossa.
var olikoOikea = true;

var edellinenJohonkinYlhaalla = [true,true,true,true]

var suunnat = {
    YLOS: 0,
    ALAS: 1,
    VASEN: 2,
    OIKEA: 3,  
    PAIKKA: 4
};

var kuollut = false;

function update() {
    
    if (!kuollut) {
        
        //Luetaan kontrollit ja liikutaan sen mukaan.
        if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && edellinenJohonkinYlhaalla[3]) {
            kentta.liikuta("kaali",suunnat.OIKEA);
        }
        else {
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && edellinenJohonkinYlhaalla[2]) {
                kentta.liikuta("kaali",suunnat.VASEN);
            }
            else {
                if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && edellinenJohonkinYlhaalla[0]) {
                    kentta.liikuta("kaali",suunnat.YLOS);
                }
                else {
                    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && edellinenJohonkinYlhaalla[1]) {
                        kentta.liikuta("kaali",suunnat.ALAS);
                    }
                }
            }
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) kentta.pelihahmo.asetaKupla("pakokupla");
        if (game.input.keyboard.isDown(Phaser.Keyboard.R)) kentta.hahmot[0].asetaKupla("pohjakupla");
        
        //Tallentaa onko pohjassa
        var apu = [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]
        for(var i = 0; i < edellinenJohonkinYlhaalla.length; i++){
            edellinenJohonkinYlhaalla[i] = !game.input.keyboard.isDown(apu[i]);
        }
        
        //Tarkistaa tuliko syödyksi
        if (kentta.onkoSamassa()) {
            
            if (--elamat <= 0){
                osuma(peliOhi);
            }
            else{
                osuma(uusiKierros);
            }
        }
    }
    
    paivitaKuplat();
    
    kentta.piirra();
    piste_teksti.setText('Pisteet: ' + pisteet);
    resize();
}

function osuma(f){
    kuollut = true;
    crunch = game.add.audio('crunch');
    crunch.play();
    game.time.events.add(Phaser.Timer.SECOND * 3, f, this);
    
}

function uusiKierros(){
    kentta.nollaaKentta();
    kentta = luoKentta();
    kuollut = false;
}

var tappoi = "";


function resize(){
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // Kiitoksia tästä Juholle
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    
    //var w = window.innerWidth * window.devicePixelRatio;
    //game.width = w;
    //game.world.width = w;
    
    //var h = window.innerHeight * window.devicePixelRatio;
    //game.height = h;
    //game.world.height = h;
    
    //kentta.paivitaAlue(10,game.width - 10, 0, game.height);
    
    //piste_teksti.x = game.world.centerX;
    //piste_teksti.y = game.world.top;
    
    //kentta.paivitaAlue(10,w - 10, 0, h);
}

var vanha_kaaliX = 0;
var vanha_HX = 3;
var vanha_pisteet = 0;


// Päivittää kuplat hahmoille.
function paivitaKuplat(){
    if (typeof kentta == 'undefined') return;
    if (typeof kentta.pelihahmo == 'undefined') return;
    
    var P = kentta.pelihahmo;
    
    //Kuollut kommentit
    if (tappoi == "H"){
        P.asetaKupla("AuSattuu");
    }
    else if (tappoi != "") {//Kaalin osumakuplat
        if  (elamat != 0) {
            var kuplat = ['AlaSyo','Lehteni','Onneksi'];
            var r = game.rnd.integerInRange(0, 2);
            if (r < kuplat.length) P.asetaKupla(kuplat[r]);
        }
        else{//Kaalin kuolemakuplat
            var kuplat = ['Pimenee','HalusinVain','OlikoTama'];
            var r = game.rnd.integerInRange(0, 2);
            if (r < kuplat.length) P.asetaKupla(kuplat[r]);
        }
    }
    
    // Etanoiden OsumaKuplat
    if (tappoi == "Zombi") kentta.asetaKupla(tappoi, 'Nam');
    else if (tappoi == "EnSano") kentta.asetaKupla(tappoi, 'Karsimaan');
    else if (tappoi == "H") kentta.asetaKupla(tappoi, 'EiSatu');
    tappoi = "";
    
    if (kuollut) return;
    
    //EtenemisKommentit
    var uusi_kaaliX = P.x;
    if (uusi_kaaliX > vanha_kaaliX) {
        var kuplat = ['AlaPakoon','Napatkaa','Pysayttakaa'];//Etanalle
        var r = game.rnd.integerInRange(0, 40);
        if (r < kuplat.length) kentta.asetaKupla('EnSano', kuplat[r]);
        
        kuplat = ['KuolemaEtanoille','Kaikkien','Taparalla', 'Kanaa', 'VielaTaytyy','EtteSaa'];//Kaalille
        r = game.rnd.integerInRange(0, 75);
        if (r < kuplat.length) P.asetaKupla(kuplat[r]);
    } 
    
    var H = kentta.annaHahmo('H');
    var uusi_HX = H.x;
    
    //Lähikommentit H:lle
    if (uusi_kaaliX != vanha_kaaliX || uusi_HX != vanha_HX) {
        
        if (typeof H !== 'undefined') {
            if (H.x - 1 <= P.x && P.x <= H.x + 1 && H.y - 1 <= P.y && P.y <= H.y + 1) {//Onko kaali hahmon h vieressä
                var kuplat = ['Veitsi','EnTee','Kaaliseni'];
                var r = game.rnd.integerInRange(0, 20);
                if (r < kuplat.length) kentta.asetaKupla('H', kuplat[r]);
            }
        }
    }
    
    //Satunnainen liikkumiskommentti.
    if (vanha_kaaliX != uusi_kaaliX && vanha_HX % 2 == 1) {
        var Z = kentta.annaHahmo('Zombi');
        if (typeof Z !== 'undefined') {
            var kuplat = ['Nalka','HaluanKaalia','Haukkaus'];
            var r = game.rnd.integerInRange(0, 20);
            if (r < kuplat.length) kentta.asetaKupla('Zombi', kuplat[r]);
        }
    }
    
    
    //Pisteiden väliaika kommentti
    if (vanha_pisteet != pisteet && pisteet % 13 == 0 && pisteet != 0) {
        kentta.asetaKupla('Viikate', 'PPP');
    }
    
    //Kierros kuplat kaalille
    if (vanha_kaaliX == 9 && uusi_kaaliX == 0) {
        var kuplat = ['Miksi','OlenkoOllut','NuoOvat'];
        var r = game.rnd.integerInRange(0, 5);
        if (r < kuplat.length) P.asetaKupla(kuplat[r]);
    }
    
    //Tallennetaan vanhat tiedot
    vanha_kaaliX = uusi_kaaliX;
    vanha_HX = uusi_HX;
    vanha_pisteet = pisteet;
}


// Pelin loppuminen
function peliOhi(){
    kentta.nollaaKentta();
    var r = game.rnd.integerInRange(0, 5);
    if (r == 0) game.add.text(0,0, "Hävisit. Sinusta tehtiin kaalikääryleitä.");//Kirjoittaa lopputekstin
    else if (r == 1) game.add.text(0,0, "Yritit oikein hienosti... \nMutta sinusta tuli silti kaalilaatikko.");
    else if (r == 2) game.add.text(0,0, "Oikein hienoa! \n...Paitsi että hävisit ja jouduit kaalikeittoon.");
    else if (r == 3) game.add.text(0,0, "...Olet tästä eteenpäin kaalisalaatti...");
    else if (r == 4) game.add.text(0,0, "Surkimuksista tehdään kaalilasagnea.");
    else if (r == 5) game.add.text(0,0, "Mukavaa jatkoa kaalitortillana.")
}