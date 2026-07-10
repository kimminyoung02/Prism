import '../models/models.dart';

/// Static demo content ported 1:1 from frontend/src/mock/data.ts.
class MockData {
  MockData._();

  static const List<PopularSearchTerm> popularSearchTerms = [
    PopularSearchTerm(term: 'H&M 리넨 여름 원피스', change: SearchTermChange.up, diff: 2),
    PopularSearchTerm(term: '유니클로 린넨 셔츠', change: SearchTermChange.same),
    PopularSearchTerm(term: '무신사 스탠다드 와이드 팬츠', change: SearchTermChange.up, diff: 1),
    PopularSearchTerm(term: '폴로 랄프로렌 가디건', change: SearchTermChange.down, diff: 3),
    PopularSearchTerm(term: '코치 크로스바디백', change: SearchTermChange.up, diff: 4),
    PopularSearchTerm(term: '나이키 에어포스1 스니커즈', change: SearchTermChange.down, diff: 1),
    PopularSearchTerm(term: '자라 오버사이즈 블레이저', change: SearchTermChange.up, diff: 5),
    PopularSearchTerm(term: '아디다스 트랙탑', change: SearchTermChange.same),
    PopularSearchTerm(term: '탑텐 반팔 티셔츠', change: SearchTermChange.up, diff: 2),
    PopularSearchTerm(term: '뉴발란스 993 스니커즈', change: SearchTermChange.down, diff: 2),
  ];

  static const todaysPickTitle = '리넨 오버핏 자켓';
  static const todaysPickSubtitle = '지금 만족도가 가장 높은';

  static const defaultQuery = '리넨 오버핏 자켓';

  static const lensIdentifiedBrand = 'H&M';
  static const lensIdentifiedName = '린넨 오버핏 셔츠';
  static const lensIdentifiedConfidence = '일치율 높음';

  static const appVersion = 'v1.0.0';

  static const List<String> termsOfServiceText = [
    "본 약관은 Prism(이하 '회사')이 제공하는 AI 리뷰 분석 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.",
    '이용자는 서비스 이용 시 관련 법령과 본 약관의 내용을 준수하여야 하며, 서비스를 통해 제공되는 분석 결과는 참고용 정보로 실제 구매 결정의 최종 책임은 이용자에게 있습니다.',
    '회사는 서비스의 안정적인 제공을 위해 노력하며, 서비스 내용의 변경이 필요한 경우 사전에 공지합니다.',
  ];

  static const List<String> privacyPolicyText = [
    'Prism은 이용자의 개인정보를 소중히 다루며, 관련 법령에 따라 최소한의 개인정보만을 수집·이용합니다.',
    '수집하는 개인정보는 이메일, 닉네임, 서비스 이용 기록이며, 회원 관리 및 서비스 제공 목적으로만 사용됩니다.',
    '이용자는 언제든지 자신의 개인정보 열람, 수정, 삭제를 요청할 수 있으며, 회원 탈퇴를 통해 개인정보 수집·이용에 대한 동의를 철회할 수 있습니다.',
  ];

  static const List<AnalysisStepInfo> analysisSteps = [
    AnalysisStepInfo(key: 'collect', title: '리뷰 수집 중', description: '다양한 채널에서 리뷰를 모으는 중'),
    AnalysisStepInfo(key: 'clean', title: '전처리 중', description: '중복 제거 및 텍스트 정리 중'),
    AnalysisStepInfo(key: 'keyword', title: '키워드 추출 중', description: '핵심 키워드를 찾는 중'),
    AnalysisStepInfo(key: 'sentiment', title: '감정 분석 중', description: '긍정/부정 비율을 분석 중'),
    AnalysisStepInfo(key: 'summary', title: '요약 생성 중', description: '한 줄 요약을 만드는 중'),
  ];

  static const List<ReviewSource> reviewSources = [
    ReviewSource(key: 'blog', label: '블로그', count: 32),
    ReviewSource(key: 'youtube', label: '유튜브', count: 18),
  ];

  static int get totalReviewCount => reviewSources.fold(0, (sum, s) => sum + s.count);

  static const analyzedDate = '2026.07.06';

  static const aiConclusionRating = 4.5;
  static const aiConclusionSummary = '가볍고 시원한 착용감에 만족도가 높은 편이에요. 다만 기장이 길다는 의견도 있었어요.';

  static const List<String> pros = [
    '소재가 가볍고 통기성이 좋다는 의견이 많아요',
    '오버핏 실루엣이 예쁘다는 의견이 있어요',
    '다양한 코디에 활용하기 좋다는 의견이 있어요',
  ];

  static const List<String> cons = [
    '기장이 생각보다 길다는 의견이 있어요',
    '구김이 잘 간다는 의견이 있어요',
    '세탁 후 수축될 수 있다는 의견이 있어요',
  ];

  static const List<Keyword> keywords = [
    Keyword(word: '핏', count: 24),
    Keyword(word: '소재', count: 19),
    Keyword(word: '색상', count: 15),
    Keyword(word: '사이즈', count: 12),
    Keyword(word: '배송', count: 9),
    Keyword(word: '가성비', count: 7),
  ];
}
