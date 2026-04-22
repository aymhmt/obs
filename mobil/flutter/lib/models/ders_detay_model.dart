class NotDetayModel {
  final int id;
  final String sinavTurAd;
  final double agirlik;
  final int sinavNotu;
  final double agirlikliNot;

  NotDetayModel({
    required this.id,
    required this.sinavTurAd,
    required this.agirlik,
    required this.sinavNotu,
    required this.agirlikliNot,
  });

  factory NotDetayModel.fromJson(Map<String, dynamic> json) => NotDetayModel(
        id: json['id'],
        sinavTurAd: json['sinav_tur_ad'],
        agirlik: (json['agirlik'] as num).toDouble(),
        sinavNotu: json['sinav_notu'],
        agirlikliNot: (json['agirlikli_not'] as num).toDouble(),
      );
}

class DersDetayModel {
  final int dersId;
  final String dersKodu;
  final String ad;
  final double kredi;
  final double akts;
  final String tur;
  final int sinifSeviyesi;
  final String ogretmenAd;
  final String ogretmenSoyad;
  final List<NotDetayModel> notlar;
  final String harfNotu;
  final double ortalamaNot;

  DersDetayModel({
    required this.dersId,
    required this.dersKodu,
    required this.ad,
    required this.kredi,
    required this.akts,
    required this.tur,
    required this.sinifSeviyesi,
    required this.ogretmenAd,
    required this.ogretmenSoyad,
    required this.notlar,
    required this.harfNotu,
    required this.ortalamaNot,
  });

  factory DersDetayModel.fromJson(Map<String, dynamic> json) => DersDetayModel(
        dersId: json['ders_id'],
        dersKodu: json['ders_kodu'],
        ad: json['ad'],
        kredi: (json['kredi'] as num).toDouble(),
        akts: (json['akts'] as num).toDouble(),
        tur: json['tur'],
        sinifSeviyesi: json['sinif_seviyesi'],
        ogretmenAd: json['ogretmen_ad'],
        ogretmenSoyad: json['ogretmen_soyad'],
        notlar: (json['notlar'] as List)
            .map((e) => NotDetayModel.fromJson(e))
            .toList(),
        harfNotu: json['harf_notu'],
        ortalamaNot: (json['ortalama_not'] as num).toDouble(),
      );
}