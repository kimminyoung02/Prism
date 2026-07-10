import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../api/api_client.dart';
import '../mock/mock_data.dart';
import '../models/models.dart';
import '../providers/activity_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';
import '../widgets/product_thumbnail.dart';
import '../widgets/scrap_button.dart';
import '../widgets/star_rating.dart';

enum _LoadStatus { loading, error, success }

class ResultPage extends StatefulWidget {
  const ResultPage({super.key, this.query});

  final String? query;

  @override
  State<ResultPage> createState() => _ResultPageState();
}

class _ResultPageState extends State<ResultPage> with SingleTickerProviderStateMixin {
  late final String _query = widget.query ?? MockData.defaultQuery;
  late final TabController _tabController = TabController(length: 3, vsync: this);

  List<ReviewItem> _blogReviews = [];
  _LoadStatus _blogStatus = _LoadStatus.loading;
  List<ReviewItem> _youtubeReviews = [];
  _LoadStatus _youtubeStatus = _LoadStatus.loading;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final activity = context.read<ActivityProvider>();
      activity.recordProductView(_query, MockData.aiConclusionRating);
      activity.incrementAnalysisRun();
    });

    ApiClient.searchBlog(_query).then((items) {
      if (mounted) setState(() { _blogReviews = items; _blogStatus = _LoadStatus.success; });
    }).catchError((_) {
      if (mounted) setState(() => _blogStatus = _LoadStatus.error);
    });

    ApiClient.searchYoutube(_query).then((items) {
      if (mounted) setState(() { _youtubeReviews = items; _youtubeStatus = _LoadStatus.success; });
    }).catchError((_) {
      if (mounted) setState(() => _youtubeStatus = _LoadStatus.error);
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _openLink(String url) {
    launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildHeader(context),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildAnalysisTab(context),
              _buildChannelTab(context, _blogReviews, _blogStatus, '블로그', Icons.article_outlined),
              _buildChannelTab(context, _youtubeReviews, _youtubeStatus, '유튜브', Icons.smart_display_outlined),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 16, 12, 0),
      decoration: const BoxDecoration(gradient: AppColors.brandGradient),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.arrow_back, color: Colors.white)),
              const Expanded(
                child: Text('분석 결과', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
              IconButton(onPressed: () => context.go('/'), icon: const Icon(Icons.search, color: Colors.white)),
              IconButton(onPressed: () => context.go('/my/notifications'), icon: const Icon(Icons.notifications_none, color: Colors.white)),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: ScrapButton(
                  size: 22,
                  item: ScrapItem(
                    id: 'product:$_query',
                    type: 'product',
                    title: _query,
                    subtitle: '리뷰 ${MockData.totalReviewCount}개 · 분석일 ${MockData.analyzedDate}',
                    query: _query,
                  ),
                ),
              ),
            ],
          ),
          TabBar(
            controller: _tabController,
            indicatorColor: Colors.white,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white.withValues(alpha: 0.5),
            labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
            tabs: const [Tab(text: 'AI 분석 결과'), Tab(text: '블로그'), Tab(text: '유튜브')],
          ),
        ],
      ),
    );
  }

  Widget _buildAnalysisTab(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 56),
            decoration: const BoxDecoration(gradient: AppColors.brandGradient),
            child: Column(
              children: [
                ProductThumbnail(title: _query, width: 112, height: 112, borderRadius: 24, backgroundColor: Colors.white.withValues(alpha: 0.15), iconColor: Colors.white, iconSize: 48),
                const SizedBox(height: 12),
                Text(_query, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 4),
                Text('리뷰 ${MockData.totalReviewCount}개 · 분석일 ${MockData.analyzedDate}', style: TextStyle(fontSize: 14, color: Colors.white.withValues(alpha: 0.85))),
              ],
            ),
          ),
          Transform.translate(
            offset: const Offset(0, -32),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 0),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? AppColors.cardDark : Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                border: isDark ? Border.all(color: Colors.white10) : null,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 12,
                children: [
                  Text('Prism AI 한줄 결론', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? AppColors.brand400 : AppColors.brand600)),
                  const StarRating(rating: MockData.aiConclusionRating),
                  Text(MockData.aiConclusionSummary, style: TextStyle(fontSize: 14, height: 1.5, color: isDark ? const Color(0xFFE5E5E5) : const Color(0xFF262626))),
                ],
              ),
            ),
          ),
          Transform.translate(
            offset: const Offset(0, -8),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                spacing: 12,
                children: [
                  Row(
                    children: MockData.reviewSources.map((source) {
                      final icon = source.key == 'blog' ? Icons.article_outlined : Icons.smart_display_outlined;
                      return Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 6),
                          child: NeuPressable(
                            variant: NeuVariant.small,
                            onTap: () => _tabController.animateTo(source.key == 'blog' ? 1 : 2),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            child: Column(
                              children: [
                                Icon(icon, size: 20, color: const Color(0xFF737373)),
                                const SizedBox(height: 6),
                                Text(source.label, style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
                                Text('${source.count}건', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? const Color(0xFFF5F5F5) : const Color(0xFF171717))),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.cardDark : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: isDark ? Border.all(color: Colors.white10) : null,
                      boxShadow: isDark ? null : [const BoxShadow(color: Colors.black12, blurRadius: 6)],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      spacing: 20,
                      children: [
                        _prosConsSection(context, '주요 장점', MockData.pros, Icons.check_circle, Colors.green),
                        _prosConsSection(context, '주요 단점', MockData.cons, Icons.cancel, Colors.red),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          spacing: 12,
                          children: [
                            Text('핵심 키워드', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: MockData.keywords.map((k) {
                                return Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF262626) : const Color(0xFFF5F5F5),
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  child: Text.rich(TextSpan(children: [
                                    TextSpan(text: k.word, style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
                                    TextSpan(text: ' ${k.count}', style: const TextStyle(fontSize: 12, color: Color(0xFF737373))),
                                  ])),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _prosConsSection(BuildContext context, String title, List<String> items, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 8,
      children: [
        Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
        ...items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(icon, size: 16, color: color),
                  const SizedBox(width: 8),
                  Expanded(child: Text(item, style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040)))),
                ],
              ),
            )),
      ],
    );
  }

  Widget _buildChannelTab(BuildContext context, List<ReviewItem> reviews, _LoadStatus status, String label, IconData fallbackIcon) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final mutedColor = isDark ? const Color(0xFF737373) : const Color(0xFFA3A3A3);

    if (status == _LoadStatus.loading) {
      return Center(child: Text('$label 리뷰를 불러오는 중이에요...', style: TextStyle(color: mutedColor)));
    }
    if (status == _LoadStatus.error) {
      return Center(child: Text('$label 리뷰를 불러오지 못했어요', style: TextStyle(color: mutedColor)));
    }
    if (reviews.isEmpty) {
      return Center(child: Text('관련 $label 리뷰가 없어요', style: TextStyle(color: mutedColor)));
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      itemCount: reviews.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (context, i) {
        final review = reviews[i];
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? AppColors.cardDark : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: neuBorder(isDark),
            boxShadow: neuShadows(NeuVariant.small, isDark),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: review.thumbnail != null
                    ? Image.network(review.thumbnail!, width: 64, height: 64, fit: BoxFit.cover)
                    : Container(
                        width: 64,
                        height: 64,
                        color: isDark ? const Color(0xFF262626) : const Color(0xFFF5F5F5),
                        alignment: Alignment.center,
                        child: Icon(fallbackIcon, color: const Color(0xFFA3A3A3)),
                      ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 6,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(child: Text(review.title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? const Color(0xFFF5F5F5) : const Color(0xFF171717)))),
                        ScrapButton(
                          size: 18,
                          item: ScrapItem(id: review.id, type: 'review', title: review.title, subtitle: '${review.source} · ${review.date}', url: review.url),
                        ),
                      ],
                    ),
                    Text('${review.source} · ${review.date}', style: TextStyle(fontSize: 12, color: mutedColor)),
                    Text(review.stat, maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, color: mutedColor)),
                    InkWell(
                      onTap: () => _openLink(review.url),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text('원문 가기', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
                          const SizedBox(width: 4),
                          const Icon(Icons.open_in_new, size: 12),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
