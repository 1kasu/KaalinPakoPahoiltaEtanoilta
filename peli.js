// Tekijä Kasimir Ilmonen

var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var kentta;

function preload() {
    // Ladataan resurssit
    game.load.image('etana','kuvat/Ilkea_etana.png');
    game.load.image('kaali','kuvat/cabbage.png');
}

class Hahmo {
    
    //Alustaa hahmon
    constructor(kuva, nimi, x, y) {
        this.kuva = kuva;
        this.nimi = nimi;
        this.x = x;
        this.y = y;
        this.s = game.add.sprite(x, y, this.kuva);
    }
    
    //Piirtää hahmon
    piirra(x, y, xl, yl) {
        var h = this.s.height;
        var w = this.s.width;
        
        if (h < w) {
            var skaalain = (xl - (xl / 10.0)) / w;        
        }
        else {
            var skaalain = (yl - (yl / 10.0)) / h;
        }
        
        if (this.nimi == "kaali") {
            skaalain = skaalain * 0.6;//Kaalit ovat aina pienempiä
        }
        
        if (Math.abs(skaalain - 1) > 0.05) {
            this.s.scale.setTo(skaalain,skaalain);
        }
        
        this.s.x = x + this.x * xl + keskita(this.s.width, xl);
        this.s.y = y + this.y * yl + keskita(this.s.height, yl);
        
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
    }
    
    //Lisää hahmon kenttään
    lisaaHahmo(hahmo) {
        this.hahmot.push(hahmo);
    }
    
    
    //Liikuttaa annettua hahmoa annettuun suuntaan.
    liikuta(nimi, suunta){
        for (var i = 0; i < this.hahmot.length; i++){
            var h = this.hahmot[i];
            if (h.nimi == nimi) {
                if (suunta == suunnat.OIKEA) {
                    if (++h.x >= this.leveys) {
                        h.x = 0;
                    }
                }
                if (suunta == suunnat.VASEN) {
                    if (--h.x < 0) {
                        h.x = this.leveys - 1;
                    }
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
        
        for (var i = 0; i < this.hahmot.length; i++) {
            this.hahmot[i].piirra(x, y, ruudun_leveys, ruudun_leveys);
        }
    }
    
    //Nollaa kentän
    nollaaKentta(){
        this.g.clear();
        for (var i = 0; i < this.hahmot.length; i++){
            this.hahmot[i].s.destroy();
        }
        this.hahmot = [];
    }
    
    //Tarkistaa onko nimillä a ja b olevat hahmot samassa ruudussa.
    onkoSamassa(a, b){
        var a_x;
        var a_y;
        var b_x;
        var b_y;
        
        for (var i = 0; i < this.hahmot.length; i++){
            if (this.hahmot[i].nimi == a) {
                a_x = this.hahmot[i].x;
                a_y = this.hahmot[i].y;
            }
            if (this.hahmot[i].nimi == b) {
                b_x = this.hahmot[i].x;
                b_y = this.hahmot[i].y;
            }
        }
        
        return (a_x === b_x && a_y === b_y);
    }
    
}

//Luo alkukentän
function luoKentta() {
    var xruutuja = 9;
    var yruutuja = 3;
    
    var kentta = new Kentta(10,window.innerWidth - 10, 0, window.innerHeight, xruutuja,yruutuja);
    var hahmo = new Hahmo('kaali', "kaali", 0, 0);
    var hahmo2 = new Hahmo('etana', "etana", 2, 2);
    
    kentta.lisaaHahmo(hahmo);
    kentta.lisaaHahmo(hahmo2); 
    
    return kentta;
}


function create() {
    game.stage.backgroundColor = "#4488AA";// Asetetaan taustaväri
    
    kentta = luoKentta();
}


var elamat = 3;

// Muistina, että mihin suuntaan ollaan menossa.
var olikoOikea = true;

var edellinenJohonkinYlhaalla = [true,true,true,true]

var suunnat = {
    YLOS: 0,
    ALAS: 1,
    VASEN: 2,
    OIKEA: 3   
};

function update() {
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
    
    //Tallentaa onko pohjassa
    var apu = [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]
    for(var i = 0; i < edellinenJohonkinYlhaalla.length; i++){
        edellinenJohonkinYlhaalla[i] = !game.input.keyboard.isDown(apu[i]);
    }
    
    //Tarkistaa tuliko syödyksi
    if (kentta.onkoSamassa("kaali", "etana")) {
        kentta.nollaaKentta();
        
        if (--elamat <= 0){
            peliOhi();
        }
        else{
            kentta = luoKentta();
        }
    }
    
    kentta.piirra();
    //resize(); //Ei toimi. Aiheuttaa värinää.
}


function resize(){
    var w = window.innerWidth * window.devicePixelRatio;
    game.width = w;
    
    var h = window.innerHeight * window.devicePixelRatio;
    game.height = h
    
    kentta.paivitaAlue(10,window.innerWidth - 10, 0, window.innerHeight);
    //kentta.paivitaAlue(10,w - 10, 0, h);
}

// Pelin loppuminen
function peliOhi(){
    game.add.text(0,0, "Hävisit. Sinusta tehtiin kaalikääryleitä.");//Kirjoittaa lopputekstin
}