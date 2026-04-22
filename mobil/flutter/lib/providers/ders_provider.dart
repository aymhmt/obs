import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/ders_model.dart';
import '../models/ogrenci_model.dart';
import '../services/ders_service.dart';

final ogrenciDersListProvider =
    FutureProvider.family<List<DersModel>, OgrenciModel>((ref, ogrenci) async {
  return DersService.getAll(
    sinif: ogrenci.sinif,
    fakulteId: ogrenci.fakulteId,
    bolumId: ogrenci.bolumId,
  );
});

final dersListProvider = FutureProvider<List<DersModel>>((ref) async {
  return DersService.getAll();
});