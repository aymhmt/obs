import '../core/api_client.dart';
import '../models/ders_detay_model.dart';

class DersDetayService {
  static Future<DersDetayModel> getDetay(int dersId, int ogrenciId) async {
    final res = await ApiClient.instance
        .get('/dersler/$dersId/detay?ogrenci_id=$ogrenciId');
    return DersDetayModel.fromJson(res.data['data']);
  }
}