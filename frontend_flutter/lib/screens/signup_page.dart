import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _passwordConfirm = TextEditingController();
  final _nickname = TextEditingController();
  String? _error;
  String? _notice;
  bool _showPassword = false;
  bool _showPasswordConfirm = false;
  bool _submitting = false;

  Future<void> _submit() async {
    if (_email.text.trim().isEmpty || _password.text.isEmpty || _nickname.text.trim().isEmpty) {
      setState(() => _error = '모든 항목을 입력해주세요');
      return;
    }
    if (_password.text != _passwordConfirm.text) {
      setState(() => _error = '비밀번호가 일치하지 않아요');
      return;
    }

    setState(() {
      _error = null;
      _notice = null;
      _submitting = true;
    });
    final result = await context.read<AuthProvider>().signUp(_email.text.trim(), _password.text, _nickname.text.trim());
    if (!mounted) return;
    setState(() => _submitting = false);

    if (result.error != null) {
      setState(() => _error = result.error);
      return;
    }
    if (result.needsEmailConfirm) {
      setState(() => _notice = '가입 확인 메일을 보냈어요. 메일함에서 인증 후 로그인해주세요.');
      return;
    }
    context.go('/my');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.arrow_back)),
              Text('회원가입', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF171717))),
            ],
          ),
          const SizedBox(height: 20),
          _field('이메일', _email, false),
          const SizedBox(height: 12),
          _field('비밀번호', _password, true, show: _showPassword, toggle: () => setState(() => _showPassword = !_showPassword)),
          const SizedBox(height: 12),
          _field('비밀번호 확인', _passwordConfirm, true, show: _showPasswordConfirm, toggle: () => setState(() => _showPasswordConfirm = !_showPasswordConfirm)),
          const SizedBox(height: 12),
          _field('닉네임', _nickname, false),
          if (_error != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_error!, style: const TextStyle(fontSize: 12, color: Colors.red))),
          if (_notice != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_notice!, style: const TextStyle(fontSize: 12, color: Colors.green))),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _submitting ? null : _submit,
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.brand500, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
              child: Text(_submitting ? '가입 처리 중...' : '회원가입', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('이미 계정이 있으신가요? ', style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
              GestureDetector(
                onTap: () => context.pop(),
                child: Text('로그인', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: isDark ? AppColors.brand400 : AppColors.brand600)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _field(String label, TextEditingController controller, bool isPassword, {bool show = false, VoidCallback? toggle}) {
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
            obscureText: isPassword && !show,
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              border: InputBorder.none,
              suffixIcon: isPassword ? IconButton(icon: Icon(show ? Icons.visibility_off : Icons.visibility, size: 18), onPressed: toggle) : null,
            ),
          ),
        ),
      ],
    );
  }
}
