import 'dart:convert';

class DuyuruModel {
  final int id;
  final String mesaj;
  final String createdAt;

  DuyuruModel({
    required this.id,
    required this.mesaj,
    required this.createdAt,
  });

  factory DuyuruModel.fromJson(Map<String, dynamic> json) {
    final duyuruRaw = json['duyuru'];
    String mesaj = '';
    if (duyuruRaw is String) {
      final parsed = jsonDecode(duyuruRaw);
      mesaj = parsed['mesaj'] ?? '';
    } else if (duyuruRaw is Map) {
      mesaj = duyuruRaw['mesaj'] ?? '';
    }
    return DuyuruModel(
      id: json['id'],
      mesaj: mesaj,
      createdAt: json['created_at'],
    );
  }
}