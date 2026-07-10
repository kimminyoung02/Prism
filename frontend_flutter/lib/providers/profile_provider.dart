import 'package:flutter/material.dart';
import '../models/models.dart';

class AvatarStyle {
  const AvatarStyle(this.background, this.foreground);
  final Color background;
  final Color foreground;
}

/// Ported from frontend/src/store/ProfileContext.tsx.
class ProfileProvider extends ChangeNotifier {
  static const defaultProfile = Profile(
    nickname: 'prism_user',
    email: 'user@example.com',
    avatarIndex: 0,
  );

  static const List<AvatarStyle> avatarStyles = [
    AvatarStyle(Color(0xFFF2E6E6), Color(0xFF1B4561)),
    AvatarStyle(Color(0xFFE0F2FE), Color(0xFF0EA5E9)),
    AvatarStyle(Color(0xFFD1FAE5), Color(0xFF10B981)),
    AvatarStyle(Color(0xFFFCE7F3), Color(0xFFEC4899)),
  ];

  Profile _profile = defaultProfile;
  Profile get profile => _profile;

  void updateProfile(Profile next) {
    _profile = next;
    notifyListeners();
  }
}
