import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';

/// 비밀번호 재설정 이메일의 딥링크(com.prism.prism://reset-password)로 도착하는 화면.
/// Supabase가 onAuthStateChange에 AuthChangeEvent.passwordRecovery를 발생시키면
/// main.dart의 리스너가 이 라우트로 이동시킴.
class ResetPasswordPage extends StatefulWidget {
  const ResetPasswordPage({super.key});

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  final _next = TextEditingController();
  final _confirm = TextEditingController();
  String? _error;
  bool _submitting = false;
  bool _done = false;

  @override
  void dispose() {
    _next.dispose();
    _confirm.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_next.text.isEmpty || _confirm.text.isEmpty) {
      setState(() => _error = '모든 항목을 입력해주세요');
      return;
    }
    if (_next.text != _confirm.text) {
      setState(() => _error = '비밀번호가 일치하지 않아요');
      return;
    }

    setState(() {
      _error = null;
      _submitting = true;
    });
    final error = await context.read<AuthProvider>().updatePassword(_next.text);
    if (!mounted) return;
    setState(() => _submitting = false);

    if (error != null) {
      setState(() => _error = error);
      return;
    }

    setState(() => _done = true);
    await context.read<AuthProvider>().logout();
    if (!mounted) return;
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) context.go('/my');
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : const Color(0xFF171717);
    final subColor = isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373);

    if (_done) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, size: 48, color: Colors.green),
            const SizedBox(height: 12),
            Text('비밀번호가 변경되었어요', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: textColor)),
            const SizedBox(height: 4),
            Text('로그인 화면으로 이동할게요', style: TextStyle(fontSize: 12, color: subColor)),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
          decoration: const BoxDecoration(
            gradient: AppColors.brandGradient,
            borderRadius: BorderRadius.only(bottomLeft: Radius.circular(24), bottomRight: Radius.circular(24)),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('새 비밀번호 설정', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
              SizedBox(height: 6),
              Text('새로 사용할 비밀번호를 입력해주세요', style: TextStyle(fontSize: 12, color: Colors.white70)),
            ],
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _field('새 비밀번호', _next, subColor: subColor, textColor: textColor),
              const SizedBox(height: 12),
              _field('새 비밀번호 확인', _confirm, subColor: subColor, textColor: textColor),
              if (_error != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_error!, style: const TextStyle(fontSize: 12, color: Colors.red))),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _submitting ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.brand500,
                  minimumSize: const Size.fromHeight(52),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  _submitting ? '변경 중...' : '변경하기',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _field(String label, TextEditingController controller, {required Color subColor, required Color textColor}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: subColor)),
        const SizedBox(height: 6),
        NeuBox(
          variant: NeuVariant.inset,
          child: TextField(
            controller: controller,
            obscureText: true,
            style: TextStyle(fontSize: 14, color: textColor),
            decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14), border: InputBorder.none),
          ),
        ),
      ],
    );
  }
}
