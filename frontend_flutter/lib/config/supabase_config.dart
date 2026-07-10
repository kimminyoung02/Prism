/// Same Supabase project the React app (frontend/src/lib/supabaseClient.ts) talks to.
/// Override at build time with --dart-define=SUPABASE_URL=... --dart-define=SUPABASE_ANON_KEY=...
///
/// The anon key is safe to ship in client code (it's protected by row-level
/// security on the Supabase side), matching how it's already exposed in the
/// deployed web app's client bundle.
class SupabaseConfig {
  SupabaseConfig._();

  static const String url = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://ocgqjvxnfzrvnbbcsvbd.supabase.co',
  );

  static const String anonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'sb_publishable_Z8stW8OcuD5KoS8Hasvq-Q_63C4TPAW',
  );

  /// Deep link the app registers to catch Supabase's password-recovery email
  /// redirect. Must also be added to Supabase Dashboard → Authentication →
  /// URL Configuration → Redirect URLs, and matches the AndroidManifest
  /// intent-filter scheme/host.
  static const String resetPasswordRedirect = 'com.prism.prism://reset-password';
}
