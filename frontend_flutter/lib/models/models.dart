/// Data models ported 1:1 from frontend/src/mock/data.ts interfaces.
library;

import 'dart:typed_data';

class ReviewSource {
  const ReviewSource({required this.key, required this.label, required this.count});
  final String key; // "blog" | "youtube"
  final String label;
  final int count;
}

class Keyword {
  const Keyword({required this.word, required this.count});
  final String word;
  final int count;
}

class ReviewItem {
  const ReviewItem({
    required this.id,
    required this.title,
    required this.source,
    required this.date,
    required this.stat,
    required this.url,
    this.thumbnail,
  });

  final String id;
  final String title;
  final String source;
  final String date;
  final String stat;
  final String url;
  final String? thumbnail;

  factory ReviewItem.fromJson(Map<String, dynamic> json) => ReviewItem(
        id: json['id'] as String,
        title: json['title'] as String,
        source: json['source'] as String,
        date: json['date'] as String,
        stat: json['stat'] as String? ?? '',
        url: json['url'] as String,
        thumbnail: json['thumbnail'] as String?,
      );
}

class MyListItem {
  const MyListItem({
    required this.id,
    required this.title,
    required this.date,
    required this.rating,
    this.reviewCount,
    this.aiComment,
  });

  final String id;
  final String title;
  final String date;
  final double rating;
  final int? reviewCount;
  final String? aiComment;

  MyListItem copyWith({String? id, String? title, String? date, double? rating}) => MyListItem(
        id: id ?? this.id,
        title: title ?? this.title,
        date: date ?? this.date,
        rating: rating ?? this.rating,
        reviewCount: reviewCount,
        aiComment: aiComment,
      );
}

enum SearchTermChange { up, down, same }

class PopularSearchTerm {
  const PopularSearchTerm({required this.term, required this.change, this.diff});
  final String term;
  final SearchTermChange change;
  final int? diff;
}

class AnalysisStepInfo {
  const AnalysisStepInfo({required this.key, required this.title, required this.description});
  final String key; // collect | clean | keyword | sentiment | summary
  final String title;
  final String description;
}

class ScrapItem {
  const ScrapItem({
    required this.id,
    required this.type,
    required this.title,
    required this.subtitle,
    this.query,
    this.url,
  });

  /// "product" | "review"
  final String type;
  final String id;
  final String title;
  final String subtitle;

  /// product 타입: /result 로 돌아갈 때 쓸 검색어
  final String? query;

  /// review 타입: 원문 링크
  final String? url;
}

class Profile {
  const Profile({
    required this.nickname,
    required this.email,
    required this.avatarIndex,
    this.avatarPhotoBytes,
  });

  final String nickname;
  final String email;
  final int avatarIndex;

  /// Bytes of a user-picked profile photo (works uniformly across web/mobile/desktop
  /// via Image.memory, unlike a file path which behaves differently per platform).
  final Uint8List? avatarPhotoBytes;

  Profile copyWith({String? nickname, String? email, int? avatarIndex, Uint8List? avatarPhotoBytes}) => Profile(
        nickname: nickname ?? this.nickname,
        email: email ?? this.email,
        avatarIndex: avatarIndex ?? this.avatarIndex,
        avatarPhotoBytes: avatarPhotoBytes ?? this.avatarPhotoBytes,
      );
}
