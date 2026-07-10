import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

const _analyzeMs = 1600;

class LensAnalyzingPage extends StatefulWidget {
  const LensAnalyzingPage({super.key, this.imagePath});

  /// Actually receives the captured image bytes (Uint8List) via go_router `extra`.
  final Object? imagePath;

  @override
  State<LensAnalyzingPage> createState() => _LensAnalyzingPageState();
}

class _LensAnalyzingPageState extends State<LensAnalyzingPage> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer(const Duration(milliseconds: _analyzeMs), () {
      if (mounted) context.go('/lens/result', extra: widget.imagePath);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bytes = widget.imagePath is Uint8List ? widget.imagePath as Uint8List : null;
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFF1B4561), Color(0xFF6292BE)]),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (bytes != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Image.memory(bytes, width: 160, height: 160, fit: BoxFit.cover),
              ),
            const SizedBox(height: 24),
            const Icon(Icons.document_scanner_outlined, size: 32, color: Colors.white),
            const SizedBox(height: 12),
            const Text('사진 속 제품을 분석하고 있어요', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 4),
            Text('잠시만 기다려주세요', style: TextStyle(fontSize: 14, color: Colors.white.withValues(alpha: 0.8))),
          ],
        ),
      ),
    );
  }
}
