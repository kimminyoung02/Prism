import 'package:flutter/material.dart';
import '../models/models.dart';

const _maxRecentSearches = 8;
const _maxViewedProducts = 20;

/// Ported from frontend/src/store/ActivityContext.tsx.
/// All state is intentionally in-memory only (resets on app restart),
/// matching the original "새로고침하면 초기화되어도 괜찮아" requirement.
class ActivityProvider extends ChangeNotifier {
  final List<String> _recentSearches = [];
  final List<MyListItem> _viewedProducts = [];
  int _analysisRunCount = 0;

  List<String> get recentSearches => List.unmodifiable(_recentSearches);
  List<MyListItem> get viewedProducts => List.unmodifiable(_viewedProducts);
  int get analysisRunCount => _analysisRunCount;

  void addSearch(String term) {
    final trimmed = term.trim();
    if (trimmed.isEmpty) return;
    _recentSearches.removeWhere((t) => t == trimmed);
    _recentSearches.insert(0, trimmed);
    if (_recentSearches.length > _maxRecentSearches) {
      _recentSearches.removeRange(_maxRecentSearches, _recentSearches.length);
    }
    notifyListeners();
  }

  void recordProductView(String title, double rating) {
    final existingIndex = _viewedProducts.indexWhere((i) => i.title == title);
    final existing = existingIndex >= 0 ? _viewedProducts[existingIndex] : null;
    final entry = MyListItem(
      id: existing?.id ?? 'view-${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      date: _formatToday(),
      rating: rating,
      reviewCount: existing?.reviewCount,
      aiComment: existing?.aiComment,
    );
    _viewedProducts.removeWhere((i) => i.title == title);
    _viewedProducts.insert(0, entry);
    if (_viewedProducts.length > _maxViewedProducts) {
      _viewedProducts.removeRange(_maxViewedProducts, _viewedProducts.length);
    }
    notifyListeners();
  }

  void incrementAnalysisRun() {
    _analysisRunCount += 1;
    notifyListeners();
  }

  static String _formatToday() {
    final now = DateTime.now();
    final y = now.year.toString();
    final m = now.month.toString().padLeft(2, '0');
    final d = now.day.toString().padLeft(2, '0');
    return '$y.$m.$d';
  }
}
