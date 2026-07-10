import 'package:flutter/material.dart';
import '../models/models.dart';

/// Ported from frontend/src/store/ScrapContext.tsx.
class ScrapProvider extends ChangeNotifier {
  final List<ScrapItem> _items = [];
  List<ScrapItem> get items => List.unmodifiable(_items);

  bool isScrapped(String id) => _items.any((i) => i.id == id);

  void toggleScrap(ScrapItem item) {
    final existingIndex = _items.indexWhere((i) => i.id == item.id);
    if (existingIndex >= 0) {
      _items.removeAt(existingIndex);
    } else {
      _items.insert(0, item);
    }
    notifyListeners();
  }
}
