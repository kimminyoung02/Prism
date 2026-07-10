import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/models.dart';
import '../providers/scrap_provider.dart';
import '../theme/app_colors.dart';

/// Ported from frontend/src/components/ScrapButton.tsx.
class ScrapButton extends StatefulWidget {
  const ScrapButton({super.key, required this.item, this.size = 20});

  final ScrapItem item;
  final double size;

  @override
  State<ScrapButton> createState() => _ScrapButtonState();
}

class _ScrapButtonState extends State<ScrapButton> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 350));
    _scale = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.35), weight: 35),
      TweenSequenceItem(tween: Tween(begin: 1.35, end: 1.0), weight: 65),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scrap = context.watch<ScrapProvider>();
    final scrapped = scrap.isScrapped(widget.item.id);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Semantics(
      button: true,
      toggled: scrapped,
      label: scrapped ? '스크랩 해제' : '스크랩',
      child: GestureDetector(
        onTap: () {
          context.read<ScrapProvider>().toggleScrap(widget.item);
          _controller.forward(from: 0);
        },
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: AnimatedBuilder(
            animation: _scale,
            builder: (context, child) => Transform.scale(scale: _scale.value, child: child),
            child: SizedBox(
              width: widget.size,
              height: widget.size,
              child: Stack(
                children: [
                  Icon(
                    Icons.bookmark_border,
                    size: widget.size,
                    color: isDark ? const Color(0xFF525252) : const Color(0xFFD4D4D4),
                  ),
                  AnimatedOpacity(
                    duration: const Duration(milliseconds: 300),
                    opacity: scrapped ? 1 : 0,
                    child: Icon(Icons.bookmark, size: widget.size, color: AppColors.brand400),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
