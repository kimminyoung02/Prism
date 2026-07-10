import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';

/// Ported from frontend/src/components/LanguageModal.tsx.
Future<void> showLanguageModal(BuildContext context) {
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: Colors.transparent,
    builder: (context) => const _LanguageModalContent(),
  );
}

class _LanguageModalContent extends StatelessWidget {
  const _LanguageModalContent();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final language = context.watch<LanguageProvider>();

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: isDark ? Border.all(color: Colors.white10) : null,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '언어 설정',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : const Color(0xFF171717),
                ),
              ),
              IconButton(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.close, size: 18),
                color: const Color(0xFFA3A3A3),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ...LanguageProvider.languages.map((lang) {
            final selected = lang.code == language.language;
            return Padding(
              padding: const EdgeInsets.only(top: 8),
              child: NeuPressable(
                variant: NeuVariant.small,
                onTap: () {
                  context.read<LanguageProvider>().setLanguage(lang.code);
                  Navigator.of(context).pop();
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        lang.label,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
                          color: selected
                              ? AppColors.brand500
                              : (isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040)),
                        ),
                      ),
                      if (selected) Icon(Icons.check, size: 18, color: AppColors.brand500),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
