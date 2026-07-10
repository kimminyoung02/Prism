import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../mock/mock_data.dart';
import '../models/models.dart';
import '../providers/activity_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';
import '../widgets/product_thumbnail.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _startSearch(String q) {
    final trimmed = q.trim();
    if (trimmed.isEmpty) return;
    context.go('/collecting', extra: trimmed);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final activity = context.watch<ActivityProvider>();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(context),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 20,
              children: [
                _buildLensBanner(context),
                _buildPopularSearches(context),
                _buildRecentlyAnalyzed(context, activity),
                _buildTodaysPick(context),
                _buildRecentSearches(context, activity, isDark),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 28),
      decoration: const BoxDecoration(
        gradient: AppColors.brandGradient,
        borderRadius: BorderRadius.only(bottomLeft: Radius.circular(32), bottomRight: Radius.circular(32)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.diamond_rounded, color: Colors.white, size: 28),
                  const SizedBox(width: 8),
                  const Text(
                    'PRISM',
                    style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800, letterSpacing: 2),
                  ),
                ],
              ),
              IconButton(
                onPressed: () => context.go('/my/notifications'),
                icon: const Icon(Icons.notifications_none_rounded, color: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 12),
          NeuBox(
            borderRadius: BorderRadius.circular(999),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              children: [
                const Icon(Icons.search, size: 18, color: Color(0xFFA3A3A3)),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _controller,
                    onSubmitted: _startSearch,
                    decoration: const InputDecoration(
                      hintText: '제품명, 브랜드, 키워드를 검색해보세요',
                      hintStyle: TextStyle(color: Color(0xFFA3A3A3), fontSize: 14),
                      border: InputBorder.none,
                    ),
                  ),
                ),
                NeuPressable(
                  variant: NeuVariant.small,
                  borderRadius: BorderRadius.circular(999),
                  onTap: () => context.go('/lens'),
                  padding: const EdgeInsets.all(8),
                  child: const Icon(Icons.camera_alt_outlined, size: 15, color: AppColors.brand500),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLensBanner(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return NeuPressable(
      onTap: () => context.go('/lens'),
      borderRadius: BorderRadius.circular(16),
      color: isDark ? AppColors.brand500.withValues(alpha: 0.1) : AppColors.brand50,
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: isDark ? AppColors.brand500.withValues(alpha: 0.2) : AppColors.brand100.withValues(alpha: 0.4),
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Icon(Icons.camera_alt_outlined, size: 16, color: isDark ? AppColors.brand400 : AppColors.brand600),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Prism Lens', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFE5E5E5) : const Color(0xFF262626))),
                Text('사진을 찍으면 AI가 제품을 찾아드려요', overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
              ],
            ),
          ),
          Icon(Icons.chevron_right, size: 16, color: isDark ? const Color(0xFF525252) : const Color(0xFFD4D4D4)),
        ],
      ),
    );
  }

  Widget _sectionHeader(BuildContext context, IconData icon, Color iconColor, String title, VoidCallback onSeeAll) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Icon(icon, size: 14, color: iconColor),
            const SizedBox(width: 6),
            Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
          ],
        ),
        TextButton(
          onPressed: onSeeAll,
          child: Row(
            children: [
              Text('전체보기', style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
              const Icon(Icons.chevron_right, size: 14),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPopularSearches(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final top6 = MockData.popularSearchTerms.take(6).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 8,
      children: [
        _sectionHeader(context, Icons.local_fire_department, AppColors.brand500, '인기 검색어', () => context.go('/search-terms/popular')),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 6,
          crossAxisSpacing: 6,
          childAspectRatio: 4.2,
          children: List.generate(top6.length, (i) {
            final item = top6[i];
            return NeuPressable(
              variant: NeuVariant.small,
              onTap: () => _startSearch(item.term),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              child: Row(
                children: [
                  Container(
                    width: 16,
                    height: 16,
                    decoration: BoxDecoration(
                      color: i < 3 ? AppColors.brand500 : (isDark ? const Color(0xFF262626) : const Color(0xFFF5F5F5)),
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: Text('${i + 1}', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: i < 3 ? Colors.white : const Color(0xFF737373))),
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(item.term, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 11, color: isDark ? const Color(0xFFE5E5E5) : const Color(0xFF262626))),
                  ),
                  if (item.change == SearchTermChange.up) const Icon(Icons.trending_up, size: 11, color: Colors.redAccent),
                  if (item.change == SearchTermChange.down) const Icon(Icons.trending_down, size: 11, color: Colors.blueAccent),
                  if (item.change == SearchTermChange.same) const Icon(Icons.remove, size: 11, color: Color(0xFFD4D4D4)),
                ],
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildRecentlyAnalyzed(BuildContext context, ActivityProvider activity) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final items = activity.viewedProducts.take(10).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 8,
      children: [
        _sectionHeader(context, Icons.bar_chart, const Color(0xFFA3A3A3), '최근 분석한 제품', () => context.go('/my/reviews')),
        if (items.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text('아직 분석한 제품이 없어요', style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFF737373) : const Color(0xFFA3A3A3))),
          )
        else
          SizedBox(
            height: 132,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final item = items[i];
                return SizedBox(
                  width: 112,
                  child: NeuPressable(
                    variant: NeuVariant.raised,
                    onTap: () => context.go('/result', extra: item.title),
                    padding: const EdgeInsets.all(8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      spacing: 6,
                      children: [
                        ProductThumbnail(title: item.title, width: 96, height: 80, borderRadius: 12),
                        Text(item.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFF5F5F5) : const Color(0xFF171717))),
                        Row(
                          children: [
                            Icon(Icons.star, size: 10, color: AppColors.brand400),
                            const SizedBox(width: 3),
                            Text('${item.rating}', style: TextStyle(fontSize: 11, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
      ],
    );
  }

  Widget _buildTodaysPick(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDark
              ? [AppColors.brand500.withValues(alpha: 0.1), AppColors.brand500.withValues(alpha: 0.05)]
              : [AppColors.brand50, AppColors.brand100.withValues(alpha: 0.6)],
        ),
        boxShadow: neuShadows(NeuVariant.raised, isDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 8,
        children: [
          NeuBox(
            variant: NeuVariant.small,
            borderRadius: BorderRadius.circular(999),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.place_outlined, size: 11, color: AppColors.brand500),
                const SizedBox(width: 4),
                Text('오늘의 Prism Pick', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: isDark ? AppColors.brand400 : AppColors.brand600)),
              ],
            ),
          ),
          InkWell(
            onTap: () => context.go('/collecting', extra: MockData.todaysPickTitle),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(MockData.todaysPickSubtitle, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF525252))),
                      Text(MockData.todaysPickTitle, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? const Color(0xFFF5F5F5) : const Color(0xFF171717))),
                    ],
                  ),
                ),
                ProductThumbnail(
                  title: MockData.todaysPickTitle,
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                  iconColor: AppColors.brand500,
                  iconSize: 20,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSearches(BuildContext context, ActivityProvider activity, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 8,
      children: [
        _sectionHeader(context, Icons.access_time, const Color(0xFFA3A3A3), '최근 검색', () => context.go('/search-terms/recent')),
        if (activity.recentSearches.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text('아직 검색한 제품이 없어요', style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFF737373) : const Color(0xFFA3A3A3))),
          )
        else
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: activity.recentSearches.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final term = activity.recentSearches[i];
                return NeuPressable(
                  variant: NeuVariant.small,
                  borderRadius: BorderRadius.circular(999),
                  onTap: () => _startSearch(term),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  child: Text(term, style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
                );
              },
            ),
          ),
      ],
    );
  }
}
