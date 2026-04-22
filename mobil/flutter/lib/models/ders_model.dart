
class DersModel {
  final int dersId;
  final String dersKodu;
  final String ad;
  final double kredi;
  final double akts;
  final String tur;
  final int sinifSeviyesi;

  DersModel({
    required this.dersId,
    required this.dersKodu,
    required this.ad,
    required this.kredi,
    required this.akts,
    required this.tur,
    required this.sinifSeviyesi,
  });

  factory DersModel.fromJson(Map<String, dynamic> json) => DersModel(
        dersId: json['ders_id'],
        dersKodu: json['ders_kodu'],
        ad: json['ad'],
        kredi: (json['kredi'] as num).toDouble(),
        akts: (json['akts'] as num).toDouble(),
        tur: json['tur'],
        sinifSeviyesi: json['sinif_seviyesi'],
      );
}