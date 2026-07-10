import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';
import '../providers/theme_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';
import '../widgets/language_modal.dart';
import '../widgets/toggle_switch.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<ThemeProvider>();
    final language = context.watch<LanguageProvider>();
    final currentLabel = LanguageProvider.languages.firstWhere((l) => l.code == language.language).label;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.fromLTRB(8, 24, 20, 20),
          decoration: const BoxDecoration(
            gradient: AppColors.brandGradient,
            borderRadius: BorderRadius.only(bottomLeft: Radius.circular(24), bottomRight: Radius.circular(24)),
          ),
          child: Row(
            children: [
              IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.arrow_back, color: Colors.white)),
              const Text('설정', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
            ],
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            children: [
              NeuPressable(
                variant: NeuVariant.small,
                onTap: () => context.go('/edit-profile'),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: _row(context, Icons.manage_accounts_outlined, '계정정보', trailing: const Icon(Icons.chevron_right, size: 16, color: Color(0xFFD4D4D4))),
              ),
              const SizedBox(height: 8),
              NeuPressable(
                variant: NeuVariant.small,
                onTap: () => context.go('/my/settings/password'),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: _row(context, Icons.key_outlined, '비밀번호 변경', trailing: const Icon(Icons.chevron_right, size: 16, color: Color(0xFFD4D4D4))),
              ),
              const SizedBox(height: 8),
              NeuBox(
                variant: NeuVariant.small,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: _row(context, Icons.dark_mode_outlined, '다크모드', trailing: AppToggleSwitch(checked: theme.isDark, onChanged: (_) => theme.toggleDark(), label: '다크모드')),
              ),
              const SizedBox(height: 8),
              NeuPressable(
                variant: NeuVariant.small,
                onTap: () => showLanguageModal(context),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: _row(
                  context,
                  Icons.language,
                  '언어설정',
                  trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                    Text(currentLabel, style: const TextStyle(fontSize: 12, color: Color(0xFF737373))),
                    const SizedBox(width: 4),
                    const Icon(Icons.chevron_right, size: 16, color: Color(0xFFD4D4D4)),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _row(BuildContext context, IconData icon, String label, {required Widget trailing}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      children: [
        Icon(icon, size: 18, color: const Color(0xFFA3A3A3)),
        const SizedBox(width: 12),
        Expanded(child: Text(label, style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040)))),
        trailing,
      ],
    );
  }
}
