// Tekijä Kasimir Ilmonen
// Pelissä tulee tappavia otuksia taivaalta, joita pitää väistellä.

var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var tasot;

var cursors;

//Hahmon koko
var hahmokoko = 2;
var suhdelukuX = 1;
var suhdelukuY = 1;

function preload() {
    // Ladataan resurssit
    game.load.image('etana','kuvat/Ilkea_etana.png');
}

class Hahmo {
    
    //Alustaa hahmon
    constructor(kuva, idnum, x, y) {
        this.kuva = kuva;
        this.idnum = idnum;
        this.x = x;
        this.y = y;
    }
    
    //Piirtää hahmon
    piirra(x, y, xl, yl) {
        game.add.sprite(x + this.x * xl, y + this.y * yl, this.kuva);
    }
}

//Antaa arvo, jolla voidaan siirtää leveyttä niin, että molempiin laitoihin jää yhtäpaljon tilaa.
function keskita(leveys, koko_leveys) {
    return ((koko_leveys - leveys) / 2.0);
}

class Kentta {
    
    //Alustaa kentän
    constructor(leveys, korkeus, ruudun_leveys, ruudun_korkeus){
        this.leveys = leveys;
        this.korkeus = korkeus;
        this.hahmot = [];
        this.x = 0;
        this.y = 0;
        this.ruudun_leveys = ruudun_leveys;
        this.ruudun_korkeus = ruudun_korkeus;
    }
    
    //Lisää hahmon kenttään
    lisaaHahmo(hahmo) {
        this.hahmot.push(hahmo);
    }
    
    //Piirtää kentän
    piirra() {
        var g = game.add.graphics(0, 0);
        
        this.x = keskita(this.ruudun_leveys * this.leveys, window.innerWidth);
        this.y = keskita(this.ruudun_korkeus * this.korkeus, window.innerHeight);
        
        g.lineStyle(3, 0x000000, 2)
        for (var i = 0; i < this.leveys; i++){
            for (var j = 0; j < this.korkeus; j++){
                g.drawRect(this.x + this.ruudun_leveys * i, this.y + this.ruudun_korkeus * j, this.ruudun_leveys, this.ruudun_korkeus);
            }
        }
        
        for (var i = 0; i < this.hahmot.length; i++) {
            this.hahmot[i].piirra(this.x, this.y, this.ruudun_leveys, this.ruudun_korkeus);
        }
        
        
    }
    
}

//Luo alkukentän
function luoKentta() {
    var xruutuja = 9;
    var yruutuja = 3;
    var leveys = window.innerWidth/xruutuja;
    var korkeus = window.innerHeight/yruutuja;
    var ruudun_leveys = Math.min(leveys,korkeus);
    
    
    var kentta = new Kentta(xruutuja,yruutuja, ruudun_leveys,ruudun_leveys);
    var hahmo = new Hahmo('etana', 1, 1, 1);
    var hahmo2 = new Hahmo('etana', 1, 2, 2);
    
    kentta.lisaaHahmo(hahmo);
    kentta.lisaaHahmo(hahmo2); 
    
    return kentta;
}



function create() {
    // Asetetaan skaalaukseen liittyvät suhdeluvut
    
    game.stage.backgroundColor = "#4488AA";// Asetetaan taustaväri
    
    var kentta = luoKentta();
    
    kentta.piirra();

 
}

var n = 1;

var otukset = [];

// Muistina, että mihin suuntaan ollaan menossa.
var olikoOikea = true;

function update() {
    
}

// Pelin loppuminen
function peliOhi(){
    game.world.removeAll(); //Poistaa kaiken
    
    game.add.text(0,0, "Hävisit. Olit surkea.");//Kirjoittaa lopputekstin
}