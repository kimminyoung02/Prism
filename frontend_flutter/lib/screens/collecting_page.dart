import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../api/api_client.dart';
import '../mock/mock_data.dart';
import '../providers/activity_provider.dart';
import '../theme/app_colors.dart';

const _shoppingTotal = 15;

class CollectingPage extends StatefulWidget {
  const CollectingPage({super.key, this.query});

  final String? query;

  @override
  State<CollectingPage> createState() => _CollectingPageState();
}

class _CollectingPageState extends State<CollectingPage> {
  late final String _query = widget.query ?? MockData.defaultQuery;

  int? _blogTotal;
  int? _youtubeTotal;
  int _blogCount = 0;
  int _youtubeCount = 0;
  int _shoppingCount = 0;
  Timer? _timer;
  bool _navigated = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ActivityProvider>().addSearch(_query);
    });

    ApiClient.searchBlog(_query).then((items) {
      if (mounted) setState(() => _blogTotal = items.length);
    }).catchError((_) {
      if (mounted) setState(() => _blogTotal = 0);
    });

    ApiClient.searchYoutube(_query).then((items) {
      if (mounted) setState(() => _youtubeTotal = items.length);
    }).catchError((_) {
      if (mounted) setState(() => _youtubeTotal = 0);
    });

    _timer = Timer.periodic(const Duration(milliseconds: 200), (_) => _tick());
  }

  int _advance(int current, int total) {
    final step = (total / 8).ceil().clamp(1, 1 << 30);
    return (current + step).clamp(0, total);
  }

  void _tick() {
    setState(() {
      if (_blogTotal != null) _blogCount = _advance(_blogCount, _blogTotal!);
      if (_youtubeTotal != null) _youtubeCount = _advance(_youtubeCount, _youtubeTotal!);
      _shoppingCount = _advance(_shoppingCount, _shoppingTotal);
    });
    _maybeNavigate();
  }

  void _maybeNavigate() {
    final blogDone = _blogTotal != null && _blogCount >= _blogTotal!;
    final youtubeDone = _youtubeTotal != null && _youtubeCount >= _youtubeTotal!;
    final shoppingDone = _shoppingCount >= _shoppingTotal;
    if (blogDone && youtubeDone && shoppingDone && !_navigated) {
      _navigated = true;
      _timer?.cancel();
      Future.delayed(const Duration(milliseconds: 500), () {
        if (mounted) context.go('/analyzing', extra: _query);
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final channels = [
      (label: '블로그', icon: Icons.article_outlined, total: _blogTotal, count: _blogCount),
      (label: '유튜브', icon: Icons.smart_display_outlined, total: _youtubeTotal, count: _youtubeCount),
      (label: '쇼핑몰', icon: Icons.shopping_bag_outlined, total: _shoppingTotal, count: _shoppingCount),
    ];

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "'$_query' 리뷰를 수집하고 있어요",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF171717)),
            ),
            const SizedBox(height: 4),
            Text('잠시만 기다려주세요', style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
            const SizedBox(height: 32),
            ...channels.map((c) {
              final isLoading = c.total == null;
              final isEmpty = c.total == 0;
              final done = !isLoading && c.count >= c.total!;
              final percent = isLoading ? 0.0 : (c.count / (c.total! == 0 ? 1 : c.total!)).clamp(0.0, 1.0);
              return Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(c.icon, size: 16, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040)),
                            const SizedBox(width: 8),
                            Text(c.label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
                          ],
                        ),
                        Row(
                          children: [
                            Text(
                              isLoading ? '확인 중...' : (isEmpty ? '검색 결과 없음' : '${c.count}/${c.total}'),
                              style: TextStyle(fontSize: 13, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373)),
                            ),
                            if (done) ...[
                              const SizedBox(width: 4),
                              const Icon(Icons.check, size: 14, color: Colors.green),
                            ],
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(999),
                      child: LinearProgressIndicator(
                        value: isEmpty ? 1.0 : percent,
                        minHeight: 8,
                        backgroundColor: isDark ? const Color(0xFF262626) : const Color(0xFFF5F5F5),
                        valueColor: AlwaysStoppedAnimation(
                          isEmpty ? (isDark ? const Color(0xFF525252) : const Color(0xFFD4D4D4)) : AppColors.brand500,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
