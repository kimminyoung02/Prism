import 'package:flutter/material.dart';

/// Ported from frontend/src/store/NotificationSettingsContext.tsx.
class NotificationSettingsProvider extends ChangeNotifier {
  final Map<String, bool> _toggles = {
    'push': true,
    'analysisDone': true,
    'recommend': true,
  };

  Map<String, bool> get toggles => Map.unmodifiable(_toggles);

  void setToggle(String key, bool value) {
    _toggles[key] = value;
    notifyListeners();
  }
}
