import 'package:go_router/go_router.dart';
import '../mock/mock_data.dart';
import '../widgets/app_layout.dart';
import '../screens/search_page.dart';
import '../screens/collecting_page.dart';
import '../screens/analyzing_page.dart';
import '../screens/result_page.dart';
import '../screens/favorites_page.dart';
import '../screens/my_tab.dart';
import '../screens/edit_profile_page.dart';
import '../screens/product_history_page.dart';
import '../screens/notification_settings_page.dart';
import '../screens/settings_page.dart';
import '../screens/change_password_page.dart';
import '../screens/search_terms_list_page.dart';
import '../screens/signup_page.dart';
import '../screens/legal_page.dart';
import '../screens/prism_lens_page.dart';
import '../screens/lens_analyzing_page.dart';
import '../screens/lens_result_page.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => AppLayout(
        currentPath: state.matchedLocation,
        onNavigate: (path) => context.go(path),
        child: child,
      ),
      routes: [
        GoRoute(path: '/', builder: (context, state) => const SearchPage()),
        GoRoute(path: '/collecting', builder: (context, state) => CollectingPage(query: state.extra as String?)),
        GoRoute(path: '/analyzing', builder: (context, state) => AnalyzingPage(query: state.extra as String?)),
        GoRoute(path: '/result', builder: (context, state) => ResultPage(query: state.extra as String?)),
        GoRoute(path: '/favorites', builder: (context, state) => const FavoritesPage()),
        GoRoute(path: '/my', builder: (context, state) => const MyTab()),
        GoRoute(path: '/edit-profile', builder: (context, state) => const EditProfilePage()),
        GoRoute(
          path: '/my/reviews',
          builder: (context, state) => const ProductHistoryPage(title: '나의 리뷰 기록', emptyText: '아직 분석한 리뷰가 없어요'),
        ),
        GoRoute(
          path: '/my/recent',
          builder: (context, state) => const ProductHistoryPage(title: '최근 본 제품', emptyText: '최근 본 제품이 없어요'),
        ),
        GoRoute(path: '/my/notifications', builder: (context, state) => const NotificationSettingsPage()),
        GoRoute(path: '/my/settings', builder: (context, state) => const SettingsPage()),
        GoRoute(path: '/my/settings/password', builder: (context, state) => const ChangePasswordPage()),
        GoRoute(
          path: '/search-terms/recent',
          builder: (context, state) => const SearchTermsListPage(variant: SearchTermsVariant.recent),
        ),
        GoRoute(
          path: '/search-terms/popular',
          builder: (context, state) => const SearchTermsListPage(variant: SearchTermsVariant.popular),
        ),
        GoRoute(path: '/signup', builder: (context, state) => const SignupPage()),
        GoRoute(
          path: '/legal/terms',
          builder: (context, state) => const LegalPage(title: '이용약관', paragraphs: MockData.termsOfServiceText),
        ),
        GoRoute(
          path: '/legal/privacy',
          builder: (context, state) => const LegalPage(title: '개인정보처리방침', paragraphs: MockData.privacyPolicyText),
        ),
      ],
    ),
    ShellRoute(
      builder: (context, state, child) => LensLayout(child: child),
      routes: [
        GoRoute(path: '/lens', builder: (context, state) => const PrismLensPage()),
        GoRoute(path: '/lens/analyzing', builder: (context, state) => LensAnalyzingPage(imagePath: state.extra as String?)),
        GoRoute(path: '/lens/result', builder: (context, state) => LensResultPage(imagePath: state.extra as String?)),
      ],
    ),
  ],
);
