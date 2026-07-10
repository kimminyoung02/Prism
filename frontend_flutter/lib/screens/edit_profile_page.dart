import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/profile_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  late int _avatarIndex;
  late final TextEditingController _nickname;
  late final TextEditingController _email;

  @override
  void initState() {
    super.initState();
    final profile = context.read<ProfileProvider>().profile;
    _avatarIndex = profile.avatarIndex;
    _nickname = TextEditingController(text: profile.nickname);
    _email = TextEditingController(text: profile.email);
  }

  @override
  void dispose() {
    _nickname.dispose();
    _email.dispose();
    super.dispose();
  }

  void _submit() {
    final profile = context.read<ProfileProvider>();
    profile.updateProfile(profile.profile.copyWith(nickname: _nickname.text, email: _email.text, avatarIndex: _avatarIndex));
    context.go('/my');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final avatar = ProfileProvider.avatarStyles[_avatarIndex];

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.arrow_back)),
              Text('회원정보 수정', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: isDark ? Colors.white : const Color(0xFF171717))),
            ],
          ),
          const SizedBox(height: 32),
          Center(
            child: Stack(
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(shape: BoxShape.circle, color: avatar.background),
                  child: Icon(Icons.person, size: 40, color: avatar.foreground),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: GestureDetector(
                    onTap: () => setState(() => _avatarIndex = (_avatarIndex + 1) % ProfileProvider.avatarStyles.length),
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(shape: BoxShape.circle, gradient: AppColors.brandGradientHorizontal),
                      child: const Icon(Icons.camera_alt, size: 16, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          _field('닉네임', _nickname, isDark),
          const SizedBox(height: 16),
          _field('이메일', _email, isDark),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.brand500, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999))),
              child: const Text('수정', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _field(String label, TextEditingController controller, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
        const SizedBox(height: 6),
        NeuBox(
          variant: NeuVariant.inset,
          child: TextField(
            controller: controller,
            decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14), border: InputBorder.none),
          ),
        ),
      ],
    );
  }
}
