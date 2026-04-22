import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/ders_detay_model.dart';
import '../../services/ders_detay_service.dart';
import '../../services/auth_service.dart';

class DersDetayScreen extends ConsumerStatefulWidget {
  final int dersId;
  final String dersAd;

  const DersDetayScreen({
    super.key,
    required this.dersId,
    required this.dersAd,
  });

  @override
  ConsumerState<DersDetayScreen> createState() => _DersDetayScreenState();
}

class _DersDetayScreenState extends ConsumerState<DersDetayScreen> {
  DersDetayModel? _detay;
  bool _yukleniyor = true;
  String? _hata;

  @override
  void initState() {
    super.initState();
    _yukle();
  }

  Future<void> _yukle() async {
    try {
      final userIdStr = await AuthService.getUserId();
      final ogrenciId = int.parse(userIdStr ?? '0');
      final detay = await DersDetayService.getDetay(widget.dersId, ogrenciId);
      setState(() {
        _detay = detay;
        _yukleniyor = false;
      });
    } catch (e) {
      setState(() {
        _hata = e.toString();
        _yukleniyor = false;
      });
    }
  }

  Color _harfRengi(String harf) {
    switch (harf) {
      case 'AA':
      case 'BA':
      case 'BB':
        return const Color(0xFF10B981);
      case 'CB':
      case 'CC':
        return const Color(0xFF3B82F6);
      case 'DC':
      case 'DD':
        return const Color(0xFFF59E0B);
      default:
        return const Color(0xFFEF4444);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      appBar: AppBar(
        backgroundColor: const Color(0xFF3B82F6),
        title: Text(widget.dersAd,
            style: const TextStyle(color: Colors.white, fontSize: 16)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _yukleniyor
          ? const Center(child: CircularProgressIndicator())
          : _hata != null
              ? Center(child: Text('Hata: $_hata'))
              : _buildBody(),
    );
  }

  Widget _buildBody() {
    final d = _detay!;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: _harfRengi(d.harfNotu),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Harf Notu',
                      style: TextStyle(color: Colors.white70, fontSize: 14)),
                  Text(d.harfNotu,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 40,
                          fontWeight: FontWeight.bold)),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('Ortalama',
                      style: TextStyle(color: Colors.white70, fontSize: 14)),
                  Text(d.ortalamaNot.toStringAsFixed(1),
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 40,
                          fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Ders Bilgileri',
                  style: TextStyle(
                      fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              _bilgiSatiri('Ders Kodu', d.dersKodu),
              _bilgiSatiri('Tür', d.tur),
              _bilgiSatiri('Kredi', '${d.kredi}'),
              _bilgiSatiri('AKTS', '${d.akts}'),
              _bilgiSatiri('Sınıf', '${d.sinifSeviyesi}. Sınıf'),
              _bilgiSatiri(
                  'Öğretmen',
                  d.ogretmenAd.isEmpty
                      ? 'Belirtilmemiş'
                      : '${d.ogretmenAd} ${d.ogretmenSoyad}'),
            ],
          ),
        ),
        const SizedBox(height: 16),

        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Notlarım',
                  style: TextStyle(
                      fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              if (d.notlar.isEmpty)
                const Text('Henüz not girilmemiş',
                    style: TextStyle(color: Colors.grey))
              else
                ...d.notlar.map((n) => _notSatiri(n)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _bilgiSatiri(String baslik, String deger) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(baslik,
              style: const TextStyle(color: Colors.grey, fontSize: 14)),
          Text(deger,
              style: const TextStyle(
                  fontWeight: FontWeight.w600, fontSize: 14)),
        ],
      ),
    );
  }

  Widget _notSatiri(NotDetayModel n) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F6FA),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(n.sinavTurAd,
                  style: const TextStyle(fontWeight: FontWeight.w600)),
                    Text('Ağırlık: %${(n.agirlik * 100).toInt()}',                  
                        style:const TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('${n.sinavNotu}',
                  style: const TextStyle(
                      fontSize: 20, fontWeight: FontWeight.bold)),
              Text('(${n.agirlikliNot.toStringAsFixed(1)})',
                  style:
                      const TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }
}