import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/duyuru_model.dart';
import '../services/duyuru_service.dart';

final duyuruListProvider = FutureProvider<List<DuyuruModel>>((ref) async {
  return DuyuruService.getAll();
});