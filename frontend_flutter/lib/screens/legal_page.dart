import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class LegalPage extends StatelessWidget {
  const LegalPage({super.key, required this.title, required this.paragraphs});

  final String title;
  final List<String> paragraphs;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.arrow_back)),
              Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF171717))),
            ],
          ),
          const SizedBox(height: 12),
          ...paragraphs.map((p) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(p, style: TextStyle(fontSize: 14, height: 1.6, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF525252))),
              )),
        ],
      ),
    );
  }
}
