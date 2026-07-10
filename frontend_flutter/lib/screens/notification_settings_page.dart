import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/notification_settings_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';
import '../widgets/toggle_switch.dart';

const _labels = {
  'push': '푸시 알림',
  'analysisDone': '분석완료 알림',
  'recommend': '추천제품 알림',
};

class NotificationSettingsPage extends StatelessWidget {
  const NotificationSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<NotificationSettingsProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

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
              const Text('알림', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
            ],
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: _labels.entries.map((entry) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: NeuBox(
                  variant: NeuVariant.small,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      Expanded(child: Text(entry.value, style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040)))),
                      AppToggleSwitch(
                        checked: settings.toggles[entry.key] ?? false,
                        onChanged: (value) => context.read<NotificationSettingsProvider>().setToggle(entry.key, value),
                        label: entry.value,
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
