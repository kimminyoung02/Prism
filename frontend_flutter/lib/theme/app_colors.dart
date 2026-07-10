import 'package:flutter/material.dart';

/// Brand palette ported from frontend/src/index.css `@theme` block.
class AppColors {
  AppColors._();

  static const brand50 = Color(0xFFF2E6E6);
  static const brand100 = Color(0xFFB5C1D4);
  static const brand300 = Color(0xFF8D9ABE);
  static const brand400 = Color(0xFF6292BE);
  static const brand500 = Color(0xFF1B4561);
  static const brand600 = Color(0xFF011F25);

  static const surfaceLight = Color(0xFFF5F7FA);
  static const outerLight = Color(0xFFF0F0F0);
  static const outerDark = Color(0xFF171717); // neutral-900 equivalent

  /// Dark-mode card tone (one step lighter than the dark background).
  static const cardDark = Color(0xFF1A2E3D);

  /// Dark-mode background tone (darkest layer).
  static const backgroundDark = Color(0xFF0D1B24);

  static const brandGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [brand500, brand400],
  );

  static const brandGradientHorizontal = LinearGradient(
    colors: [brand500, brand400],
  );
}
