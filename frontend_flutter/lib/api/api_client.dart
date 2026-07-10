import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';

/// Same backend proxy the React app talks to (backend/src/index.ts).
/// Override at build time with --dart-define=API_BASE_URL=http://host:port
class ApiClient {
  ApiClient._();

  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3001',
  );

  static Future<List<ReviewItem>> searchBlog(String query) async {
    final res = await http.get(Uri.parse('$baseUrl/api/search/blog?query=${Uri.encodeComponent(query)}'));
    if (res.statusCode != 200) throw Exception('request failed');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>? ?? []);
    return items.map((e) => ReviewItem.fromJson(e as Map<String, dynamic>)).toList();
  }

  static Future<List<ReviewItem>> searchYoutube(String query) async {
    final res = await http.get(Uri.parse('$baseUrl/api/search/youtube?query=${Uri.encodeComponent(query)}'));
    if (res.statusCode != 200) throw Exception('request failed');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final items = (data['items'] as List<dynamic>? ?? []);
    return items.map((e) => ReviewItem.fromJson(e as Map<String, dynamic>)).toList();
  }

  static Future<String?> searchImage(String query) async {
    final res = await http.get(Uri.parse('$baseUrl/api/search/image?query=${Uri.encodeComponent(query)}'));
    if (res.statusCode != 200) throw Exception('request failed');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return data['imageUrl'] as String?;
  }
}
