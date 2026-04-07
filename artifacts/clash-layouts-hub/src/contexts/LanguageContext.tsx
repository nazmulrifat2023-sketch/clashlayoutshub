import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "bn" | "hi";

const translations = {
  en: {
    siteTitle: "ClashLayoutsHub",
    tagline: "Find the Best Clash of Clans Base Layouts",
    searchPlaceholder: "Search bases by TH level or type...",
    browseByTH: "Browse by Town Hall",
    trending: "Trending This Week",
    latestBases: "Latest Bases",
    viewAll: "View All",
    copyLayout: "Copy Layout",
    saveFavorite: "Save to Favorites",
    reportIssue: "Report Issue",
    baseOfDay: "Base of the Day",
    health: "Health",
    winRate: "Win Rate",
    copies: "copies",
    views: "views",
    copiedToday: "players copied this today",
    submit: "Submit",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    submitBase: "Submit a Base",
    admin: "Admin",
    login: "Login",
    home: "Home",
    filters: "Filters",
    sortBy: "Sort By",
    latest: "Latest",
    mostViewed: "Most Viewed",
    topRated: "Top Rated",
    mostCopied: "Most Copied",
    difficulty: "Difficulty",
    type: "Type",
    loadMore: "Load More",
    noBasesFound: "No bases found",
    reportModal: {
      title: "Report an Issue",
      reason: "Reason",
      broken_link: "Broken Link",
      outdated: "Outdated",
      wrong_th: "Wrong TH Level",
      spam: "Spam",
      other: "Other",
      submit: "Submit Report",
      cancel: "Cancel",
    },
    stats: {
      bases: "Bases",
      playersHelped: "Players Helped",
      updatedDaily: "Updated Daily",
    },
    keyFeatures: "Key Features",
    bestAgainst: "Best Against",
    similarBases: "Similar Bases",
    comments: "Comments",
    leaveComment: "Leave a Comment",
    yourName: "Your Name",
    yourComment: "Your Comment",
    rating: "Rating",
    submitComment: "Submit Comment",
    discord: "Join Discord",
    recentlyViewed: "Recently Viewed",
  },
  bn: {
    siteTitle: "ClashLayoutsHub",
    tagline: "সেরা ক্ল্যাশ অফ ক্ল্যান্স বেস লেআউট খুঁজুন",
    searchPlaceholder: "TH লেভেল বা টাইপ দিয়ে খুঁজুন...",
    browseByTH: "টাউন হল অনুযায়ী দেখুন",
    trending: "এই সপ্তাহে ট্রেন্ডিং",
    latestBases: "সর্বশেষ বেস",
    viewAll: "সব দেখুন",
    copyLayout: "লেআউট কপি করুন",
    saveFavorite: "প্রিয়তে সংরক্ষণ",
    reportIssue: "সমস্যা রিপোর্ট করুন",
    baseOfDay: "দিনের সেরা বেস",
    health: "স্বাস্থ্য",
    winRate: "জয়ের হার",
    copies: "কপি",
    views: "ভিউ",
    copiedToday: "জন আজ এটি কপি করেছেন",
    submit: "জমা দিন",
    blog: "ব্লগ",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    submitBase: "বেস জমা দিন",
    admin: "অ্যাডমিন",
    login: "লগইন",
    home: "হোম",
    filters: "ফিল্টার",
    sortBy: "সাজানো",
    latest: "সর্বশেষ",
    mostViewed: "সর্বাধিক দেখা",
    topRated: "সর্বোচ্চ রেটেড",
    mostCopied: "সর্বাধিক কপি",
    difficulty: "কঠিনতা",
    type: "ধরন",
    loadMore: "আরো লোড করুন",
    noBasesFound: "কোনো বেস পাওয়া যায়নি",
    reportModal: {
      title: "সমস্যা রিপোর্ট করুন",
      reason: "কারণ",
      broken_link: "ভাঙা লিঙ্ক",
      outdated: "পুরানো",
      wrong_th: "ভুল TH লেভেল",
      spam: "স্প্যাম",
      other: "অন্যান্য",
      submit: "রিপোর্ট জমা দিন",
      cancel: "বাতিল",
    },
    stats: {
      bases: "বেস",
      playersHelped: "খেলোয়াড়দের সাহায্য করা হয়েছে",
      updatedDaily: "প্রতিদিন আপডেট হয়",
    },
    keyFeatures: "মূল বৈশিষ্ট্য",
    bestAgainst: "কার বিরুদ্ধে সেরা",
    similarBases: "একই রকম বেস",
    comments: "মন্তব্য",
    leaveComment: "মন্তব্য করুন",
    yourName: "আপনার নাম",
    yourComment: "আপনার মন্তব্য",
    rating: "রেটিং",
    submitComment: "মন্তব্য জমা দিন",
    discord: "ডিসকর্ডে যোগ দিন",
    recentlyViewed: "সম্প্রতি দেখা",
  },
  hi: {
    siteTitle: "ClashLayoutsHub",
    tagline: "सबसे अच्छे Clash of Clans बेस लेआउट खोजें",
    searchPlaceholder: "TH स्तर या प्रकार से खोजें...",
    browseByTH: "टाउन हॉल के अनुसार ब्राउज़ करें",
    trending: "इस सप्ताह ट्रेंडिंग",
    latestBases: "नवीनतम बेस",
    viewAll: "सभी देखें",
    copyLayout: "लेआउट कॉपी करें",
    saveFavorite: "पसंदीदा में सेव करें",
    reportIssue: "समस्या रिपोर्ट करें",
    baseOfDay: "आज का बेस",
    health: "स्वास्थ्य",
    winRate: "जीत दर",
    copies: "कॉपी",
    views: "व्यूज़",
    copiedToday: "खिलाड़ियों ने आज कॉपी किया",
    submit: "सबमिट",
    blog: "ब्लॉग",
    about: "हमारे बारे में",
    contact: "संपर्क",
    submitBase: "बेस सबमिट करें",
    admin: "एडमिन",
    login: "लॉगिन",
    home: "होम",
    filters: "फ़िल्टर",
    sortBy: "क्रमबद्ध करें",
    latest: "नवीनतम",
    mostViewed: "सर्वाधिक देखा",
    topRated: "शीर्ष रेटेड",
    mostCopied: "सर्वाधिक कॉपी",
    difficulty: "कठिनाई",
    type: "प्रकार",
    loadMore: "और लोड करें",
    noBasesFound: "कोई बेस नहीं मिला",
    reportModal: {
      title: "समस्या रिपोर्ट करें",
      reason: "कारण",
      broken_link: "टूटा हुआ लिंक",
      outdated: "पुराना",
      wrong_th: "गलत TH स्तर",
      spam: "स्पैम",
      other: "अन्य",
      submit: "रिपोर्ट सबमिट करें",
      cancel: "रद्द करें",
    },
    stats: {
      bases: "बेस",
      playersHelped: "खिलाड़ियों की मदद की",
      updatedDaily: "प्रतिदिन अपडेट",
    },
    keyFeatures: "मुख्य विशेषताएं",
    bestAgainst: "किसके विरुद्ध सर्वश्रेष्ठ",
    similarBases: "समान बेस",
    comments: "टिप्पणियाँ",
    leaveComment: "टिप्पणी छोड़ें",
    yourName: "आपका नाम",
    yourComment: "आपकी टिप्पणी",
    rating: "रेटिंग",
    submitComment: "टिप्पणी सबमिट करें",
    discord: "Discord पर जुड़ें",
    recentlyViewed: "हाल ही में देखा",
  },
};

type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("clh_lang") as Language) || "en";
  });

  function handleSetLanguage(lang: Language) {
    setLanguage(lang);
    localStorage.setItem("clh_lang", lang);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
