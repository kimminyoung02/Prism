import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import 'bottom_nav.dart';

/// Ported from frontend/src/components/Layout.tsx: caps the app to a
/// phone-width column (430px) centered on wider (desktop) viewports, with a
/// sticky bottom nav.
class AppLayout extends StatelessWidget {
  const AppLayout({super.key, required this.child, required this.currentPath, required this.onNavigate});

  final Widget child;
  final String currentPath;
  final void Function(String path) onNavigate;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return ColoredBox(
      color: isDark ? AppColors.outerDark : AppColors.outerLight,
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 430),
          child: ColoredBox(
            color: isDark ? AppColors.backgroundDark : AppColors.surfaceLight,
            child: Column(
              children: [
                Expanded(child: child),
                BottomNav(currentPath: currentPath, onNavigate: onNavigate),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Ported from the `LensLayout` in App.tsx: same 430px column, no bottom nav.
class LensLayout extends StatelessWidget {
  const LensLayout({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: Colors.black,
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 430),
          child: child,
        ),
      ),
    );
  }
}
