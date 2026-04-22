import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _ogrenciNoCtrl = TextEditingController();
  final _tcKimlikCtrl = TextEditingController();
  bool _tcGizli = true;

  @override
  void dispose() {
    _ogrenciNoCtrl.dispose();
    _tcKimlikCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final success = await ref.read(authProvider.notifier).loginOgrenci(
          _ogrenciNoCtrl.text.trim(),
          _tcKimlikCtrl.text.trim(),
        );
    if (!mounted) return;
    if (success) {
      Navigator.pushReplacementNamed(context, '/ogrenci-home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Öğrenci numarası veya TC kimlik hatalı'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(authProvider).isLoading;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.school, size: 72, color: Color(0xFF3B82F6)),
              const SizedBox(height: 12),
              const Text('OBS',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
              const Text('Öğrenci Bilgi Sistemi',
                  style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 40),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.06),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    TextField(
                      controller: _ogrenciNoCtrl,
                      keyboardType: TextInputType.number,
                      decoration: _inputDec(
                          'Öğrenci Numarası', Icons.badge_outlined),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _tcKimlikCtrl,
                      obscureText: _tcGizli,
                      keyboardType: TextInputType.number,
                      decoration:
                          _inputDec('TC Kimlik No', Icons.lock_outline)
                              .copyWith(
                        suffixIcon: IconButton(
                          icon: Icon(_tcGizli
                              ? Icons.visibility_off
                              : Icons.visibility),
                          onPressed: () =>
                              setState(() => _tcGizli = !_tcGizli),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF3B82F6),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: isLoading
                            ? const CircularProgressIndicator(
                                color: Colors.white)
                            : const Text('Giriş Yap',
                                style: TextStyle(
                                    color: Colors.white, fontSize: 16)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDec(String label, IconData icon) => InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        filled: true,
        fillColor: const Color(0xFFF5F6FA),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      );
}