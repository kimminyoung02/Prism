import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/activity_provider.dart';
import '../widgets/product_thumbnail.dart';
import '../widgets/star_rating.dart';

class ProductHistoryPage extends StatelessWidget {
  const ProductHistoryPage({super.key, required this.title, required this.emptyText});

  final String title;
  final String emptyText;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final items = context.watch<ActivityProvider>().viewedProducts;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.arrow_back)),
              Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF171717))),
            ],
          ),
          const SizedBox(height: 12),
          if (items.isEmpty)
            Text(emptyText, style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373)))
          else
            ...items.map((item) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1A2E3D) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: isDark ? Border.all(color: Colors.white10) : null,
                  ),
                  child: Row(
                    children: [
                      ProductThumbnail(title: item.title, width: 56, height: 56, borderRadius: 12, iconSize: 24),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: isDark ? const Color(0xFFF5F5F5) : const Color(0xFF171717))),
                            Text('분석일 ${item.date}', style: const TextStyle(fontSize: 12, color: Color(0xFFA3A3A3))),
                            StarRating(rating: item.rating, size: 14),
                          ],
                        ),
                      ),
                    ],
                  ),
                )),
        ],
      ),
    );
  }
}
