import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../mock/mock_data.dart';
import '../providers/activity_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/profile_provider.dart';
import '../providers/scrap_provider.dart';
import '../theme/app_colors.dart';
import '../theme/neu.dart';

class MyPage extends StatefulWidget {
  const MyPage({super.key});

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> {
  bool _editingNickname = false;
  final _nicknameController = TextEditingController();

  @override
  void dispose() {
    _nicknameController.dispose();
    super.dispose();
  }

  Future<void> _pickPhoto() async {
    final picker = ImagePicker();
    final file = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (file == null) return;
    final bytes = await file.readAsBytes();
    if (!mounted) return;
    final profile = context.read<ProfileProvider>();
    profile.updateProfile(profile.profile.copyWith(avatarPhotoBytes: bytes));
  }

  void _startEditingNickname(String current) {
    _nicknameController.text = current;
    setState(() => _editingNickname = true);
  }

  void _commitNickname() {
    final trimmed = _nicknameController.text.trim();
    if (trimmed.isNotEmpty) {
      final profile = context.read<ProfileProvider>();
      profile.updateProfile(profile.profile.copyWith(nickname: trimmed));
    }
    setState(() => _editingNickname = false);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final profileState = context.watch<ProfileProvider>();
    final profile = profileState.profile;
    final avatar = ProfileProvider.avatarStyles[profile.avatarIndex];
    final scrapCount = context.watch<ScrapProvider>().items.length;
    final activity = context.watch<ActivityProvider>();

    final stats = [
      (label: '리뷰 분석', value: activity.analysisRunCount, to: '/my/reviews'),
      (label: '찜한 리뷰', value: scrapCount, to: '/favorites'),
      (label: '최근 본 제품', value: activity.viewedProducts.length, to: '/my/recent'),
    ];

    final menu = [
      (icon: Icons.notifications_none, label: '알림', to: '/my/notifications'),
      (icon: Icons.settings_outlined, label: '설정', to: '/my/settings'),
      (icon: Icons.description_outlined, label: '이용약관', to: '/legal/terms'),
      (icon: Icons.shield_outlined, label: '개인정보처리방침', to: '/legal/privacy'),
    ];

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 32, 20, 32),
            decoration: const BoxDecoration(
              gradient: AppColors.brandGradient,
              borderRadius: BorderRadius.only(bottomLeft: Radius.circular(32), bottomRight: Radius.circular(32)),
            ),
            child: Row(
              children: [
                GestureDetector(
                  onTap: _pickPhoto,
                  child: Stack(
                    children: [
                      ClipOval(
                        child: profile.avatarPhotoBytes != null
                            ? Image.memory(profile.avatarPhotoBytes!, width: 80, height: 80, fit: BoxFit.cover)
                            : Container(
                                width: 80,
                                height: 80,
                                color: avatar.background,
                                alignment: Alignment.center,
                                child: Icon(Icons.person, size: 32, color: avatar.foreground),
                              ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white, border: Border.all(color: AppColors.brand500, width: 2)),
                          child: const Icon(Icons.camera_alt, size: 12, color: Color(0xFF525252)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _editingNickname
                          ? Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    controller: _nicknameController,
                                    autofocus: true,
                                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600),
                                    decoration: InputDecoration(
                                      isDense: true,
                                      filled: true,
                                      fillColor: Colors.white.withValues(alpha: 0.2),
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
                                    ),
                                    onSubmitted: (_) => _commitNickname(),
                                  ),
                                ),
                                IconButton(onPressed: _commitNickname, icon: const Icon(Icons.check, size: 18, color: Colors.white)),
                              ],
                            )
                          : GestureDetector(
                              onTap: () => _startEditingNickname(profile.nickname),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Flexible(child: Text(profile.nickname, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white))),
                                  const SizedBox(width: 6),
                                  Icon(Icons.edit, size: 13, color: Colors.white.withValues(alpha: 0.5)),
                                ],
                              ),
                            ),
                      const SizedBox(height: 2),
                      Text(profile.email, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 13, color: Colors.white.withValues(alpha: 0.8))),
                    ],
                  ),
                ),
                IconButton(onPressed: () => context.go('/my/notifications'), icon: const Icon(Icons.notifications_none, color: Colors.white)),
              ],
            ),
          ),
          Transform.translate(
            offset: const Offset(0, -12),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: stats.map((s) {
                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: NeuPressable(
                        variant: NeuVariant.small,
                        onTap: () => context.go(s.to),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        child: Column(
                          children: [
                            Text('${s.value}', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFF5F5F5) : const Color(0xFF171717))),
                            Text(s.label, style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFA3A3A3) : const Color(0xFF737373))),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 8,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.access_time, size: 14, color: Color(0xFFA3A3A3)),
                        const SizedBox(width: 6),
                        Text('최근 검색 기록', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
                      ],
                    ),
                    TextButton(
                      onPressed: () => context.go('/search-terms/recent'),
                      child: Row(children: const [Text('전체보기', style: TextStyle(fontSize: 12, color: Color(0xFF737373))), Icon(Icons.chevron_right, size: 14)]),
                    ),
                  ],
                ),
                if (activity.recentSearches.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('아직 검색한 제품이 없어요', style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFF737373) : const Color(0xFFA3A3A3))),
                  )
                else
                  SizedBox(
                    height: 40,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: activity.recentSearches.length,
                      separatorBuilder: (_, _) => const SizedBox(width: 8),
                      itemBuilder: (context, i) {
                        final term = activity.recentSearches[i];
                        return NeuPressable(
                          variant: NeuVariant.small,
                          borderRadius: BorderRadius.circular(999),
                          onTap: () => context.go('/collecting', extra: term),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          child: Text(term, style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040))),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              spacing: 8,
              children: [
                ...menu.map((item) => NeuPressable(
                      variant: NeuVariant.small,
                      onTap: () => context.go(item.to),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      child: Row(
                        children: [
                          Icon(item.icon, size: 18, color: const Color(0xFFA3A3A3)),
                          const SizedBox(width: 12),
                          Expanded(child: Text(item.label, style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040)))),
                          Icon(Icons.chevron_right, size: 16, color: isDark ? const Color(0xFF525252) : const Color(0xFFD4D4D4)),
                        ],
                      ),
                    )),
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: NeuPressable(
                    variant: NeuVariant.small,
                    onTap: () {
                      context.read<AuthProvider>().logout();
                      context.go('/my');
                    },
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    child: Center(child: Text('로그아웃', style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFF737373) : const Color(0xFFA3A3A3)))),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Text('앱 버전 ${MockData.appVersion}', style: const TextStyle(fontSize: 11, color: Color(0xFFA3A3A3))),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
