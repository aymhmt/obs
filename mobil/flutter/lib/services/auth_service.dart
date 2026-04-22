import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/api_client.dart';
import '../models/ogrenci_model.dart';

class AuthService {
  static const _storage = FlutterSecureStorage();

  static Future<OgrenciModel> loginOgrenci(String ogrenciNo, String tcKimlik) async {
    try {
      final res = await ApiClient.instance.post('/ogrenci-login', data: {
        'ogrenci_no': ogrenciNo,
        'tc_kimlik': tcKimlik,
      });
      final token = res.data['token'];
      final ogrenci = OgrenciModel.fromJson(res.data['ogrenci']);
      await _storage.write(key: 'token', value: token);
      await _storage.write(key: 'rol', value: 'ogrenci');
      await _storage.write(key: 'user_id', value: ogrenci.ogrenciId.toString());
      await _storage.write(key: 'ad', value: '${ogrenci.ad} ${ogrenci.soyad}');
      return ogrenci;
    } on DioException catch (e) {
      print('>>> DIO HATA: ${e.type}');
      print('>>> MESAJ: ${e.message}');
      rethrow;
    }
  }

  static Future<void> logout() async => _storage.deleteAll();
  static Future<bool> isLoggedIn() async => await _storage.read(key: 'token') != null;
  static Future<String?> getRol() async => _storage.read(key: 'rol');
  static Future<String?> getUserId() async => _storage.read(key: 'user_id');
}