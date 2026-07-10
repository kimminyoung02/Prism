import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Ported from frontend/src/store/ThemeContext.tsx.
///
/// Defaults to following the OS/system brightness; a manual [toggleDark] call
/// creates a persisted override that takes priority over future system changes.
class ThemeProvider extends ChangeNotifier {
  static const _storageKey = 'prism-theme-override';

  bool _isDark;
  bool? _override; // null = no override, follow system
  SharedPreferences? _prefs;

  ThemeProvider() : _isDark = _systemPrefersDark() {
    _init();
  }

  bool get isDark => _isDark;

  static bool _systemPrefersDark() {
    return SchedulerBinding.instance.platformDispatcher.platformBrightness == Brightness.dark;
  }

  Future<void> _init() async {
    _prefs = await SharedPreferences.getInstance();
    final stored = _prefs?.getString(_storageKey);
    if (stored == 'dark') {
      _override = true;
    } else if (stored == 'light') {
      _override = false;
    }
    _isDark = _override ?? _systemPrefersDark();
    notifyListeners();

    PlatformDispatcher.instance.onPlatformBrightnessChanged = () {
      if (_override == null) {
        _isDark = _systemPrefersDark();
        notifyListeners();
      }
    };
  }

  Future<void> toggleDark() async {
    _isDark = !_isDark;
    _override = _isDark;
    _prefs ??= await SharedPreferences.getInstance();
    await _prefs!.setString(_storageKey, _isDark ? 'dark' : 'light');
    notifyListeners();
  }
}
