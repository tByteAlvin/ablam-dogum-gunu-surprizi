window.BIRTHDAY_CONFIG = {
  personName: "Elif",
  audio: {
    intro: "assets/music/acilis-muzigi.mp3",
    birthday: "assets/music/iyi-ki-dogdun-elif.mp3",
    ambient: "assets/music/ana-fon-muzigi.mp3",
    confetti: "assets/sounds/konfeti.mp3",
    tongue: "assets/sounds/dil-cikarma.mp3"
  },
  flowers: [
    "assets/flowers/cicek-1.png",
    "assets/flowers/cicek-2.png",
    "assets/flowers/cicek-3.png",
    "assets/flowers/cicek-4.png"
  ],
  familyPhoto: "assets/images/aile-fotografi.jpg",
  memories: [
    { image: "assets/images/fotograf-01.jpg", title: "İyi ki hayatımızın içindesin.", text: "Buraya ilk fotoğrafla ilgili kısa bir anını yaz.", note: "İlk hatıramız ✦" },
    { image: "assets/images/fotograf-02.jpg", title: "Her evin görünmeyen bir ışığı vardır.", text: "Bu alanı fotoğrafın hissine göre değiştirebilirsin.", note: "Birlikte güldüğümüz günlerden" },
    { image: "assets/images/fotograf-03.jpg", title: "Bazı anılar eskimez.", text: "Buraya birlikte yaşadığınız özel bir anıyı ekleyebilirsin.", note: "Sadece bizim anlayacağımız bir cümle" },
    { image: "assets/images/fotograf-04.jpg", title: "Kahkahanın olduğu yerde ev vardır.", text: "Kısa, samimi ve fotoğrafa ait bir cümle burada güzel durur.", note: "Bu karenin perde arkası" },
    { image: "assets/images/fotograf-05.jpg", title: "Seninle her şey biraz daha güzel.", text: "Ablanın emeğinden, karakterinden veya aileye kattığı güzellikten bahset.", note: "Güçlü, zarif ve biraz inatçı" },
    { image: "assets/images/fotograf-06.jpg", title: "İyi ki ablamızsın.", text: "Buraya ailece söylemek istediğiniz küçük bir teşekkür yazabilirsin.", note: "İyi ki varsın" },
    { image: "assets/images/fotograf-07.jpg", title: "Yeni yaşın sana çok yakışsın.", text: "Son fotoğrafta yeni yaş dileklerini yazabilirsin.", note: "Daha nice güzel yaşlara" }
  ]
};

/*
  Açılış sahnesi düzeltmesi:
  Bu kod, index.html içindeki eski açılış tıklamasını devralır ve sahneleri
  birbirinden bağımsız, atlanamayan adımlar halinde oynatır.
*/
setTimeout(() => {
  const config = window.BIRTHDAY_CONFIG;
  const $ = (selector) => document.querySelector(selector);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const player = $('#player');
  const playButton = $('#play');
  const record = $('#record');
  const prompt = $('#prompt');
  const permissionButton = $('#permission');
  const meter = $('#meter');
  const reveal = $('#reveal');
  const scrollButton = $('#scrollBtn');
  const story = $('#story');
  const flowersLayer = $('#flowers');
  const confettiLayer = $('#confetti');

  const introAudio = $('#introAudio');
  const birthdayAudio = $('#birthdayAudio');
  const ambientAudio = $('#ambientAudio');
  const confettiAudio = $('#confettiAudio');

  if (!playButton || !flowersLayer || !prompt || !reveal) return;

  let stage = 'idle';
  let motionProgress = 0;
  let lastMouseX = 0;
  let lastMouseTime = 0;
  let lastTouchX = 0;
  let revealSequenceRunning = false;

  const safePlay = (audio, volume) => {
    if (!audio) return;
    if (typeof volume === 'number') audio.volume = volume;
    audio.play().catch(() => {});
  };

  const fadeAudio = (audio, target, duration = 800) => {
    if (!audio) return;
    const startVolume = audio.volume;
    const startedAt = performance.now();

    const tick = (now) => {
      const ratio = Math.min(1, (now - startedAt) / duration);
      audio.volume = startVolume + (target - startVolume) * ratio;
      if (ratio < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const makeDenseFlowerCover = () => {
    flowersLayer.innerHTML = '';

    const width = window.innerWidth;
    const height = window.innerHeight;
    const spacing = width <= 600 ? 42 : 56;
    const flowerSize = Math.ceil(spacing * 1.55);
    const columns = Math.ceil(width / spacing) + 3;
    const rows = Math.ceil(height / spacing) + 3;
    const emojis = ['🌸', '🌺', '🌼', '🌷', '💮'];
    let longestAnimation = 0;
    let flowerIndex = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const flower = document.createElement('div');
        const duration = 2600 + Math.random() * 1200;
        const delay = Math.random() * 1700;
        const left = column * spacing - spacing + (Math.random() * 14 - 7);
        const landingTop = row * spacing - spacing + (Math.random() * 14 - 7);

        longestAnimation = Math.max(longestAnimation, duration + delay);
        flower.className = 'flower';
        flower.style.cssText = [
          `left:${left}px`,
          `width:${flowerSize}px`,
          `height:${flowerSize}px`,
          `font-size:${Math.round(flowerSize * 0.84)}px`,
          `--fall:${duration}ms`,
          `--end:${landingTop}px`,
          `--rot:${Math.random() * 180 - 90}deg`,
          `animation-delay:${delay}ms`,
          `z-index:${1 + Math.floor(Math.random() * 5)}`
        ].join(';');

        const path = config.flowers?.[flowerIndex % (config.flowers?.length || 1)];
        if (path) {
          const image = new Image();
          image.src = path;
          image.alt = '';
          image.onerror = () => {
            flower.textContent = emojis[flowerIndex % emojis.length];
          };
          flower.append(image);
        } else {
          flower.textContent = emojis[flowerIndex % emojis.length];
        }

        flowersLayer.append(flower);
        flowerIndex += 1;
      }
    }

    return longestAnimation + 450;
  };

  const makeConfettiBurst = (pieceCount = 34, playSound = false) => {
    if (playSound) safePlay(confettiAudio, 0.9);

    for (const side of [0, 1]) {
      for (let index = 0; index < pieceCount; index += 1) {
        const piece = document.createElement('i');
        piece.className = 'piece';
        piece.style.cssText = [
          `left:${side ? 96 : 4}%`,
          'bottom:2%',
          `--h:${Math.random() * 360}`,
          `--x:${(side ? -1 : 1) * (45 + Math.random() * 60)}vw`,
          `--y:${-(25 + Math.random() * 85)}vh`,
          `animation-delay:${Math.random() * 0.18}s`
        ].join(';');
        confettiLayer.append(piece);
        setTimeout(() => piece.remove(), 1900);
      }
    }
  };

  const playConfettiSequence = async () => {
    const burstTimes = [0, 600, 1200, 1800, 2400, 3000];
    burstTimes.forEach((delay, index) => {
      setTimeout(() => makeConfettiBurst(30, index === 0), delay);
    });
    await sleep(3800);
  };

  const sweepOnlyFlowers = async () => {
    const flowers = [...flowersLayer.querySelectorAll('.flower')];
    const screenMiddle = window.innerWidth / 2;

    flowers.forEach((flower, index) => {
      const box = flower.getBoundingClientRect();
      const direction = box.left + box.width / 2 < screenMiddle ? -1 : 1;
      const sweepX = direction * (90 + Math.random() * 110);
      const sweepY = -30 + Math.random() * 160;

      flower.style.setProperty('--sx', `${sweepX}vw`);
      flower.style.setProperty('--sy', `${sweepY}vh`);
      setTimeout(() => flower.classList.add('sweep'), Math.min(320, index * 2));
    });

    await sleep(1250);
    flowersLayer.innerHTML = '';
  };

  const runRevealSequence = async () => {
    if (revealSequenceRunning) return;
    revealSequenceRunning = true;
    stage = 'clearing-flowers';

    lastMouseX = 0;
    lastMouseTime = 0;
    lastTouchX = 0;
    motionProgress = 100;
    meter.style.width = '100%';
    confettiLayer.innerHTML = '';

    prompt.classList.add('hidden');
    permissionButton?.classList.add('hidden');

    await sleep(250);
    await sweepOnlyFlowers();

    stage = 'showing-title';
    fadeAudio(introAudio, 0.06, 700);
    if (birthdayAudio) birthdayAudio.currentTime = 0;
    safePlay(birthdayAudio, 1);

    scrollButton?.classList.add('hidden');
    reveal.classList.remove('hidden');

    /* Başlık önce tek başına görünür. Konfeti bundan sonra başlar. */
    await sleep(1800);

    stage = 'confetti-show';
    confettiLayer.innerHTML = '';
    await playConfettiSequence();

    story?.classList.remove('hidden');
    scrollButton?.classList.remove('hidden');
    document.body.classList.remove('locked');
    stage = 'complete';
  };

  const addMotion = (amount) => {
    if (stage !== 'awaiting-shake') return;

    motionProgress = Math.min(100, motionProgress + amount);
    meter.style.width = `${motionProgress}%`;

    if (motionProgress >= 100) {
      stage = 'shake-complete';
      runRevealSequence();
    }
  };

  setInterval(() => {
    if (stage !== 'awaiting-shake') return;
    motionProgress = Math.max(0, motionProgress - 1.1);
    meter.style.width = `${motionProgress}%`;
  }, 90);

  window.addEventListener('mousemove', (event) => {
    if (stage !== 'awaiting-shake') return;
    const now = Date.now();
    const movement = Math.abs(event.clientX - lastMouseX);

    if (lastMouseTime && now - lastMouseTime < 100 && movement > 15) {
      addMotion(Math.min(14, movement / 3.2));
    }

    lastMouseX = event.clientX;
    lastMouseTime = now;
  });

  window.addEventListener('touchmove', (event) => {
    if (stage !== 'awaiting-shake' || !event.touches[0]) return;
    const currentX = event.touches[0].clientX;
    if (lastTouchX) addMotion(Math.min(14, Math.abs(currentX - lastTouchX) / 2.4));
    lastTouchX = currentX;
  }, { passive: true });

  window.addEventListener('devicemotion', (event) => {
    if (stage !== 'awaiting-shake') return;
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const strength = Math.abs(acceleration.x || 0)
      + Math.abs(acceleration.y || 0)
      + Math.abs(acceleration.z || 0);
    addMotion(Math.min(13, strength / 3.8));
  });

  const enableShakeStage = () => {
    motionProgress = 0;
    meter.style.width = '0%';
    stage = 'awaiting-shake';

    if (
      typeof DeviceMotionEvent !== 'undefined'
      && typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      permissionButton?.classList.remove('hidden');
      permissionButton.onclick = async () => {
        try {
          const result = await DeviceMotionEvent.requestPermission();
          if (result === 'granted') permissionButton.classList.add('hidden');
        } catch {
          // Parmakla sağa sola sürükleme yedek kontrol olarak çalışmaya devam eder.
        }
      };
    }
  };

  playButton.onclick = async () => {
    if (stage !== 'idle') return;
    stage = 'flowers-falling';

    player.classList.add('playing');
    record?.classList.add('spin');
    playButton.disabled = true;
    safePlay(introAudio, 0.7);
    safePlay(ambientAudio, 0);

    const fillDuration = makeDenseFlowerCover();
    await sleep(fillDuration);

    player.classList.add('hidden');
    prompt.classList.remove('hidden');
    enableShakeStage();
  };
}, 0);
