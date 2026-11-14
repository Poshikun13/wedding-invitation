/* =============================================
   ナビゲーション
   ============================================= */
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('is-open');
});

document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('is-open');
  }
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('is-open'));
});


/* =============================================
   スクロールフェードイン
   ============================================= */
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.12 });

sections.forEach(sec => observer.observe(sec));


/* =============================================
   ギャラリースライダー
   ============================================= */
let currentSlide = 0;
const slides     = document.querySelectorAll('.gallery__slide');
const thumbs     = document.querySelectorAll('.gallery__thumb');
const dots       = document.querySelectorAll('.gallery__dot');
const slidesTrack = document.querySelector('.gallery__slides');
const total      = slides.length;

function goTo(index) {
  // 範囲ループ
  if (index < 0) index = total - 1;
  if (index >= total) index = 0;

  currentSlide = index;

  // スライドトラックを移動
  slidesTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  // アクティブ状態の更新
  slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
  thumbs.forEach((t, i) => t.classList.toggle('active', i === currentSlide));
  dots.forEach((d, i)   => d.classList.toggle('active', i === currentSlide));
}

document.querySelector('.gallery__arrow--prev').addEventListener('click', () => goTo(currentSlide - 1));
document.querySelector('.gallery__arrow--next').addEventListener('click', () => goTo(currentSlide + 1));

thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => goTo(Number(thumb.dataset.index)));
});

dots.forEach(dot => {
  dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
});

// スワイプ対応
let touchStartX = 0;
const stage = document.querySelector('.gallery__stage');

stage.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

stage.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  }
});

// 自動送り（5秒）
let autoTimer = setInterval(() => goTo(currentSlide + 1), 5000);

function resetTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(currentSlide + 1), 5000);
}

document.querySelector('.gallery__arrow--prev').addEventListener('click', resetTimer);
document.querySelector('.gallery__arrow--next').addEventListener('click', resetTimer);
thumbs.forEach(t => t.addEventListener('click', resetTimer));


/* =============================================
   出欠フォームの表示切替
   ============================================= */
function showForm(type) {
  const formSection = document.getElementById('rsvp-form');
  const title = formSection.querySelector('.section__title');
  const input = document.getElementById('attendanceInput');

  input.value = type;
  title.textContent = type === 'attend' ? '出席のご連絡' : '欠席のご連絡';

  formSection.style.display = 'flex';

  // スクロール
  setTimeout(() => {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // フェードイン発火
    formSection.classList.add('is-visible');
  }, 50);
}


/* =============================================
   フォーム送信（仮）
   ============================================= */
document.getElementById('rsvpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  btn.textContent = '送信しました';
  btn.disabled = true;

  // ※ 実際の送信処理はここに追加してください
  // 例: fetch('/api/rsvp', { method: 'POST', body: new FormData(e.target) })
});
