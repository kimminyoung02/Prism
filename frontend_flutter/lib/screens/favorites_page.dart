import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/models.dart';
import '../providers/scrap_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/product_thumbnail.dart';
import '../widgets/scrap_button.dart';

class FavoritesPage extends StatelessWidget {
  const FavoritesPage({super.key});

  void _openItem(BuildContext context, ScrapItem item) {
    if (item.type == 'product') {
      context.go('/result', extra: item.query);
    } else if (item.url != null) {
      launchUrl(Uri.parse(item.url!), mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final items = context.watch<ScrapProvider>().items;
    final products = items.where((i) => i.type == 'product').toList();
    final reviews = items.where((i) => i.type == 'review').toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(20, 40, 20, 40),
          decoration: const BoxDecoration(
            gradient: AppColors.brandGradient,
            borderRadius: BorderRadius.only(bottomLeft: Radius.circular(32), bottomRight: Radius.circular(32)),
          ),
          child: const Text('즐겨찾기', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
        ),
        Expanded(
          child: items.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.bookmark_border, size: 32, color: Color(0xFFA3A3A3)),
                      const SizedBox(height: 8),
                      Text('스크랩한 제품이나 리뷰가 없어요', style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
                    ],
                  ),
                )
              : ListView(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                  children: [
                    if (products.isNotEmpty) ...[
                      _sectionTitle(context, Icons.checkroom, '찜한 제품', products.length),
                      const SizedBox(height: 12),
                      ...products.map((item) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: _ScrapRow(item: item, onOpen: () => _openItem(context, item)),
                          )),
                      const SizedBox(height: 12),
                    ],
                    if (reviews.isNotEmpty) ...[
                      _sectionTitle(context, Icons.chat_bubble_outline, '찜한 리뷰', reviews.length),
                      const SizedBox(height: 12),
                      ...reviews.map((item) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: _ScrapRow(item: item, onOpen: () => _openItem(context, item)),
                          )),
                    ],
                  ],
                ),
        ),
      ],
    );
  }

  Widget _sectionTitle(BuildContext context, IconData icon, String label, int count) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      children: [
        Icon(icon, size: 15, color: const Color(0xFFA3A3A3)),
        const SizedBox(width: 6),
        Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
        const SizedBox(width: 4),
        Text('$count', style: const TextStyle(fontSize: 14, color: Color(0xFFA3A3A3))),
      ],
    );
  }
}

class _ScrapRow extends StatelessWidget {
  const _ScrapRow({required this.item, required this.onOpen});

  final ScrapItem item;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: isDark ? Border.all(color: Colors.white10) : null,
      ),
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              onTap: onOpen,
              child: Row(
                children: [
                  if (item.type == 'product') ...[
                    ProductThumbnail(title: item.title, width: 48, height: 48, borderRadius: 12),
                    const SizedBox(width: 12),
                  ],
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? const Color(0xFFF5F5F5) : const Color(0xFF171717))),
                        Text(item.subtitle, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: Color(0xFFA3A3A3))),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          ScrapButton(item: item, size: 18),
        ],
      ),
    );
  }
}
