import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../mock/mock_data.dart';

const _stepMs = 700;
const _settleMs = 300;
const _ringSize = 144.0;
const _ringStroke = 6.0;

const _stepIcons = {
  'collect': Icons.inbox_outlined,
  'clean': Icons.filter_alt_outlined,
  'keyword': Icons.tag,
  'sentiment': Icons.pie_chart_outline,
  'summary': Icons.description_outlined,
};

class AnalyzingPage extends StatefulWidget {
  const AnalyzingPage({super.key, this.query});

  final String? query;

  @override
  State<AnalyzingPage> createState() => _AnalyzingPageState();
}

class _AnalyzingPageState extends State<AnalyzingPage> {
  late final String _query = widget.query ?? MockData.defaultQuery;
  int _currentStep = 0;
  Timer? _timer;

  bool get _allDone => _currentStep >= MockData.analysisSteps.length;

  @override
  void initState() {
    super.initState();
    _scheduleNext();
  }

  void _scheduleNext() {
    if (_allDone) {
      Future.delayed(const Duration(milliseconds: 700), () {
        if (mounted) context.go('/result', extra: _query);
      });
      return;
    }
    _timer = Timer(const Duration(milliseconds: _stepMs + _settleMs), () {
      if (!mounted) return;
      setState(() => _currentStep += 1);
      _scheduleNext();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final totalSteps = MockData.analysisSteps.length;
    final progress = (_currentStep.clamp(0, totalSteps)) / totalSteps;

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF1B4561), Color(0xFF6292BE)],
        ),
      ),
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
          child: Column(
            children: [
              SizedBox(
                width: _ringSize,
                height: _ringSize,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: _ringSize,
                      height: _ringSize,
                      child: CircularProgressIndicator(
                        value: 1,
                        strokeWidth: _ringStroke,
                        valueColor: AlwaysStoppedAnimation(Colors.white.withValues(alpha: 0.2)),
                      ),
                    ),
                    SizedBox(
                      width: _ringSize,
                      height: _ringSize,
                      child: TweenAnimationBuilder<double>(
                        tween: Tween(begin: 0, end: progress),
                        duration: const Duration(milliseconds: 700),
                        curve: Curves.easeOut,
                        builder: (context, value, _) => CircularProgressIndicator(
                          value: value,
                          strokeWidth: _ringStroke,
                          strokeCap: StrokeCap.round,
                          valueColor: AlwaysStoppedAnimation(_allDone ? Colors.greenAccent.shade400 : Colors.white),
                        ),
                      ),
                    ),
                    const Icon(Icons.diamond_rounded, color: Colors.white, size: 56),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              const Text('AI가 리뷰를 분석하고 있어요', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 4),
              Text('잠시만 기다려주세요', style: TextStyle(fontSize: 14, color: Colors.white.withValues(alpha: 0.8))),
              const SizedBox(height: 40),
              Column(
                children: List.generate(MockData.analysisSteps.length, (i) {
                  final step = MockData.analysisSteps[i];
                  final state = i < _currentStep ? 'done' : (i == _currentStep ? 'active' : 'pending');
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 14),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: state == 'active' ? Colors.white : (state == 'done' ? Colors.green : null),
                            border: state == 'pending' ? Border.all(color: Colors.white.withValues(alpha: 0.25), width: 2) : null,
                          ),
                          alignment: Alignment.center,
                          child: state == 'done'
                              ? const Icon(Icons.check, size: 18, color: Colors.white)
                              : Icon(_stepIcons[step.key], size: 18, color: state == 'active' ? const Color(0xFF1B4561) : Colors.white.withValues(alpha: 0.3)),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(step.title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: state == 'pending' ? Colors.white.withValues(alpha: 0.35) : Colors.white)),
                              Text(step.description, style: TextStyle(fontSize: 12, color: state == 'pending' ? Colors.white.withValues(alpha: 0.2) : Colors.white.withValues(alpha: 0.8))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
