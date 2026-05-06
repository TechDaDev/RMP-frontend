import type { Locale, Translations } from "@/types/i18n";

export const defaultLocale: Locale = "ar";

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  ku: "rtl",
  en: "ltr",
};

export const translations: Record<Locale, Translations> = {
  ar: {
    nav: {
      home: "الرئيسية",
      features: "المزايا",
      whoItServes: "لمن المنصة؟",
      security: "الأمان",
      howItWorks: "آلية العمل",
      faq: "الأسئلة الشائعة",
      cta: "دخول تجريبي",
    },
    hero: {
      title: "منصة طبية رقمية تربط الرعاية الصحية من البداية إلى المتابعة",
      subtitle:
        "منصة الرافدين الطبية الرقمية تساعد على تنظيم التواصل بين المريض والطبيب والمختبر والصيدلية، مع التركيز على الأمان، الخصوصية، وسهولة الوصول.",
      exploreBtn: "استكشف المنصة",
      howBtn: "تعرف على آلية العمل",
    },
    trust: {
      title: "مؤشرات الثقة",
      items: [
        {
          label: "خصوصية البيانات",
          desc: "إدارة دقيقة للوصول إلى المعلومات الطبية الحساسة.",
        },
        {
          label: "وصول منظم",
          desc: "صلاحيات واضحة لكل دور لضمان استخدام منضبط.",
        },
        {
          label: "تواصل آمن",
          desc: "قنوات تواصل مصممة لحماية سرية الرعاية.",
        },
        {
          label: "متابعة طبية",
          desc: "استمرارية في الرعاية عبر رحلة المريض كاملة.",
        },
      ],
    },
    features: {
      title: "المزايا الأساسية",
      subtitle:
        "واجهة موحدة لتنسيق خدمات الرعاية الصحية بين الأطراف المختلفة.",
      items: [
        {
          title: "الاستشارات",
          desc: "تنظيم طلبات الاستشارة والمتابعة الطبية بوضوح.",
        },
        {
          title: "الوصفات",
          desc: "إدارة وصفات رقمية بأسلوب منظم وسهل المتابعة.",
        },
        {
          title: "طلبات ونتائج المختبر",
          desc: "ربط طلبات الفحوصات ومتابعة النتائج ضمن نفس المسار.",
        },
        {
          title: "سجلات المرضى",
          desc: "عرض منظم للمعلومات الطبية لدعم القرار العلاجي.",
        },
        {
          title: "مراسلة آمنة",
          desc: "تبادل معلومات الرعاية ضمن قنوات محمية.",
        },
        {
          title: "دعم طبي معرفي",
          desc: "محتوى مرجعي يساعد الفرق الطبية على العمل بكفاءة.",
        },
      ],
    },
    whoItServes: {
      title: "لمن المنصة؟",
      subtitle: "مصممة لخدمة أطراف المنظومة الصحية بشكل متكامل.",
      items: [
        {
          title: "للمرضى",
          desc: "وصول أوضح للمعلومات والمتابعة من أي جهاز.",
        },
        {
          title: "للأطباء",
          desc: "تدفق عملي منظم للاستشارات والخطط العلاجية.",
        },
        {
          title: "للصيدليات",
          desc: "تنسيق صرف الوصفات ضمن سياق طبي موثوق.",
        },
        {
          title: "للمختبرات",
          desc: "إدارة الطلبات والنتائج بطريقة مترابطة وشفافة.",
        },
      ],
    },
    security: {
      title: "الأمان والخصوصية",
      subtitle: "مصممة بمبادئ الأمان والخصوصية من البداية.",
      tagline:
        "بنية تشغيلية تدعم الاستخدام الآمن للمعلومات الطبية بين الجهات المعنية.",
      items: [
        {
          label: "وصول منضبط",
          desc: "التحكم بمن يمكنه الاطلاع على كل نوع من البيانات.",
        },
        {
          label: "صلاحيات مبنية على الأدوار",
          desc: "توزيع المسؤوليات حسب طبيعة العمل لكل مستخدم.",
        },
        {
          label: "سجلات تدقيق",
          desc: "تتبع الأنشطة لدعم الشفافية وتحسين الحوكمة.",
        },
        {
          label: "إدارة آمنة للوثائق",
          desc: "تنظيم مشاركة الوثائق الطبية وفق سياسات حماية واضحة.",
        },
        {
          label: "تواصل طبي محمي",
          desc: "قنوات مراسلة تراعي سرية التواصل الطبي.",
        },
      ],
    },
    howItWorks: {
      title: "آلية العمل",
      subtitle: "تدفق واضح من الطلب الأول حتى المتابعة.",
      steps: [
        {
          title: "1. يقدم المريض الطلب أو الاستشارة",
          desc: "يبدأ المسار عبر طلب منظم داخل المنصة.",
        },
        {
          title: "2. يراجع الطبيب ويستجيب",
          desc: "يتم تقييم الحالة وتقديم التوجيه المناسب.",
        },
        {
          title: "3. تنفيذ إجراءات المختبر أو الصيدلية عند الحاجة",
          desc: "تتصل الجهات ذات الصلة ضمن نفس الرحلة العلاجية.",
        },
        {
          title: "4. متابعة المريض بشكل آمن",
          desc: "تستمر المتابعة عبر سجل موحد وموثوق.",
        },
      ],
    },
    preview: {
      title: "نظرة على المنصة",
      subtitle: "تصور واجهة تشغيلية رقمية بدون بيانات حقيقية.",
      items: [
        { title: "الاستشارة", status: "بانتظار رد الطبيب" },
        { title: "نتيجة المختبر", status: "قيد المعالجة" },
        { title: "الوصفة", status: "جاهزة للمراجعة" },
        { title: "إشعار", status: "تحديث آمن جديد" },
        { title: "شارة الأمان", status: "تواصل طبي محمي" },
      ],
    },
    faq: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات سريعة على الأسئلة الأساسية.",
      items: [
        {
          q: "هل هذه المنصة بديل عن المستشفيات؟",
          a: "لا، المنصة تدعم تنظيم التواصل والإجراءات الرقمية ولا تستبدل الرعاية السريرية المباشرة.",
        },
        {
          q: "هل يمكن للمريض الوصول من الهاتف؟",
          a: "نعم، الواجهة متجاوبة ومهيأة للاستخدام على الهواتف والأجهزة اللوحية.",
        },
        {
          q: "هل يوجد تطبيق iOS؟",
          a: "في المرحلة الحالية يمكن لمستخدمي iPhone استخدام نسخة الويب المتجاوبة، وسيتم التخطيط لتطبيق iOS لاحقًا.",
        },
        {
          q: "كيف تتم حماية الخصوصية؟",
          a: "يتم اعتماد وصول منظم وصلاحيات بحسب الدور مع ممارسات أمان وخصوصية ضمن بنية المنصة.",
        },
        {
          q: "متى ستكون المنصة متاحة؟",
          a: "المنصة حالياً في مرحلة الإطلاق الأولي، وسيتم الإعلان عن الجدول الزمني قريبًا.",
        },
      ],
    },
    finalCta: {
      tagline:
        "الرعاية الصحية الرقمية تبدأ من تنظيم الوصول الآمن للمعلومة الطبية.",
      btn: "دخول تجريبي",
    },
    footer: {
      description:
        "منصة رقمية موحدة لربط المرضى ومقدمي الرعاية ضمن تجربة موثوقة وآمنة.",
      copyright:
        "© 2026 منصة الرافدين الطبية الرقمية. جميع الحقوق محفوظة.",
    },
    auth: {
      loginTitle: "تسجيل الدخول",
      loginSubtitle: "واجهة تمهيدية للوصول إلى بوابة المنصة من المتصفح.",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      rememberMe: "تذكرني",
      enterPlatform: "الدخول إلى المنصة",
      forgotPassword: "نسيت كلمة المرور؟",
      noAccount: "لا تملك حسابًا؟",
      createAccount: "إنشاء حساب",
      registerTitle: "إنشاء حساب",
      registerSubtitle: "اختر نوع الحساب وأكمل البيانات الأساسية. الربط بالخادم سيُضاف لاحقًا.",
      chooseAccountType: "اختر نوع الحساب",
      continue: "متابعة",
      haveAccount: "لديك حساب بالفعل؟",
      nameLabel: "الاسم الكامل",
      registerAction: "متابعة",
      loginPreviewNotice: "واجهة تسجيل الدخول التمهيدية — سيتم ربطها بالخادم لاحقًا.",
      registerPreviewNotice: "واجهة إنشاء الحساب التمهيدية — سيتم ربطها بالخادم لاحقًا.",
    },
    portal: {
      dashboard: "لوحة التحكم",
      profile: "الملف الشخصي",
      notifications: "الإشعارات",
      messages: "الرسائل",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      previewNotice: "هذه واجهة تمهيدية بدون اتصال بالخادم.",
      demoUser: "مستخدم تجريبي",
      entryTitle: "اختر واجهة تجريبية حسب الدور",
      entrySubtitle: "اختر واجهة تجريبية لمعاينة تجربة المستخدم حسب الدور. لاحقًا سيتم تحديد الواجهة تلقائيًا حسب حساب المستخدم.",
      currentRole: "الدور الحالي",
      chooseRole: "معاينة الأدوار",
      roleAutoRoutingNotice: "سيتم لاحقًا توجيه المستخدم تلقائيًا حسب نوع حسابه.",
    },
    roles: {
      patient: "المريض",
      doctor: "الطبيب",
      pharmacist: "الصيدلية",
      laboratory: "المختبر",
      admin: "الإدارة",
    },
    dashboards: {
      previewNotice: "هذه واجهة تمهيدية، وسيتم ربطها بخدمات المنصة لاحقًا.",
      patientTitle: "واجهة المريض",
      patientSubtitle: "عرض أولي للمسارات التي ستظهر للمريض عند تفعيل خدمات المنصة.",
      doctorTitle: "واجهة الطبيب",
      doctorSubtitle: "عرض أولي لمساحة العمل المخصصة للأطباء والاستشارات والمتابعة.",
      pharmacistTitle: "واجهة الصيدلية",
      pharmacistSubtitle: "عرض أولي لتدفق مراجعة الوصفات وصرف الأدوية داخل المنصة.",
      laboratoryTitle: "واجهة المختبر",
      laboratorySubtitle: "عرض أولي لمسار طلبات الفحص ورفع النتائج ومشاركتها بأمان.",
      adminTitle: "واجهة الإدارة",
      adminSubtitle: "عرض أولي لأدوات الإدارة والحوكمة ومتابعة حالة المنصة.",
      modules: {
        consultations: "الاستشارات",
        prescriptions: "الوصفات",
        labResults: "نتائج المختبر",
        messages: "الرسائل",
        patients: "المرضى",
        labRequests: "طلبات المختبر",
        prescriptionReview: "مراجعة الوصفات",
        medicationDispensing: "صرف الأدوية",
        dispensingLog: "سجل الصرف",
        testRequests: "طلبات الفحص",
        uploadResults: "رفع النتائج",
        sentResults: "النتائج المرسلة",
        users: "المستخدمون",
        staffVerification: "التحقق من الكوادر",
        knowledgeBase: "قاعدة المعرفة",
        auditLog: "سجل التدقيق",
        systemStatus: "حالة النظام",
      },
    },
    common: {
      backToHome: "العودة إلى الرئيسية",
      previewBadge: "معاينة",
      uiOnlyBadge: "واجهة فقط",
      viewPreview: "عرض تجريبي",
      previewLogin: "دخول تجريبي",
      accountType: "نوع الحساب",
    },
    lang: {
      ar: "العربية",
      ku: "کوردی",
      en: "English",
    },
    theme: {
      light: "الوضع النهاري",
      dark: "الوضع الليلي",
      shortLight: "نهاري",
      shortDark: "ليلي",
    },
    ui: {
      phaseBadge: "منصة طبية رقمية آمنة",
      languageSwitcherLabel: "تبديل اللغة",
      themeToggleLabel: "تبديل الوضع",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
      primaryNavigation: "التنقل الرئيسي",
      mobileMenu: "قائمة التنقل للجوال",
      heroFlowLabel: "تدفق الرعاية الصحية المتصل",
      openPortalNavigation: "فتح تنقل البوابة",
      closePortalNavigation: "إغلاق تنقل البوابة",
      portalNavigation: "تنقل البوابة",
      languageMenu: "قائمة اللغات",
      currentLanguage: "اللغة الحالية",
    },
  },
  ku: {
    nav: {
      home: "سەرەکی",
      features: "تایبەتمەندییەکان",
      whoItServes: "بۆ کێیە؟",
      security: "ئاسایش",
      howItWorks: "چۆن کاردەکات",
      faq: "پرسیارە باوەکان",
      cta: "چوونەژوورەوەی تاقیکردنەوە",
    },
    hero: {
      title:
        "پلاتفۆرمێکی پزیشکی دیجیتاڵی بۆ بەستنەوەی چاودێری تەندروستی لە ڕاوێژەوە تا بەدواداچوون",
      subtitle:
        "پلاتفۆرمی پزیشکی دیجیتاڵی ڕافیدەین یارمەتی ڕێکخستنی پەیوەندی نێوان نەخۆش، پزیشک، تاقیگە و دەرمانخانە دەدات، بە جەختکردنەوە لەسەر ئاسایش، تایبەتمەندی و ئاسانکاری.",
      exploreBtn: "پلاتفۆرمەکە ببینە",
      howBtn: "بزانە چۆن کاردەکات",
    },
    trust: {
      title: "نیشانەکانی متمانە",
      items: [
        {
          label: "تایبەتمەندی داتا",
          desc: "پاراستنی زانیاری پزیشکی بە کۆنترۆڵی ورد.",
        },
        {
          label: "دەستگەیشتنی ڕێکخراو",
          desc: "دەسەڵات بەپێی ڕۆڵ بۆ بەکارهێنانی ڕێکوپێک.",
        },
        {
          label: "پەیوەندی پارێزراو",
          desc: "هێڵی پەیوەندی تایبەتی بۆ کاری پزیشکی.",
        },
        {
          label: "بەدواداچوونی پزیشکی",
          desc: "بەردەوامی چاودێری لە هەموو قۆناغەکاندا.",
        },
      ],
    },
    features: {
      title: "تایبەتمەندییە سەرەکییەکان",
      subtitle:
        "ڕووکارێکی یەکگرتوو بۆ ڕێکخستنی خزمەتگوزاریی تەندروستی.",
      items: [
        {
          title: "ڕاوێژ",
          desc: "ڕێکخستنی داواکاری ڕاوێژ و بەدواداچوون بە ڕوونی.",
        },
        {
          title: "ڕەچەتە",
          desc: "بەڕێوەبردنی ڕەچەتەی دیجیتاڵی بە شێوەیەکی ئاسان.",
        },
        {
          title: "داواکاری و ئەنجامی تاقیکردنەوە",
          desc: "بەستنەوەی تاقیکردنەوەکان لە هەمان ڕێڕەودا.",
        },
        {
          title: "تۆماری نەخۆش",
          desc: "پیشاندانی زانیاری پزیشکی بۆ هاوکاری بڕیاردان.",
        },
        {
          title: "نامەگۆڕینی پارێزراو",
          desc: "ئاڵوگۆڕی زانیاری تەندروستی لە ژێر پاراستندا.",
        },
        {
          title: "پشتگیری پزیشکیی زانیاری-بنیاد",
          desc: "سەرچاوەی یارمەتیدەر بۆ تیمە پزیشکییەکان.",
        },
      ],
    },
    whoItServes: {
      title: "بۆ کێیە؟",
      subtitle: "بۆ هەموو لایەنە سەرەکییەکانی سیستەمی تەندروستی.",
      items: [
        {
          title: "بۆ نەخۆشان",
          desc: "دەستگەیشتنێکی ئاسانتر بۆ بەدواداچوون و زانیاری.",
        },
        {
          title: "بۆ پزیشکان",
          desc: "ڕێڕەوێکی کارا بۆ ڕاوێژ و پلانی چارەسەر.",
        },
        {
          title: "بۆ دەرمانخانەکان",
          desc: "هاوتاکردنی ڕەچەتەکان لە چوارچێوەیەکی متمانەپێکراودا.",
        },
        {
          title: "بۆ تاقیگەکان",
          desc: "بەڕێوەبردنی داواکاری و ئەنجام بە شێوەیەکی پەیوەست.",
        },
      ],
    },
    security: {
      title: "ئاسایش و تایبەتمەندی",
      subtitle: "لە بنەڕەتەوە بە بنەماکانی ئاسایش و تایبەتمەندی دیزاین کراوە.",
      tagline:
        "بنکەیەکی کارپێکراو بۆ بەکارهێنانی پارێزراوی زانیاری پزیشکی.",
      items: [
        {
          label: "دەستگەیشتنی کۆنترۆڵکراو",
          desc: "دیاریکردنی ئەوەی کێ بتوانێت چ زانیارییەک ببینێت.",
        },
        {
          label: "دەسەڵاتی بەپێی ڕۆڵ",
          desc: "پەیوەستکردنی مافەکان بە جۆری ئەرکی بەکارهێنەر.",
        },
        {
          label: "تۆماری چاودێری",
          desc: "تۆمارکردنی چالاکییەکان بۆ ڕوونی و باشترکردنی سیستەم.",
        },
        {
          label: "بەڕێوەبردنی پارێزراوی بەڵگەنامە",
          desc: "هاوبەشکردنی بەڵگەنامەی پزیشکی بە ڕێسای پاراستنی دیاریکراو.",
        },
        {
          label: "پەیوەندی پزیشکی پارێزراو",
          desc: "کەناڵی نامەگۆڕین کە نهێنیی پەیوەندی پارێزراو دەکات.",
        },
      ],
    },
    howItWorks: {
      title: "چۆن کاردەکات",
      subtitle: "ڕێڕەوێکی ڕوون لە داواکاری یەکەمەوە تا بەدواداچوون.",
      steps: [
        {
          title: "1. نەخۆش داواکاری یان ڕاوێژ دەنێرێت",
          desc: "دەستپێکردنی ڕێڕەوەکە لە ناو پلاتفۆرمدا.",
        },
        {
          title: "2. پزیشک پشکنین دەکات و وەڵام دەدات",
          desc: "هەڵسەنگاندنی دۆخ و ناردنی ڕێنمایی پێویست.",
        },
        {
          title: "3. کاری تاقیگە/دەرمانخانە ئەنجام دەدرێت کاتێک پێویستە",
          desc: "لایەنە پەیوەندیدارەکان لە هەمان ڕێڕەوی چارەسەردا پەیوەست دەبن.",
        },
        {
          title: "4. نەخۆش بە شێوەیەکی پارێزراو بەدواداچوون دەکات",
          desc: "بەردەوامبوون لە چاودێری بە تۆمارێکی یەکگرتوو.",
        },
      ],
    },
    preview: {
      title: "پێشبینینی پلاتفۆرم",
      subtitle: "نموونەی ڕووکارێکی کارپێکراو بەبێ داتای ڕاستەقینە.",
      items: [
        { title: "ڕاوێژ", status: "چاوەڕێی وەڵامی پزیشک" },
        { title: "ئەنجامی تاقیگە", status: "لە ژێر کارکردن" },
        { title: "ڕەچەتە", status: "ئامادەی پشکنینە" },
        { title: "ئاگادارکردنەوە", status: "نوێکردنەوەیەکی پارێزراو" },
        { title: "نیشانی ئاسایش", status: "پەیوەندی پزیشکی پارێزراو" },
      ],
    },
    faq: {
      title: "پرسیارە باوەکان",
      subtitle: "وەڵامی خێرا بۆ گرنگترین پرسیارەکان.",
      items: [
        {
          q: "ئەم پلاتفۆرمە جێگرەوەی نەخۆشخانەیە؟",
          a: "نەخێر، پلاتفۆرمەکە بۆ ڕێکخستنی پەیوەندی و پرۆسەی دیجیتاڵە و جێگرەوەی چاودێری ڕاستەوخۆ نابێت.",
        },
        {
          q: "نەخۆش دەتوانێت لە مۆبایلەوە دەستگەیشتن بکات؟",
          a: "بەڵێ، ڕووکارەکە وەڵامدەرەوەیە و بۆ مۆبایل و تابلێت ئامادە کراوە.",
        },
        {
          q: "ئەپی iOS هەیە؟",
          a: "لە ئێستادا بەکارهێنەرانی iPhone دەتوانن وەشانی وێبی وەڵامدەرەوە بەکاربهێنن، و ئەپی تایبەتی iOS دواتر دەتوانرێت پلان بکرێت.",
        },
        {
          q: "تایبەتمەندی چۆن پارێزراو دەبێت؟",
          a: "بە دەستگەیشتنی ڕێکخراو، دەسەڵاتی بەپێی ڕۆڵ و بنەماکانی ئاسایش لە ناو دیزاینەکەدا.",
        },
        {
          q: "کەی پلاتفۆرمەکە بەردەست دەبێت؟",
          a: "ئێستا لە قۆناغی ئامادەکاریی سەرەتاییدایە و کاتی فەرمی بە زوویی ڕادەگەیەنرێت.",
        },
      ],
    },
    finalCta: {
      tagline:
        "چاودێری تەندروستی دیجیتاڵی لە دەستگەیشتنی پارێزراو و ڕێکخراو بە زانیاری پزیشکی دەستپێدەکات.",
      btn: "چوونەژوورەوەی تاقیکردنەوە",
    },
    footer: {
      description:
        "پلاتفۆرمێکی یەکگرتوو بۆ بەستنەوەی نەخۆش و دابینکەرانی چاودێری بە شێوەیەکی متمانەپێکراو.",
      copyright:
        "© 2026 پلاتفۆرمی پزیشکی دیجیتاڵی ڕافیدەین. هەموو مافەکان پارێزراون.",
    },
    auth: {
      loginTitle: "چوونەژوورەوە",
      loginSubtitle: "ڕووکارێکی سەرەتایی بۆ چوونە ناو پۆرتاڵی پلاتفۆرم لە وێبدا.",
      emailLabel: "ئیمەیڵ",
      passwordLabel: "وشەی نهێنی",
      rememberMe: "بیرم بێت",
      enterPlatform: "چوونە ناو پلاتفۆرم",
      forgotPassword: "وشەی نهێنی لەبیرت چووە؟",
      noAccount: "هێشتا هەژمارێکت نییە؟",
      createAccount: "دروستکردنی هەژمار",
      registerTitle: "دروستکردنی هەژمار",
      registerSubtitle: "جۆری هەژمار هەڵبژێرە و زانیارییە سەرەتاییەکان پڕبکەرەوە. بەستنەوە بە خزمەتگوزاری دواتر زیاد دەکرێت.",
      chooseAccountType: "جۆری هەژمار هەڵبژێرە",
      continue: "بەردەوام بە",
      haveAccount: "هەژمارت هەیە؟",
      nameLabel: "ناوی تەواو",
      registerAction: "بەردەوام بە",
      loginPreviewNotice: "پێشبینینی ڕووکارى چوونەژوورەوەیە — پەیوەندی بە خادەم دواتر زیاد دەکرێت.",
      registerPreviewNotice: "پێشبینینی ڕووکارى دروستکردنی هەژمارە — پەیوەندی بە خادەم دواتر زیاد دەکرێت.",
    },
    portal: {
      dashboard: "داشبۆرد",
      profile: "پرۆفایل",
      notifications: "ئاگادارکردنەوەکان",
      messages: "نامەکان",
      settings: "ڕێکخستنەکان",
      logout: "چوونەدەرەوە",
      previewNotice: "ئەم ڕووکارە سەرەتایییە و پەیوەندی بە خادەم نییە.",
      demoUser: "بەکارهێنەری تاقیکردنەوە",
      entryTitle: "ڕووکارێکی تاقیکردنەوە بەپێی ڕۆڵ هەڵبژێرە",
      entrySubtitle: "ڕووکارێکی تاقیکردنەوە هەڵبژێرە بۆ بینینی ئەزموونی بەکارهێنەر بەپێی ڕۆڵ. دواتر، بۆخۆیی بەپێی جۆری هەژمار ئاراستە دەکرێت.",
      currentRole: "ڕۆڵی ئێستا",
      chooseRole: "بینینی ڕۆڵەکان",
      roleAutoRoutingNotice: "دواتر بەکارهێنەر بۆخۆیی بەپێی جۆری هەژمار ئاراستە دەکرێت.",
    },
    roles: {
      patient: "نەخۆش",
      doctor: "پزیشک",
      pharmacist: "دەرمانخانە",
      laboratory: "تاقیگە",
      admin: "بەڕێوەبەرایەتی",
    },
    dashboards: {
      previewNotice: "ئەمە ڕووکارێکی سەرەتایییە و دواتر بە خزمەتگوزارییەکانی پلاتفۆرم بەستراو دەبێت.",
      patientTitle: "ڕووکاری نەخۆش",
      patientSubtitle: "پێشبینینی ڕێڕەوە سەرەکییەکان بۆ ئەوەی نەخۆش دواتر چی دەبینێت.",
      doctorTitle: "ڕووکاری پزیشک",
      doctorSubtitle: "پێشبینینی شوێنی کار بۆ ڕاوێژ و چاودێری و کارەکانی پزیشک.",
      pharmacistTitle: "ڕووکاری دەرمانخانە",
      pharmacistSubtitle: "پێشبینینی ڕێڕەوی پشکنینی ڕەچەتە و دەرچوونی دەرمان.",
      laboratoryTitle: "ڕووکاری تاقیگە",
      laboratorySubtitle: "پێشبینینی ڕێڕەوی داواکاریی تاقیکردنەوە و بەرزکردنەوەی ئەنجامەکان.",
      adminTitle: "ڕووکاری بەڕێوەبەرایەتی",
      adminSubtitle: "پێشبینینی ئامرازەکانی بەڕێوەبردن و چاودێری و دۆخی سیستەم.",
      modules: {
        consultations: "ڕاوێژەکان",
        prescriptions: "ڕەچەتەکان",
        labResults: "ئەنجامەکانی تاقیگە",
        messages: "نامەکان",
        patients: "نەخۆشان",
        labRequests: "داواکارییەکانی تاقیگە",
        prescriptionReview: "پشکنینی ڕەچەتە",
        medicationDispensing: "دەرچوونی دەرمان",
        dispensingLog: "تۆماری دەرچوون",
        testRequests: "داواکارییەکانی تاقیکردنەوە",
        uploadResults: "بەرزکردنەوەی ئەنجامەکان",
        sentResults: "ئەنجامە نێردراوەکان",
        users: "بەکارهێنەران",
        staffVerification: "پشتڕاستکردنەوەی کادەر",
        knowledgeBase: "بنکەی زانیاری",
        auditLog: "تۆماری پشکنین",
        systemStatus: "دۆخی سیستەم",
      },
    },
    common: {
      backToHome: "گەڕانەوە بۆ سەرەکی",
      previewBadge: "پێشبینین",
      uiOnlyBadge: "تەنها ڕووکار",
      viewPreview: "بینینی پێشبینین",
      previewLogin: "چوونەژوورەوەی تاقیکردنەوە",
      accountType: "جۆری هەژمار",
    },
    lang: {
      ar: "العربية",
      ku: "کوردی",
      en: "English",
    },
    theme: {
      light: "دۆخی ڕووناک",
      dark: "دۆخی تاریک",
      shortLight: "ڕووناک",
      shortDark: "تاریک",
    },
    ui: {
      phaseBadge: "پلاتفۆرمی پزیشکی دیجیتاڵی پارێزراو",
      languageSwitcherLabel: "گۆڕینی زمان",
      themeToggleLabel: "گۆڕینی دۆخ",
      openMenu: "کردنەوەی لیست",
      closeMenu: "داخستنی لیست",
      primaryNavigation: "گەڕانی سەرەکی",
      mobileMenu: "لیستی گەڕان بۆ مۆبایل",
      heroFlowLabel: "ڕێڕەوی پەیوەستکراوی چاودێری تەندروستی",
      openPortalNavigation: "کردنەوەی گەڕانی پۆرتاڵ",
      closePortalNavigation: "داخستنی گەڕانی پۆرتاڵ",
      portalNavigation: "گەڕانی پۆرتاڵ",
      languageMenu: "لیستی زمانەکان",
      currentLanguage: "زمانی ئێستا",
    },
  },
  en: {
    nav: {
      home: "Home",
      features: "Features",
      whoItServes: "Who It Serves",
      security: "Security",
      howItWorks: "How It Works",
      faq: "FAQ",
      cta: "Preview Login",
    },
    hero: {
      title:
        "A digital medical platform connecting healthcare from consultation to follow-up",
      subtitle:
        "Al-Rafidain Digital Medical Platform helps organize communication between patients, doctors, laboratories, and pharmacies with a focus on security, privacy, and accessibility.",
      exploreBtn: "Explore the Platform",
      howBtn: "See How It Works",
    },
    trust: {
      title: "Trust Indicators",
      items: [
        {
          label: "Data Privacy",
          desc: "Sensitive medical information is handled with strict access control.",
        },
        {
          label: "Controlled Access",
          desc: "Role-aware access keeps workflows organized and accountable.",
        },
        {
          label: "Secure Communication",
          desc: "Clinical communication flows through protected channels.",
        },
        {
          label: "Medical Follow-up",
          desc: "Continuity of care is supported across every stage.",
        },
      ],
    },
    features: {
      title: "Core Features",
      subtitle:
        "One professional interface for structured healthcare collaboration.",
      items: [
        {
          title: "Consultations",
          desc: "Structured consultation and follow-up management.",
        },
        {
          title: "Prescriptions",
          desc: "Organized digital prescription workflows for safer continuity.",
        },
        {
          title: "Lab Orders & Results",
          desc: "Connected testing requests and results in one timeline.",
        },
        {
          title: "Patient Records",
          desc: "Unified patient context to support better clinical decisions.",
        },
        {
          title: "Secure Messaging",
          desc: "Protected communication for care coordination.",
        },
        {
          title: "Knowledge-Based Medical Support",
          desc: "Practical reference support for healthcare teams.",
        },
      ],
    },
    whoItServes: {
      title: "Who It Serves",
      subtitle: "Built for all core participants in the care ecosystem.",
      items: [
        {
          title: "For Patients",
          desc: "Clearer access to care updates and medical information.",
        },
        {
          title: "For Doctors",
          desc: "A streamlined workspace for consultations and care plans.",
        },
        {
          title: "For Pharmacies",
          desc: "Aligned prescription handling in a trusted clinical flow.",
        },
        {
          title: "For Laboratories",
          desc: "Structured order and result exchange across stakeholders.",
        },
      ],
    },
    security: {
      title: "Security & Privacy",
      subtitle: "Designed around security and privacy principles from the beginning.",
      tagline:
        "Operational safeguards help protect medical information throughout the care journey.",
      items: [
        {
          label: "Controlled access",
          desc: "Granular visibility control over medical data.",
        },
        {
          label: "Role-based permissions",
          desc: "Permissions are assigned according to user responsibilities.",
        },
        {
          label: "Audit logs",
          desc: "Actions are traceable to improve transparency and governance.",
        },
        {
          label: "Secure document handling",
          desc: "Medical documents are managed with protected sharing flows.",
        },
        {
          label: "Protected medical communication",
          desc: "Clinical communication is routed through secure channels.",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "A clear process from first request to secure follow-up.",
      steps: [
        {
          title: "1. Patient submits a request or consultation",
          desc: "The care journey starts with a structured intake.",
        },
        {
          title: "2. Doctor reviews and responds",
          desc: "The clinician evaluates the request and provides guidance.",
        },
        {
          title: "3. Lab/pharmacy workflows are handled when needed",
          desc: "Relevant partners are engaged inside the same care flow.",
        },
        {
          title: "4. Patient follows up securely",
          desc: "Follow-up continues with protected, organized access.",
        },
      ],
    },
    preview: {
      title: "Platform Preview",
      subtitle: "A conceptual interface sample with no real patient data.",
      items: [
        { title: "Consultation", status: "Awaiting doctor response" },
        { title: "Lab Result", status: "In progress" },
        { title: "Prescription", status: "Ready for review" },
        { title: "Notification", status: "New secure update" },
        { title: "Security Badge", status: "Protected medical communication" },
      ],
    },
    faq: {
      title: "FAQ",
      subtitle: "Quick answers to common questions.",
      items: [
        {
          q: "Is this a replacement for hospitals?",
          a: "No. The platform supports digital coordination and communication, but it does not replace direct clinical care.",
        },
        {
          q: "Can patients access from phone?",
          a: "Yes. The interface is fully responsive for phones and tablets.",
        },
        {
          q: "Is there an iOS app?",
          a: "At this stage, iPhone users can use the responsive web version. A dedicated iOS app can be planned later.",
        },
        {
          q: "How is privacy handled?",
          a: "The platform uses controlled access, role-based permissions, and privacy-oriented design practices.",
        },
        {
          q: "When will the platform be available?",
          a: "This is an early launch phase, and timeline details will be announced soon.",
        },
      ],
    },
    finalCta: {
      tagline:
        "Digital healthcare starts with secure, organized access to medical information.",
      btn: "Preview Login",
    },
    footer: {
      description:
        "A unified digital platform connecting patients and healthcare providers with trust and clarity.",
      copyright:
        "© 2026 Al-Rafidain Digital Medical Platform. All rights reserved.",
    },
    auth: {
      loginTitle: "Login",
      loginSubtitle: "A preview sign-in interface for accessing the web portal.",
      emailLabel: "Email",
      passwordLabel: "Password",
      rememberMe: "Remember me",
      enterPlatform: "Enter Platform",
      forgotPassword: "Forgot password?",
      noAccount: "Don\'t have an account?",
      createAccount: "Create account",
      registerTitle: "Create Account",
      registerSubtitle: "Choose an account type and complete the basic fields. Backend connection will be added later.",
      chooseAccountType: "Choose account type",
      continue: "Continue",
      haveAccount: "Already have an account?",
      nameLabel: "Full name",
      registerAction: "Continue",
      loginPreviewNotice: "Login UI preview — backend connection will be added later.",
      registerPreviewNotice: "Register UI preview — backend connection will be added later.",
    },
    portal: {
      dashboard: "Dashboard",
      profile: "Profile",
      notifications: "Notifications",
      messages: "Messages",
      settings: "Settings",
      logout: "Logout",
      previewNotice: "This is a frontend preview without backend connection.",
      demoUser: "Demo User",
      entryTitle: "Choose a preview portal by role",
      entrySubtitle: "Choose a preview portal by role. Later, the user will be routed automatically based on their account role.",
      currentRole: "Current role",
      chooseRole: "Role previews",
      roleAutoRoutingNotice: "Later, users will be routed automatically based on their account role.",
    },
    roles: {
      patient: "Patient",
      doctor: "Doctor",
      pharmacist: "Pharmacist",
      laboratory: "Laboratory",
      admin: "Admin",
    },
    dashboards: {
      previewNotice: "This is a placeholder interface that will connect to platform services later.",
      patientTitle: "Patient Workspace",
      patientSubtitle: "An early view of the future patient portal modules and flows.",
      doctorTitle: "Doctor Workspace",
      doctorSubtitle: "An early view of the clinical consultation and follow-up workspace.",
      pharmacistTitle: "Pharmacist Workspace",
      pharmacistSubtitle: "An early view of prescription review and dispensing flows.",
      laboratoryTitle: "Laboratory Workspace",
      laboratorySubtitle: "An early view of lab orders, result uploads, and secure delivery.",
      adminTitle: "Admin Workspace",
      adminSubtitle: "An early view of governance, verification, and system operations tools.",
      modules: {
        consultations: "Consultations",
        prescriptions: "Prescriptions",
        labResults: "Lab Results",
        messages: "Messages",
        patients: "Patients",
        labRequests: "Lab Requests",
        prescriptionReview: "Prescription Review",
        medicationDispensing: "Medication Dispensing",
        dispensingLog: "Dispensing Log",
        testRequests: "Test Requests",
        uploadResults: "Upload Results",
        sentResults: "Sent Results",
        users: "Users",
        staffVerification: "Staff Verification",
        knowledgeBase: "Knowledge Base",
        auditLog: "Audit Log",
        systemStatus: "System Status",
      },
    },
    common: {
      backToHome: "Back to home",
      previewBadge: "Preview",
      uiOnlyBadge: "UI Only",
      viewPreview: "View preview",
      previewLogin: "Preview Login",
      accountType: "Account type",
    },
    lang: {
      ar: "العربية",
      ku: "کوردی",
      en: "English",
    },
    theme: {
      light: "Light Mode",
      dark: "Dark Mode",
      shortLight: "Light",
      shortDark: "Dark",
    },
    ui: {
      phaseBadge: "Secure Digital Medical Platform",
      languageSwitcherLabel: "Switch language",
      themeToggleLabel: "Toggle theme",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      primaryNavigation: "Primary navigation",
      mobileMenu: "Mobile navigation menu",
      heroFlowLabel: "Connected healthcare flow",
      openPortalNavigation: "Open portal navigation",
      closePortalNavigation: "Close portal navigation",
      portalNavigation: "Portal navigation",
      languageMenu: "Language menu",
      currentLanguage: "Current language",
    },
  },
};

export function getTranslation(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale];
}
