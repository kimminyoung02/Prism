import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_image_provider.dart';

/// Ported from frontend/src/components/ProductThumbnail.tsx.
///
/// Fetches (and shares) a real product photo via [ProductImageProvider], keyed
/// by [title]; falls back to a shirt icon while loading or when none is found.
class ProductThumbnail extends StatefulWidget {
  const ProductThumbnail({
    super.key,
    required this.title,
    required this.width,
    required this.height,
    this.borderRadius = 12,
    this.backgroundColor,
    this.iconColor,
    this.iconSize = 22,
  });

  final String title;
  final double width;
  final double height;
  final double borderRadius;
  final Color? backgroundColor;
  final Color? iconColor;
  final double iconSize;

  @override
  State<ProductThumbnail> createState() => _ProductThumbnailState();
}

class _ProductThumbnailState extends State<ProductThumbnail> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) context.read<ProductImageProvider>().ensureImage(widget.title);
    });
  }

  @override
  void didUpdateWidget(covariant ProductThumbnail oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.title != widget.title) {
      context.read<ProductImageProvider>().ensureImage(widget.title);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final url = context.watch<ProductImageProvider>().imageFor(widget.title);
    final bg = widget.backgroundColor ?? (isDark ? const Color(0xFF262626) : const Color(0xFFF5F5F5));

    return ClipRRect(
      borderRadius: BorderRadius.circular(widget.borderRadius),
      child: Container(
        width: widget.width,
        height: widget.height,
        color: bg,
        alignment: Alignment.center,
        child: url != null
            ? Image.network(
                url,
                width: widget.width,
                height: widget.height,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => _fallbackIcon(isDark),
              )
            : _fallbackIcon(isDark),
      ),
    );
  }

  Widget _fallbackIcon(bool isDark) {
    return Icon(
      Icons.checkroom,
      size: widget.iconSize,
      color: widget.iconColor ?? (isDark ? const Color(0xFFA3A3A3) : const Color(0xFFA3A3A3)),
    );
  }
}
