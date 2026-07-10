import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

const homePaths = [
  '/',
  '/collecting',
  '/analyzing',
  '/result',
  '/lens',
  '/lens/analyzing',
  '/lens/result',
];

class _NavTab {
  const _NavTab(this.to, this.label, this.icon, this.match);
  final String to;
  final String label;
  final IconData icon;
  final bool Function(String path) match;
}

final _tabs = [
  _NavTab('/', '홈', Icons.home_rounded, (p) => homePaths.contains(p)),
  _NavTab('/favorites', '즐겨찾기', Icons.bookmark_rounded, (p) => p == '/favorites'),
  _NavTab('/my', '마이페이지', Icons.person_rounded, (p) => p == '/my'),
];

/// Ported from frontend/src/components/BottomNav.tsx.
class BottomNav extends StatelessWidget {
  const BottomNav({super.key, required this.currentPath, required this.onNavigate});

  final String currentPath;
  final void Function(String path) onNavigate;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        border: isDark ? const Border(top: BorderSide(color: Colors.white10)) : null,
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black.withValues(alpha: 0.5) : const Color(0xFFA3B1C6).withValues(alpha: 0.35),
            blurRadius: 14,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: _tabs.map((tab) {
            final active = tab.match(currentPath);
            final color = active ? AppColors.brand500 : const Color(0xFFA3A3A3);
            return Expanded(
              child: InkWell(
                onTap: () => onNavigate(tab.to),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(tab.icon, size: 20, color: color),
                      const SizedBox(height: 4),
                      Text(
                        tab.label,
                        style: TextStyle(
                          fontSize: 11,
                          color: color,
                          fontWeight: active ? FontWeight.w600 : FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
