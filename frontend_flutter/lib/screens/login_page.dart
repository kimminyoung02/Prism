import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/profile_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _showPassword = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  void _submitLogin() {
    if (_email.text.trim().isNotEmpty) {
      final profile = context.read<ProfileProvider>();
      profile.updateProfile(profile.profile.copyWith(email: _email.text.trim()));
    }
    context.read<AuthProvider>().login();
    context.go('/my');
  }

  void _socialLogin() {
    context.read<AuthProvider>().login();
    context.go('/my');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.diamond_rounded, color: isDark ? Colors.white : const Color(0xFF171717), size: 26),
                const SizedBox(width: 8),
                Text('PRISM', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, letterSpacing: 2, color: isDark ? Colors.white : const Color(0xFF171717))),
              ],
            ),
            const SizedBox(height: 32),
            _labeledField(context, '이메일 또는 아이디', _email, false),
            const SizedBox(height: 16),
            _labeledField(context, '비밀번호', _password, true),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submitLogin,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.brand500,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('로그인', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('계정이 없으신가요? ', style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
                GestureDetector(
                  onTap: () => context.go('/signup'),
                  child: Text('회원가입', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? AppColors.brand400 : AppColors.brand600)),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(child: Divider(color: isDark ? const Color(0xFF262626) : const Color(0xFFE5E5E5))),
                const Padding(padding: EdgeInsets.symmetric(horizontal: 12), child: Text('또는', style: TextStyle(fontSize: 12, color: Color(0xFFA3A3A3)))),
                Expanded(child: Divider(color: isDark ? const Color(0xFF262626) : const Color(0xFFE5E5E5))),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _socialButton(const Color(0xFFFEE500), const Color(0xFF171717), Icons.chat_bubble, '카카오로 시작하기'),
                const SizedBox(width: 16),
                _socialButton(const Color(0xFF03C75A), Colors.white, null, '네이버로 시작하기', text: 'N'),
                const SizedBox(width: 16),
                _socialButton(isDark ? AppColors.cardDark : Colors.white, const Color(0xFF737373), null, '구글로 시작하기', text: 'G'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _socialButton(Color bg, Color fg, IconData? icon, String semanticLabel, {String? text}) {
    return Semantics(
      button: true,
      label: semanticLabel,
      child: NeuPressable(
        variant: NeuVariant.small,
        borderRadius: BorderRadius.circular(999),
        color: bg,
        onTap: _socialLogin,
        padding: const EdgeInsets.all(16),
        child: SizedBox(
          width: 22,
          height: 22,
          child: Center(child: icon != null ? Icon(icon, color: fg, size: 22) : Text(text ?? '', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: fg))),
        ),
      ),
    );
  }

  Widget _labeledField(BuildContext context, String label, TextEditingController controller, bool isPassword) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF525252))),
        const SizedBox(height: 6),
        NeuBox(
          variant: NeuVariant.inset,
          child: TextField(
            controller: controller,
            obscureText: isPassword && !_showPassword,
            style: TextStyle(fontSize: 14, color: isDark ? Colors.white : const Color(0xFF171717)),
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              border: InputBorder.none,
              hintText: label,
              hintStyle: const TextStyle(color: Color(0xFFA3A3A3), fontSize: 14),
              suffixIcon: isPassword
                  ? IconButton(
                      icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility, size: 18, color: const Color(0xFFA3A3A3)),
                      onPressed: () => setState(() => _showPassword = !_showPassword),
                    )
                  : null,
            ),
          ),
        ),
      ],
    );
  }
}
