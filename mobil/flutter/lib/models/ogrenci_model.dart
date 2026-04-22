class OgrenciModel {
  final int ogrenciId;
  final String ogrenciNo;
  final String ad;
  final String soyad;
  final int sinif;
  final int fakulteId;
  final int bolumId;

  OgrenciModel({
    required this.ogrenciId,
    required this.ogrenciNo,
    required this.ad,
    required this.soyad,
    required this.sinif,
    required this.fakulteId,
    required this.bolumId,
  });

  factory OgrenciModel.fromJson(Map<String, dynamic> json) => OgrenciModel(
        ogrenciId: json['ogrenci_id'],
        ogrenciNo: json['ogrenci_no'],
        ad: json['ad'],
        soyad: json['soyad'],
        sinif: json['sinif'],
        fakulteId: json['fakulte_id'],
        bolumId: json['bolum_id'],
      );

  Map<String, dynamic> toJson() => {
        'ogrenci_no': ogrenciNo,
        'ad': ad,
        'soyad': soyad,
        'sinif': sinif,
        'fakulte_id': fakulteId,
        'bolum_id': bolumId,
      };
}