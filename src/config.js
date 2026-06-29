window.BIRTHDAY_CONFIG = {
  personName: "Elif ablamm",
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
    {
      image: "assets/images/fotograf-01.jpg",
      title: "İlk kışlarımızdan biri.",
      text: "İlk kartoplarımızdan biriydi. Üşüdüğümüzü bile unutup ne kadar eğlendiğimiz hâlâ aklımda.",
      note: "Karın içindeki kahkahamız"
    },
    {
      image: "assets/images/fotograf-02.jpg",
      title: "Seninle güldüğüm ilk anlardan.",
      text: "Daha küçücükken bile beni güldürmenin bir yolunu buluyordun. Bu kare, birlikte biriktirdiğimiz kahkahaların başlangıcı gibi.",
      note: "İlk kahkahalarımızdan biri"
    },
    {
      image: "assets/images/fotograf-05.jpg",
      title: "İlk yolculuk heyecanımda sen vardın.",
      text: "Uçağa binmeden önceki o büyük heyecanımı seninle paylaşmıştım. Bilmediğim bir yere giderken yanımda olman bana güven vermişti.",
      note: "Yolculuk başlamadan önce"
    },
    {
      image: "assets/images/fotograf-04.jpg",
      title: "Her yaşımda bir izin var.",
      text: "Doğum günlerimde, kalabalığın içinde ve en güzel anlarımda hep sen vardın. Çocukluğum seninle daha güzel geçti.",
      note: "Birlikte büyüdüğümüz günler"
    },
    {
      image: "assets/images/fotograf-03.jpg",
      title: "Ben büyürken hep yanımdaydın.",
      text: "Heyecanlandığımda, korktuğumda ya da sadece gülmek istediğimde yanımda sen vardın. Çocukluğumun en güzel yerlerinde hep sen varsın.",
      note: "Yanımda olduğun yıllar"
    },
    {
      image: "assets/images/fotograf-06.jpg",
      title: "Beni büyüten sevgilerden birisin.",
      text: "Ben daha hiçbir şeyi hatırlayamazken bile yanımdaydın. Bana ablalığın ne demek olduğunu yıllar boyunca hep hissettirdin.",
      note: "Daha küçücükken bile"
    },
    {
      image: "assets/images/fotograf-07.jpg",
      title: "İlklerimin çoğunda sen vardın.",
      text: "İlk banyolarımdan birini bana sen yaptırmıştın. O günü ben hatırlamasam da bu fotoğraf, sevgini yıllar öncesinden anlatıyor.",
      note: "İlk banyolarımdan biri"
    }
  ],
  galleryOnly: [
    "assets/images/fotograf-08.jpg",
    "assets/images/fotograf-09.jpg",
    "assets/images/fotograf-10.jpg"
  ]
};

setTimeout(() => {
  const C = window.BIRTHDAY_CONFIG;
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
  const gallery = $('#gallery');
  const galleryGrid = $('#galleryGrid');
  const galleryButton = $('#galleryBtn');

  const introAudio = $('#introAudio');
  const birthdayAudio = $('#birthdayAudio');
  const ambientAudio = $('#ambientAudio');
  const confettiAudio = $('#confettiAudio');

  const familyText = document.querySelector('.familyInner > div:last-child > p:last-child');
  if (familyText) {
    familyText.textContent = 'Çocukluğumuzun, kahkahalarımızın ve en güzel anlarımızın içinde hep sen varsın. İyi ki bizimlesin, iyi ki ablamızsın.';
  }

  if (!playButton || !flowersLayer || !prompt || !reveal) return;

  let stage = 'idle';
  let motion = 0;
  let lastMouseX = 0;
  let lastMouseTime = 0;
  let lastTouchX = 0;
  let lastDeviceVector = null;
  let sequenceRunning = false;
  let audioHandoffFinished = false;

  const safePlay = (audio, volume) => {
    if (!audio) return;
    if (typeof volume === 'number') audio.volume = volume;
    audio.play().catch(() => {});
  };

  const fadeAudio = (audio, target, duration = 800) => {
    if (!audio) return;
    const start = audio.volume;
    const begin = performance.now();
    const frame = (now) => {
      const ratio = Math.min(1, (now - begin) / duration);
      audio.volume = start + (target - start) * ratio;
      if (ratio < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const createFlowerCover = () => {
    flowersLayer.innerHTML = '';
    const width = innerWidth;
    const height = innerHeight;
    const spacing = width <= 600 ? 42 : 56;
    const size = Math.ceil(spacing * 1.55);
    const cols = Math.ceil(width / spacing) + 3;
    const rows = Math.ceil(height / spacing) + 3;
    const emojis = ['🌸', '🌺', '🌼', '🌷', '💮'];
    let longest = 0;
    let index = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const flower = document.createElement('div');
        const duration = 2600 + Math.random() * 1200;
        const delay = Math.random() * 1700;
        const left = col * spacing - spacing + (Math.random() * 14 - 7);
        const top = row * spacing - spacing + (Math.random() * 14 - 7);
        const fallback = emojis[index % emojis.length];
        longest = Math.max(longest, duration + delay);

        flower.className = 'flower';
        flower.style.cssText = [
          `left:${left}px`,
          `width:${size}px`,
          `height:${size}px`,
          `font-size:${Math.round(size * 0.84)}px`,
          `--fall:${duration}ms`,
          `--end:${top}px`,
          `--rot:${Math.random() * 180 - 90}deg`,
          `animation-delay:${delay}ms`,
          `z-index:${1 + Math.floor(Math.random() * 5)}`
        ].join(';');

        const path = C.flowers?.[index % (C.flowers?.length || 1)];
        if (path) {
          const image = new Image();
          image.src = path;
          image.alt = '';
          image.onerror = () => {
            flower.innerHTML = '';
            flower.textContent = fallback;
          };
          flower.append(image);
        } else {
          flower.textContent = fallback;
        }

        flowersLayer.append(flower);
        index += 1;
      }
    }

    return longest + 450;
  };

  const makeConfettiBurst = (count = 30, playSound = false) => {
    if (playSound) safePlay(confettiAudio, 0.9);
    for (const side of [0, 1]) {
      for (let index = 0; index < count; index += 1) {
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
    [0, 600, 1200, 1800, 2400, 3000].forEach((delay, index) => {
      setTimeout(() => makeConfettiBurst(30, index === 0), delay);
    });
    await sleep(3800);
  };

  const sweepFlowers = async () => {
    const flowers = [...flowersLayer.querySelectorAll('.flower')];
    const middle = innerWidth / 2;

    flowers.forEach((flower, index) => {
      const box = flower.getBoundingClientRect();
      const direction = box.left + box.width / 2 < middle ? -1 : 1;
      flower.style.setProperty('--sx', `${direction * (90 + Math.random() * 110)}vw`);
      flower.style.setProperty('--sy', `${-30 + Math.random() * 160}vh`);
      setTimeout(() => flower.classList.add('sweep'), Math.min(320, index * 2));
    });

    await sleep(1250);
    flowersLayer.innerHTML = '';
  };

  const revealSequence = async () => {
    if (sequenceRunning) return;
    sequenceRunning = true;
    stage = 'clearing-flowers';
    lastMouseX = 0;
    lastMouseTime = 0;
    lastTouchX = 0;
    lastDeviceVector = null;
    motion = 100;
    meter.style.width = '100%';
    confettiLayer.innerHTML = '';
    prompt.classList.add('hidden');
    permissionButton?.classList.add('hidden');

    await sleep(250);
    await sweepFlowers();

    stage = 'showing-title';
    fadeAudio(introAudio, 0.06, 700);
    if (birthdayAudio) birthdayAudio.currentTime = 0;
    safePlay(birthdayAudio, 1);
    scrollButton?.classList.add('hidden');
    reveal.classList.remove('hidden');

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
    motion = Math.min(100, motion + amount);
    meter.style.width = `${motion}%`;
    if (motion >= 100) {
      stage = 'shake-complete';
      revealSequence();
    }
  };

  setInterval(() => {
    if (stage !== 'awaiting-shake') return;
    motion = Math.max(0, motion - 0.55);
    meter.style.width = `${motion}%`;
  }, 100);

  addEventListener('mousemove', (event) => {
    if (stage !== 'awaiting-shake') return;
    const now = Date.now();
    const movement = Math.abs(event.clientX - lastMouseX);
    if (lastMouseTime && now - lastMouseTime < 100 && movement > 22) {
      addMotion(Math.min(3.5, movement / 13));
    }
    lastMouseX = event.clientX;
    lastMouseTime = now;
  });

  addEventListener('touchmove', (event) => {
    if (stage !== 'awaiting-shake' || !event.touches[0]) return;
    const currentX = event.touches[0].clientX;
    if (lastTouchX) {
      const movement = Math.abs(currentX - lastTouchX);
      if (movement > 18) addMotion(Math.min(3.5, movement / 10));
    }
    lastTouchX = currentX;
  }, { passive: true });

  addEventListener('devicemotion', (event) => {
    if (stage !== 'awaiting-shake') return;

    const source = event.acceleration || event.accelerationIncludingGravity;
    if (!source) return;

    const current = {
      x: Number(source.x) || 0,
      y: Number(source.y) || 0,
      z: Number(source.z) || 0
    };

    if (!lastDeviceVector) {
      lastDeviceVector = current;
      return;
    }

    const change = Math.abs(current.x - lastDeviceVector.x)
      + Math.abs(current.y - lastDeviceVector.y)
      + Math.abs(current.z - lastDeviceVector.z);

    lastDeviceVector = current;

    if (change > 4.5) {
      addMotion(Math.min(3.2, (change - 4.5) / 4.5));
    }
  });

  const enableShake = () => {
    motion = 0;
    lastDeviceVector = null;
    meter.style.width = '0%';
    stage = 'awaiting-shake';

    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      permissionButton?.classList.remove('hidden');
      permissionButton.onclick = async () => {
        try {
          const result = await DeviceMotionEvent.requestPermission();
          if (result === 'granted') permissionButton.classList.add('hidden');
        } catch {}
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

    const fillDuration = createFlowerCover();
    await sleep(fillDuration);
    player.classList.add('hidden');
    prompt.classList.remove('hidden');
    enableShake();
  };

  const updateStoryAudio = () => {
    if (!story || story.classList.contains('hidden')) return;

    const opening = document.querySelector('.opening');
    const firstMemory = document.querySelector('.memory');
    if (!opening || !firstMemory || !birthdayAudio || !ambientAudio) return;

    if (audioHandoffFinished) {
      birthdayAudio.volume = 0;
      if (!birthdayAudio.paused) birthdayAudio.pause();
      if (ambientAudio.paused) safePlay(ambientAudio, 0.5);
      ambientAudio.volume = 0.5;
      return;
    }

    const start = opening.offsetTop + innerHeight * 0.12;
    const end = Math.max(start + 1, firstMemory.offsetTop - innerHeight * 0.18);
    const progress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));

    if (ambientAudio.paused) safePlay(ambientAudio, 0);
    birthdayAudio.volume = Math.max(0, 1 - progress);
    ambientAudio.volume = Math.min(0.5, progress * 0.5);

    if (progress >= 0.995) {
      audioHandoffFinished = true;
      birthdayAudio.volume = 0;
      birthdayAudio.pause();
      ambientAudio.volume = 0.5;
    }
  };

  addEventListener('scroll', updateStoryAudio, { passive: true });

  const appendGalleryImage = (path, label) => {
    if (!galleryGrid) return;
    const image = new Image();
    image.src = path;
    image.alt = label;
    image.onerror = () => {
      const fallback = document.createElement('div');
      fallback.className = 'fakePhoto';
      fallback.textContent = `${label} henüz yüklenmedi`;
      image.replaceWith(fallback);
    };
    galleryGrid.append(image);
  };

  if (galleryButton && gallery && galleryGrid) {
    galleryButton.onclick = () => {
      galleryGrid.innerHTML = '';

      C.memories.forEach((memory, index) => {
        appendGalleryImage(memory.image, `${index + 1}. fotoğraf`);
      });

      (C.galleryOnly || []).forEach((path, index) => {
        appendGalleryImage(path, `${C.memories.length + index + 1}. fotoğraf`);
      });

      gallery.classList.remove('hidden');
      document.body.classList.add('locked');
    };
  }
}, 0);
