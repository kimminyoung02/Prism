import 'package:flutter/material.dart';

/// Ported from frontend/src/components/StarRating.tsx.
class StarRating extends StatelessWidget {
  const StarRating({super.key, required this.rating, this.max = 5, this.size = 20});

  final double rating;
  final int max;
  final double size;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final emptyColor = isDark ? const Color(0xFF525252) : const Color(0xFFD4D4D4);
    final fillColor = isDark ? const Color(0xFF8D9ABE) : const Color(0xFF1B4561);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(max, (i) {
        final fill = (rating - i).clamp(0.0, 1.0);
        return Padding(
          padding: EdgeInsets.only(right: i == max - 1 ? 0 : 2),
          child: SizedBox(
            width: size,
            height: size,
            child: Stack(
              children: [
                Icon(Icons.star, size: size, color: emptyColor),
                if (fill > 0)
                  ClipRect(
                    clipper: _FractionClipper(fill),
                    child: Icon(Icons.star, size: size, color: fillColor),
                  ),
              ],
            ),
          ),
        );
      }),
    );
  }
}

class _FractionClipper extends CustomClipper<Rect> {
  _FractionClipper(this.fraction);
  final double fraction;

  @override
  Rect getClip(Size size) => Rect.fromLTWH(0, 0, size.width * fraction, size.height);

  @override
  bool shouldReclip(covariant _FractionClipper oldClipper) => oldClipper.fraction != fraction;
}
