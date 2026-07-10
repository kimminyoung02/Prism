import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/supabase_config.dart';

/// Ported from frontend/src/store/AuthContext.tsx — real Supabase Auth session,
/// not local-only state.
class AuthProvider extends ChangeNotifier {
  AuthProvider() {
    _session = Supabase.instance.client.auth.currentSession;
    Supabase.instance.client.auth.onAuthStateChange.listen((data) {
      _session = data.session;
      notifyListeners();
    });
  }

  Session? _session;

  bool get isLoggedIn => _session != null;
  User? get user => _session?.user;

  String _translateError(String message) {
    if (message.contains('Invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않아요';
    if (message.contains('User already registered')) return '이미 가입된 이메일이에요';
    if (message.toLowerCase().contains('password should be at least')) return '비밀번호는 6자 이상이어야 해요';
    if (message.toLowerCase().contains('unable to validate email address')) return '이메일 형식이 올바르지 않아요';
    if (message.toLowerCase().contains('should be different')) return '현재 비밀번호와 다른 비밀번호를 입력해주세요';
    return message;
  }

  /// null = 성공. 로그인.
  Future<String?> signIn(String email, String password) async {
    try {
      await Supabase.instance.client.auth.signInWithPassword(email: email, password: password);
      return null;
    } on AuthException catch (e) {
      return _translateError(e.message);
    }
  }

  /// error == null && needsEmailConfirm == false: 가입 즉시 로그인됨.
  /// error == null && needsEmailConfirm == true: 이메일 인증이 필요해 세션이 아직 없음.
  Future<({String? error, bool needsEmailConfirm})> signUp(String email, String password, String nickname) async {
    try {
      final res = await Supabase.instance.client.auth.signUp(
        email: email,
        password: password,
        data: {'nickname': nickname},
      );
      if (res.session == null) return (error: null, needsEmailConfirm: true);
      return (error: null, needsEmailConfirm: false);
    } on AuthException catch (e) {
      return (error: _translateError(e.message), needsEmailConfirm: false);
    }
  }

  Future<void> logout() async {
    await Supabase.instance.client.auth.signOut();
  }

  /// 비밀번호 재설정 메일 발송. null = 성공.
  Future<String?> resetPasswordForEmail(String email) async {
    try {
      await Supabase.instance.client.auth.resetPasswordForEmail(
        email,
        redirectTo: SupabaseConfig.resetPasswordRedirect,
      );
      return null;
    } on AuthException catch (e) {
      return _translateError(e.message);
    }
  }

  /// 비밀번호 재설정 딥링크로 얻은 복구 세션 상태에서 새 비밀번호 저장. null = 성공.
  Future<String?> updatePassword(String newPassword) async {
    try {
      await Supabase.instance.client.auth.updateUser(UserAttributes(password: newPassword));
      return null;
    } on AuthException catch (e) {
      return _translateError(e.message);
    }
  }

  /// 마이페이지 "비밀번호 변경"에서 쓰는 현재 비밀번호 재인증. null = 성공(현재 비밀번호 일치).
  Future<String?> reauthenticate(String currentPassword) async {
    final email = user?.email;
    if (email == null) return 'Supabase 연결 설정이 필요해요';
    try {
      await Supabase.instance.client.auth.signInWithPassword(email: email, password: currentPassword);
      return null;
    } on AuthException {
      return '현재 비밀번호가 올바르지 않아요';
    }
  }
}
