import { Manga, Genre, Comment } from '../types';

export const GENRES: Genre[] = [
  { id: 'action', name: 'Action', description: 'Thể loại hành động, kịch tính, chiến đấu kịch liệt.' },
  { id: 'adventure', name: 'Adventure', description: 'Thể loại phiêu lưu, khám phá những vùng đất mới.' },
  { id: 'comedy', name: 'Comedy', description: 'Thể loại hài hước, mang lại tiếng cười sảng khoái.' },
  { id: 'drama', name: 'Drama', description: 'Thể loại chính kịch, kịch tính, tập trung vào chiều sâu cảm xúc.' },
  { id: 'fantasy', name: 'Fantasy', description: 'Thể loại huyền ảo, phép thuật, thế giới siêu nhiên.' },
  { id: 'manhua', name: 'Manhua', description: 'Truyện tranh xuất xứ từ Trung Quốc.' },
  { id: 'manhwa', name: 'Manhwa', description: 'Truyện tranh xuất xứ từ Hàn Quốc.' },
  { id: 'romance', name: 'Romance', description: 'Thể loại tình cảm, lãng mạn, câu chuyện tình yêu ngọt ngào.' },
  { id: 'school-life', name: 'School Life', description: 'Thể loại học đường, thanh xuân vườn trường.' },
  { id: 'shounen', name: 'Shounen', description: 'Thể loại hướng tới độc giả nam thiếu niên, thường có hành động và ý chí vươn lên.' },
  { id: 'supernatural', name: 'Supernatural', description: 'Thể loại siêu nhiên, tâm linh, năng lực đặc biệt.' },
  { id: 'slice-of-life', name: 'Slice of Life', description: 'Thể loại đời thường, nhẹ nhàng, sâu lắng về cuộc sống thường nhật.' }
];

// Helper to generate pages of chapter with high quality imagery
const getChapterPages = (mangaId: string, chapterNum: number): string[] => {
  // Let's use clean, atmospheric Unsplash illustration links
  const illustrationPools = {
    'one-piece': [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', // ocean magic
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80', // boat drawing
      'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?w=800&auto=format&fit=crop&q=80', // blue wave
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80', // abstract golden art
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', // deep space blue
    ],
    'solo-leveling': [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80', // purple portal vibe
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', // sharp neon
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80', // high tech energy
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80', // dark geometric abstract
      'https://images.unsplash.com/photo-1504333631550-3a450db3623f?w=800&auto=format&fit=crop&q=80', // blue cyber cave
    ],
    'demon-slayer': [
      'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?w=800&auto=format&fit=crop&q=80', // dark fire cloud
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80', // anime warrior girl
      'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&auto=format&fit=crop&q=80', // dark katana vibe
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80', // cherry blossom red
      'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=800&auto=format&fit=crop&q=80', // moonlit sky
    ],
    'martial-emperor': [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80', // mist bamboo forest
      'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=800&auto=format&fit=crop&q=80', // sword practitioner
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', // mountain shrine fantasy
      'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&auto=format&fit=crop&q=80', // sunset fog
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&auto=format&fit=crop&q=80', // misty forest pathway
    ],
    'spy-family': [
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=80', // cozy reading/vintage room
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80', // pastel cute colors
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80', // bright retro flat layout
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80', // cute graphic elements
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&auto=format&fit=crop&q=80', // playful clouds
    ],
    'school-love': [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', // warm light school desk
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80', // study books pile
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80', // retro bicycle school wall
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80', // sunset romance golden light
      'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&auto=format&fit=crop&q=80', // holding hands / minimal
    ],
    'titan-war': [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80', // anime mech/vibe
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', // heavy ruins
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', // dramatic lightning sky
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', // brutalist walls
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80', // ashes / dark background
    ],
    'conan': [
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80', // detective magnifying glass / mystery shadow
      'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=800&auto=format&fit=crop&q=80', // camera lens focus
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80', // technological interface / gadgets
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', // code / puzzle clues
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80', // light trail city
    ]
  };

  const pool = illustrationPools[mangaId as keyof typeof illustrationPools] || illustrationPools['one-piece'];
  
  // Return images with dynamic text overlay / unique parameters to make them stand out
  return pool.map((url, index) => `${url}&sig=${mangaId}_ch${chapterNum}_p${index}`);
};

export const MOCK_MANGAS: Manga[] = [
  {
    id: 'one-piece',
    title: 'Một Mảnh (One Piece)',
    otherTitle: 'Đảo Hải Tặc, Vua Hải Tặc',
    author: 'Oda Eiichiro',
    status: 'Đang tiến hành',
    description: 'One Piece là câu chuyện kể về Luffy - một cậu bé mong muốn tìm kiếm kho báu huyền thoại "One Piece" và trở thành Vua Hải Tặc đời tiếp theo. Ăn phải trái ác quỷ cao su Gomu Gomu, Luffy có khả năng co giãn cơ thể như cao su nhưng đổi lại cậu mất đi khả năng bơi lội. Đồng hành cùng những thành viên tuyệt vời trong Băng Mũ Rơm, Luffy đi qua vô số hòn đảo kỳ thú và đối mặt với những thế lực hải quân hùng mạnh trên Đại Hải Trình.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?w=1200&auto=format&fit=crop&q=80',
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy', 'Shounen'],
    viewCount: 45209300,
    commentCount: 15430,
    followerCount: 238490,
    rating: 4.8,
    isHot: true,
    chapters: [
      { id: 'op-1050', mangaId: 'one-piece', title: 'Chapter 1050: Vinh Quang', updatedAt: '2026-07-13T01:00:00Z', viewCount: 145000, pages: getChapterPages('one-piece', 1050) },
      { id: 'op-1049', mangaId: 'one-piece', title: 'Chapter 1049: Thế Giới Mà Ta Mong Muốn', updatedAt: '2026-07-12T12:00:00Z', viewCount: 120000, pages: getChapterPages('one-piece', 1049) },
      { id: 'op-1048', mangaId: 'one-piece', title: 'Chapter 1048: Hai Mươi Năm', updatedAt: '2026-07-10T08:00:00Z', viewCount: 110000, pages: getChapterPages('one-piece', 1048) },
      { id: 'op-1047', mangaId: 'one-piece', title: 'Chapter 1047: Bầu Trời Thủ Đô', updatedAt: '2026-07-05T03:00:00Z', viewCount: 95000, pages: getChapterPages('one-piece', 1047) },
      { id: 'op-1046', mangaId: 'one-piece', title: 'Chapter 1046: Raizo', updatedAt: '2026-06-28T14:00:00Z', viewCount: 88000, pages: getChapterPages('one-piece', 1046) }
    ]
  },
  {
    id: 'solo-leveling',
    title: 'Tôi Thăng Cấp Một Mình (Solo Leveling)',
    otherTitle: 'Only I Level Up',
    author: 'Chugong, DUBU (Redice Studio)',
    status: 'Hoàn thành',
    description: '10 năm trước, sau khi "Cánh cổng" kết nối thế giới thực với thế giới quái vật mở ra, một số người bình thường đã nhận được sức mạnh săn lùng quái vật trong Cổng. Họ được gọi là các "Thợ săn". Tuy nhiên, không phải tất cả các Thợ săn đều mạnh mẽ. Sung Jin-Woo, một Thợ săn hạng E, là người yếu nhất trong tất cả các Thợ săn. Sau khi suýt chết trong một hầm ngục kép vô cùng nguy hiểm, anh tỉnh dậy và nhìn thấy một bảng nhiệm vụ bí ẩn trước mắt. Chấp nhận nhiệm vụ, Jin-Woo bắt đầu hành trình tự thăng cấp một mình để trở thành thợ săn mạnh nhất thế giới.',
    coverUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
    genres: ['Action', 'Fantasy', 'Manhwa', 'Supernatural'],
    viewCount: 38209400,
    commentCount: 12400,
    followerCount: 198420,
    rating: 4.9,
    isHot: true,
    chapters: [
      { id: 'sl-179', mangaId: 'solo-leveling', title: 'Chapter 179: Kết Thúc Và Khởi Đầu (Hết)', updatedAt: '2026-07-12T15:30:00Z', viewCount: 220000, pages: getChapterPages('solo-leveling', 179) },
      { id: 'sl-178', mangaId: 'solo-leveling', title: 'Chapter 178: Trận Chiến Sau Cùng', updatedAt: '2026-07-08T06:00:00Z', viewCount: 180000, pages: getChapterPages('solo-leveling', 178) },
      { id: 'sl-177', mangaId: 'solo-leveling', title: 'Chapter 177: Sức Mạnh Toàn Diện', updatedAt: '2026-07-01T09:00:00Z', viewCount: 154000, pages: getChapterPages('solo-leveling', 177) },
      { id: 'sl-176', mangaId: 'solo-leveling', title: 'Chapter 176: Hoàng Đế Bóng Tối', updatedAt: '2026-06-25T11:00:00Z', viewCount: 142000, pages: getChapterPages('solo-leveling', 176) }
    ]
  },
  {
    id: 'demon-slayer',
    title: 'Thanh Gươm Diệt Quỷ (Demon Slayer)',
    otherTitle: 'Kimetsu no Yaiba, Diệt Quỷ Cứu Nhân',
    author: 'Koyoharu Gotouge',
    status: 'Hoàn thành',
    description: 'Từ thời cổ đại, đã có nhiều tin đồn về những con quỷ ăn thịt người ẩn nấp trong rừng sâu. Vì thế, người dân trong làng không bao giờ dám ra ngoài vào ban đêm. Câu chuyện bắt đầu với Kamado Tanjiro, một cậu bé bán than hiền lành, thông minh. Gia đình cậu bị quỷ sát hại dã man, chỉ còn duy nhất em gái Nezuko sống sót nhưng lại bị biến thành quỷ. Nhằm tìm cách chữa trị cho Nezuko và trả thù cho gia đình, Tanjiro đã quyết tâm gia nhập Sát Quỷ Đoàn, bắt đầu cuộc hành trình diệt quỷ đầy gian nan thử thách.',
    coverUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?w=1200&auto=format&fit=crop&q=80',
    genres: ['Action', 'Fantasy', 'Shounen', 'Supernatural'],
    viewCount: 29500120,
    commentCount: 9520,
    followerCount: 154900,
    rating: 4.7,
    isHot: true,
    chapters: [
      { id: 'ds-205', mangaId: 'demon-slayer', title: 'Chapter 205: Đời Đời Kiếp Kiếp (Hết)', updatedAt: '2026-07-11T10:00:00Z', viewCount: 135000, pages: getChapterPages('demon-slayer', 205) },
      { id: 'ds-204', mangaId: 'demon-slayer', title: 'Chapter 204: Thế Giới Không Còn Loài Quỷ', updatedAt: '2026-07-06T04:20:00Z', viewCount: 115000, pages: getChapterPages('demon-slayer', 204) },
      { id: 'ds-203', mangaId: 'demon-slayer', title: 'Chapter 203: Ánh Sáng Bình Minh', updatedAt: '2026-06-30T13:00:00Z', viewCount: 102000, pages: getChapterPages('demon-slayer', 203) }
    ]
  },
  {
    id: 'martial-emperor',
    title: 'Ta Là Tà Đế (Martial Emperor)',
    otherTitle: 'I am the Fated Villain, Ta Là Tà Đế Cực Phẩm',
    author: 'Đang cập nhật',
    status: 'Đang tiến hành',
    description: 'Truyện kể về Tạ Diệm, một nam thanh niên đẹp trai bất ngờ xuyên không vào cơ thể của một đệ tử tà phái đỉnh cấp. Nơi đây là thế giới tu chân vô cùng tàn khốc, "thịt yếu ăn mạnh". Để bảo toàn mạng sống và thăng tiến trong môn phái tà đạo đầy rẫy âm mưu này, Tạ Diệm đã kích hoạt "Hệ thống vạn giới", giúp anh xuyên không qua nhiều vị diện khác nhau để tích lũy điểm năng lực và học tập các võ công độc môn tuyệt đỉnh thượng cổ.',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    genres: ['Action', 'Fantasy', 'Manhua', 'Supernatural'],
    viewCount: 22405000,
    commentCount: 8940,
    followerCount: 112450,
    rating: 4.6,
    isHot: false,
    chapters: [
      { id: 'me-350', mangaId: 'martial-emperor', title: 'Chapter 350: Cửu Thiên Huyền Thần', updatedAt: '2026-07-13T02:40:00Z', viewCount: 65000, pages: getChapterPages('martial-emperor', 350) },
      { id: 'me-349', mangaId: 'martial-emperor', title: 'Chapter 349: Ma Tổ Quy Vị', updatedAt: '2026-07-12T11:00:00Z', viewCount: 54000, pages: getChapterPages('martial-emperor', 349) },
      { id: 'me-348', mangaId: 'martial-emperor', title: 'Chapter 348: Kế Hoạch Đột Kích', updatedAt: '2026-07-09T03:30:00Z', viewCount: 48000, pages: getChapterPages('martial-emperor', 348) }
    ]
  },
  {
    id: 'spy-family',
    title: 'Gia Đình Điệp Viên (Spy x Family)',
    otherTitle: 'Spy x Family, Gia Đình Hoàn Hảo',
    author: 'Tatsuya Endo',
    status: 'Đang tiến hành',
    description: 'Để duy trì nền hòa bình mong manh giữa hai quốc gia thù địch Ostania và Westalis, điệp viên hàng đầu biệt danh "Twilight" nhận nhiệm vụ thâm nhập vào một trường học danh tiếng để tiếp cận mục tiêu chính trị cực kỳ cẩn trọng. Nhằm thực hiện nhiệm vụ, anh phải tạo dựng một "gia đình giả" trong vòng một tuần. Anh nhận nuôi một cô bé mồ côi đáng yêu tên Anya, kết hôn với một nữ nhân viên công sở dịu dàng tên Yor Briar. Thế nhưng, Twilight không hề biết rằng Yor thực chất là một sát thủ khét tiếng, còn bé Anya lại là một siêu năng lực gia có khả năng đọc được suy nghĩ của người khác!',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop&q=80',
    genres: ['Action', 'Comedy', 'Drama', 'School Life', 'Shounen'],
    viewCount: 18504000,
    commentCount: 7200,
    followerCount: 98300,
    rating: 4.8,
    isHot: true,
    chapters: [
      { id: 'sf-85', mangaId: 'spy-family', title: 'Chapter 85: Buổi Dã Ngoại Kịch Tính', updatedAt: '2026-07-12T22:00:00Z', viewCount: 88000, pages: getChapterPages('spy-family', 85) },
      { id: 'sf-84', mangaId: 'spy-family', title: 'Chapter 84: Thân Phận Bị Lung Lay', updatedAt: '2026-07-07T05:00:00Z', viewCount: 75000, pages: getChapterPages('spy-family', 84) },
      { id: 'sf-83', mangaId: 'spy-family', title: 'Chapter 83: Bí Mật Nhà Forger', updatedAt: '2026-06-29T10:30:00Z', viewCount: 69000, pages: getChapterPages('spy-family', 83) }
    ]
  },
  {
    id: 'school-love',
    title: 'Lời Tỏ Tình Ngọt Ngào (Sweet Confession)',
    otherTitle: 'Kaguya-sama: Love is War, Cuộc Chiến Tỏ Tình',
    author: 'Aka Akasaka',
    status: 'Hoàn thành',
    description: 'Trong hội học sinh của học viện danh giá Shuchiin, Hội trưởng Shirogane Miyuki và Hội phó Shinomiya Kaguya được xem là cặp đôi hoàn hảo về tài năng lẫn gia thế. Mặc dù cả hai đều đã phải lòng đối phương từ lâu, nhưng với cái tôi cực kỳ cao của những kẻ thiên tài, họ cho rằng "ai tỏ tình trước là kẻ thua cuộc". Thế là một cuộc chiến cân não cực kỳ hài hước và kịch tính nổ ra, khi cả hai đều lập mưu để ép đối phương phải mở lời tỏ tình trước!',
    coverUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    genres: ['Comedy', 'Romance', 'School Life', 'Slice of Life'],
    viewCount: 15400300,
    commentCount: 5120,
    followerCount: 74200,
    rating: 4.7,
    isHot: false,
    chapters: [
      { id: 'sl-281', mangaId: 'school-love', title: 'Chapter 281: Lời Hứa Trọn Đời (Hết)', updatedAt: '2026-07-10T14:00:00Z', viewCount: 71000, pages: getChapterPages('school-love', 281) },
      { id: 'sl-280', mangaId: 'school-love', title: 'Chapter 280: Buổi Tốt Nghiệp Ấm Áp', updatedAt: '2026-07-04T07:30:00Z', viewCount: 62000, pages: getChapterPages('school-love', 280) },
      { id: 'sl-279', mangaId: 'school-love', title: 'Chapter 279: Kế Hoạch Ngày Cuối', updatedAt: '2026-06-25T02:00:00Z', viewCount: 58000, pages: getChapterPages('school-love', 279) }
    ]
  },
  {
    id: 'titan-war',
    title: 'Đại Chiến Titan (Attack on Titan)',
    otherTitle: 'Shingeki no Kyojin, Shingeki no Kyojin',
    author: 'Hajime Isayama',
    status: 'Hoàn thành',
    description: 'Hàng trăm năm trước, loài người suýt bị diệt vong bởi Titan - những sinh vật khổng lồ, không có trí thông minh và chuyên ăn thịt người. Số ít nhân loại còn sống sót đã tự giam mình sau ba bức tường thành kiên cố khổng lồ để bảo vệ mạng sống. Cuộc sống yên bình kéo dài hơn 100 năm cho đến một ngày, một Titan khổng lồ cao hơn 60 mét bất ngờ xuất hiện và phá hủy bức tường ngoài cùng. Chứng kiến mẹ mình bị Titan ăn thịt trước mắt, cậu bé Eren Yeager thề sẽ tiêu diệt toàn bộ Titan trên thế giới, bắt đầu gia nhập Trinh Sát Binh Đoàn đầy hiểm nguy.',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    genres: ['Action', 'Drama', 'Fantasy', 'Supernatural'],
    viewCount: 31204000,
    commentCount: 11450,
    followerCount: 168300,
    rating: 4.8,
    isHot: true,
    chapters: [
      { id: 'aot-139', mangaId: 'titan-war', title: 'Chapter 139: Bức Thư Cuối Cùng (Hết)', updatedAt: '2026-07-09T08:00:00Z', viewCount: 185000, pages: getChapterPages('titan-war', 139) },
      { id: 'aot-138', mangaId: 'titan-war', title: 'Chapter 138: Giấc Mơ Dài', updatedAt: '2026-07-02T11:45:00Z', viewCount: 154000, pages: getChapterPages('titan-war', 138) },
      { id: 'aot-137', mangaId: 'titan-war', title: 'Chapter 137: Người Khổng Lồ Sáng Lập', updatedAt: '2026-06-20T03:00:00Z', viewCount: 142000, pages: getChapterPages('titan-war', 137) }
    ]
  },
  {
    id: 'conan',
    title: 'Thám Tử Lừng Danh Conan',
    otherTitle: 'Detective Conan, Case Closed',
    author: 'Gosho Aoyama',
    status: 'Đang tiến hành',
    description: 'Kudo Shinichi là một thám tử trung học cực kỳ tài ba, thường xuyên giúp cảnh sát phá giải các vụ án hóc búa. Trong một lần điều tra hai kẻ khả nghi mặc đồ đen, Shinichi bị chúng đánh ngất và ép uống một loại thuốc độc thử nghiệm APTX 4869. Chất độc không giết chết cậu nhưng khiến cơ thể cậu bị thu nhỏ lại thành một đứa trẻ 7 tuổi. Để che giấu thân phận thật sự nhằm bảo vệ người thân và tiếp tục tìm kiếm manh mối về Tổ Chức Áo Đen bí ẩn, cậu lấy tên là Edogawa Conan và chuyển đến sống tại văn phòng thám tử của ông Mori Kogoro - bố của bạn gái cậu.',
    coverUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    genres: ['Comedy', 'Drama', 'School Life', 'Supernatural'],
    viewCount: 35409800,
    commentCount: 9810,
    followerCount: 142900,
    rating: 4.7,
    isHot: false,
    chapters: [
      { id: 'conan-1110', mangaId: 'conan', title: 'Chapter 1110: Quân Cờ Shogi Ký Ức', updatedAt: '2026-07-13T02:00:00Z', viewCount: 95000, pages: getChapterPages('conan', 1110) },
      { id: 'conan-1109', mangaId: 'conan', title: 'Chapter 1109: Cuộc Đấu Trí Dưới Mưa', updatedAt: '2026-07-08T09:00:00Z', viewCount: 88000, pages: getChapterPages('conan', 1109) },
      { id: 'conan-1108', mangaId: 'conan', title: 'Chapter 1108: Sát Ý Ở Hội Trường', updatedAt: '2026-07-01T14:30:00Z', viewCount: 81000, pages: getChapterPages('conan', 1108) }
    ]
  }
];

// Generates some Initial Mock Comments for a Manga
export const generateInitialComments = (mangaId: string): Comment[] => {
  return [
    {
      id: `${mangaId}-c1`,
      mangaId,
      username: 'MêTruyệnTranh9x',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      content: 'Truyện hay quá trời ơi! Đọc đi đọc lại không chán, mong là dịch giả up chương mới nhanh nhanh xíu nhé.',
      timestamp: '2 giờ trước',
      likes: 42,
      replies: [
        {
          id: `${mangaId}-c1-r1`,
          mangaId,
          username: 'OtakuChínhHiệu',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
          content: 'Chuẩn luôn bác, mong hóng chương tiếp theo ghê.',
          timestamp: '1 giờ trước',
          likes: 12
        }
      ]
    },
    {
      id: `${mangaId}-c2`,
      mangaId,
      username: 'WibuĐẹpTrai',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face',
      content: 'Cốt truyện đỉnh thật sự, nét vẽ cũng quá đẹp nữa, đúng là siêu phẩm!',
      timestamp: '5 giờ trước',
      likes: 28,
      replies: []
    },
    {
      id: `${mangaId}-c3`,
      mangaId,
      username: 'HóngHớtManga',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      content: 'Trời ơi, xem đoạn chap mới kịch tính kinh khủng khiếp! Ai spoil cho tôi chút chap sau với :3',
      timestamp: '1 ngày trước',
      likes: 15,
      replies: []
    }
  ];
};
