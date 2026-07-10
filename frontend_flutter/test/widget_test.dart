import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:prism/main.dart';

void main() {
  testWidgets('App boots to the home search screen', (WidgetTester tester) async {
    await tester.pumpWidget(const PrismApp());
    await tester.pumpAndSettle();

    expect(find.text('PRISM'), findsOneWidget);
    expect(find.byIcon(Icons.home_rounded), findsOneWidget);
  });
}
