# **IsegyeIDOL Dom_Info <수정중>**
<!--프로젝트 메인 이미지-->
![Project Title](readme_img/members.png)

<hr>

### **<주의> 해당 페이지의 모든 Source는 이세계 아이돌에게 저작권이 있습니다.**
  
<!--목차-->
## 목차
- [**Project**](#project)
    - [Features](#features)
    - [Techniques](#techniques)
    - [Distribution](#distribution)
- [**Page**](#page)
    - [Fixed Element](#fixed-element)
    - [Main Page](#main-page)
    - [Member Page](#member-page)
    - [Board Page](#board-page)
    - [Playlist Page](#playlist-page)
    - [WatchParty Page](#watchparty-page)
- [**Contact**](#contact)

<hr>

<!--프로젝트 설명-->
## **Project**
- 해당 프로젝트는 인터넷 방송인 그룹 **이세계 아이돌**의 5월 24일 고척돔 공연 축하를 위해 제작되었습니다.
- AI의 사용법 및 적응을 위해 80% 정도 AI를 이용하여 프로젝트를 진행하였으며 주로 GPT와 GROK을 이용하였습니다.
- 해당 프로젝트는 **이세계 아이돌 멤버들의 정보**와 **오리지널 곡 및 커버곡**, 다같이 영상 시청을 위한 **WatchParty**기능이 구현되어 있습니다.

### **Features**
- ServerLess로 개발되어 있으며 Database는 PostgreSQL을 사용하는 Supabase를 이용하였습니다.
- admin페이지를 이용한 데이터 수정, 삭제, 생성이 가능합니다.
- 정보 페이지들은 정보 전달이 주 목적이기 때문에 다양한 interaction이 적용되어 있습니다.
- Playlist페이지는 여러 음악 감상을 위한 기본 Playlist와 자유롭게 Customizing할 수 있도록 작업되어 있습니다.
- WatchParty는 supabase의 realtime을 이용하여 실시간으로 채팅 및 host 여부를 파악할 수 있습니다.

### **Techniques**
- [**HTML5, CSS3, JavaScript**]
- <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
- [**Vue.js (3버전)** ]
- <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=Vue.js&logoColor=white"/>
- [**Supabase**]
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
- [**Visual Studio Code**]
- ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

### **Distribution**
- URL : <a href="http://isedolinfo.dothome.co.kr">이세계 아이돌</a>
<hr>

<!--각 페이지 설명-->
## **Page**

### **Fixed Element**
> Nav
- 좌측 : 로고
- 중앙 : 페이지 이동
- 우측 : 기본 프로필 및 WatchParty 이동을 위한 button

> Playbar
- 노래 재생을 위한 목적으로 제작되어 있으며 기본 playlist는 **이세계 아이돌**의 단체 오리지널 곡 및 커버곡으로 구성되어있습니다.
- Left : 재생 중인 곡의 기본 정보 [ 앨범커버, 제목, 가수 ]
- Center : 음악 재생 조절을 위한 Progressbar 및 버튼
- Right : 볼룸 조절을 위한 ProgressBar와 수치 표시

<hr>

### **Main Page**
![Main Page](readme_img/main.png)
- **Main Page**입니다. 해당 페이지는 로딩페이지에서 로드 직후 출력되는 페이지 입니다.
> 섹션 단위
- 1 section : 상단 배너로 이는 상업적으로 이용할 경우 광고를 출력하기 위한 공간입니다.
- 2 section : 각 멤버들의 정보를 간략하게 출력합니다.
- 3 section : 최신곡을 기준으로 title, youtube url, naver cafe, 가사 일부 를 출력합니다.
- 4 section : 각 멤버들의 최신 영상을 출력하며 이는 매일 오후 8시마다 갱신됩니다. 클릭하면 해당 섹션을 전체로 영상이 출력됩니다.
- 5 section : reward를 무한 슬라이더로 정의해 놓았습니다.
- Footer

<hr>

### **Member Page**
![Member Page](readme_img/member.png)
- **Member Page**입니다. **이세계 아이돌의 앨범아트** 및 **이세계 아이돌 멤버의 상세 정보**를 출력합니다.
- 정보는 JavaScript에 저장되어 있으며 멤버 별 이미지를 클릭하는 경우 하단 정보가 변경됩니다.

<hr>

### **Board page**
![Board Detail Page](readme_img/board.png)
- **Board page**입니다. 각 News, 공지사항, 자유게시판, 건의사항 으로 구성되어 있습니다.
> Type
- News : 새로운 정보를 교환하는 게시판입니다.
- 공지사항 : 수정 내역 및 공지를 위한 게시판입니다.
- 자유게시판 : 이용자들의 의견을 교환하기 위한 게시판입니다.
- 건의사항 : 이용자들이 이용 중 건의사항을 제보하기 위한 게시판입니다

<hr>

### **Playlist Page**
![Playlist Page](readme_img/playlist.png)
-  **Playlist Page**입니다. 이용자의 투표를 통해 높은 점수를 가진 음악 top 10을 무한슬라이드로 출력됩니다.
-  기본 플레이리스트 및 추가적으로 플레이 리스트를 생성할 수 있습니다.

![Playlist Page_detail](readme_img/playlist_detail.png)
-  **Playlist Datail Page**입니다. 해당 플레이리스트의 수정 및 삭제가 가능합니다.
-  해당 노래를 클릭하여 해당 단일 곡 재생 및 투표, 점수를 확인할 수 있습니다.

<hr>

### **WatchParty Page**
![WatchParty Page](readme_img/watchparty.png)
-  **WatchParty Page**입니다. 해당 페이지는 사용자가 같이 공유 및 채팅을 진행하면서 영상 공유를 원할 경우 같이 보기 위한 페이지입니다.
-  Supabase의 realtime기능을 이용하여 실시간으로 동기화 되도록 처리하였습니다. 
-  영상은 유튜브의 영상이 기준이며 host가 영상을 재생한 후 sync버튼을 통해 시청자는 영상을 시청할 수 있습니다.

<hr>

<!--접근-->
## **Contact**
- 📧  **wodnd565@gmail.com**
