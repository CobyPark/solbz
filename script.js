// 고정 헤더 높이를 CSS 변수로 동기화
function syncHeaderHeight() {
  const header = document.querySelector('.header');
  if (header) {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }
}
syncHeaderHeight();
window.addEventListener('resize', syncHeaderHeight);
window.addEventListener('load', syncHeaderHeight);

$(document).ready(function () {
  // 메인 포트폴리오 캐러셀 (해당 요소가 있는 페이지에서만 실행)
  if (document.querySelector('.swiper-main')) {
    new Swiper('.swiper-main', {
      slidesPerView: 3,
      slidesBetween: 20,
      loop: true,
      centeredSlides: true,
      pagination: { el: '.swiper-pagination' },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  // 협력업체 캐러셀
  let swiper_cooperation = null;
  if (document.querySelector('.swiper_cooperation')) {
    swiper_cooperation = new Swiper('.swiper_cooperation', {
      slidesPerView: 4,
      spaceBetween: 70,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false
      }
    });
  }

  // 히어로 스와이퍼
  let swiper_hero = null;
  if (document.querySelector('.swiper-hero')) {
    swiper_hero = new Swiper('.swiper-hero', {
      loop: true,
      allowTouchMove: false,
      autoplay: { delay: 5000, disableOnInteraction: false },
      navigation: {
        prevEl: '.swiper-hero .swiper-button-prev',
        nextEl: '.swiper-hero .swiper-button-next'
      },
      effect: 'fade',
      fadeEffect: { crossFade: true }
    });
  }

  // 히어로 일시정지/재생 토글
  const heroPlayPauseBtn = document.querySelector('.hero-playpause');
  let heroPlaying = true;

  if (heroPlayPauseBtn && swiper_hero) {
    heroPlayPauseBtn.addEventListener('click', () => {
      if (heroPlaying) {
        swiper_hero.autoplay.stop();
        heroPlayPauseBtn.textContent = '▶';
        heroPlayPauseBtn.setAttribute('aria-label', '재생');
      } else {
        swiper_hero.autoplay.start();
        heroPlayPauseBtn.textContent = '❚❚';
        heroPlayPauseBtn.setAttribute('aria-label', '일시정지');
      }
      heroPlaying = !heroPlaying;
    });
  }

  // 대표 소개 사진 캐러셀 (profile.html)
  let swiper_profile = null;
  if (document.querySelector('.swiper-profile')) {
    swiper_profile = new Swiper('.swiper-profile', {
      loop: true,
      allowTouchMove: false,
      autoplay: { delay: 4000, disableOnInteraction: false },
      effect: 'fade',
      fadeEffect: { crossFade: true }
    });
  }

  // 대표 소개 사진 일시정지/재생 토글
  const profilePlayPauseBtn = document.querySelector('.profile-playpause');
  let profilePlaying = true;

  if (profilePlayPauseBtn && swiper_profile) {
    profilePlayPauseBtn.addEventListener('click', () => {
      if (profilePlaying) {
        swiper_profile.autoplay.stop();
        profilePlayPauseBtn.textContent = '▶';
        profilePlayPauseBtn.setAttribute('aria-label', '재생');
      } else {
        swiper_profile.autoplay.start();
        profilePlayPauseBtn.textContent = '❚❚';
        profilePlayPauseBtn.setAttribute('aria-label', '일시정지');
      }
      profilePlaying = !profilePlaying;
    });
  }

  // 프로그램 필터
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      programCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 블로그 목록 필터 + 페이지네이션 (blog.html)
  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogItems = document.querySelectorAll('.blog-list-item');
  const blogPagination = document.getElementById('blogPagination');
  const BLOG_PAGE_SIZE = 15;

  if (blogFilterBtns.length && blogItems.length && blogPagination) {
    // 좌측 번호(화면 표시용)는 오래된 글부터 1번으로 매깁니다. 글 파일명과는 별개이며,
    // 글이 삭제되면 남은 글 기준으로 자동 재계산됩니다.
    const BLOG_NUMBER_START = 1;
    const totalBlogItems = blogItems.length;
    blogItems.forEach((item, domIndex) => {
      const numberEl = item.querySelector('.blog-list-number');
      if (numberEl) numberEl.textContent = BLOG_NUMBER_START + totalBlogItems - 1 - domIndex;
    });

    let blogFilter = 'all';
    let blogPage = 1;

    function renderBlogList() {
      const filtered = [...blogItems].filter(item => {
        if (blogFilter === 'all') return true;
        const categories = (item.dataset.category || '').split(' ');
        return categories.includes(blogFilter);
      });
      const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
      if (blogPage > totalPages) blogPage = totalPages;

      blogItems.forEach(item => item.classList.add('hidden'));
      const start = (blogPage - 1) * BLOG_PAGE_SIZE;
      filtered.slice(start, start + BLOG_PAGE_SIZE).forEach(item => item.classList.remove('hidden'));

      blogPagination.innerHTML = '';
      if (totalPages <= 1) return;

      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = 'blog-page-btn' + (i === blogPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
          blogPage = i;
          renderBlogList();
        });
        blogPagination.appendChild(pageBtn);
      }
    }

    blogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogFilter = btn.dataset.filter;
        blogPage = 1;
        renderBlogList();
      });
    });

    renderBlogList();
  }

  // 블로그 상세 접힘 영역
  document.querySelectorAll('.blog-post-toggle-btn').forEach(btn => {
    const targetId = btn.dataset.toggleTarget;
    const target = targetId ? document.getElementById(targetId) : null;
    if (!target) return;

    btn.addEventListener('click', () => {
      const isOpen = target.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.textContent = isOpen ? '직접 적용 방법 접기' : '프로그램 안쓰고 직접 적용해보기';
    });
  });

  // 문의 유형 선택 → 같은 프레임 안에서 선택 화면을 Tally 폼 화면으로 전환
  const contactOptions = document.querySelectorAll('.contact-option');
  const contactOptionsView = document.getElementById('contactOptions');
  const contactFormView = document.getElementById('contactFormView');
  const contactFormFrame = document.getElementById('contactFormFrame');
  const contactFormBack = document.getElementById('contactFormBack');

  contactOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      const formUrl = btn.dataset.formUrl;
      if (contactFormFrame && formUrl) {
        contactFormFrame.src = formUrl;
      }
      if (contactOptionsView) contactOptionsView.style.display = 'none';
      if (contactFormView) contactFormView.style.display = 'block';
    });
  });

  if (contactFormBack) {
    contactFormBack.addEventListener('click', () => {
      if (contactFormView) contactFormView.style.display = 'none';
      if (contactOptionsView) contactOptionsView.style.display = 'flex';
      if (contactFormFrame) contactFormFrame.src = 'about:blank';
    });
  }

  // 부드러운 스크롤 (고정 헤더 높이만큼 보정, 같은 페이지 내 앵커만 해당)
  $('.nav a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    const target = $($(this).attr('href'));
    if (target.length) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      $('html, body').animate({ scrollTop: target.offset().top - headerHeight }, 400);
    }
  });

  if (swiper_cooperation) {
    swiper_cooperation.update();
    console.log(swiper_cooperation.slides.length);
  }
});
