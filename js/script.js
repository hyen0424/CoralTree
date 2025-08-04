// script.js

// --- 헤더 스크롤 고정 ---
window.addEventListener("scroll", () => {
  const header = document.querySelector("#main_header");
  if (window.scrollY > 0) {
    header.classList.add("fix");
  } else {
    header.classList.remove("fix");
  }
});

// --- 검색 폼 Enter 제출 처리 ---
const searchForm = document.querySelector("#searchform");
if (searchForm) {
  searchForm.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchForm.submit();
    }
  });
}

// --- GNB 메뉴 (PC hover, Mobile click) ---
const mainMenuItems = document.querySelectorAll(".gnb > ul > li");

const openSub = (el) => {
  const sub = el.querySelector(".sub");
  if (sub) sub.style.display = "block";
};
const closeSub = (el) => {
  const sub = el.querySelector(".sub");
  if (sub) sub.style.display = "none";
};

const addHoverEvents = () => {
  if (window.innerWidth >= 1200) {
    mainMenuItems.forEach((li) => {
      li.addEventListener("mouseenter", () => openSub(li));
      li.addEventListener("mouseleave", () => closeSub(li));
    });
  } else {
    mainMenuItems.forEach((li) => {
      li.removeEventListener("mouseenter", () => openSub(li));
      li.removeEventListener("mouseleave", () => closeSub(li));
    });
  }
};
addHoverEvents();
window.addEventListener("resize", addHoverEvents);

// 모바일: Rooms 서브메뉴 클릭 토글
const roomsMenu = mainMenuItems[1]; // 두번째 li (Rooms)
if (roomsMenu) {
  const roomsLink = roomsMenu.querySelector("a");
  roomsLink.addEventListener("click", (e) => {
    if (window.innerWidth < 1200) {
      e.preventDefault();
      const sub = roomsMenu.querySelector(".sub");
      if (!sub) return;
      if (sub.style.display === "block") {
        sub.style.display = "none";
      } else {
        sub.style.display = "block";
      }
    }
  });
}

// --- 모바일 메뉴 열기/닫기 ---
const toggleBtn = document.querySelector(".toggle_btn");
const gnb = document.querySelector(".gnb");
const blackBg = document.querySelector(".black_bg");
const gnbCloseBtn = document.querySelector(".closeBtn");
let isMenuOpen = false;

const openMenu = () => {
  gnb.style.transition = "all 0.5s ease";
  gnb.style.left = "0";
  if (blackBg) blackBg.style.display = "block";
  isMenuOpen = true;
};
const closeMenu = () => {
  gnb.style.transition = "all 0.5s ease";
  gnb.style.left = "-70vw";
  gnb.addEventListener(
    "transitionend",
    () => {
      gnb.style.transition = "";
    },
    { once: true }
  );
  if (blackBg) blackBg.style.display = "none";
  isMenuOpen = false;
};

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (!isMenuOpen) openMenu();
    else closeMenu();
  });
}
if (gnbCloseBtn) {
  gnbCloseBtn.addEventListener("click", closeMenu);
}
if (blackBg) {
  blackBg.addEventListener("click", closeMenu);
}

// --- 텍스트 애니메이션 함수 (GSAP) ---
const animateText = (textEl) => {
  if (!textEl) return;
  const letters = textEl.textContent.split("");
  textEl.innerHTML = "";
  letters.forEach((letter) => {
    const span = document.createElement("span");
    if (letter === " ") span.innerHTML = "&nbsp;";
    else span.textContent = letter;
    span.style.display = "inline-block";
    textEl.appendChild(span);
  });

  const spans = textEl.querySelectorAll("span");
  spans.forEach((span, i) => {
    gsap.set(span, { opacity: 0, y: 60, display: "inline-block" });
    gsap.to(span, {
      duration: 0.8,
      opacity: 1,
      y: 0,
      delay: (i + 1) * 0.08,
      ease: "power2.out",
      overwrite: "auto",
    });
  });
};

// --- Swiper 초기화 및 텍스트 애니메이션 연결 ---
const swiper = new Swiper(".swiper", {
  autoplay: { delay: 8000 },
  loop: true,
  pagination: { el: ".swiper-pagination", clickable: true },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  on: {
    slideChange: function () {
      const currentText =
        this.slides[this.activeIndex].querySelector(".text_content");
      animateText(currentText);
    },
  },
});

window.addEventListener("load", () => {
  const initText =
    swiper.slides[swiper.activeIndex].querySelector(".text_content");
  animateText(initText);
});
//--------------room swiper_slide-----------------

const slides = document.querySelectorAll(".swiper_slide");
const windowHeight = window.innerHeight;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  slides.forEach((slide, index) => {
    const sectionStart = windowHeight * index;
    const sectionEnd = windowHeight * (index + 1);

    if (scrollY >= sectionStart && scrollY < sectionEnd) {
      slide.classList.add("visible");
    } else {
      slide.classList.remove("visible");
    }
  });
});

// --- travel 섹션 애니메이션 ---
const travels = document.querySelectorAll("#Travel .content_wrap > div");
const travelRows = [];

travels.forEach((item, index) => {
  const rowIndex = Math.floor(index / 3);
  if (!travelRows[rowIndex]) travelRows[rowIndex] = [];
  travelRows[rowIndex].push(item);
});

travelRows.forEach((row) => {
  gsap.fromTo(
    row,
    { opacity: 0, y: 100 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: row[0],
        start: "top 75%",
        end: "bottom top",
        toggleActions: "play none none reverse",
        onLeaveBack: () =>
          gsap.to(row, { opacity: 0, y: 100, overwrite: true }),
      },
    }
  );
});
