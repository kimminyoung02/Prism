import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../mock/mock_data.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';

class LensResultPage extends StatelessWidget {
  const LensResultPage({super.key, this.imagePath});

  /// Actually receives the captured image bytes (Uint8List) via go_router `extra`.
  final Object? imagePath;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bytes = imagePath is Uint8List ? imagePath as Uint8List : null;
    final productLabel = '${MockData.lensIdentifiedBrand} ${MockData.lensIdentifiedName}';

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
              IconButton(onPressed: () => context.go('/'), icon: const Icon(Icons.arrow_back, color: Colors.white)),
              const Text('식별 결과', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
            ],
          ),
        ),
        Expanded(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('이 제품이에요!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF171717))),
                  const SizedBox(height: 20),
                  Container(
                    width: 192,
                    height: 192,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.cardDark : Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: neuShadows(NeuVariant.raised, isDark),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: bytes != null
                        ? Image.memory(bytes, fit: BoxFit.cover)
                        : Icon(Icons.checkroom, size: 56, color: isDark ? const Color(0xFF404040) : const Color(0xFFD4D4D4)),
                  ),
                  const SizedBox(height: 20),
                  Text(productLabel, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF171717))),
                  const SizedBox(height: 8),
                  NeuBox(
                    variant: NeuVariant.small,
                    borderRadius: BorderRadius.circular(999),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.verified_user_outlined, size: 14, color: Colors.green),
                        const SizedBox(width: 6),
                        Text(MockData.lensIdentifiedConfidence, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.green)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => context.go('/result', extra: productLabel),
                      style: ElevatedButton.styleFrom(backgroundColor: AppColors.brand500, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                      child: const Text('이 제품 리뷰 분석 보기', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
