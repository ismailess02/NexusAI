
import { Translation } from './types';

export const TRANSLATIONS: Translation = {
  welcome: { en: 'Welcome back', es: 'Bienvenido de nuevo', fr: 'Bon retour', de: 'Willkommen zurück', ar: 'مرحباً بعودتك' },
  dashboard: { en: 'Dashboard', es: 'Tablero', fr: 'Tableau de bord', de: 'Dashboard', ar: 'لوحة القيادة' },
  shop: { en: 'Shop', es: 'Tienda', fr: 'Boutique', de: 'Shop', ar: 'المتجر' },
  settings: { en: 'Settings', es: 'Ajustes', fr: 'Paramètres', de: 'Einstellungen', ar: 'الإعدادات' },
  logout: { en: 'Logout', es: 'Cerrar sesión', fr: 'Déconnexion', de: 'Abmelden', ar: 'تسجيل الخروج' },
  login: { en: 'Login', es: 'Iniciar sesión', fr: 'Connexion', de: 'Anmelden', ar: 'تسجيل الدخول' },
  signup: { en: 'Sign Up', es: 'Registrarse', fr: 'S\'inscrire', de: 'Registrieren', ar: 'إنشاء حساب' },
  email: { en: 'Email', es: 'Correo electrónico', fr: 'Email', de: 'Email', ar: 'البريد الإلكتروني' },
  password: { en: 'Password', es: 'Contraseña', fr: 'Mot de passe', de: 'Passwort', ar: 'كلمة المرور' },
  confirmPassword: { en: 'Confirm Password', es: 'Confirmar contraseña', fr: 'Confirmer le mot de passe', de: 'Passwort bestätigen', ar: 'تأكيد كلمة المرور' },
  coins: { en: 'Coins', es: 'Monedas', fr: 'Pièces', de: 'Münzen', ar: 'عملات' },
  nextReward: { en: 'Next Reward', es: 'Siguiente recompensa', fr: 'Prochaine récompense', de: 'Nächste Belohnung', ar: 'المكافأة التالية' },
  mergeImages: { en: 'Merge Images', es: 'Combinar imágenes', fr: 'Fusionner les images', de: 'Bilder zusammenführen', ar: 'دمج الصور' },
  createImage: { en: 'Create Image', es: 'Crear imagen', fr: 'Créer une image', de: 'Bild erstellen', ar: 'إنشاء صورة' },
  uploadImage: { en: 'Upload Image', es: 'Subir imagen', fr: 'Télécharger l\'image', de: 'Bild hochladen', ar: 'رفع صورة' },
  generate: { en: 'Generate', es: 'Generar', fr: 'Générer', de: 'Generieren', ar: 'توليد' },
  premiumStatus: { en: 'Premium Status', es: 'Estado Premium', fr: 'Statut Premium', de: 'Premium-Status', ar: 'حالة بريميوم' },
  accessCount: { en: 'Times Accessed', es: 'Veces accedido', fr: 'Accès totaux', de: 'Zugriffe', ar: 'عدد مرات الدخول' },
  darkMode: { en: 'Dark Mode', es: 'Modo oscuro', fr: 'Mode sombre', de: 'Dunkelmodus', ar: 'الوضع الليلي' },
  language: { en: 'Language', es: 'Idioma', fr: 'Langue', de: 'Sprache', ar: 'اللغة' },
  insufficientCoins: { en: 'Insufficient coins!', es: '¡Monedas insuficientes!', fr: 'Pièces insuffisantes !', de: 'Nicht genügend Münzen!', ar: 'عملات غير كافية!' },
  successRegistration: { en: 'Registration successful!', es: '¡Registro exitoso!', fr: 'Inscription réussie !', de: 'Registrierung erfolgreich!', ar: 'تم التسجيل بنجاح!' },
  resolution: { en: 'Resolution', es: 'Resolución', fr: 'Résolution', de: 'Auflösung', ar: 'الدقة' },
  checkout: { en: 'Checkout', es: 'Pagar', fr: 'Paiement', de: 'Kasse', ar: 'الدفع' },
  payVia: { en: 'Pay via', es: 'Pagar con', fr: 'Payer via', de: 'Bezahlen über', ar: 'الدفع عبر' }
};

export const COIN_REWARD_INTERVAL = 10 * 60 * 1000;
export const COIN_REWARD_AMOUNT = 10;
