import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Neumorphism shadow variants, ported from the `.neu` / `.neu-sm` / `.neu-inset`
/// CSS classes in frontend/src/index.css.
enum NeuVariant { raised, small, inset }

List<BoxShadow> neuShadows(NeuVariant variant, bool isDark) {
  switch (variant) {
    case NeuVariant.raised:
      return isDark
          ? [
              BoxShadow(color: Colors.black.withValues(alpha: 0.55), offset: const Offset(6, 6), blurRadius: 14),
              BoxShadow(color: Colors.white.withValues(alpha: 0.03), offset: const Offset(-4, -4), blurRadius: 10),
            ]
          : [
              BoxShadow(color: const Color(0xFFA3B1C6).withValues(alpha: 0.5), offset: const Offset(6, 6), blurRadius: 14),
              BoxShadow(color: Colors.white.withValues(alpha: 0.85), offset: const Offset(-6, -6), blurRadius: 14),
            ];
    case NeuVariant.small:
      return isDark
          ? [
              BoxShadow(color: Colors.black.withValues(alpha: 0.5), offset: const Offset(3, 3), blurRadius: 8),
              BoxShadow(color: Colors.white.withValues(alpha: 0.025), offset: const Offset(-3, -3), blurRadius: 8),
            ]
          : [
              BoxShadow(color: const Color(0xFFA3B1C6).withValues(alpha: 0.45), offset: const Offset(3, 3), blurRadius: 8),
              BoxShadow(color: Colors.white.withValues(alpha: 0.8), offset: const Offset(-3, -3), blurRadius: 8),
            ];
    case NeuVariant.inset:
      return const [];
  }
}

Border? neuBorder(bool isDark) {
  if (!isDark) return null;
  return Border.all(color: Colors.white.withValues(alpha: 0.08));
}

/// A raised/small neumorphic surface. Use [variant] = inset for pressed-in fields;
/// inset shadows aren't natively supported by [BoxShadow] so we approximate them
/// with two soft corner gradients clipped to the border radius.
class NeuBox extends StatelessWidget {
  const NeuBox({
    super.key,
    required this.child,
    this.variant = NeuVariant.raised,
    this.borderRadius = const BorderRadius.all(Radius.circular(16)),
    this.color,
    this.padding,
  });

  final Widget child;
  final NeuVariant variant;
  final BorderRadius borderRadius;
  final Color? color;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = color ?? (isDark ? AppColors.cardDark : Colors.white);

    if (variant == NeuVariant.inset) {
      return ClipRRect(
        borderRadius: borderRadius,
        child: Container(
          decoration: BoxDecoration(color: bg, border: neuBorder(isDark)),
          child: Stack(
            children: [
              Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      center: const Alignment(-1.2, -1.2),
                      radius: 1.6,
                      colors: [
                        (isDark ? Colors.black : const Color(0xFFA3B1C6)).withValues(alpha: isDark ? 0.45 : 0.35),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
              Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      center: const Alignment(1.2, 1.2),
                      radius: 1.6,
                      colors: [
                        (isDark ? Colors.white.withValues(alpha: 0.03) : Colors.white.withValues(alpha: 0.65)),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
              Padding(padding: padding ?? EdgeInsets.zero, child: child),
            ],
          ),
        ),
      );
    }

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: borderRadius,
        border: neuBorder(isDark),
        boxShadow: neuShadows(variant, isDark),
      ),
      child: child,
    );
  }
}

/// Interactive neumorphic surface that swaps to an inset look while pressed,
/// mirroring the `.neu-pressable:active` CSS behaviour.
class NeuPressable extends StatefulWidget {
  const NeuPressable({
    super.key,
    required this.child,
    required this.onTap,
    this.variant = NeuVariant.small,
    this.borderRadius = const BorderRadius.all(Radius.circular(16)),
    this.color,
    this.padding,
  });

  final Widget child;
  final VoidCallback? onTap;
  final NeuVariant variant;
  final BorderRadius borderRadius;
  final Color? color;
  final EdgeInsetsGeometry? padding;

  @override
  State<NeuPressable> createState() => _NeuPressableState();
}

class _NeuPressableState extends State<NeuPressable> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapCancel: () => setState(() => _pressed = false),
      onTapUp: (_) => setState(() => _pressed = false),
      onTap: widget.onTap,
      child: NeuBox(
        variant: _pressed ? NeuVariant.inset : widget.variant,
        borderRadius: widget.borderRadius,
        color: widget.color,
        padding: widget.padding,
        child: widget.child,
      ),
    );
  }
}
