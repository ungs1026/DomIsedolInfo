import pandas as pd
import random
from datetime import datetime, timedelta

# Helper to generate random date
def random_date(start, end):
    return start + timedelta(days=random.randint(0, (end - start).days))

# Base columns
columns = [
    "contentID", "contentType", "title", "originTitle", "description", "releaseDate",
    "releaseYear", "publicDate", "runtime", "thumbnailURL", "mainImage",
    "originLang", "productionCountry", "registeredAt", "updatedAt",
    "availableCountry", "videoQuality"
]

# Known Netflix content released in 2024 (mocked based on known or plausible content)
contents_2024 = [
    ("영화", "댐셀", "Damsel", "공주가 된 소녀가 용에게 제물로 바쳐지며 벌어지는 판타지 스릴러", "2024-03-08", 110, "영어", "미국", "HD"),
    ("영화", "레벨 16", "Level 16", "엄격한 기숙학교에서의 미스터리한 사건을 다룬 SF 스릴러", "2024-02-23", 102, "영어", "캐나다", "HD"),
    ("영화", "리벨 문", "Rebel Moon – Part Two", "은하계를 지키기 위한 반란군의 마지막 전투", "2024-12-15", 122, "영어", "미국", "4K"),
    ("영화", "더 키스 리스트", "The Kissing List", "한 여성이 만든 리스트가 로맨스를 뒤흔든다", "2024-06-19", 99, "영어", "미국", "HD"),
    ("영화", "밀수 작전", "Operation Mincemeat", "2차 세계대전 속 기밀 작전을 다룬 영화", "2024-09-03", 128, "영어", "영국", "HD"),
    ("드라마", "3바디 문제", "3 Body Problem", "중국 소설을 원작으로 한 외계 문명과의 충돌 이야기", "2024-03-21", 55, "영어", "미국", "4K"),
    ("드라마", "보디가드 시즌2", "Bodyguard S2", "정치 스릴러 드라마의 새로운 시즌", "2024-07-17", 60, "영어", "영국", "HD"),
    ("드라마", "에밀리, 파리에 가다 시즌4", "Emily in Paris S4", "패션 마케팅 전문가의 파리 생활", "2024-09-01", 32, "영어", "미국", "HD"),
    ("드라마", "오징어 게임 시즌2", "Squid Game S2", "생존 게임의 충격적인 귀환", "2024-11-11", 62, "한국어", "대한민국", "4K"),
    ("드라마", "아웃랜더 시즌8", "Outlander S8", "시간 여행 로맨스의 마지막 시즌", "2024-05-09", 58, "영어", "영국", "HD"),
]

# Netflix content known/planned for 2025 (mocked/future-forecasted)
contents_2025 = [
    ("영화", "애프터 어스2", "After Earth 2", "미래 지구를 배경으로 하는 SF 생존 드라마", "2025-01-20", 116, "영어", "미국", "HD"),
    ("영화", "인비저블 리턴", "Invisible Return", "투명인간이 된 주인공의 복수극", "2025-02-22", 105, "영어", "미국", "HD"),
    ("영화", "시공간의 틈", "Crack in Time", "시간 여행이 불러오는 혼란과 로맨스", "2025-03-10", 118, "영어", "영국", "4K"),
    ("영화", "스노우하트", "Snowheart", "알프스 설원에서 펼쳐지는 생존과 사랑", "2025-04-01", 111, "독일어", "독일", "HD"),
    ("영화", "더 라스트 코드", "The Last Code", "인공지능 시대의 윤리를 다룬 기술 스릴러", "2025-01-03", 127, "영어", "미국", "4K"),
    ("드라마", "에덴의 끝", "End of Eden", "디스토피아에서 펼쳐지는 인간 군상", "2025-01-13", 56, "영어", "미국", "HD"),
    ("드라마", "노바 시즌1", "Nova", "우주 탐사대의 모험과 내면 갈등", "2025-02-09", 60, "영어", "미국", "4K"),
    ("드라마", "베를린의 봄", "Spring in Berlin", "냉전 시대의 베를린에서 벌어지는 첩보전", "2025-03-29", 53, "독일어", "독일", "HD"),
    ("드라마", "서울 크로니클", "Seoul Chronicle", "근미래 서울에서의 사이버범죄 수사극", "2025-02-19", 50, "한국어", "대한민국", "HD"),
    ("드라마", "디코딩", "Decoding", "신비한 상징을 둘러싼 미스터리 추적극", "2025-04-05", 55, "영어", "영국", "HD"),
]

# Combine and construct data rows
all_new_data = contents_2024 + contents_2025
csv_rows = []

for i, entry in enumerate(all_new_data, start=16):
    contentType, title, originTitle, description, releaseDate, runtime, originLang, productionCountry, videoQuality = entry
    releaseDate_dt = datetime.strptime(releaseDate, "%Y-%m-%d")
    releaseYear = releaseDate_dt.year
    publicDate = releaseDate
    thumbnailURL = f"img/content/sub{title}.jpg"
    mainImage = f"img/content/{title}.jpg"
    registeredAt = random_date(datetime(2022, 1, 1), datetime(2025, 2, 1))
    updatedAt = random_date(max(registeredAt, datetime(2023, 1, 1)), datetime(2025, 4, 1))
    availableCountry = productionCountry

    csv_rows.append([
        i, contentType, title, originTitle, description, releaseDate, releaseYear,
        publicDate, runtime, thumbnailURL, mainImage, originLang, productionCountry,
        registeredAt.strftime("%Y-%m-%d"), updatedAt.strftime("%Y-%m-%d"),
        availableCountry, videoQuality
    ])

# Create DataFrame
df = pd.DataFrame(csv_rows, columns=columns)

# Save as CSV
csv_path = "/mnt/data/netflix_content_updated.csv"
df.to_csv(csv_path, index=False)

csv_path
