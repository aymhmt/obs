import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/ders_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/ders_provider.dart';
import '../../providers/duyuru_provider.dart';
import '../ders_detay/ders_detay_screen.dart';

class OgrenciHomeScreen extends ConsumerWidget {
  const OgrenciHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final asyncDuyurular = ref.watch(duyuruListProvider);
    final asyncDersler = auth.ogrenci != null
        ? ref.watch(ogrenciDersListProvider(auth.ogrenci!))
        : const AsyncValue<List<DersModel>>.data([]);

    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      appBar: AppBar(
        backgroundColor: const Color(0xFF3B82F6),
        title: Text(
          'Hoş geldin, ${auth.displayName}',
          style: const TextStyle(color: Colors.white, fontSize: 16),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () async {
              await ref.read(authProvider.notifier).logout();
              if (context.mounted) {
                Navigator.pushReplacementNamed(context, '/login');
              }
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF3B82F6),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white24,
                  child: Icon(Icons.person, color: Colors.white, size: 32),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      auth.displayName,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'No: ${auth.ogrenci?.ogrenciNo ?? ''}  •  ${auth.ogrenci?.sinif ?? ''}. Sınıf',
                      style: const TextStyle(color: Colors.white70),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          const Text('Duyurular',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          asyncDuyurular.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) => Text('Hata: $e'),
            data: (duyurular) => duyurular.isEmpty
                ? Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text('Henüz duyuru yok',
                        style: TextStyle(color: Colors.grey)),
                  )
                : Column(
                    children: duyurular
                        .take(3)
                        .map((d) => Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.campaign,
                                      color: Color(0xFFF59E0B)),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(d.mesaj,
                                        style: const TextStyle(fontSize: 14)),
                                  ),
                                ],
                              ),
                            ))
                        .toList(),
                  ),
          ),
          const SizedBox(height: 24),

          const Text('Derslerim',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          asyncDersler.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) => Text('Hata: $e'),
            data: (dersler) => dersler.isEmpty
                ? Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text('Ders bulunamadı',
                        style: TextStyle(color: Colors.grey)),
                  )
                : Column(
                    children: dersler
                        .map((d) => GestureDetector(
                              onTap: () => Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => DersDetayScreen(
                                    dersId: d.dersId,
                                    dersAd: d.ad,
                                  ),
                                ),
                              ),
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.book,
                                        color: Color(0xFF10B981)),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(d.ad,
                                              style: const TextStyle(
                                                  fontWeight: FontWeight.w600)),
                                          Text(
                                              '${d.dersKodu} • ${d.kredi} kredi • ${d.tur}',
                                              style: const TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.grey)),
                                        ],
                                      ),
                                    ),
                                    const Icon(Icons.chevron_right,
                                        color: Colors.grey),
                                  ],
                                ),
                              ),
                            ))
                        .toList(),
                  ),
          ),
        ],
      ),
    );
  }
}