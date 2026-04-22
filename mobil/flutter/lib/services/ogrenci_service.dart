import '../core/api_client.dart';
import '../models/ogrenci_model.dart';

class OgrenciService {
  static Future<List<OgrenciModel>> getAll() async {
    final res = await ApiClient.instance.get('/ogrenciler');
    final List data = res.data['data'];
    return data.map((e) => OgrenciModel.fromJson(e)).toList();
  }

  static Future<OgrenciModel> getById(int id) async {
    final res = await ApiClient.instance.get('/ogrenciler/$id');
    return OgrenciModel.fromJson(res.data['data']);
  }

  static Future<void> create(Map<String, dynamic> data) async {
    await ApiClient.instance.post('/ogrenciler', data: data);
  }

  static Future<void> update(int id, Map<String, dynamic> data) async {
    await ApiClient.instance.put('/ogrenciler/$id', data: data);
  }

  static Future<void> delete(int id) async {
    await ApiClient.instance.delete('/ogrenciler/$id');
  }
}