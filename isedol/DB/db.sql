-- 슬라이드
create table sliders (
  idx int not null primary key,
  name varchar(50) default '',
  url varchar(200) default '',
  img varchar(255) default '',
  sdate date,
  edate date
);
insert into sliders values (1, 'test', 'https://www.naver.com', 'first.jpg', '2025-01-05', '2025-04-01');
insert into sliders values (2, 'test2', 'https://www.naver.com', 'second.jpg', '2025-02-05', '2025-04-01');
insert into sliders values (3, 'test3', 'https://www.naver.com', 'first.jpg', '2025-02-05', '2025-08-01');
insert into sliders values (4, 'test4', 'https://www.naver.com', 'second.jpg', '2025-03-05', '2025-07-01');
insert into sliders values (5, 'test5', 'https://www.naver.com', 'first.jpg', '2025-03-05', '2025-06-01');


-- video thumbnail
create table videoThumbnails(
  idx int not null primary key,
  name varchar(30) default '',
  img varchar(100) default ''
);

insert into videoThumbnails values 
(1, 'ine', 'ine.jpg'),
(2, 'jingburger', 'jingburger.jpg'),
(3, 'lilpa', 'lilpa.jpg'),
(4, 'jururu', 'jururu.jpg'),
(5, 'gosegu', 'gosegu.jpg'),
(6, 'viichan', 'viichan.jpg');


-- group song
create table albums(
  idx int not null primary key,
  name varchar(30) default '',
  img varchar(100) default '',
);

alter table albums add column img varchar(100) default ''; 

insert into albums values (1, 'rewind', 'rewind.png');
insert into albums values (2, 'winer', 'winer.png');
insert into albums values (3, 'kidding', 'kidding.png');
insert into albums values (4, 'lockdown', 'lockdown.png');
insert into albums values (5, 'anotherworld', 'anotherworld.png');
insert into albums values (6, 'superhero', 'superhero.png');
insert into albums values (7, 'over', 'over.png');
insert into albums values (8, 'syzygy', 'syzygy.png');

-- board 4개
create table boards(
  idx int not null primary key,
  boardKind varchar(50) default '',
  title varchar(200) default '',
  writer varchar(50) default '',
  wdate date,
  content varchar(5000) default ''
);
alter table boards alter column content type varchar(5000);

INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(1, 'free', 'A New Beginning in Life', 'Alice', '2016-03-12', 'The sun rises over the horizon. New opportunities emerge with each dawn.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(2, 'free', 'Exploring the Depths of Creativity', 'Bob', '2018-07-21', 'Creative minds find solace in art. The world becomes a canvas of ideas.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(3, 'free', 'Uncovering Hidden Treasures', 'Charlie', '2020-11-05', 'Every day holds a secret waiting to be revealed. Curiosity drives us to explore.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(4, 'free', 'Journey Through the Mountains', 'Diana', '2017-04-18', 'The rugged paths teach resilience. Nature offers wisdom in silence.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(5, 'free', 'Digital Transformation in Modern Era', 'Eve', '2019-09-10', 'Technology reshapes our daily lives. Innovation fuels progress.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(6, 'free', 'Reflections on a Quiet Evening', 'Frank', '2015-12-30', 'Moments of stillness capture the soul. Thoughts flow like gentle streams.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(7, 'free', 'A Walk in the Urban Jungle', 'Grace', '2021-06-25', 'City lights reveal hidden stories. The rhythm of life pulses in every corner.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(8, 'free', 'Melodies of the Night', 'Hank', '2023-01-15', 'Music bridges the gap between hearts. Night brings dreams into focus.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(9, 'free', 'The Art of Culinary Magic', 'Ivy', '2018-02-07', 'Delicious recipes spark joyful memories. Cooking is an art of love.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(10, 'free', 'Adventures in the Digital Realm', 'Jack', '2020-08-19', 'Virtual worlds expand creative boundaries. Digital landscapes inspire exploration.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(11, 'free', 'Whispers of the Ancient Forest', 'Kim', '2017-10-03', 'Old trees tell timeless tales. The forest hums with mystery.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(12, 'free', 'Innovations in Sustainable Energy', 'Leo', '2019-03-22', 'Renewable energy promises a greener future. Science drives us toward sustainability.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(13, 'free', 'The Charm of Vintage Memories', 'Mia', '2022-12-11', 'Past eras echo in modern dreams. Nostalgia shapes the beauty of tradition.');

INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(14, 'notice', 'Important Announcement for All Users', 'Nina', '2016-01-20', 'This notice provides crucial updates. Please read the details carefully.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(15, 'notice', 'System Maintenance Scheduled', 'Oscar', '2017-08-09', 'Scheduled downtime will occur during the weekend. Maintenance will ensure improved performance.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(16, 'notice', 'New Features Released Today', 'Paul', '2018-05-14', 'Our platform has been updated with exciting new features. Users are encouraged to explore them.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(17, 'notice', 'Reminder: Policy Update', 'Quinn', '2020-02-28', 'Policy changes have been implemented for better security. Please review the updated guidelines.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(18, 'notice', 'Upcoming Community Event', 'Rita', '2021-09-03', 'Join us for a community gathering. Enjoy fun activities and meaningful conversations.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(19, 'notice', 'Service Interruption Notice', 'Sam', '2015-11-11', 'Unexpected service interruptions may occur. We apologize for any inconvenience caused.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(20, 'notice', 'Holiday Schedule Announcement', 'Tina', '2019-12-24', 'Office hours will change during the holidays. Please plan accordingly for timely responses.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(21, 'notice', 'Security Alert for All Accounts', 'Uma', '2022-07-19', 'A security update is required immediately. Protect your account with the latest measures.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(22, 'notice', 'New Office Opening Ceremony', 'Victor', '2018-06-30', 'We are excited to announce our new office. Join us for the opening ceremony celebration.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(23, 'notice', 'Employee Recognition Program', 'Wendy', '2020-04-25', 'Outstanding performance is being recognized. Congratulations to all award recipients.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(24, 'notice', 'System Upgrade Notification', 'Xander', '2017-03-16', 'A major system upgrade is underway. Enhanced features will improve user experience.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(25, 'notice', 'Scheduled Downtime Update', 'Yara', '2021-11-29', 'There will be scheduled downtime tonight. Please save your work in advance.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(26, 'notice', 'Policy Compliance Reminder', 'Zack', '2023-02-10', 'Ensure all actions comply with policies. Regular audits will maintain standards.');

INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(27, 'news', 'Breaking News: Market Soars', 'Alice', '2023-03-01', 'The stock market reached new heights. Investors are optimistic about the future.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(28, 'news', 'Global Summit Concludes Successfully', 'Bob', '2022-05-17', 'World leaders gathered to discuss pressing issues. The summit ended with hopeful resolutions.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(29, 'news', 'New Scientific Discovery Announced', 'Charlie', '2019-07-23', 'Scientists have unveiled a groundbreaking discovery. The implications are vast and far-reaching.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(30, 'news', 'Historic Agreement Signed Today', 'Diana', '2021-01-30', 'A landmark agreement has been reached. Global cooperation is on the rise.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(31, 'news', 'Weather Alert: Storm Approaching', 'Eve', '2018-10-12', 'A severe storm is expected soon. Residents are advised to take precautions.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(32, 'news', 'Elections Update: Vote Count Rising', 'Frank', '2020-06-05', 'The vote count is increasing steadily. Election results are being closely monitored.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(33, 'news', 'Tech Conference Kicks Off', 'Grace', '2017-09-27', 'The tech conference started with innovative sessions. Experts shared insights on future trends.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(34, 'news', 'Economic Report Released', 'Hank', '2016-08-14', 'Latest economic data reveals mixed trends. Analysts provide in-depth commentary on growth.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(35, 'news', 'Health Advisory Issued', 'Ivy', '2022-11-08', 'Health officials issue new guidelines. Public awareness is crucial during outbreaks.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(36, 'news', 'Sports Championship Announced', 'Jack', '2019-04-03', 'The national championship is coming soon. Fans eagerly await the competition.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(37, 'news', 'Cultural Festival Opens', 'Kim', '2021-10-19', 'A vibrant cultural festival kicked off today. Art and music unite diverse communities.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(38, 'news', 'Infrastructure Bill Passed', 'Leo', '2018-12-06', 'A new infrastructure bill has been passed. This will boost national development.');

INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(39, 'suggest', 'Suggestion: Improve Public Transport', 'Mia', '2020-03-15', 'Enhancing public transport benefits everyone. A more efficient system is needed for urban areas.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(40, 'suggest', 'Idea: Community Garden Initiative', 'Nina', '2021-07-22', 'A community garden can bring neighbors together. Green spaces improve quality of life.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(41, 'suggest', 'Proposal: Flexible Work Hours', 'Oscar', '2017-05-06', 'Flexible work schedules enhance productivity. Employees thrive with balanced routines.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(42, 'suggest', 'Recommendation: Local Recycling Program', 'Paul', '2019-08-28', 'Improving recycling efforts reduces waste. A local program can spark environmental change.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(43, 'suggest', 'Advice: Enhance Online Security', 'Quinn', '2022-03-11', 'Strengthening cybersecurity is essential. Digital defenses must evolve with emerging threats.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(44, 'suggest', 'Tip: Organize Community Workshops', 'Rita', '2016-11-02', 'Community workshops foster learning and collaboration. Sharing skills benefits everyone involved.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(45, 'suggest', 'Observation: Traffic Congestion Issues', 'Sam', '2020-01-19', 'Traffic congestion hampers daily life. Innovative solutions are required to ease urban mobility.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(46, 'suggest', 'Feedback: Update City Infrastructure', 'Tina', '2018-04-27', 'City infrastructure needs modern upgrades. Investing in roads and bridges is crucial.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(47, 'suggest', 'Insight: Promote Renewable Resources', 'Uma', '2019-10-16', 'Renewable energy sources offer sustainable benefits. Embracing green technology is the future.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(48, 'suggest', 'Critique: Rethink Urban Planning', 'Victor', '2017-02-13', 'Urban planning must be reimagined. Smart designs lead to efficient cities.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(49, 'suggest', 'Observation: Enhance Public Safety Measures', 'Wendy', '2021-05-08', 'Improved public safety protects communities. Effective measures are needed to reduce risks.');
INSERT INTO boards (idx, boardKind, title, writer, wdate, content) VALUES 
(50, 'suggest', 'Advice: Boost Local Business Growth', 'Xander', '2023-01-04', 'Supporting local businesses fuels the economy. Collaborative efforts drive community success.');


-- - artist
create table artists (
  idx int not null primary key,
  name varchar(30) default ''
);

insert into artists values 
(1, 'iseodol'),
(2, 'ine'),
(3, 'jingburger'),
(4, 'lilpa'),
(5, 'jururu'),
(6, 'gosegu'),
(7, 'viichan');

-- - single, group
create table albumKinds(
  idx int not null primary key,
  kind varchar(50) default ''
);

insert into albumKinds value 
(1, 'single'),
(2, 'group');

-- song
CREATE TABLE songs (
    idx INT NOT NULL PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    thumbnail varcahr(255) default '',
    mp3file varcahr(255) default '',
    odate DATE,
    artist INT REFERENCES artists(idx),
    album_kind INT REFERENCES albumKinds(idx)
);

insert into songs values 
(1, 'rewind', '1ISEDOL/rewind.jpg', '1ISEDOL/rewind.mp3', '2021-12-17', 1, 2),
(2, '겨울봄', '1ISEDOL/겨울봄.jpg', '1ISEDOL/겨울봄.mp3', '2022-03-11', 1, 2),
(3, 'kidding', '1ISEDOL/kidding.jpg', '1ISEDOL/kidding.mp3', '2023-08-18', 1, 2),
(4, 'panorama', '1ISEDOL/panorama.jpg', '1ISEDOL/panorama.mp3', '2025-01-17', 1, 2),
(5, 'beyond_the_way', '1ISEDOL/beyond_the_way.jpg', '1ISEDOL/beyond_the_way.mp3', '2025-01-21', 1, 2),

-- INE 아이네클라이네 / 내손을잡아 / 마리골드 / 성간비행 / Lost my music / Lovely / sora / tomboy
(6, '와스레모노', '2INE/ine_와스레모노.jpg', '2INE/ine_와스레모노.mp3', '2023-11-05', 2, 1),
(7, 'mashup', '2INE/ine_mashup.jpg', '2INE/ine_mashup.mp3', '2022-12-01', 2, 1),
(8, 'im_still_standing', '2INE/ine_im_still_standing.jpg', '2INE/ine_im_still_standing.mp3', '2024-05-30', 2, 1),
(9, 'star_walkin', '2INE/ine_star_walkin.jpg', '2INE/ine_star_walkin.mp3', '2024-05-31', 2, 1),
(10, '잔혹한천사의태제', '2INE/ine_잔혹한천사의태제.jpg', '2INE/ine_잔혹한천사의태제.mp3', '2024-05-29', 2, 1),

-- JINGBURGER - ballin / brave_new_world / cant_slow_me_down / love_war/ sway_to_my_beat_in_cosmos / 강풍올백 / 저쪽으로 / 좋아하니까
(11, '혼돈부기', '3JUNGBURGER/jingburger_혼돈부기.jpg', '3JUNGBURGER/jingburger_혼돈부기.mp3', '2024-04-19', 3, 1),
(12, '봄도둑', '3JUNGBURGER/jingburger_봄도둑.jpg', '3JUNGBURGER/jingburger_봄도둑.mp3', '2023-04-30', 3, 1),
(13, 'tomboy', '3JUNGBURGER/jingburger_tomboy.jpg', '3JUNGBURGER/jingburger_tomboy.mp3', '2022-05-30', 3, 1),
(14, 'stay', '3JUNGBURGER/jingburger_stay.jpg', '3JUNGBURGER/jingburger_stay.mp3', '2023-01-20', 3, 1),
(15, 'and_july', '3JUNGBURGER/jingburger_and_july.jpg', '3JUNGBURGER/jingburger_and_july.mp3', '2023-11-30', 3, 1),

-- LILPA
(16, '마지막재회', '4LILPA/lilpa_마지막재회.jpg', '4LILPA/lilpa_마지막재회.mp3', '2022-06-05', 4, 1),
(17, 'lady', '4LILPA/lilpa_lady.jpg', '4LILPA/lilpa_lady.mp3', '2023-07-09', 4, 1),
(18, '너로피어오라', '4LILPA/lilpa_너로피어오라.jpg', '4LILPA/lilpa_너로피어오라.mp3', '2022-03-31', 4, 1),
(19, 'u', '4LILPA/lilpa_u.jpg', '4LILPA/lilpa_u.mp3', '2023-12-03', 4, 1),
(20, '댄스홀', '4LILPA/lilpa_댄스홀.jpg', '4LILPA/lilpa_댄스홀.mp3', '2024-08-26', 4, 1),

-- JURURU
(21, '초절정귀여워', '5JURURU/jururu_초절정귀여워.jpg', 'j5JURURU/ururu_초절정귀여워.mp3', '2024-03-05', 5, 1),
(22, '귀여워서미안해', '5JURURU/jururu_귀여워서미안해.jpg', '5JURURU/jururu_귀여워서미안해.mp3', '2023-01-15', 5, 1),
(23, '너에게닿기를', '5JURURU/jururu_너에게닿기를.jpg', '5JURURU/jururu_너에게닿기를.mp3', '2023-12-09', 5, 1),
(24, '고민중독', '5JURURU/jururu_고민중독.jpg', '5JURURU/jururu_고민중독.mp3', '2024-05-29', 5, 1),
(25, '달링', '5JURURU/jururu_달링.jpg', '5JURURU/jururu_달링.mp3', '2023-08-13', 5, 1),

-- GOSEGU
(26, '나만봄', '6GOSEGU/gosegu_나만봄.jpg', '6GOSEGU/gosegu_나만봄.mp3', '2022-05-22', 6, 1),
(27, '긍지높은_아이돌', '6GOSEGU/gosegu_긍지높은_아이돌.jpg', '6GOSEGU/gosegu_긍지높은_아이돌.mp3', '2022-12-03', 6, 1),
(28, '신시대', '6GOSEGU/gosegu_신시대.jpg', '6GOSEGU/gosegu_신시대.mp3', '2024-02-12', 6, 1),
(29, '팬서비스', '6GOSEGU/gosegu_팬서비스.jpg', '6GOSEGU/gosegu_팬서비스.mp3', '2022-01-11', 6, 1),
(30, '별이_되지_않아도_돼', '6GOSEGU/gosegu_별이_되지_않아도_돼.jpg', '6GOSEGU/gosegu_별이_되지_않아도_돼.mp3', '2021-09-26', 6, 1),

-- VIICHAN
(31, 'tot_musica', '7VIICHAN/viichan_tot_musica.jpg', '7VIICHAN/viichan_tot_musica.mp3', '2023-04-23', 7, 1),
(32, '그저_네게_맑아라', '7VIICHAN/viichan_그저_네게_맑아라.jpg', '7VIICHAN/viichan_그저_네게_맑아라.mp3', '2024-08-05', 7, 1),
(33, '나는_아픈_건_딱_질색이니까', '7VIICHAN/viichan_나는_아픈_건_딱_질색이니까.jpg', '7VIICHAN/viichan_나는_아픈_건_딱_질색이니까.mp3', '2024-11-11', 7, 1),
(34, '유령도쿄', '7VIICHAN/viichan_유령도쿄.jpg', '7VIICHAN/viichan_유령도쿄.mp3', '2021-01-16', 7, 1),
(35, 'ditto', '7VIICHAN/viichan_ditto.jpg', '7VIICHAN/viichan_ditto.mp3', '2024-08-05', 7, 1);

-- playlist
create table playlists (
  idx int not null primary key,
  name varchar(30) default '',
  play_list integer[] 
);  

INSERT INTO playlists (idx, name, play_list) VALUES 
(1, 'ISEDOL', ARRAY[1, 2, 3, 4, 5]),
(2, 'INE', ARRAY[6,7,8,9,10]),
(3, 'JINGBURGER', ARRAY[11,12,13,14,15]),
(4, 'LILPA', ARRAY[16,17,18,19,20]),
(5, 'JURURU', ARRAY[21,22,23,24,25]),
(6, 'GOSEGU', ARRAY[26,27,28,29,30]),
(7, 'VIICHAN', ARRAY[31,32,33,34,35]);
-- user
create table users (
  idx int not null primary key,
  id varchar(100) default '',
  password varchar(255) default '',
  profile varchar(255) default ''
)