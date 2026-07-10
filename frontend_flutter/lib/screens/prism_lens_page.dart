import 'dart:async';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

class PrismLensPage extends StatefulWidget {
  const PrismLensPage({super.key});

  @override
  State<PrismLensPage> createState() => _PrismLensPageState();
}

class _PrismLensPageState extends State<PrismLensPage> {
  CameraController? _controller;
  String? _error;
  bool _flashOn = false;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    _startCamera();
  }

  Future<void> _startCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isEmpty) {
        setState(() => _error = '카메라를 사용할 수 없어요');
        return;
      }
      final back = cameras.firstWhere((c) => c.lensDirection == CameraLensDirection.back, orElse: () => cameras.first);
      final controller = CameraController(back, ResolutionPreset.medium, enableAudio: false);
      await controller.initialize();
      if (!mounted) {
        await controller.dispose();
        return;
      }
      setState(() {
        _controller = controller;
        _ready = true;
      });
    } catch (_) {
      if (mounted) setState(() => _error = '카메라 권한이 필요해요');
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  Future<void> _capture() async {
    final controller = _controller;
    if (controller == null || !_ready) return;
    try {
      final file = await controller.takePicture();
      final bytes = await file.readAsBytes();
      if (!mounted) return;
      context.go('/lens/analyzing', extra: bytes);
    } catch (_) {
      // ignore capture failures; user can retry
    }
  }

  Future<void> _pickFromGallery() async {
    final picker = ImagePicker();
    final file = await picker.pickImage(source: ImageSource.gallery);
    if (file == null) return;
    final bytes = await file.readAsBytes();
    if (!mounted) return;
    context.go('/lens/analyzing', extra: bytes);
  }

  Future<void> _toggleFlash() async {
    final controller = _controller;
    if (controller == null) return;
    final next = !_flashOn;
    try {
      await controller.setFlashMode(next ? FlashMode.torch : FlashMode.off);
      setState(() => _flashOn = next);
    } catch (_) {
      setState(() => _flashOn = next);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF011F25),
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(onPressed: () => context.pop(), icon: const Icon(Icons.close, color: Colors.white, size: 24)),
                  IconButton(
                    onPressed: _toggleFlash,
                    icon: Icon(_flashOn ? Icons.flash_on : Icons.flash_off, color: _flashOn ? Colors.amber : Colors.white70, size: 22),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    color: Colors.black26,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        if (_error != null)
                          Center(child: Padding(padding: const EdgeInsets.all(32), child: Text(_error!, textAlign: TextAlign.center, style: const TextStyle(color: Colors.white60, fontSize: 14))))
                        else if (_ready && _controller != null)
                          FittedBox(
                            fit: BoxFit.cover,
                            child: SizedBox(
                              width: _controller!.value.previewSize?.height ?? 1,
                              height: _controller!.value.previewSize?.width ?? 1,
                              child: CameraPreview(_controller!),
                            ),
                          )
                        else
                          const Center(child: CircularProgressIndicator(color: Colors.white)),
                        if (_error == null) ...[
                          _corner(Alignment.topLeft),
                          _corner(Alignment.topRight),
                          _corner(Alignment.bottomLeft),
                          _corner(Alignment.bottomRight),
                        ],
                      ],
                    ),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(32, 8, 32, 32),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    onPressed: _pickFromGallery,
                    icon: const Icon(Icons.image_outlined, color: Colors.white, size: 20),
                    style: IconButton.styleFrom(backgroundColor: Colors.white.withValues(alpha: 0.1), fixedSize: const Size(44, 44)),
                  ),
                  GestureDetector(
                    onTap: (_ready && _error == null) ? _capture : null,
                    child: Container(
                      width: 72,
                      height: 72,
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white.withValues(alpha: 0.3), width: 4)),
                      child: Container(
                        decoration: BoxDecoration(shape: BoxShape.circle, color: (_ready && _error == null) ? Colors.white : Colors.white38),
                      ),
                    ),
                  ),
                  const SizedBox(width: 44),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _corner(Alignment alignment) {
    final isTop = alignment.y < 0;
    final isLeft = alignment.x < 0;
    return Align(
      alignment: alignment,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: SizedBox(
          width: 32,
          height: 32,
          child: CustomPaint(painter: _CornerPainter(isTop: isTop, isLeft: isLeft)),
        ),
      ),
    );
  }
}

class _CornerPainter extends CustomPainter {
  _CornerPainter({required this.isTop, required this.isLeft});
  final bool isTop;
  final bool isLeft;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke;
    final path = Path();
    final y = isTop ? 0.0 : size.height;
    final x = isLeft ? 0.0 : size.width;
    path.moveTo(x, isTop ? size.height : 0);
    path.lineTo(x, y);
    path.lineTo(isLeft ? size.width : 0, y);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
