import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Ported from frontend/src/components/ToggleSwitch.tsx.
class AppToggleSwitch extends StatelessWidget {
  const AppToggleSwitch({super.key, required this.checked, required this.onChanged, required this.label});

  final bool checked;
  final ValueChanged<bool> onChanged;
  final String label;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Semantics(
      toggled: checked,
      label: label,
      child: GestureDetector(
        onTap: () => onChanged(!checked),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 44,
          height: 24,
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            gradient: checked ? AppColors.brandGradientHorizontal : null,
            color: checked ? null : (isDark ? const Color(0xFF404040) : const Color(0xFFE5E5E5)),
          ),
          child: AnimatedAlign(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOut,
            alignment: checked ? Alignment.centerRight : Alignment.centerLeft,
            child: Container(
              width: 20,
              height: 20,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 2, offset: Offset(0, 1))],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
