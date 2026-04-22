import '../core/api_client.dart';
import '../models/ders_model.dart';

class DersService {
  static Future<List<DersModel>> getAll({int? sinif, int? fakulteId, int? bolumId}) async {
    String url = '/dersler';
    if (sinif != null && fakulteId != null && bolumId != null) {
      url += '?sinif=$sinif&fakulte_id=$fakulteId&bolum_id=$bolumId';
    }
    final res = await ApiClient.instance.get(url);
    final List data = res.data['data'] ?? [];
    return data.map((e) => DersModel.fromJson(e)).toList();
  }

  static Future<void> create(Map<String, dynamic> data) async {
    await ApiClient.instance.post('/dersler', data: data);
  }
}