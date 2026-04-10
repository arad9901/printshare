# 🖨️ PrintShare — מדריך העלאה לאפליקציה (ללא ניסיון בקוד)

---

## שלב 1 — התקנת Node.js (פעם אחת בלבד)

1. פתח דפדפן ועבור לכתובת: **https://nodejs.org**
2. לחץ על הכפתור הירוק הגדול "**LTS Download**"
3. פתח את הקובץ שהוריד ועקוב אחר ההוראות (Next → Next → Install)
4. בסוף הפעלה מחדש של המחשב אם מתבקש

---

## שלב 2 — הפעלת האפליקציה לראשונה (בדיקה מקומית)

1. פתח את תיקיית `printshare` שקיבלת
2. בשורת הכתובת של הסייר (Windows Explorer), הקלד `cmd` ולחץ Enter
3. בחלון השחור שנפתח, הקלד:

```
npm install
```
לחץ Enter וחכה כ-2 דקות עד שמסתיים.

4. לאחר מכן הקלד:
```
npm run dev
```

5. פתח דפדפן ועבור לכתובת: **http://localhost:5173**
   — האפליקציה שלך אמורה לרוץ! 🎉

---

## שלב 3 — העלאה לאינטרנט בחינם (Vercel)

### 3א — יצירת חשבון GitHub (לשמירת הקוד)

1. עבור ל **https://github.com** → "Sign up"
2. צור חשבון עם האימייל שלך (חינם)

### 3ב — יצירת repository (תיקיית פרויקט ברשת)

1. לחץ על **"New repository"** בGitHub
2. שם: `printshare`
3. בחר **Public** → **Create repository**

### 3ג — העלאת הקוד ל-GitHub

בחלון השחור (cmd), הקלד שורה שורה:

```
git init
git add .
git commit -m "PrintShare initial version"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/printshare.git
git push -u origin main
```

_(החלף `YOUR_USERNAME` בשם המשתמש שלך ב-GitHub)_

### 3ד — חיבור Vercel לGitHub

1. עבור ל **https://vercel.com** → "Sign Up with GitHub"
2. לחץ **"New Project"** → בחר את ה-repository `printshare`
3. לחץ **"Deploy"** — Vercel יבנה ויעלה אוטומטית
4. אחרי ~2 דקות תקבל כתובת כמו: `https://printshare-xyz.vercel.app`

✅ **האפליקציה עכשיו חיה באינטרנט!**
כל מי שייכנס לכתובת הזו יוכל להשתמש בה כ-PWA (אפליקציה ניידת).

---

## שלב 4 — יצירת APK לאנדרואיד (Google Play)

### 4א — בניית הקובץ

בחלון השחור בתיקיית `printshare`:

```
npm run build
```

זה ייצור תיקייה `dist/` עם כל קבצי האפליקציה.

### 4ב — PWA Builder (ממיר לאפליקציית חנות)

1. עבור ל **https://www.pwabuilder.com**
2. הכנס את הכתובת שקיבלת מ-Vercel (שלב 3ד), לחץ **Start**
3. הכלי יבדוק שהאפליקציה עומדת בדרישות (צריך ציון ≥ 90)
4. לחץ על **"Package for Stores"**
5. בחר **"Android"** → לחץ **"Generate"**
6. הורד את הקובץ `printshare.apk` או `printshare.aab`

---

## שלב 5 — פרסום ב-Google Play Store

### 5א — תשלום חד-פעמי

- Google גובה **$25 (≈₪92)** דמי רישום חד-פעמיים
- עבור ל **https://play.google.com/console** → "Get started"

### 5ב — יצירת האפליקציה בConsole

1. לחץ **"Create app"**
2. שם: `PrintShare`
3. שפה: עברית, קטגוריה: **Productivity** או **Shopping**
4. מלא פרטים (תיאור, צילומי מסך — בתיקיית `public/` יש לך screenshot-wide.png ו-screenshot-narrow.png)

### 5ג — העלאת קובץ האפליקציה

1. תחת **"Release"** → **"Production"** → **"Create new release"**
2. העלה את הקובץ `.aab` שהורדת מPWABuilder
3. לחץ **"Review release"** → **"Start rollout"**

### 5ד — המתנה לאישור

Google בודקת אפליקציות חדשות **3–7 ימי עסקים**.
תקבל אימייל כשהאפליקציה מאושרת ← מופיעה ב-Play Store!

---

## שלב 6 — Apple App Store (אופציונלי, עולה יותר)

Apple דורשת:
- **מק (מחשב macOS)** — חובה לבניית iOS
- **Apple Developer Program** — **$99/שנה**
- Xcode (תוכנה חינמית)

אם תרצה בעתיד — PWABuilder תומך גם ב-iOS (הורד את חבילת ה-Xcode מהאתר).

---

## 📋 סיכום מהיר

| שלב | פעולה | עלות | זמן |
|-----|--------|------|-----|
| Node.js | הורד והתקן | חינם | 5 דק' |
| GitHub | צור חשבון + העלה קוד | חינם | 10 דק' |
| Vercel | אירוח אינטרנט | חינם | 5 דק' |
| PWABuilder | המר לAPK | חינם | 5 דק' |
| Google Play | פרסום | $25 חד-פעמי | 7 דק' + 3-7 ימי בדיקה |

**סה"כ עלות: $25 בלבד ← האפליקציה שלך ב-Google Play!**

---

## 🆘 תקלות נפוצות

**"npm לא מזוהה"** → Node.js לא הותקן כהלכה, התקן שוב מ-nodejs.org

**הציון ב-PWABuilder נמוך מ-90** → ודא שה-Vercel URL עובד ומאובטח (https)

**"פג התוקף" בgit push** → GitHub ביקש token — צור ב: Settings → Developer Settings → Personal Access Token

---

**צריך עזרה? אני כאן! 🤝**
