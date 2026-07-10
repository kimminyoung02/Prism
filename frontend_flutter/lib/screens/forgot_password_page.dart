import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _email = TextEditingController();
  String? _error;
  bool _submitting = false;
  bool _sent = false;

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _email.text.trim();
    if (email.isEmpty) {
      setState(() => _error = '이메일을 입력해주세요');
      return;
    }
    setState(() {
      _error = null;
      _submitting = true;
    });
    final error = await context.read<AuthProvider>().resetPasswordForEmail(email);
    if (!mounted) return;
    setState(() => _submitting = false);
    if (error != null) {
      setState(() => _error = error);
      return;
    }
    setState(() => _sent = true);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : const Color(0xFF171717);
    final subColor = isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373);

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.arrow_back)),
              Text('비밀번호 찾기', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor)),
            ],
          ),
          const SizedBox(height: 12),
          if (!_sent) ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                '가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드려요.',
                style: TextStyle(fontSize: 13, color: subColor, height: 1.5),
              ),
            ),
            const SizedBox(height: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('이메일', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: subColor)),
                const SizedBox(height: 6),
                NeuBox(
                  variant: NeuVariant.inset,
                  child: TextField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    style: TextStyle(fontSize: 14, color: textColor),
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      border: InputBorder.none,
                      hintText: '이메일을 입력하세요',
                      hintStyle: TextStyle(color: Color(0xFFA3A3A3), fontSize: 14),
                    ),
                  ),
                ),
              ],
            ),
            if (_error != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(_error!, style: const TextStyle(fontSize: 12, color: Colors.red))),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submitting ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.brand500,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  _submitting ? '보내는 중...' : '재설정 링크 보내기',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white),
                ),
              ),
            ),
          ] else ...[
            const SizedBox(height: 24),
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(color: AppColors.brand500.withValues(alpha: 0.1), shape: BoxShape.circle),
                    child: Icon(Icons.mark_email_read_outlined, color: AppColors.brand500, size: 30),
                  ),
                  const SizedBox(height: 16),
                  Text('이메일을 확인해주세요', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor)),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Text(
                      '${_email.text.trim()}로 재설정 링크를 보냈어요.\n메일함에서 링크를 눌러 새 비밀번호를 설정해주세요.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 13, color: subColor, height: 1.5),
                    ),
                  ),
                  const SizedBox(height: 24),
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: Text('로그인으로 돌아가기', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: isDark ? AppColors.brand400 : AppColors.brand600)),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
