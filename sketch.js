  var radius = 150;
  var numberPoints = 101;
  var centerX = 0;
  var centerY = 0;
  var points = [];
  var invert = false;
  var playing = false;
  var coloreSfondo = 'white';
  var circleColor = 'blue';
  var coloriNormali = 'brightness(0) saturate(100%) invert(8%) sepia(100%) saturate(6526%) hue-rotate(187deg) brightness(112%) contrast(146%)';
  var coloriInvertiti = 'brightness(1000%) saturate(0%)';



  var song, analyzer;
  var playImg;

  function preload() {
      song = loadSound('assets/Miles Away.mp3');
  }

  function setup() {
      var myCanvas = createCanvas(windowWidth, windowHeight);
      myCanvas.parent("container");

      analyzer = new p5.Amplitude();  // amplitude analyzer
      fft = new p5.FFT(); // frequency
      analyzer.setInput(song);

      // set the center of window as axis origin
      translate(windowWidth/2, windowHeight/2);
      rotate(PI / 2.0);

      // custom controls
        // inverted color
        var tre = document.getElementById('tre');
        var quattro = document.getElementById('quattro');
        tre.addEventListener('click', inverted);
        quattro.addEventListener('click', normal)

        // play/pause button
        var uno = document.getElementById('uno')
        var due = document.getElementById('due')
        uno.addEventListener('click', playSong)
        due.addEventListener('click', stopSong)


      // sets 100 points + one (for better connection)
      for (var i = 0; i < numberPoints; i++) {
          var degree = i * (360 / 100);
          var radian = degree * (PI / 180);
          var p = new Point(radian);

          points.push(p);
      }

  }

  function playSong() {
    console.log("song is playin'")
    uno.style.display = 'none'
    due.style.display = 'block'
    song.loop();
  }

  function stopSong() {
    console.log("song stopped")
    uno.style.display = 'block'
    due.style.display = 'none'
    song.pause();
  }

  function inverted() {
    console.log("inverted")
    quattro.style.display = 'block'
    tre.style.display = 'none'
    coloreSfondo = 'blue'
    circleColor = 'white';
    uno.style.filter = coloriInvertiti
    due.style.filter = coloriInvertiti
    tre.style.filter = coloriInvertiti
    quattro.style.filter = coloriInvertiti

  }

  function normal() {
    console.log("normal")
    tre.style.display = 'block'
    quattro.style.display = 'none'
    coloreSfondo = 'white'
    circleColor = 'blue';
    uno.style.filter = coloriNormali
    due.style.filter = coloriNormali
    tre.style.filter = coloriNormali
    quattro.style.filter = coloriNormali

  }

  function CoSine(angle, add) {
      var length = radius + add;
      return (cos(angle) * length) + centerX;
  }

  function Sine(angle, add) {
      var length = radius + add;
      return (-sin(angle) * length) + centerY;
  }

  function draw() {
      background(coloreSfondo)

      var vol = analyzer.getLevel();
      var freq = fft.analyze();


      //base points(49 - 63) frequency(96,128)
      var base = new Frequency(freq.length - (freq.length / 4), freq.length);

      //mid-low 33 - 48
      var midLow = new Frequency(freq.length - 2 * (freq.length / 4),
          freq.length - (freq.length / 4));

      //mid-high 17 - 32
      var midHigh = new Frequency(freq.length - 3 * (freq.length / 4),
          freq.length - 2 * (freq.length / 4));

      //treble 0 - 16
      var treble = new Frequency(1, freq.length - 3 * (freq.length / 4));

      //draws all the intial points
      for (var i = 0; i < points.length; i++) {
          //+ 110 gets rid of the weird right side sticking out too far
          var a = freq[i + 150];

          //modifies the amplitude
          var ampMax = map(vol, 0, 1, 0, 300);
          var amp = map(a, 0, 300, 0 - ampMax, ampMax);
          points[i].amplitude = amp;
          stroke(circleColor);
          points[i].display();
      }

      push()
        fill(circleColor)
        textFont('Space Mono')
        rotate(- PI / 2)
        noStroke()
        textSize(22);
        textAlign(CENTER, CENTER);
        var author = 'Wontolla, Kasger & Limitless - Miles Away [NCS Release]'
        text(author, 0, - windowHeight / 2.3)
      pop()

  }


  function Point(angle) {
      this.amplitude = 0;
      this.angle = angle;
      this.xVal = CoSine(this.angle, 0);
      this.yVal = Sine(this.angle, 0);

      this.display = function () {

          var amp = map(this.amplitude, 0, 255, 0, -340);
          var amp2 = map(this.amplitude, 0, 255, 0, -480);

          strokeWeight(2);
          point(CoSine(angle, (amp2)), Sine(angle, (amp2)))
          line(this.xVal, this.yVal, CoSine(angle, (amp)), Sine(angle, (amp)));
          point(CoSine(angle, (amp * 3)), Sine(angle, (amp * 3)))

      }
  }

  function Frequency(low, high) {
      this.low = low;
      this.high = high;
      this.value = fft.getEnergy(low, high);
  }
