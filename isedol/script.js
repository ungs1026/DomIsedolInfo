
const { createApp, ref, onMounted, computed, nextTick } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// 라우터 설정 (Vue 3 방식)
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: { template: '<div>Main Page</div>' }, meta: { title: 'Isegye Idol Info Main Page', description: 'You can check information on members, latest songs, latest YouTube videos, and records.' } },
    { path: '/member', component: { template: '<div>Member Page</div>' }, meta: { title: 'Isegye Idol Info Member Page', description: 'This is the album title of each member\'s information and group songs.' } },
    { path: '/board', component: { template: '<div>Board Page</div>' }, meta: { title: 'Isegye Idol Info Board Page', description: 'Check the contents of new information, notice, free bulletin board, and suggestion bulletin board.' } },
    { path: '/board/full/news', component: { template: '<div>Board Full News Page</div>' }, meta: { title: 'Isegye Idol Info Board Full News Page', description: 'Check all the posts on the new information bulletin board.' } },
    { path: '/board/full/notice', component: { template: '<div>Board Full Notice Page</div>' }, meta: { title: 'Isegye Idol Info Board Full Notice Page', description: 'Check all the posts on the notice board.' } },
    { path: '/board/full/free', component: { template: '<div>Board Full Free Page</div>' }, meta: { title: 'Isegye Idol Info Board Full Free Page', description: 'Check all the posts on the free bulletin board.' } },
    { path: '/board/full/suggest', component: { template: '<div>Board Full Suggest Page</div>' }, meta: { title: 'Isegye Idol Info Board Full Suggest Page', description: 'Check all the posts on the suggestion board.' } },
    { path: '/playlist', component: { template: '<div>Playlist Page</div>' }, meta: { title: 'Isegye Idol Info Playlist Page', description: 'Check the top 10 songs and playlist based on user ratings.' } },
    { path: '/playlist/all', component: { template: '<div>Playlist All Page</div>' }, meta: { title: 'Isegye Idol Info Playlist All Page', description: 'You can check, play, and modify the songs in the playlist selected on the playlist page.' } },
  ]
});
// 메타 태그 수동 관리
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Isegye Idol Info';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', to.meta.description || 'It is a site to celebrate ISEGYE IDOL\'s performance at Gocheok Dome in May 2025, and to provide information and songs.');
  }
  next();
});

const app = createApp({
  setup() {
    // Supabase 연결 설정
    const SUPABASE_URL = "https://pdwbghdbrzcaftdzjegw.supabase.co"; // 여기에 네 프로젝트 URL 입력
    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkd2JnaGRicnpjYWZ0ZHpqZWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjI4NzYsImV4cCI6MjA1ODYzODg3Nn0.PS9lyc45XXnhVw52qq9TOQyYiWclxNxPwLGtSFX8VbI"; // 여기에 네 공개 키 입력
    // Supabase 클라이언트 생성
    const supabase = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    // 반응형 데이터 정의
    const currentPage = ref("page-loading");
    const loadingPercent = ref(0);
    let newCp = ref("");
    // 페이지 전환 함수 (DOM 업데이트 후 초기화)
    const switchPage = (path) => {
      if (path == "page-main") {
        newCp = '/';
      } else {
        newCp = '/' + path.replace('page-', '').replace('-', '/').replace('-', '/');
      }

      console.log('newCp : ', newCp);
      if (currentPage.value === path) return;
      currentPage.value = path;
      router.push(newCp);
      nextTick(() => {
        if (path === "page-main") {
          initMainPage();
        } else if (path === "page-member") {
          initMemberPage();
        } else if (path === "page-board") {
          initBoardPage();
        } else if (path === "page-playlist") {
          initPlaylistPage();
        } else if (path.startsWith("page-board-full-")) {
          initFullBoardPage(path);
        } else if (path === "page-playlist-all") {
          fetchSelectedPlaylistSongs();
        }
      });
      console.log('path : ', path);
      console.log('currentPage : ', currentPage.value);
    };

    // 로딩 페이지 초기화
    const initLoadingPage = (duration) => {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".loading-logo",
        { y: -200, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power2.out" }
      );
      loadingPercent.value = 0;
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min(100, (elapsed / duration) * 100);
        loadingPercent.value = Math.floor(percent);
        if (percent >= 100) clearInterval(interval);
      }, 16);
    };
    
    const isModalActive = ref(false);
    const modalTitle = ref("");
    const modalMeta = ref("");
    const modalBody = ref("");
    const modalImage = ref("");
    const activeVideoCard = ref(null);
    const activeMemberInfo = ref(null);
    const currentTime = ref(0); // 오디오 재생시간 업데이트용

//#region mainPage
    // 변수================================
    const sliders = ref([]);
    const memberImages = ref([]);
    const memberInfo = ref("");
    const memberColor = ref("");
    const isSongTitlesVisible = ref(false);
    const isFooterVisible = ref(false);
    const showDetail = ref(false);
    // 데이터 정의
    const members = ref([
      {
        index: "ine",
        img1: "source/profiles/ine/ine_body.png",
        img2: "source/profiles/ine/ine_face.png",
        img3: "source/profiles/ine/ine_fan.png",
        info: `<div class="mem_detail_right_info">
                      <h3 style="margin-bottom: 1rem;">아이네(INE)</h3>
                      <span>나이 : 31살</span><br>
                      <span>158cm｜B형</span><br>
                      <span>상징색 : 파란제비꽃색 #8A2BE2</span><br>
                      <span>팬덤명 : 둘기</span><br>
                      <span>첫 방송일 : 2021년 7월 26일</span>
                    </div>`,
        color: "#8A2BE2",
      },
      {
        index: "jingburger",
        img1: "source/profiles/jingburger/jing_body.png",
        img2: "source/profiles/jingburger/jing_face.png",
        img3: "source/profiles/jingburger/jing_fan.png",
        info: `<div class="mem_detail_right_info">
                      <h3 style="margin-bottom: 1rem;">징버거(JINGBURGER)</h3>
                      <span>나이 : 1995년 10월 8일 (29세)</span><br>
                      <span>161.9cm｜B형</span><br>
                      <span>상징색 : 노란색 빨간색</span><br>
                      <span>팬덤명 : 똥강아지</span><br>
                      <span>첫 방송일 : 2018년 7월 10일</span>
                    </div>`,
        color: "#f0a957",
      },
      {
        index: "lilpa",
        img1: "source/profiles/lilpa/lil_body.png",
        img2: "source/profiles/lilpa/lil_face.png",
        img3: "source/profiles/lilpa/lil_fan.png",
        info: `<div class="mem_detail_right_info">
                      <h3 style="margin-bottom: 1rem;">릴파(LILPA)</h3>
                      <span>나이 : 1996년 3월 9일 (29세)</span><br>
                      <span>164cm｜O형</span><br>
                      <span>상징색 : 남색</span><br>
                      <span>팬덤명 : 박쥐단</span><br>
                      <span>첫 방송일 : 2021년 7월 24일</span>
                    </div>`,
        color: "#000080",
      },
      {
        index: "jururu",
        img1: "source/profiles/jururu/ju_body.png",
        img2: "source/profiles/jururu/ju_face.png",
        img3: "source/profiles/jururu/ju_fan.png",
        info: `<div class="mem_detail_right_info">
                      <h3 style="margin-bottom: 1rem;">주르르(JURURU)</h3>
                      <span>나이 : 1997년 6월 10일 (27세)</span><br>
                      <span>162.3cm[3]｜O형｜225mm</span><br>
                      <span>상징색 : 분홍색</span><br>
                      <span>팬덤명 : 주폭도</span><br>
                      <span>첫 방송일 : 2018년 3월 14일</span>
                    </div>`,
        color: "#ff008c",
      },
      {
        index: "gosegu",
        img1: "source/profiles/gosegu/go_body.png",
        img2: "source/profiles/gosegu/go_face.png",
        img3: "source/profiles/gosegu/go_fan.png",
        info: `<div class="mem_detail_right_info">
                      <h3 style="margin-bottom: 1rem;">고세구(GOSEGU)</h3>
                      <span>나이 : 1998년 (26~27세)</span><br>
                      <span>300m[3]｜B형</span><br>
                      <span>상징색 : 하늘색</span><br>
                      <span>팬덤명 : 세균단</span><br>
                      <span>첫 방송일 : 2021년 7월 27일</span>
                    </div>`,
        color: "#4672c6",
      },
      {
        index: "viichan",
        img1: "source/profiles/viichan/vi_body.png",
        img2: "source/profiles/viichan/vi_face.png",
        img3: "source/profiles/viichan/vi_fan.png",
        info: `<div class="mem_detail_right_info">
                      <h3 style="margin-bottom: 1rem;">비챤(VIICHAN)</h3>
                      <span>나이 : 2000년 1월 16일(25세)</span><br>
                      <span>161cm｜B형</span><br>
                      <span>상징색 : 스프링버드 / 진회색 / 코토리 베이지</span><br>
                      <span>팬덤명 : 라니</span><br>
                      <span>첫 방송일 : 2021년 5월 30일</span>
                    </div>`,
        color: "#95c100",
      },
    ]);
    const songs = ref([
      { title: "이세계 아이돌 - SYZYGY", img: "source/syzygy.png" },
      {
        title: `<a href="https://www.youtube.com/watch?v=v9Jqz13gg8k" target="_blank" style="color: white;">YOUTUBE</a>`,
        img: "source/profiles/sns/youtube.svg",
      },
      {
        title: `<a href="https://cafe.naver.com/steamindiegame?iframe_url=/ArticleList.nhn%3Fsearch.clubid=27842958%26search.menuid=345%26search.boardtype=L" target="_blank" style="color: white;">네이버 카페</a>`,
        img: "source/profiles/sns/naver_cafe.svg",
      },
      {
        title: `<a href="https://namu.wiki/w/SYZYGY(%EC%9D%B4%EC%84%B8%EA%B3%84%EC%95%84%EC%9D%B4%EB%8F%8C)" target="_blank" style="color: white;">[가사 일부]</a>
              따라와, 내 universe Findin’ through the light 함께할 night, 시작된 day Come in SYZYGY (yeah) 널 기다려`,
        img: "source/syzygy.png",
      },
    ]);
    const videoCards = ref([]);
    const awardCards = ref([
      { icon: "source/award/melon.png", info: "" },
      { icon: "source/award/lockdown.webp", info: "24H 스트리밍 - 1,156,500" },
      { icon: "source/award/another.webp", info: "24H 스트리밍 - 1,335,900" },
      {
        icon: "source/award/kidding.jpg",
        info: "24H 스트리밍 - 2,109,700",
      },
      { icon: "source/award/melon.png", info: "24H 스트리밍 - 1,825,900" },
      { icon: "source/award/superhero.webp", info: "" },
      { icon: "source/award/kidding.jpg", info: "3위" },
      { icon: "source/award/빌보드글로벌.png" },
      { icon: "source/award/kidding.jpg", info: "167위" },
    ]);

    // 함수================================
    // Main 페이지 초기화 (Swiper, Song Icons, Member Icon, Video, Footer, Playbar)
    const initMainPage = async () => {
      initSongIcons();
      initVideo();
      initFooterAnimation();
      initPlaybar();
      // 페이지 데이터 로드가 완료될 때까지 대기
      await Promise.all([
        fetchVideoThumbnails(),
        fetchSliders()
      ]);
    };

    // Song Icons 초기화
    const initSongIcons = () => {
      const songIcons = document.getElementById("song-icons");
      if (songIcons) {
        songIcons.addEventListener("mouseenter", showSongTitles);
        songIcons.addEventListener("mouseleave", hideSongTitles);
      }
    };
    // 수정된 Video 초기화 (Vue 환경에서 nextTick 후 DOM 접근)
    const initVideo = () => {
      nextTick(() => {
        const videoContainer = document.getElementById("video-container");
        if (!videoContainer) return;
        const videoCardNodes = Array.from(
          videoContainer.querySelectorAll(".video-card")
        );
        const closeBtn = document.getElementById("video-close-btn");
        let activeCard = null;

        function isMobile() {
          return window.innerWidth <= 768;
        }

        function resetGridStyles() {
          videoCardNodes.forEach((card) => {
            card.classList.remove(
              "active",
              "hidden",
              "float-animation",
              "animate"
            );
            card.style.removeProperty("width");
            card.style.removeProperty("height");
            card.style.removeProperty("line-height");
            card.style.removeProperty("left");
            card.style.removeProperty("top");
            card.style.removeProperty("transform");
          });
        }

        function setVideoCardPositions() {
          const containerWidth = videoContainer.clientWidth;
          const cardSize = 260;
          const rowTops = [50, 220, 450];
          const rows = { 0: [], 1: [], 2: [] };
          videoCardNodes.forEach((card, idx) => rows[idx % 3].push(card));
          Object.keys(rows).forEach((rowIndex) => {
            const cards = rows[rowIndex];
            const minGap = cardSize;
            let left1 =
              Math.random() * (containerWidth - cardSize * 2 - minGap);
            let left2 =
              left1 +
              cardSize +
              minGap +
              Math.random() *
                (containerWidth - left1 - cardSize - minGap - cardSize);
            if (Math.random() > 0.5) [left1, left2] = [left2, left1];
            if (cards[0])
              cards[0].style.cssText = `left: ${left1}px; top: ${
                rowTops[rowIndex]
              }px; width: ${cardSize}px; height: ${
                cardSize - 60
              }px; line-height: ${cardSize}px; transform: translateY(30px);`;
            if (cards[1])
              cards[1].style.cssText = `left: ${left2}px; top: ${
                rowTops[rowIndex]
              }px; width: ${cardSize}px; height: ${
                cardSize - 60
              }px; line-height: ${cardSize}px; transform: translateY(30px);`;
          });
        }

        if (isMobile()) resetGridStyles();
        else {
          setVideoCardPositions();
          const onScroll = () => {
            const videoRect = videoContainer.getBoundingClientRect();
            if (
              videoRect.top <
              window.innerHeight - videoContainer.clientHeight / 5
            ) {
              videoCardNodes.forEach((card) => {
                if (!card.classList.contains("animate")) {
                  card.classList.add("animate");
                  setTimeout(() => card.classList.add("float-animation"), 500);
                }
              });
              window.removeEventListener("scroll", onScroll);
            }
          };
          window.addEventListener("scroll", onScroll);
        }

        videoCardNodes.forEach((card) => {
          card.addEventListener("click", () => {
            if (activeCard) return;
            activeCard = card;
            videoCardNodes.forEach((c) => {
              if (c !== card) c.classList.add("hidden");
            });
            card.classList.remove("float-animation");
            card.classList.add("active");
            card.style.transition = "all 0.5s ease";
            if (isMobile()) {
              card.style.width = `${videoContainer.clientWidth}px`;
              card.style.height = `${videoContainer.clientHeight}px`;
              card.style.lineHeight = `${videoContainer.clientHeight}px`;
            } else {
              const targetWidth = videoContainer.clientWidth * 0.8;
              const targetHeight = videoContainer.clientHeight * 0.8;
              card.style.left = `${
                (videoContainer.clientWidth - targetWidth) / 2
              }px`;
              card.style.top = `${
                (videoContainer.clientHeight - targetHeight) / 2
              }px`;
              card.style.width = `${targetWidth}px`;
              card.style.height = `${targetHeight}px`;
              card.style.lineHeight = `${targetHeight}px`;
            }
            closeBtn.classList.add("show");
          });
        });

        closeBtn.addEventListener("click", () => {
          if (!activeCard) return;
          activeCard.classList.remove("active");
          activeCard.style.transition = "all 0.5s ease";
          if (isMobile()) {
            videoCardNodes.forEach((card) => {
              card.classList.remove("hidden");
              card.style.removeProperty("width");
              card.style.removeProperty("height");
              card.style.removeProperty("line-height");
            });
          } else {
            setVideoCardPositions();
            videoCardNodes.forEach((c) => c.classList.remove("hidden"));
          }
          closeBtn.classList.remove("show");
          activeCard = null;
        });
      });
    };
    // initFooterAnimation 함수: footer가 뷰포트에 보이면 isFooterVisible 업데이트
    const initFooterAnimation = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) isFooterVisible.value = true;
          });
        },
        { threshold: 0.5 }
      );
      const footerEl = document.querySelector("footer");
      if (footerEl) observer.observe(footerEl);
    };
// fetchData
    // videoThumbnails 데이터를 가져와 videoCards의 defaultImg를 업데이트하는 함수 추가
    const fetchVideoThumbnails = async () => {
      // videothumbnails 테이블에서 video_id, thumbnail_url 가져오기
      const { data, error } = await supabase
        .from("videothumbnails")
        .select("*")
        .order("idx", { ascending: true });
      if (error) {
        console.error("Error fetching video thumbnails:", error);
        return;
      }
      // videoCards 배열을 DB 레코드 수만큼 동적 생성
      videoCards.value = data.map((rec, i) => ({
        index: i,
        defaultImg: rec.img,
        youtubeUrl: `https://www.youtube.com/embed/${rec.video_id}?autoplay=1`,
        animate: false,
        float: false,
        active: false,
        hidden: false,
        showVideo: false,
      }));
    };
    const fetchSliders = async () => {
      const { data, error } = await supabase.from("sliders").select("*");
      if (error) {
        console.error("슬라이더 데이터 로드 에러:", error);
      } else {
        // Supabase에서 가져온 배열 전체를 sliders에 저장
        sliders.value = data;
        // DOM 갱신 후 Swiper 초기화 (v-for로 렌더링 완료 후)
        nextTick(() => {
          new Swiper(".main_banner", {
            autoplay: { delay: 5000, disableOnInteraction: false },
            loop: sliders.value.length > 1, // 슬라이드가 1개 이상일 때만 루프 활성화
            slidesPerView: 1,
            slidesPerGroup: 1,
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      }
    };

    // Video 섹션 이벤트 핸들러 (추가 Vue 처리 필요 시)
    const onVideoCardClick = (index) => {
      // initVideo 내 이벤트 등록으로 별도 처리 없음.
      if (activeVideoCard.value !== null) return; // 이미 활성화된 카드가 있으면 무시
      activeVideoCard.value = index;
      videoCards.value[index].showVideo = true;
    };
    const onCloseVideoCard = () => {
      // initVideo 내 이벤트 등록으로 별도 처리 없음.
      if (activeVideoCard.value !== null) {
        videoCards.value[activeVideoCard.value].showVideo = false;
        activeVideoCard.value = null;
      }
    };

    // Song Icons 기능
    const showSongTitles = () => {
      isSongTitlesVisible.value = true;
    };
    const hideSongTitles = () => {
      isSongTitlesVisible.value = false;
    };

    // Member Detail 기능
    const showMemberDetail = (index) => {
      const member = members.value.find((m) => m.index === index);
      memberImages.value = [member.img1, member.img2, member.img3];
      memberInfo.value = member.info.replace(/\n/g, "<br>");
      memberColor.value = member.color;
      showDetail.value = true;
    };
    const hideMemberDetail = () => {
      showDetail.value = false;
    };
//#endregion

//#region memberPage
    // 변수================================
    const albums = ref([]);
    const memberSliderCards = ref(
      Array.from({ length: 8 }, () => ({ videoMode: false }))
    );
    const memberIcons = ref([
      {
        defaultImg: "source/profiles/profile-ine.png",
        hoverImg: "source/profiles/ine.png",
      },
      {
        defaultImg: "source/profiles/profile-jingburger.png",
        hoverImg: "source/profiles/jingburger.png",
      },
      {
        defaultImg: "source/profiles/profile-lilpa.png",
        hoverImg: "source/profiles/lilpa.png",
      },
      {
        defaultImg: "source/profiles/profile-jururu.png",
        hoverImg: "source/profiles/jururu.png",
      },
      {
        defaultImg: "source/profiles/profile-gosegu.png",
        hoverImg: "source/profiles/gosegu.png",
      },
      {
        defaultImg: "source/profiles/profile-viichan.png",
        hoverImg: "source/profiles/viichan.png",
      },
    ]);
    const memberInfos = ref([
      // ine
      `<div class="member_info_wrapper">
              <div class="member_info_contain">
              
                <!-- 소개 비디오 -->
                <div class="intro_video">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/Bx68J--HyhI?si=DfKsxJh_F0DDgg8D"
                    title="YouTube video player" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>

                  <!-- 기본정보 -->
                <div class="member-summary-detail">
                  <div class="left">
                    <img src="source/profiles/ine/ine_body.png" alt="" style="height: 400px;">
                  </div>
                  <div class="right">
                    <div class="info">
                      <h2>아이네(INE)</h2>
                      <span>출생 : 1994년 (31세)</span><br>
                      <span>거주지 : 수도권 외 시골</span><br>
                      <span>신체 : 158cm｜B형</span><br>
                      <span>성별 : 여성</span><br>
                      <span>가족 : 부모님, 남동생</span><br>
                      <span>반려견 : 뭉뭉이(견종 불명)</span><br>
                      <span>상징색 : 파란제비꽃색 #8A2BE2</span><br>
                      <span>소속사 : 패러블 엔터테인먼트[운영]</span><br>
                      <span>소속 그룹 : 이세계아이돌</span><br>
                      <span>데뷔 : 2021년 이세계아이돌 싱글 1집 RE : WIND <br>
                        <pre>         (데뷔일로부터 +1203일, 3주년)</pre>
                      </span>
                      <span>첫 방송일 : 2021년 7월 26일</span><br>
                      <span>팬덤명 : 둘기</span><br>
                      <span>MBTI : INFP</span><br>
                      <span>별명 : 이네땅, 아잉네, 아굳형 등</span>
                      <img src="source/profiles/ine/ine.svg" alt="" style="width: 140px; background-color: white; border-radius: 10px;" >
                    </div>  
                    <div class="platform">
                      <div class="info">
                        <a href="https://www.youtube.com/@INE" target="_blank">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>아이네 유튜브</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@Desuk">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>데친 숙주나물</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@INE_dasibogi">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>아이네 다시보기</span>
                      </div>
                      <div class="info">
                        <a href="https://ch.sooplive.co.kr/inehine">
                          <img src="source/profiles/sns/soop.png" alt="">
                        </a>
                        <span>아이네♪</span>     
                      </div>
                    </div>

                  </div>
                </div>

                <div class="sum_video">
                  <img src="source/profiles/ine/intro.gif"></img>
                  <div class="greet">
                    <span>흐으으으으음~ 하이네~~!!!!!!!!!!!</span><br>
                    <span>패러블 엔터테인먼트[운영] 소속 6인조 버츄얼 방송인 그룹 이세계아이돌의 멤버. 동시에 SOOP 스트리머이며, 버츄얼 유튜버이다.</span>
                  </div>
                </div>

                <div class="vocal">
                  <div class="ex">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/aaqIHn61OVE?si=okZUUJlywxhL1Ah3" 
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="text">
                    <span>- 오디션 때부터 팬들은 물론이고, 합격 후 이세돌 멤버들도 입을 모아 릴파와 함께 메인보컬로 꼽을 정도로 노래 실력이 뛰어나다. 그룹 내에서 공식 포지션은 정해지지 않았지만 보통 노래 후렴구와 같은 하이라이트 파트와 화음, 코러스를 담당하는 등 비공식적으로도 그 역할을 하는 편.</span><br>
                    <span>- 허스키한 톤에 풍부한 성량과 넓은 음역대를 지니고 있으며, 특히 감정을 연기하는 데 있어 특출난 기교를 갖춘 훌륭한 보컬의 소유자이다. 소화할 수 있는 장르의 영역도 그만큼 넓다</span><br>
                    <span>- 아이네의 보컬로서의 큰 강점은 명료한 딕션과 뛰어난 완급조절 및 끝음처리를 통해 노래가 의도하는 감정을 그대로 담아 전달하는 표현력이다. 음 하나하나와 호흡까지도 섬세하게 계산된 의도를 담아 부르는 그녀의 노래는 청자에게 기교와 스킬의 차원을 뛰어넘은 매력으로 다가오며, 이는 아이네의 보컬이 많은 사람들에게 사랑을 받는 이유이기도 하다. 여기에 더해 마치 성대를 갈아끼워 넣는 것마냥 노래의 분위기에 따라 전혀 다른 창법과 음색으로 다양한 스타일의 장르들을 능숙하게 소화해 낸다.</span><br>
                    <span>- 음악을 사랑하는 부모님의 희망으로 어렸을 때부터 다양한 콩쿠르에 참여하면서 성악가를 장래 희망으로 삼았으며, 자신의 실력에 한계를 느껴 고등학생 때 즈음 꿈을 접었지만 이후 다시금 노래를 제대로 해보고 싶다는 희망이 생겨 실용음악을 공부했다고 한다.</span><br>
                  </div>
                </div>

                <div class="activities">
                  <div class="year">
                    <h2>2021년</h2>
                    <span>9월 9일 : 제 1회 <a href="https://namu.wiki/w/%EA%B5%AC%EA%B5%AC%EC%9D%98%20%EB%82%A0" target="_blank">구구의 날</a></span>
                  </div>
                  <div class="year">
                    <h2>2022년</h2>
                    <span>4월 2일 : <a href="https://www.youtube.com/watch?v=OUT33SIFEK0" target="_blank">없는 계절</a> 발매</span><br>
                    <span>10월 9일 : <a href="https://www.youtube.com/watch?v=lttoODN5hOo" target="_blank">햄이네 락페스티벌</a></span>
                  </div>
                  <div class="year">
                    <h2>2023년</h2>
                    <span>9월 9일 <a href="https://namu.wiki/w/%EA%B5%AC%EA%B5%AC%EC%9D%98%20%EB%82%A0" target="_blank">제 2회 구구의 날</a></span>
                  </div>
                  <div class="year">
                    <h2>2024년</h2>
                    <span>2월 10일 : <a href="https://vod.sooplive.co.kr/player/115894243" target="_blank">아이네 아프리카TV 데뷔 콘서트</a></span><br>
                    <span>5월 11일 <a href="https://www.youtube.com/live/aCa5qn11IrI" target="_blank">EVER PURPLE</a>콘서트</span><br>
                    <span>9월 9일 : <a href="https://www.youtube.com/watch?v=jv_OeXLXCHs" target="_blank">제 3회 구구의 날</a></span>
                  </div>
                </div>

                <div class="subimg">
                  <img src="source/profiles/ine/ine_sub.png" alt="">
                </div>

                <div class="rule">
                  <h2>방송규칙</h2>
                  <span>(예외도 있긴하지만) 방장이 언급전에 </span><br>
                  <span> > 타스트리머 언급/방송주제와 상관없는 채팅/훈수/중계/비교/평가/시청자수언급/친목/네임드/도배/물타기/뇌절/개인정보 추측 외에도 방장 주관적인 상황에 따른 알잘딱 못하는 선넘는 행동 < </span><br>
                  <span>위와 같은 행동을 했을시 즉시 밴 혹은 채팅금지 / 경고 혹은 채팅금지를 3번 받을시 밴</span>
                </div>

              </div>
            </div>`,
      // jingburger
      `<div class="member_info_wrapper">
              <div class="member_info_contain">
              
                <!-- 소개 비디오 -->
                <div class="intro_video">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/-CJa1On8gh4?si=qGxgbqQ__JtadNzJ" 
                  title="YouTube video player" frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>

                  <!-- 기본정보 -->
                <div class="member-summary-detail">
                  <div class="left">
                    <img src="source/profiles/jingburger/jing_body.png" alt="" style="height: 400px;">
                  </div>
                  <div class="right">
                    <div class="info">
                      <h2>징버거(JINGBURGER)</h2>
                      <span>출생 : 1995년 10월 8일 (29세)</span><br>
                      <span>거주지 : 울산광역시</span><br>
                      <span>신체 : 161.9cm｜B형</span><br>
                      <span>성별 : 여성</span><br>
                      <span>가족 : 부모님, 큰오빠 거머리TV, 작은오빠</span><br>
                      <span>상징색 : 노란색 빨간색</span><br>
                      <span>소속사 : 패러블 엔터테인먼트[운영]</span><br>
                      <span>소속 그룹 : 이세계아이돌</span><br>
                      <span>데뷔 : 2021년 이세계아이돌 싱글 1집 RE : WIND <br>
                        <pre>         (데뷔일로부터 +1203일, 3주년)</pre>
                      </span>
                      <span>첫 방송일 : 2018년 7월 10일</span><br>
                      <span>팬덤명 : 똥강아지</span><br>
                      <span>MBTI : INTJ</span><br>
                      <span>별명 : 부가땅, 버건니, 버그 등</span>
                      <img src="source/profiles/jingburger/jing.webp" alt="" style="width: 140px;  background-color: white; border-radius: 10px;" >
                    </div>  
                    <div class="platform">
                      <div class="info">
                        <a href="https://www.youtube.com/@jingburger" target="_blank">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>징버거 유튜브</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@jingburger2k">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>징버거가 ZZANG센 주제에 너무 신중하다</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@jingburger_dasibogi">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>징버거의 무한 츠쿠요미</span>
                      </div>
                      <div class="info">
                        <a href="https://ch.sooplive.co.kr/jingburger1">
                          <img src="source/profiles/sns/soop.png" alt="">
                        </a>
                        <span>징버거☆</span>     
                      </div>
                    </div>

                  </div>
                </div>

                <div class="sum_video">
                  <img src="source/profiles/jingburger/jingburger.gif"></img>
                  <div class="greet">
                    <span>하이부가~~~~~~~~</span><br>
                    <span>패러블 엔터테인먼트[운영] 소속 6인조 버츄얼 방송인 그룹 이세계아이돌의 멤버. 동시에 SOOP 스트리머이며, 버츄얼 유튜버이다.</span>
                  </div>
                </div>

                <div class="vocal">
                  <div class="ex">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/8MImc3MxYZg?si=eru7EusfDDG4QktU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="text">
                    <span>- TOMBOY나 LOVE DIVE와 같은 K-POP 장르는 물론이고 STAY, 별빛 등대의 섬, 강풍 올백 등 여러 장르의 곡을 커버했다.</span><br>
                    <span>- 목소리의 스타일을 바꿀 수 있어 이세계아이돌 보컬의 또 다른 코어 역할을 담당한다. 멤버들 저마다의 음색에 개성이 강한 팀이기에 연결고리 역할을 수행할 다재다능한 보컬이 필요한데, 징버거가 파트에 맞게 톤을 바꿔가며 이 역할을 수행한다.</span><br>
                  </div>
                </div>

                <div class="activities">
                  <div class="year">
                    <h2>2024년</h2>
                    <span>2월 10일 : <a href="https://www.youtube.com/watch?v=0HcTddHouRo" target="_blank">징버거 아프리카TV 데뷔 콘서트</a></span>
                  </div>
                </div>

                <div class="subimg">
                  <img src="source/profiles/jingburger/jing_sub.png" alt="">
                </div>

                <div class="rule">
                  <h2>방송규칙</h2>
                  <span>채팅 규칙
                    채금 3회 > 강퇴 1회 / 강퇴 3회 > 블랙 (방송못봐요) <br>
                    - 시청자 수 언급 금지 <br>
                    - 타비제이 언급, 비하, 비교 발언 금지 <br>
                    - 경찰 행동 금지<br>
                    - 훈수 금지 (물어볼때만 가능) <br>
                    - 신상정보 및 전생 언급 금지 <br>
                    - 정치/종교, 성차별 발언 금지 <br>
                    - 뻐꾸기, 중계 금지<br>
                    - 스포 금지</span>
                </div>
              </div>
            </div>
            `,
      // lilpa
      `<div class="member_info_wrapper">
              <div class="member_info_contain">
              
                <!-- 소개 비디오 -->
                <div class="intro_video">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/cQ97HyrHYOI?si=yZfj3AlP4m3KBkPR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                  <!-- 기본정보 -->
                <div class="member-summary-detail">
                  <div class="left">
                    <img src="source/profiles/lilpa/lil_body.png" alt="" style="height: 400px;">
                  </div>
                  <div class="right">
                    <div class="info">
                      <h2>릴파(LILPA)</h2>
                      <span>출생 : 1996년 3월 9일 (29세)</span><br>
                      <span>출생지 : 부산광역시</span><br>
                      <span>신체 : 164cm｜O형</span><br>
                      <span>성별 : 여성</span><br>
                      <span>가족 : 부모님, 언니</span><br>
                      <span>반려견 : 반려견 아토</span>
                      <span>상징색 : 남색</span><br>
                      <span>소속사 : 패러블 엔터테인먼트[운영]</span><br>
                      <span>소속 그룹 : 이세계아이돌</span><br>
                      <span>데뷔 : 2021년 이세계아이돌 싱글 1집 RE : WIND <br>
                        <pre>         (데뷔일로부터 +1203일, 3주년)</pre>
                      </span>
                      <span>첫 방송일 : 2021년 7월 24일</span><br>
                      <span>팬덤명 : 박쥐단</span><br>
                      <span>MBTI : ENFP</span><br>
                      <span>별명 : 김릴파, 릴파넴, 릴트리버 등</span>
                      <img src="source/profiles/lilpa/lil.svg" alt="" style="width: 140px;  background-color: white; border-radius: 10px;" >
                    </div>  
                    <div class="platform">
                      <div class="info">
                        <a href="https://www.youtube.com/@lilpa" target="_blank">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>릴파 유튜브</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@lilpa_sub">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>릴파의 순간들</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@lilpa_vod">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>릴파 다시보기</span>
                      </div>
                      <div class="info">
                        <a href="https://ch.sooplive.co.kr/lilpa0309">
                          <img src="source/profiles/sns/soop.png" alt="">
                        </a>
                        <span>릴파♬</span>     
                      </div>
                    </div>

                  </div>
                </div>

                <div class="sum_video">
                  <img src="source/profiles/lilpa/lilpa.gif"></img>
                  <div class="greet">
                    <span>에블바리 세이~ 리라리라~!</span><br>
                    <span>패러블 엔터테인먼트[운영] 소속 6인조 버츄얼 방송인 그룹 이세계아이돌의 멤버. 동시에 SOOP 스트리머이며, 버츄얼 유튜버이다.</span>
                  </div>
                </div>

                <div class="vocal">
                  <div class="ex">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/SPyUgq5ukNE?si=NwcsbHqiqHvlm5cz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="text">
                    <span>- 이세계아이돌 활동 초기부터 멤버들이나 팬들 사이에서 아이네와 함께 메인보컬로 거론될 만큼 실력이 좋다. 물론 각 멤버마다 공식적으로 정해진 포지션은 없지만 대체로 후렴, 클라이맥스 고음 파트와 같은 하이라이트나 애드립과 코러스를 맡는 등 중추적인 역할을 하는 편. 기본기가 좋으며 단단한 성대와 발성, 매우 넓은 음역대[35], 큰 성량을 소화하는 고유의 창법 등 특색있는 매력을 가지고 있어 다양한 장르에서 본인만의 색을 드러내는 것이 가능한 보컬이다.</span><br>
                    <span>- 실제 아이돌 그룹 메인보컬로 활동한 경력이 있고 재즈 보컬을 전공으로 배우기도 하였다. 팬들 사이에서 굉장히 높은 음까지도 시원하게 올라가는 고음역대에 대한 인상이 깊은 데다, 릴파 본인도 락밴드 장르를 좋아하여 상대적으로 드러나지 않은 감이 있으나 LADY 커버를 통해 부드러운 중저음을, KIDDING의 랩 파트를 맡아 인상적인 저음을 보여주는 등 다른 음역대 보컬로서도 실력이 뛰어나며 이러한 파트를 맡는 일도 많다.</span><br>
                    <span>- 성량이 매우 커 고음에서 꽉 차는 목소리를 들려준다. 평소 대화를 할 때의 목소리도 그만큼 큰 편이다.</span>
                  </div>
                  <div class="ex">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/SLa8fe1Z2XE?si=GcF5qxBpfnEUjvc0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="text">
                    <span>- 팬들 사이에서 메인댄서로 자주 거론된다. 이세돌 활동에서도 드러나는 능력으로 RE : WIND 뮤직 비디오나 LOVE DIVE 커버 영상에 쓰인 안무를 모션 캡처를 활용해 다른 멤버들의 몫까지 6인분을 혼자 전부 촬영했으며, 이 모션을 다른 멤버들의 아바타에 덮어쓰기 하는 방식으로 제작되었다.</span><br>
                    <span>- 아이돌 활동 경력이 있어 이세돌 멤버들 중 유일하게 전문적으로 댄스를 배운 멤버이기 때문에 아이솔레이션 등의 다소 기술적인 동작이나 쉽사리 시도하기 어려운 격한 움직임 등이 포함되는 안무도 디테일하고 안정적으로 소화할 수 있으며, 그만큼 춤에 대한 이해력도 높아 KIDDING의 안무와 그 동작을 다른 멤버들에게 직접 설명하며 가르쳐주기도 했다. 또한 필요에 따라 안무 중 일부를 촬영장에서 즉석으로 만들거나 수정할 수도 있고 군무의 동선 역시 스스로 짜는 것이 가능해 이런 점이 활동에 적지 않은 영향을 주었다.</span><br>
                    <span>- 마지막 재회 커버 MV 등에서와 같이 페이셜 캡처를 이용한 표정 연기도 자연스러워 안무나 각종 몸동작에 시각적인 몰입감을 더불어 부여할 수가 있다.</span>
                  </div>
                </div>

                <div class="activities">
                  <div class="year">
                    <h2>2022년</h2>
                    <span>12월 23일 : <a href="https://www.youtube.com/watch?v=SLa8fe1Z2XE" target="_blank">Dream Again 콘서트</a></span>
                  </div>
                  <div class="year">
                    <h2>2024년</h2>
                    <span>2월 11일 : <a href="https://vod.sooplive.co.kr/player/115972573" target="_blank">LILease 라이브 쇼</a></span><br>
                    <span>7월 12일 / 13일 : <a href="https://namu.wiki/w/LILPACON%20:%20Going%20Out%20-%20SOOPER%20CONCERT" target="_blank">LILPACON : Going Out </a>콘서트</span><br>
                    <span>12월 7일 : <a href="https://namu.wiki/w/Anime%20X%20Game%20Festival%202024" target="_blank">Anime X Game Festival 2024: 에픽세븐 출연</a></span><br>
                  </div>
                </div>

                <div class="subimg">
                  <img src="source/profiles/lilpa/lil_sub.png" alt="">
                </div>

                <div class="rule">
                  <h2>방송규칙</h2>
                  <span>채팅 규칙
                    1. 친목, 과도한 요청 또는 도배 금지<br>
                    2. 개인 신상 및 전생 언급 성희롱 절대 금지<br>
                    3. 방장이 언급 전 타스 언급 금지(이세돌 포함) <중계금지란 소리입니다><br>
                    4. 타 커뮤니티 언급 및 타스랑 비교 금지(이세돌 포함) <br>
                    5. 방송 분위기를 흐리는 언행 금지<br>
                    6. 방장이 허락 전까지 게임 훈수 및 스포성 채팅 모두 금지<br>
                    7. 정치/종교 발언 절대 금지(드립도 포함) <br>
                    8. 다른 방 분위기를 해치는 이모티콘 남용은 금지 <br>
                    9. 이모티콘 20개 이상 사용시 봇이 자동으로 도배처리 (임시차단이므로 당황하지마세요~) <br>
                    10. 링크(URL) 첨부는 요청 할 때만 허용 <br>
                    11. 전투메이드 밈은 아이네언니방의 158 대머리 밈과 흡사한 느낌입니다 하면 목이 잘립수도있습니다! <br>
                    *뇌절 금지 알잘딱 <br>
                    위 규칙들을 지키지 않았을 경우 즉시 밴 혹은 임시차단입니다! 방송 공지는 왁물원을 참고해주세요. <br>
                </div>
              </div>
            </div>`,
      // jururu
      `<div class="member_info_wrapper">
              <div class="member_info_contain">
              
                <!-- 소개 비디오 -->
                <div class="intro_video">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/sv5VaWp0keI?si=KTWJ5Fj9VLl2wVDF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                  <!-- 기본정보 -->
                <div class="member-summary-detail">
                  <div class="left">
                    <img src="source/profiles/jururu/ju_body.png" alt="" style="height: 400px;">
                  </div>
                  <div class="right">
                    <div class="info">
                      <h2>주르르(JURURU)</h2>
                      <span>출생 : 1997년 6월 10일 (27세)</span><br>
                      <span>거주지 : 부산광역시</span><br>
                      <span>신체 : 162.3cm[3]｜O형｜225mm</span><br>
                      <span>성별 : 여성</span><br>
                      <span>가족 : 부모님, 오빠(1989년생), 언니(1994년생)</span><br>
                      <span>반려견 : 반려묘 포리</span>
                      <span>상징색 : 분홍색</span><br>
                      <span>소속사 : 패러블 엔터테인먼트[운영]</span><br>
                      <span>소속 그룹 : 이세계아이돌</span><br>
                      <span>데뷔 : 2021년 이세계아이돌 싱글 1집 RE : WIND <br>
                        <pre>         (데뷔일로부터 +1203일, 3주년)</pre>
                      </span>
                      <span>첫 방송일 : 2018년 3월 14일</span>
                      <span>팬덤명 : 주폭도</span><br>
                      <span>MBTI : INTP</span><br>
                      <span>별명 : 르르땅, 주폭스, 코튼 등</span>
                      <img src="source/profiles/jururu/ju.webp" alt="" style="width: 140px;  background-color: white; border-radius: 10px;" >
                    </div>  
                    <div class="platform">
                      <div class="info">
                        <a href="https://www.youtube.com/@JU_RURU" target="_blank">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>주르르 유튜브</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@UnsealedJURURU">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>봉인 풀린 주르르</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@JURURU_dasibogi">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>주르르 다시보기</span>
                      </div>
                      <div class="info">
                        <a href="https://ch.sooplive.co.kr/cotton1217">
                          <img src="source/profiles/sns/soop.png" alt="">
                        </a>
                        <span>주르르</span>     
                      </div>
                    </div>

                  </div>
                </div>

                <div class="sum_video">
                  <img src="source/profiles/jururu/jururu.gif"></img>
                  <div class="greet">
                    <span>콘르르~</span><br>
                    <span>패러블 엔터테인먼트[운영] 소속 6인조 버츄얼 방송인 그룹 이세계아이돌의 멤버. 동시에 SOOP 스트리머이며, 버츄얼 유튜버이다.</span>
                  </div>
                </div>

                <div class="vocal">
                  <div class="ex">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/oRg-7iku6Ok?si=FYZp0mu-ywLzgQ_f" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="text">
                    <span>- 높은 톤과 밝은 음색의 목소리를 지닌 보컬로, 이런 점으로 하여금 K-POP 노래와 같은 장르에 자연스럽게 녹아드면서도 자신만의 특색을 보일 수 있는 가창이 가능하다.</span><br>
                    <span>- 특색 있는 목소리를 활용해 팀에서는 곡의 포인트가 될 만한 부분을 주로 담당한다. 감탄사, 나레이션 등 다양한 영역에서 귀에 콕 박히는 부분을 맛깔스럽게 소화한다.</span><br>
                  </div>
                </div>

                <div class="activities">
                  <div class="year">
                    <h2>2022년</h2>
                    <span>5월 16일 : <a href="https://www.youtube.com/watch?v=wmbN3BPIUbQ" target="_blank">Ju. T'aime</a></span>
                  </div>
                  <div class="year">
                    <h2>2023년</h2>
                    <span>11월 12일 : <a href="https://www.youtube.com/watch?v=y6mnUx580yQ" target="_blank">이세돌 풀더빙 미연시 1탄 (주르르편)</a></span><br>
                    <span>12월 23일 : <a href="https://www.youtube.com/watch?v=hJAXi4Zgm1E&feature=youtu.be" target="_blank">크리스마스 미니 콘서트⛄</a></span><br>
                  </div>
                  <div class="year">
                    <h2>2024년</h2>
                    <span>2월 13일 : <a href="https://www.youtube.com/watch?v=udB06Jvizu4&t=30s" target="_blank">아프리카TV 데뷔 방송</a></span><br>
                    <span>11월 14일 : <a href="https://www.youtube.com/watch?v=6U2WK6mA54U" target="_blank">주르르 연애 시뮬레이션 감독판</a></span><br>
                  </div>
                </div>

                <div class="subimg">
                  <img src="source/profiles/jururu/ju_sub.png" alt="">
                </div>

                <div class="rule">
                  <h2>방송규칙</h2>
                  <span>채팅 규칙<br>
                    🎀 기본 매너와 예의를 지킬 것<br>
                    🎀 신상 정보 질문 X<br>
                    🎀 서로 간의 닉네임 언급 X<br>
                    🎀 타 스트리머 언급 자제 (특히 비교 및 비난 금지)<br>
                    🎀 욕, 뇌절, 과몰입, 물타기 금지<br>
                    🎀 방송요일 랜덤 - 왁물원 이세돌 공지 게시판 봐주시길 바람<br>
                </div>

              </div>
            </div>`,
      // gosegu
      `<div class="member_info_wrapper">
              <div class="member_info_contain">
              
                <!-- 소개 비디오 -->
                <div class="intro_video">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/vWX_kkaw7fk?si=k4FADmDstd17qCdw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                  <!-- 기본정보 -->
                <div class="member-summary-detail">
                  <div class="left">
                    <img src="source/profiles/gosegu/go_body.png" alt="" style="height: 400px;">
                  </div>
                  <div class="right">
                    <div class="info">
                      <h2>고세구(GOSEGU)</h2>
                      <span>출생 : 1998년 (27세)</span><br>
                      <span>거주지 : 인천광역시</span><br>
                      <span>신체 : 	300m｜B형</span><br>
                      <span>성별 : 여성</span><br>
                      <span>가족 : 부모님, 남동생</span><br>
                      <span>상징색 : 하늘색</span><br>
                      <span>소속사 : 패러블 엔터테인먼트[운영]</span><br>
                      <span>소속 그룹 : 이세계아이돌</span><br>
                      <span>데뷔 : 2021년 이세계아이돌 싱글 1집 RE : WIND <br>
                        <pre>         (데뷔일로부터 +1203일, 3주년)</pre>
                      </span>
                      <span>첫 방송일 : 2021년 7월 27일</span><br>
                      <span>팬덤명 : 세균단</span><br>
                      <span>MBTI : ENTP</span><br>
                      <span>별명 : 세구세구, 고양이, 구스 등</span>
                      <img src="source/profiles/gosegu/go.svg" alt="" style="width: 140px;  background-color: white; border-radius: 10px;" >
                    </div>  
                    <div class="platform">
                      <div class="info">
                        <a href="https://www.youtube.com/channel/UCV9WL7sW6_KjanYkUUaIDfQ" target="_blank">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>고세구 유튜브</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/channel/UCSSPlgcyDA5eoN3hrkXpvHg">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>고세구의 좀 더</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/channel/UCc4qGj6d8LBXW2qZ9GZQWqQ">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>밥 친구 고세구</span>
                      </div>
                      <div class="info">
                        <a href="https://ch.sooplive.co.kr/gosegu2">
                          <img src="source/profiles/sns/soop.png" alt="">
                        </a>
                        <span>고세구!</span>     
                      </div>
                    </div>

                  </div>
                </div>

                <div class="sum_video">
                  <img src="source/profiles/gosegu/gosegu.gif"></img>
                  <div class="greet">
                    <span>하이 빵까루~~~!!</span><br>
                    <span>패러블 엔터테인먼트[운영] 소속 6인조 버츄얼 방송인 그룹 이세계아이돌의 멤버. 동시에 SOOP 스트리머이며, 버츄얼 유튜버이다.</span>
                  </div>
                </div>

                <div class="vocal">
                  <div class="ex">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/5qUwMpUWNLQ?si=noiSnZFHuZ1BQkxZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="text">
                    <span>- 맑고 청아한 음색이 특징인 보컬 스타일을 가지고 있으며, 밝고 활기찬 곡부터 중저음이 돋보이는 잔잔한 곡에 이르기까지 다양한 노래를 선보이고 있다.<br> 특유의 음색이 맑고 깨끗해서 듣기 편안하다고 좋아하는 팬들이 많으며, 데뷔곡 RE : WIND에서 가이드 보컬을 담당하였다.</span><br>
                  </div>
                  <div class="ex">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/de1OdGUVRys?si=jxzkvsNeII78hAsS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="text">
                    <span>- 또한 성우처럼 노래하는 것에 능한 편으로 호쇼 마린의 Ahoy, 시구레 우이의 로리신 레퀴엠 같은 전파곡과 여러가지 동요도 잘 소화한다.</span><br>
                    <span>- 빠른 노래를 부를 때도 가사가 정확히 들릴 정도로 발음이 정확하다. 농담 반 진담 반으로 이세계아이돌의 랩 담당 멤버로 불리기도 한다</span><br>
                  </div>
                </div>

                <div class="activities">
                  <div class="year">
                    <h2>2022년</h2>
                    <span>3월 21일 : <a href="https://www.youtube.com/watch?v=KdWPnX7HVCY" target="_blank">시청자 24000명과 함께한 VR 콘서트!</a></span><br>
                    <span>12월 18일 : <a href=https://www.youtube.com/watch?v=78_SbCuAhxA&feature=youtu.be" target="_blank">TOUR</a> 콘서트</span>
                  </div>
                  <div class="year">
                    <h2>2023년</h2>
                    <span>9월 10일 : <a href="https://www.youtube.com/watch?v=foq0NOD_go8&feature=youtu.be" target="_blank">GoReal </a>미니 콘서트</span><br>
                  </div>
                  <div class="year">
                    <h2>2024년</h2>
                    <span>1월 12일 : <a href="https://www.youtube.com/watch?v=ZO2hMSNWtmU" target="_blank">The Predator 2: FLEEKY SYNDROME</a>발매 (TOKYO 피처링)</span><br>
                    <span>2월 11일 : <a href="https://vod.sooplive.co.kr/player/115986767" target="_blank">GOSEGU 미니 콘서트</a></span><br>
                  </div>
                </div>

                <div class="subimg">
                  <img src="source/profiles/gosegu/go_sub.png" alt="">
                </div>

                <div class="rule">
                  <h2>방송규칙</h2>
                  <span>채팅 규칙
                    *벤서비스*<br>
                    -다들 오늘 하루 파이팅~ 웃어요 ^ㅁ^<br>
                    -신상정보 및 정치/종교 발언 금지<br>
                    -친목, 과도한 요청 또는 도배 금지<br>
                    -방송 분위기를 흐리는 언행 금지<br>
                    -타스, 타 커뮤니티 언급 및 비교 금지<br>
                    -중계(타스님께 중계도 포함), 선넘는 발언, 과몰입 금지<br>
                    -스포 및 추측성 물타기, 훈수 금지<br>
                    -병먹금 플리즈<br>
                    -방송공지는 왁물원을 참고해주세요<br>
                    -그외 알잘딱<br>
                </div>
              </div>
            </div>`,
      // viichan
      `<div class="member_info_wrapper">
              <div class="member_info_contain">
              
                <!-- 소개 비디오 -->
                <div class="intro_video">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/w0MblR-fL2M?si=rlY9JZ9uVfgnxokU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                  <!-- 기본정보 -->
                <div class="member-summary-detail">
                  <div class="left">
                    <img src="source/profiles/viichan/vi_body.png" alt="" style="height: 400px;">
                  </div>
                  <div class="right">
                    <div class="info">
                      <h2>비챤(VIICHAN)</h2>
                      <span>출생 : 2000년 1월 16일(25세)</span><br>
                      <span>거주지 : 경기도</span><br>
                      <span>신체 : 161cm[6]｜B형</span><br>
                      <span>성별 : 여성</span><br>
                      <span>가족 : 부모님</span><br>
                      <span>반려견 : 체리</span><br>
                      <span>상징색 : 스프링버드 / 진회색 / 코토리 베이지</span><br>
                      <span>소속사 : 패러블 엔터테인먼트[운영]</span><br>
                      <span>소속 그룹 : 이세계아이돌</span><br>
                      <span>데뷔 : 2021년 이세계아이돌 싱글 1집 RE : WIND <br>
                        <pre>         (데뷔일로부터 +1203일, 3주년)</pre>
                      </span>
                      <span>첫 방송일 : 2021년 5월 30일</span><br>
                      <span>팬덤명 : 라니</span><br>
                      <span>MBTI : ENTJ</span><br>
                      <span>별명 : 챠니, 납작복숭아, 장비챤 등</span>
                      <img src="source/profiles/viichan/vic.webp" alt="" style="width: 140px; background-color: white; border-radius: 5px;">
                    </div>  
                    <div class="platform">
                      <div class="info">
                        <a href="https://www.youtube.com/@viichan116" target="_blank">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>비챤 유튜브</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@viichan_nrna">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>비챤의 나랑놀아</span>
                      </div>
                      <div class="info">
                        <a href="https://www.youtube.com/@viichan_archive">
                          <img src="source/profiles/sns/youtube.svg" alt="">
                        </a>
                        <span>비챤의 무릉도원</span>
                      </div>
                      <div class="info">
                        <a href="https://ch.sooplive.co.kr/viichan6">
                          <img src="source/profiles/sns/soop.png" alt="">
                        </a>
                        <span>비챤</span>     
                      </div>
                    </div>

                  </div>
                </div>

                <div class="sum_video">
                  <img src="source/profiles/viichan/viichan.gif"></img>
                  <div class="greet">
                    <span>하이하이!</span><br>
                    <span>패러블 엔터테인먼트[운영] 소속 6인조 버츄얼 방송인 그룹 이세계아이돌의 멤버. 동시에 SOOP 스트리머이며, 버츄얼 유튜버이다.</span>
                  </div>
                </div>

                <div class="vocal">
                  <div class="ex">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/--Go33WYnqw?si=T-O6G0pNADpFGX2a" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div class="text">
                    <span>- 음색이 굉장히 독특하고 매력적이며 창법의 개성이 강한 보컬이다. 본격적인 노래 공부를 일본 노래로 한 티가 조금 나는데, 고음부에서 허스키하면서도 얇고 예쁜 톤을 유지하면서도 힘이 잘 붙는 편이다. 첫 음을 잡고 들어갈 때나 끝을 마무리할 때 특유의 스타일이 있으며 거슬린다는 느낌 없이 꽤 부드럽게 이어진다. 주로 드러나는 점은 끝 음의 모음을 'ㅣ'로 점점 변화시키는 것인데, 이는 볼빨간사춘기, 10cm의 노래에서 쉽게 들을 수 있는 발음이다.[27] 팬덤인 라니들 사이에선 비챤의 독특한 음색과 창법이 가장 큰 인기 요소로 꼽히는 편이다.</span><br>
                    <span>- 노래를 시작하면서 본인이 부른 노래를 녹음해서 계속 들어가며 연습했는데, 어느 순간 "내 목소리는 이런 소리를 내는 악기구나." 하고 깨달음을 얻은 뒤로 실력이 많이 올랐다고 한다.</span><br>
                    <span>- 이세계아이돌 멤버들 중에서 유일하게 음역이 메조 소프라노다.</span><br>
                    <span>- SOOP 첫방송에서 자신의 포지션을 음색요정 황금막내로 소개했다.</span><br>
                  </div>
                </div>

                <div class="activities">
                  <div class="year">
                    <h2>2024년</h2>
                    <span>2월 11일 : <a href="https://www.youtube.com/watch?v=UIHoQ-4ts38" target="_blank">아프리카 첫방송</a></span><br>
                    <span>8월 3일 : <a href="https://www.youtube.com/live/Ip1WwW0gwf4" target="_blank">역광</a>콘서트</span><br>
                    <span>11월 9일 : <a href="https://www.youtube.com/watch?v=eShncFDtVRw" target="_blank">V급밴드 미니 콘서트</a></span><br>
                  </div>
                </div>

                <div class="subimg">
                  <img src="source/profiles/viichan/vi_sub.png" alt="">
                </div>

                <div class="rule">
                  <h2>방송규칙</h2>
                  <span>채팅 규칙<br>
                    ✦신상정보 및 정치/종교 발언 금지<br>
                    ✦친목, 과도한 요청 또는 도배 금지<br>
                    ✦방송 분위기를 흐리는 언행 금지<br>
                    ✦타 스트리머, 타 커뮤니티 언급 및 비교 금지<br>
                    ✦도배, 중계, 물타기 및 선넘는 발언 금지<br>
                    ✦이모티콘 20개 이상 사용시 도배 처리<br>
                    ✦링크(URL) 첨부는 요청할때만 허용<br>
                    ✦방송공지는 왁물원을 참고해주세요<br>
                    ✦3살, 애기 관련 용어 언급 금지입니다<br>
                </div>

              </div>
            </div>`,
    ]);
    const slider = ref(null);
    const card = ref([]);
    const isPaused = ref(false);       // 마우스 오버 시 애니메이션 정지를 위한 플래그
    const positions = ref([]);         // 각 카드의 x좌표를 저장할 배열
    const speed = 0.7;  
    // 함수================================
    // Member Slider 기능
    const initMemberPage = async () => {
      await fetchAlbums();
      initMemberSlider();
    };
    const toggleMemberSliderCard = (index) => {
      memberSliderCards.value[index].videoMode =
        !memberSliderCards.value[index].videoMode;
    };
    // 앨범 데이터 가져오기
    const fetchAlbums = async () => {
      const { data, error } = await supabase
        .from("albums")
        .select("*")
        .order("idx", { ascending: true });
      if (error) {
        console.error("앨범 데이터 로드 에러:", error);
      } else {
        // Supabase에서 가져온 배열 전체를 albums에 저장
        albums.value = data;
        console.log(albums);
      }
    };
    const initMemberSlider = () => {
      nextTick(() => {
        const sliderEl = slider.value;
        const cardEls = card.value;
        if (!sliderEl || !cardEls || cardEls.length === 0) return;
        
        // 카드 너비 계산 (첫번째 카드의 너비 + margin-right 10px 포함)
        const cardWidth = cardEls[0].offsetWidth + 10;
        const totalCards = cardEls.length;
        positions.value = [];
        
        cardEls.forEach((el, index) => {
          positions.value[index] = index * cardWidth;
          el.style.transform = `translateX(${positions.value[index]}px)`;
        });

        // 기기 너비에 따른 추가 오프셋 설정 (모바일일 경우 값을 줄임)
        const additionalOffsetFactor = window.innerWidth <= 450 ? 138 : 210;
        
        // 애니메이션 루프: 카드 위치 업데이트 및 왼쪽 끝 이탈 시 카드 재배치
        const animate = () => {
          if (!isPaused.value) {
            for (let i = 0; i < totalCards; i++) {
              positions.value[i] -= speed;
              if (positions.value[i] < -cardWidth) {
                const maxPosition = Math.max(...positions.value);
                positions.value[i] = maxPosition + cardWidth;
              }
              cardEls[i].style.transform = `translateX(${positions.value[i] - ( i * additionalOffsetFactor)}px)`;
            }
          }
          requestAnimationFrame(animate);
        };
        animate();
      });
    };
    const showMemberInfo = (index) => {
      activeMemberInfo.value = index;
    };
//#endregion

//#region boardpage
    // 변수================================
    const boards = ref([]);
    const validCategories = ["news", "notice", "free", "suggest"];
    const fullPosts = ref({
      news: [],
      notice: [],
      free: [],
      suggest: [],
    });
    // board 종류별 현재 페이지 번호 (초기값 1)
    const currentFullPage = ref({
      news: 1,
      notice: 1,
      free: 1,
      suggest: 1,
    });
    const commentText = ref("");
    const boardCommentsList = ref([]);
    const currentBoardId = ref(null);

    // 함수================================
    const initBoardPage = () => {
      fetchBoards();
    };
    const fetchBoards = async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .order("idx", { ascending: false });
      if (error) {
        console.error("Error fetching boards:", error);
      } else if (data) {
        // 기본 그룹: 미리 정의한 네 가지 분류
        const grouped = {
          news: { type: "news", title: "NEWS", posts: [] },
          notice: { type: "notice", title: "공지사항", posts: [] },
          free: { type: "free", title: "자유게시판", posts: [] },
          suggest: { type: "suggest", title: "건의사항", posts: [] },
        };
        data.forEach((item) => {
          // boardKind 값 정제: 공백 제거 및 소문자 변환
          let rawKind = item.boardkind
            ? item.boardkind.trim().toLowerCase()
            : "";
          // 유효한 분류가 아니라면 기본값("news")로 설정
          const boardKind = validCategories.includes(rawKind)
            ? rawKind
            : "news";
          const subject = item.subject || "제목 없음";
          const writer = item.writer || "작성자 미상";
          const wdate = item.wdate || "날짜 미상";
          const content = item.content || "";
          const img = item.img || null; // 이미지 URL 추가

          grouped[boardKind].posts.push({
            id: item.idx,
            title: subject,
            writer: writer,
            wdate: wdate,
            content: content,
            img : img
          });
        });
        boards.value = Object.values(grouped);
      }
    };
    const totalPages = computed(() => {
      const pages = {};
      for (const key in fullPosts.value) {
        pages[key] = Math.ceil(fullPosts.value[key].length / 10);
      }
      return pages;
    });
    const paginatedFullPosts = computed(() => {
      return {
        news: fullPosts.value.news.slice(
          (currentFullPage.value.news - 1) * 10,
          currentFullPage.value.news * 10
        ),
        notice: fullPosts.value.notice.slice(
          (currentFullPage.value.notice - 1) * 10,
          currentFullPage.value.notice * 10
        ),
        free: fullPosts.value.free.slice(
          (currentFullPage.value.free - 1) * 10,
          currentFullPage.value.free * 10
        ),
        suggest: fullPosts.value.suggest.slice(
          (currentFullPage.value.suggest - 1) * 10,
          currentFullPage.value.suggest * 10
        ),
      };
    });
    const fetchFullPosts = async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .order("idx", { ascending: false });
      if (error) {
        console.error("Error fetching full posts:", error);
      } else if (data) {
        // fullPosts의 경우도 네 가지 분류를 미리 정의
        const grouped = {
          news: [],
          notice: [],
          free: [],
          suggest: [],
        };
        data.forEach((item) => {
          let rawKind = item.boardkind
            ? item.boardkind.trim().toLowerCase()
            : "";
          const boardKind = validCategories.includes(rawKind)
            ? rawKind
            : "news";
          const subject = item.subject || "제목 없음";
          const writer = item.writer || "작성자 미상";
          const wdate = item.wdate || "날짜 미상";
          const content = item.content || "";

          grouped[boardKind].push({
            id: item.idx,
            title: subject,
            writer: writer,
            wdate: wdate,
            content: content,
            img: item.img || null, // 이미지 URL 추가
          });
        });
        fullPosts.value = grouped;
      }
    };
    const showFullBoard = (type) => {
      switchPage(`page-board-full-${type}`);
    };
    const fetchBoardComments = async () => {
      if (!currentBoardId.value) return;
      const { data, error } = await supabase
        .from("boardcomments")
        .select("*")
        .eq("boardid", currentBoardId.value)
        .order("idx", { ascending: false })
        .limit(5);
      if (error) console.error("댓글 조회 오류:", error);
      else boardCommentsList.value = data;
    };

    // (3) 댓글 등록 함수
    const postComment = async () => {
      const text = commentText.value.trim();
      if (!text) return;

      // 1) 현재 테이블에서 가장 큰 idx 조회
      let newIdx = 1;
      const { data: rows, error: err1 } = await supabase
        .from("boardcomments")
        .select("idx")
        .order("idx", { ascending: false })
        .limit(1);
      if (!err1 && Array.isArray(rows) && rows.length > 0 && rows[0].idx != null) {
        newIdx = rows[0].idx + 1;
      }

      // 2) 새로운 idx와 함께 댓글 삽입
      const { error } = await supabase
        .from("boardcomments")
        .insert([{
          idx: newIdx,
          boardid: currentBoardId.value,
          comment: text
        }]);
      if (error) {
        console.error("댓글 등록 오류:", error);
      } else {
        commentText.value = "";
        fetchBoardComments();
      }
    };

    // (4) 모달 열 때 currentBoardId 세팅하고 댓글 초기화 & 조회
    const showPostModal = (post) => {
      modalTitle.value = post.title;
      modalMeta.value = `작성자: ${post.writer} | 작성일자: ${post.wdate}`;
      modalImage.value = post.img;
      modalBody.value = post.content;
      currentBoardId.value = post.id;   // selectBoard 값 저장
      commentText.value = "";
      fetchBoardComments();
      isModalActive.value = true;
    };
    
    // Full Board 페이지 기능
    const initFullBoardPage = (pageId) => {
      fetchFullPosts();
      console.log(`게시판 ${currentBoardId.value} 페이지로 이동`);
    };
    const changePage = (type, page) => {
      currentFullPage.value[type] = page;
    };
    const closeModal = () => {
      isModalActive.value = false;
    };
//#endregion

//#region playlistPage
    // 변수================================
    // 현재 선택된 플레이리스트 정보를 저장 (playlistAll 페이지에서 사용)
    const currentPlaylist = ref(null);
    const selectedPlaylistSongs = ref([]);
    const selectedPlaylistIdx = ref(null);
    // 플레이리스트 추가 모달 활성화 여부 (2-1)
    const isPlaylistAddModalActive = ref(false);
    // 플레이리스트 수정 모달 활성화 여부 (2-2)
    const isPlaylistEditModalActive = ref(false);
    // (추가) 새 플레이리스트 thumbnail 파일을 저장할 반응형 변수
    const newPlaylistThumbnail = ref(null);
    const currentPlaylistPlayList = ref([]);
    const allSongs = ref([]);
    const newplaylistName = ref("");

    const topSlider = ref(null);       // 슬라이더 컨테이너
    const topCards = ref([]);          // 모든 카드 엘리먼트
    const topPositions = ref([]);      // 카드별 x좌표
    const topSpeed = 0.5;              // 초당 이동 픽셀 수
    const isTopPaused = ref(false);    // 마우스 오버 시 일시정지

    const topSongs = ref([]);
    const isSongInfoModalActive = ref(false);
    const modalSong = ref({});
    const modalSongIndex = ref(null);
    const selectedScore = ref(null);
    const otherSongs = ref([]);
    let topSliderInitialized = false;
    // 함수================================
    // Playlist 페이지 기능
    const refreshPlaylistAll = async () => {
      // 1) playlists 테이블에서 최신 play_list 배열을 다시 가져오기
      await fetchPlaylists();
      // 2) 그 배열에 따라 곡 목록만 다시 로드
      await fetchSelectedPlaylistSongs();
    };

    const refreshPlaylists = async () => {
      await fetchPlaylists();
    };

    async function fetchTopSongs() {
      const { data, error } = await supabase
        .from('songs')
        .select('*, artist:artists(name)')
        .order('score', { ascending: false })
        .limit(10);
      if (!error) topSongs.value = data;
    }

    // 슬라이더 초기화 (member slider와 유사하게)
    function initTopSlider() {
      nextTick(() => {
        const cards = topCards.value;
        if (!cards.length === 0) return;
        const cardWidth = cards[0].offsetWidth + 10;
        cards.forEach((el, i) => {
          topPositions.value[i] = i * cardWidth;
          el.style.position = 'absolute';
          el.style.transform = `translateX(${topPositions.value[i]}px)`;
        });

        const additionalOffsetFactor = window.innerWidth <= 768 ? 856 : 160;

        function animate() {
          if (!isTopPaused.value) {
            for (let i = 0; i < cards.length; i++) {
              topPositions.value[i] -= topSpeed;
              if (topPositions.value[i] <= -cardWidth * (cards.length/2)) {
                topPositions.value[i] += cardWidth * (cards.length/2) + window.innerWidth + additionalOffsetFactor;
              }
              cards[i].style.transform = `translateX(${topPositions.value[i]}px)`;
            }
          }
          requestAnimationFrame(animate);
        }
        animate();
      });
    }

    // 마우스 오버 일시정지
    function pauseTopSlider() { isTopPaused.value = true; }
    function resumeTopSlider() { isTopPaused.value = false; }

    // 클릭 시 해당 곡만 Playbar에 세팅 및 재생
    function playTopSong(song) {
      currentPlaylist.value = { songs: [song] };
      currentSongIndex.value = 0;
      playbarPlaylist.value = [ song.mp3file ];
      repeatMode.value = true;
      playCurrentSong();
    }

    
    // Playlist 페이지 진입 시 Top10 + 슬라이더 초기화
    async function initPlaylistPage() {
      await fetchTopSongs();    // ← 새로 추가된 API 호출
      initTopSlider();          // 슬라이더 시작
      // ↓ 기존 로직 유지 ↓
      fetchPlaylists();
    }

    // 2. 플레이리스트 아이템 클릭 시 songs 및 아티스트 정보 가져오기
    const viewPlaylistAll = async (playlist) => {
      selectedPlaylistIdx.value = playlist.idx;
      // 페이지 전환 전에 플레이리스트 곡 & 전체 곡 로드
      await fetchSelectedPlaylistSongs();
      switchPage("page-playlist-all");
    };
    // 플레이리스트 추가 모달 열기/닫기 함수
    const openPlaylistAddModal = () => {
      isPlaylistAddModalActive.value = true;
    };
    const closePlaylistAddModal = () => {
      isPlaylistAddModalActive.value = false;
    };
    // (추가) 파일 입력 변경 시 파일 데이터를 저장하는 핸들러
    const handleThumbnailChange = (event) => {
      newPlaylistThumbnail.value = event.target.files[0];
    };
    // 플레이리스트 수정 모달 열기/닫기 함수
    const openPlaylistEditModal = async () => {
      // 현재 선택된 플레이리스트를 찾아 currentPlaylist에 저장
      currentPlaylist.value = playlists.value.find(pl => pl.idx === selectedPlaylistIdx.value) || {};
      // 기존 play_list 값이 배열로 존재하면 복사, 없으면 빈 배열로 초기화
      currentPlaylistPlayList.value = currentPlaylist.value.play_list ? [...currentPlaylist.value.play_list] : [];
      // Supabase에서 모든 노래 목록 fetch
      await fetchAllSongs();
      isPlaylistEditModalActive.value = true;
    };

    const savePlaylistChanges = async () => {
      // checked된 노래 idx 배열은 currentPlaylistPlayList.value에 저장되어 있음 (예: [1,2,3,4,5])
      const { error } = await supabase
        .from("playlists")
        .update({ play_list: currentPlaylistPlayList.value })
        .eq("idx", selectedPlaylistIdx.value);
      if (error) {
        console.error("플레이리스트 업데이트 오류:", error);
      } else {
        console.log("플레이리스트 업데이트 성공:", currentPlaylistPlayList.value);
        // 업데이트 성공 시 모달 닫기 및 필요 시 플레이리스트 목록 재갱신
        isPlaylistEditModalActive.value = false;
        // 예: await fetchPlaylists();
      }
    };

    const closePlaylistEditModal = () => {
      isPlaylistEditModalActive.value = false;
    };
    const addNewPlaylist = async () => {
      newplaylistName.value = document.querySelector('#newPLName').value;
      try {
        // 현재 playlists 배열에서 최대 idx 값을 찾고 새 idx 계산
        let maxIdx = 0;
        playlists.value.forEach(pl => {
          if (pl.idx > maxIdx) {
            maxIdx = pl.idx;
          }
        });
        const newIdx = maxIdx + 1;

        // 파일이 선택되지 않았으면 경고 후 종료
        const file = newPlaylistThumbnail.value;
        if (!file) {
          alert("썸네일 파일을 선택하세요.");
          return;
        }

        // Supabase Storage에 thumbnail 업로드 (버킷 이름은 "playlists")
        // 파일명은 새 idx와 원래 파일명을 결합하여 고유하게 함
        const filePath = `${newIdx}-${file.name}`;
        let { error: uploadError } = await supabase
          .storage
          .from("playlists")
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        // 업로드된 파일의 public URL 획득 (반환 값 수정: data.publicUrl 사용)
        const { data: urlData, error: urlError } = supabase
          .storage
          .from("playlists")
          .getPublicUrl(filePath);
        if (urlError) throw urlError;
        const publicURL = urlData.publicUrl;  // 수정된 부분

        // Supabase의 playlists 테이블에 새 플레이리스트 행 삽입
        let { error: insertError } = await supabase
          .from("playlists")
          .insert([{ idx: newIdx, name: newplaylistName.value, thumbnail: publicURL }]);
        if (insertError) throw insertError;

        

        // playlists 데이터를 새로고침
        await fetchPlaylists();
        // 모달 닫기 및 입력값 초기화
        closePlaylistAddModal();
        newPlaylistName.value = "";
        newPlaylistThumbnail.value = null;
      } catch (err) {
        console.error("플레이리스트 추가 에러:", err);
      }
    };
    const fetchSelectedPlaylistSongs = async () => {
      // playlists는 이미 Supabase에서 전체 플레이리스트를 불러온 배열로 가정합니다.
      const selectedPlaylist = playlists.value.find(
        (pl) => pl.idx === selectedPlaylistIdx.value
      );
      if (selectedPlaylist) {
        const { data, error } = await supabase
          .from("songs")
          // artistID → artists.id 관계 매핑
          .select("*, artist:artists(name)")
          .in("idx", selectedPlaylist.play_list)
          .order("artist");
        if (error) {
          console.error("선택한 플레이리스트 노래 로드 에러:", error);
        } else {
          selectedPlaylistSongs.value = data;
          await fetchAllSongs();
        }
      } else {
        console.error("선택한 플레이리스트를 찾을 수 없습니다.");
      }
    };
    const fetchAllSongs = async () => {
      const { data, error } = await supabase
        .from("songs")
        // artistID → artists.id 관계, 이름(name)만 가져오기
        .select("*, artist:artists(name)")
        .order("artist");
      if (error) {
        console.error("노래 목록 가져오기 오류:", error);
      } else {
        allSongs.value = data;
      } 
    };

    function showSongInfoModal(index) {
      modalSongIndex.value = index;
      modalSong.value = selectedPlaylistSongs.value[index];
      // 현재 곡 제외한 다른 노래 목록
      otherSongs.value = allSongs.value.filter(s => s.idx !== modalSong.value.idx);
      selectedScore.value = null;
      isSongInfoModalActive.value = true;
    }
    function closeSongInfoModal() {
      isSongInfoModalActive.value = false;
      selectedScore.value = 0;
    }
    async function saveVote() {
      // 1) 세션 스토리지에 투표 여부 확인
      const key = `voted_${modalSong.value.idx}`;
      if (sessionStorage.getItem(key)) {
        alert('이미 이 곡에 투표하셨습니다.');
        return;
      }
      if (!selectedScore.value) return;

      // 2) 기존 투표 로직
      const newPart = modalSong.value.part + 1;
      const newScore = (modalSong.value.score + selectedScore.value) / newPart;
      const { error } = await supabase
        .from('songs')
        .update({ score: newScore, part: newPart })
        .eq('idx', modalSong.value.idx);

      if (error) {
        console.error('Vote 저장 오류:', error);
      } else {
        // 3) UI 반영 및 세션에 투표 기록
        modalSong.value.score = newScore;
        modalSong.value.part = newPart;
        sessionStorage.setItem(key, 'true');
      }
    }


    function toggleScore(n) {
      selectedScore.value = selectedScore.value === n ? 0 : n;
    }

    function openModalSong(song) {
      // 모달에 표시할 곡 교체
      modalSong.value = song;
      modalSongIndex.value = 0;
      // 점수 초기화
      selectedScore.value = 0;
      // 다시 ‘다른 곡 목록’ 갱신
      otherSongs.value = allSongs.value.filter(s => s.idx !== song.idx);
    }

    // 모달에서 Play 클릭 시 해당 곡만 재생
    function playModalSong() {
      // currentPlaylist에 모달 곡 하나만 넣고
      currentPlaylist.value = { songs: [ modalSong.value ] };
      currentSongIndex.value = 0;
      // playbarPlaylist도 mp3파일 경로 하나만
      playbarPlaylist.value = [ modalSong.value.mp3file ];
      repeatMode.value = true;
      // 즉시 재생
      playCurrentSong();
    }

    //#endregion

//#region playbar
    // 변수================================
    const playlists = ref([]);
    // Playbar 데이터 및 오디오 객체
    const audio = new Audio(); // 초기 src 없이 생성
    const playbarPlaylist = ref([]); // mp3파일 URL 배열
    const currentSongIndex = ref(0);
    const isPlaying = ref(false);
    const progress = ref(0);
    const volume = ref(20);
    const repeatMode = ref(false);

    const originalPlaylistSongs = ref([]);
    const isRandomMode = ref(false);
    
    // 함수================================   
    const goToPlaylistPage = () => {
      switchPage("page-playlist");
    };
    const fetchPlaylists = async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .order("idx", { ascending: true });
      if (error) {
        console.error("플레이리스트 로드 에러:", error);
      } else {
        playlists.value = data;
      }
    };
    // 1. 특정 플레이리스트의 mp3파일 배열 생성 (기본값: idx 1)
    // 전체 fetchPlaybarPlaylist 함수 (JavaScript)
    const fetchPlaybarPlaylist = async (playlistId) => {
      const { data: plData, error: plError } = await supabase
        .from("playlists")
        .select("*")
        .eq("idx", playlistId)
        .single();
      if (plError) {
        console.error("플레이리스트 로드 에러:", plError);
      } else if (plData) {
        const playListArr = plData.play_list;
        const { data: songsData, error: sError } = await supabase
          .from("songs")
          // artistID → artists.id 관계, 이름(name)까지 가져오기
          .select("idx, mp3file, thumbnail, title, artist:artists(name)")
          .in("idx", playListArr);
        if (sError) {
          console.error("노래 mp3파일 조회 에러:", sError);
        } else {
          // Supabase에서 가져온 순서대로 정렬
          const sortedSongs = playListArr.map((songIdx) =>
            songsData.find((s) => s.idx === songIdx)
          );

          // 플레이바에 사용할 mp3 파일 URL 배열 업데이트
          playbarPlaylist.value = sortedSongs.map((song) =>
            song ? song.mp3file : null
          );

          // 재생 인덱스 및 재생 목록 상태 업데이트
          currentSongIndex.value = 0;
          currentPlaylist.value = { songs: sortedSongs };

          playCurrentSong();

        }
      }
    };

    // Playbar 기능
    const initPlaybar = () => {
      audio.volume = volume.value / 100;
      audio.addEventListener("timeupdate", updateProgress);

      audio.addEventListener("ended", () => {
        if (repeatMode.value) {
          // 현재 곡만 반복 재생
          playCurrentSong();
        } else {
          nextSong(); 
        }
      });
    };

    const updateProgress = () => {
      const current = audio.currentTime;
      currentTime.value = current;
      const duration = audio.duration || 216;
      progress.value = (current / duration) * 100;
    };

    const elapsedTime = computed(() => {
      const current = currentTime.value;
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    });

    const remainingTime = computed(() => {
      const duration = audio.duration || 216;
      const current = currentTime.value;
      const remaining = duration - current;
      const minutes = Math.floor(remaining / 60);
      const seconds = Math.floor(remaining % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    });

    const playPauseIcon = computed(() =>
      isPlaying.value ? "source/pause.png" : "source/play.png"
    );
    const repeatIcon = computed(() =>
      repeatMode.value ? "source/repeat-active.png" : "source/repeat.png"
    );

    const togglePlayPause = () => {
      if (isPlaying.value) {
        audio.pause();
      } else {
        audio.play();
      }
      isPlaying.value = !isPlaying.value;
    };

    // 2. 재생 함수 및 prev/next 함수
    const playCurrentSong = () => {
      if (
        currentPlaylist.value &&
        currentPlaylist.value.songs &&
        currentPlaylist.value.songs.length > 0
      ) {
        audio.src =
          currentPlaylist.value.songs[currentSongIndex.value].mp3file;
        console.log(
          "current : " +
            currentPlaylist.value.songs[currentSongIndex.value].mp3file
        );
        audio
          .play()
          .then(() => {
            isPlaying.value = true;
          })
          .catch((err) => console.error("Audio play error:", err));
      }
    };

    const prevSong = () => {
      if (currentSongIndex.value > 0) {
        currentSongIndex.value--;
        playCurrentSong();
      }
    };

    const nextSong = () => {
      if (currentSongIndex.value < playbarPlaylist.value.length - 1) {
        currentSongIndex.value++;
        playCurrentSong();
      }
    };
    // 3. playlistAll 페이지에서 노래 클릭 시 playbar 업데이트 및 재생 시작
    const playSongFromPlaylist = (playlistIdx) => {
      const pl = playlists.value.find(p => p.idx === playlistIdx);
      if (!pl?.play_list?.length) return;

      // allSongs에는 artist.name까지 함께 들어 있음
      const songsArr = pl.play_list
        .map(songIdx => allSongs.value.find(s => s.idx === songIdx))
        .filter(Boolean);

      if (!songsArr.length) return;

      currentPlaylist.value = { songs: songsArr };
      currentSongIndex.value = 0;
      playbarPlaylist.value = songsArr.map(song => song.mp3file);
      playCurrentSong();
    };

    // 랜덤 재생 기능: playbarPlaylist 배열을 Fisher-Yates 알고리즘으로 무작위 섞기
    function shuffleArray(array) {
      let newArray = array.slice();
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    }
    // 수정된 toggleRandom 함수: 클릭 시 currentPlaylist.songs를 셔플하고, playbarPlaylist를 재구성합니다.
    const toggleRandom = () => {
      isRandomMode.value = !isRandomMode.value;
      if (isRandomMode.value) {
        // 원본 순서가 아직 저장되지 않았다면 저장
        if (
          !originalPlaylistSongs.value.length &&
          currentPlaylist.value &&
          currentPlaylist.value.songs
        ) {
          originalPlaylistSongs.value = currentPlaylist.value.songs.slice();
        }
        if (currentPlaylist.value && currentPlaylist.value.songs) {
          const shuffledSongs = shuffleArray(currentPlaylist.value.songs);
          currentPlaylist.value.songs = shuffledSongs;
          playbarPlaylist.value = shuffledSongs.map((song) => {
            return {
              mp3file: song.mp3file,
              title: song.title,
              thumbnail: song.thumbnail,
              artist:
                song.artist && song.artist.name
                  ? song.artist.name
                  : "Unknown Artist",
            };
          });
          currentSongIndex.value = 0;
          playCurrentSong();
        }
      } else {
        // 랜덤 모드 해제 시 원본 순서를 복원
        if (originalPlaylistSongs.value.length && currentPlaylist.value) {
          currentPlaylist.value.songs = originalPlaylistSongs.value.slice();
          playbarPlaylist.value = originalPlaylistSongs.value.map((song) => {
            return {
              mp3file: song.mp3file,
              title: song.title,
              thumbnail: song.thumbnail,
              artist:
                song.artist && song.artist.name
                  ? song.artist.name
                  : "Unknown Artist",
            };
          });
          currentSongIndex.value = 0;
          playCurrentSong();
        }
      }
    };
    const toggleRepeat = () => {
      repeatMode.value = !repeatMode.value;
    };

    const seek = () => {
      const duration = audio.duration || 216;
      audio.currentTime = (progress.value / 100) * duration;
    };
    const setVolume = () => {
      audio.volume = volume.value / 100;
    };

    const pause = () => {
      isPaused.value = true;
    };

    const resume = () => {
      isPaused.value = false;
    };
//#endregion
    
    onMounted(async () => {
      // 1) 로딩 시작 타이밍 기록
      const startTime = performance.now();

      // 2) 메인 페이지 렌더링에 필요한 데이터 로드
      await initMainPage();

      // 3) 로드에 걸린 시간 계산
      const loadDuration = performance.now() - startTime + 3000; // 로딩 시간 추가

      // 4) 그 시간만큼 프로그레스바 채우기
      initLoadingPage(loadDuration);
      await new Promise(resolve => {
        const check = setInterval(() => {
          if (loadingPercent.value >= 100) {
            clearInterval(check);
            resolve();
          }
        }, 50);
      });

      switchPage("page-main");
      document.body.style.overflow = "";
      fetchPlaybarPlaylist(1);
    });

    return {
      allSongs,
      currentPlaylistPlayList,
      awardCards,
      selectedPlaylistIdx,
      selectedPlaylistSongs,
      currentPage,
      loadingPercent,
      showDetail,
      memberImages,
      memberInfo,
      memberColor,
      isSongTitlesVisible,
      isFooterVisible,
      isModalActive,
      modalTitle,
      modalMeta,
      modalBody,
      activeVideoCard,
      activeMemberInfo,
      members,
      songs,
      videoCards,
      memberSliderCards,
      memberIcons,
      memberInfos,
      boards,
      validCategories,
      fullPosts,
      totalPages,
      currentFullPage,
      paginatedFullPosts,
      progress,
      volume,
      elapsedTime,
      remainingTime,
      playPauseIcon,
      repeatIcon,
      sliders,
      newplaylistName,
      slider,
      card,
      albums,
      activeVideoCard,
      playlists,
      currentPlaylist,
      isPlaylistEditModalActive,
      isPlaylistAddModalActive,
      currentSongIndex,
      isRandomMode,
      originalPlaylistSongs,
      newPlaylistThumbnail,
      modalImage,
      isSongInfoModalActive,
      modalSong,
      modalSongIndex,
      selectedScore,
      otherSongs,
      commentText,
      boardCommentsList,
      topSongs,
      topSongs, topSlider, topCards,newCp,
  fetchTopSongs, initTopSlider, playTopSong,
  pauseTopSlider, resumeTopSlider,
      fetchBoardComments,
      postComment,
      showSongInfoModal,
      closeSongInfoModal,
      saveVote,
      pause,
      resume,
      savePlaylistChanges,
      handleThumbnailChange,
      addNewPlaylist,
      shuffleArray,
      fetchPlaylists,
      goToPlaylistPage,
      viewPlaylistAll,
      openPlaylistAddModal,
      closePlaylistAddModal,
      openPlaylistEditModal,
      closePlaylistEditModal,
      switchPage,
      showMemberDetail,
      hideMemberDetail,
      showSongTitles,
      hideSongTitles,
      onVideoCardClick,
      onCloseVideoCard,
      toggleMemberSliderCard,
      showMemberInfo,
      showPostModal,
      closeModal,
      showFullBoard,
      changePage,
      togglePlayPause,
      prevSong,
      nextSong,
      toggleRandom,
      toggleRepeat,
      seek,
      setVolume,
      onVideoCardClick,
      onCloseVideoCard,
      playSongFromPlaylist,
      fetchSelectedPlaylistSongs,
      toggleScore,
      openModalSong,
      playModalSong,
      refreshPlaylists,
      refreshPlaylistAll,
    };
  },
});
app.use(router);
app.mount("#app");