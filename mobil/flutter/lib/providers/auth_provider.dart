import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/ogrenci_model.dart';
import '../services/auth_service.dart';

class AuthState {
  final OgrenciModel? ogrenci;
  final String? rol;
  final bool isLoading;
  final String? error;

  AuthState({
    this.ogrenci,
    this.rol,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    OgrenciModel? ogrenci,
    String? rol,
    bool? isLoading,
    String? error,
  }) =>
      AuthState(
        ogrenci: ogrenci ?? this.ogrenci,
        rol: rol ?? this.rol,
        isLoading: isLoading ?? this.isLoading,
        error: error,
      );

  String get displayName {
    if (ogrenci != null) return '${ogrenci!.ad} ${ogrenci!.soyad}';
    return '';
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState());

  Future<bool> loginOgrenci(String ogrenciNo, String tcKimlik) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final ogrenci = await AuthService.loginOgrenci(ogrenciNo, tcKimlik);
      state = state.copyWith(ogrenci: ogrenci, rol: 'ogrenci', isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'Öğrenci numarası veya TC hatalı');
      return false;
    }
  }

  Future<void> logout() async {
    await AuthService.logout();
    state = AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(),
);