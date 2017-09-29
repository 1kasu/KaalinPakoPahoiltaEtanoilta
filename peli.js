// Tekijä Kasimir Ilmonen

var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '', { preload: preload, create: create, update: update });


var kentta;

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
        this.s = game.add.sprite(x, y, this.kuva);
    }
    
    //Piirtää hahmon
    piirra(x, y, xl, yl) {
        
        //var s = game.add.sprite(x + this.x * xl, y + this.y * yl, this.kuva);
        
        
        var h = this.s.height;
        var w = this.s.width;
        
        if (h < w) {
            var skaalain = (xl - (xl / 10.0)) / w;        
        }
        else {
            var skaalain = (yl - (yl / 10.0)) / h;
        }
        
        if (skaalain != 1) {
            this.s.scale.setTo(skaalain,skaalain);// = yl - (yl / 10.0);
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
    
}

//Luo alkukentän
function luoKentta() {
    var xruutuja = 9;
    var yruutuja = 3;
    
    var kentta = new Kentta(10,window.innerWidth - 10, 0, window.innerHeight, xruutuja,yruutuja);
    var hahmo = new Hahmo('etana', 1, 1, 1);
    var hahmo2 = new Hahmo('etana', 1, 2, 2);
    
    kentta.lisaaHahmo(hahmo);
    kentta.lisaaHahmo(hahmo2); 
    
    return kentta;
}



function create() {
    // Asetetaan skaalaukseen liittyvät suhdeluvut
    
    game.stage.backgroundColor = "#4488AA";// Asetetaan taustaväri
    
    kentta = luoKentta();
    window.addEventListener('resize',resize(), true);
    
    kentta.piirra();

 
}

var n = 1;

var otukset = [];

// Muistina, että mihin suuntaan ollaan menossa.
var olikoOikea = true;

function update() {
    //kentta.width = 
    kentta.piirra();
    resize();
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
    game.world.removeAll(); //Poistaa kaiken
    
    game.add.text(0,0, "Hävisit. Olit surkea.");//Kirjoittaa lopputekstin
}