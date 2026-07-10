import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../mock/mock_data.dart';
import '../models/models.dart';
import '../providers/activity_provider.dart';
import '../theme/app_colors.dart';

enum SearchTermsVariant { recent, popular }

class SearchTermsListPage extends StatelessWidget {
  const SearchTermsListPage({super.key, required this.variant});

  final SearchTermsVariant variant;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final recentSearches = context.watch<ActivityProvider>().recentSearches;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.arrow_back)),
              Text(
                variant == SearchTermsVariant.recent ? '최근 검색' : '인기 검색어',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF171717)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (variant == SearchTermsVariant.recent)
            ...recentSearches.map((term) => _row(
                  context,
                  onTap: () => context.go('/collecting', extra: term),
                  child: Row(
                    children: [
                      const Icon(Icons.search, size: 16, color: Color(0xFFA3A3A3)),
                      const SizedBox(width: 12),
                      Text(term, style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFE5E5E5) : const Color(0xFF262626))),
                    ],
                  ),
                ))
          else
            ...List.generate(MockData.popularSearchTerms.length, (i) {
              final item = MockData.popularSearchTerms[i];
              return _row(
                context,
                onTap: () => context.go('/collecting', extra: item.term),
                child: Row(
                  children: [
                    SizedBox(width: 20, child: Text('${i + 1}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.brand500))),
                    const SizedBox(width: 8),
                    Expanded(child: Text(item.term, style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFE5E5E5) : const Color(0xFF262626)))),
                    if (item.change == SearchTermChange.up)
                      Row(children: [const Icon(Icons.trending_up, size: 14, color: Colors.redAccent), Text('${item.diff}', style: const TextStyle(fontSize: 12, color: Colors.redAccent))]),
                    if (item.change == SearchTermChange.down)
                      Row(children: [const Icon(Icons.trending_down, size: 14, color: Colors.blueAccent), Text('${item.diff}', style: const TextStyle(fontSize: 12, color: Colors.blueAccent))]),
                    if (item.change == SearchTermChange.same) const Icon(Icons.remove, size: 14, color: Color(0xFFD4D4D4)),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _row(BuildContext context, {required VoidCallback onTap, required Widget child}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10), child: child),
    );
  }
}
