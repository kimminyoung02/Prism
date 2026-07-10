import 'package:flutter/material.dart';
import '../api/api_client.dart';

/// Ported from frontend/src/store/ProductImageContext.tsx.
///
/// Caches one fetched image URL per product title so the same product shown
/// in multiple places (home carousel, result page, favorites, ...) only
/// triggers a single network request.
class ProductImageProvider extends ChangeNotifier {
  final Map<String, String?> _images = {};
  final Set<String> _requested = {};

  Map<String, String?> get images => Map.unmodifiable(_images);

  String? imageFor(String title) => _images[title];

  void ensureImage(String title) {
    final trimmed = title.trim();
    if (trimmed.isEmpty || _requested.contains(trimmed)) return;
    _requested.add(trimmed);

    ApiClient.searchImage(trimmed).then((url) {
      _images[trimmed] = url;
      notifyListeners();
    }).catchError((_) {
      _images[trimmed] = null;
      notifyListeners();
    });
  }
}
