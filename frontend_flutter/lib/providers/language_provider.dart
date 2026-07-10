import 'package:flutter/material.dart';

class LanguageOption {
  const LanguageOption(this.code, this.label);
  final String code;
  final String label;
}

/// Ported from frontend/src/store/LanguageContext.tsx.
class LanguageProvider extends ChangeNotifier {
  static const List<LanguageOption> languages = [
    LanguageOption('ko', '한국어'),
    LanguageOption('en', 'English'),
    LanguageOption('zh', '中文'),
    LanguageOption('ja', '日本語'),
  ];

  String _language = 'ko';
  String get language => _language;

  void setLanguage(String code) {
    _language = code;
    notifyListeners();
  }
}
