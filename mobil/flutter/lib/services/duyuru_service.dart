import '../core/api_client.dart';
import '../models/duyuru_model.dart';

class DuyuruService {
  static Future<List<DuyuruModel>> getAll() async {
    final res = await ApiClient.instance.get('/duyurular');
    final List data = res.data['data'];
    return data.map((e) => DuyuruModel.fromJson(e)).toList();
  }

  static Future<void> create(Map<String, dynamic> content) async {
    await ApiClient.instance.post('/duyurular', data: {'duyuru': content});
  }
}