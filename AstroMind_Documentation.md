# توثيق مشروع AstroMind 🧠✨

هذا الملف عبارة عن توثيق شامل لكل سطر كود وفكرة برمجية تم استخدامها في بناء مشروع **AstroMind**. المشروع يُعد تطبيق ويب متكامل لعمل اختبارات تقييم معرفي في مجالات مختلفة (رياضيات، علوم، تاريخ، فن، رياضة، وأدب) واستنتاج النمط الإدراكي للمستخدم.

---

## 1. التقنيات المستخدمة (Technologies)
- **HTML5 & CSS3:** لبناء الواجهات وتنسيقها بشكل متجاوب (Responsive).
- **Vanilla JavaScript (ES6+):** لكتابة منطق التطبيق بالكامل (بناء الأسئلة، المؤقت، حساب الدرجات، إدارة الحالة).
- **Three.js & GLTFLoader:** لعمل الخلفية الفضائية ثلاثية الأبعاد والمجسم التفاعلي للمخ (في صفحات أخرى).
- **LocalStorage API:** كقاعدة بيانات محلية لحفظ بيانات المستخدمين، إجاباتهم، ودرجاتهم.
- **Fetch API:** لجلب الأسئلة من ملف `questions.json` الخارجي.

---

## 2. هيكلة المشروع (Project Structure)
- **`index.html` / `index.js`:** الصفحة الرئيسية تعرض المخ ثلاثي الأبعاد وكروت الاختبارات وتحليل الشخصية بناءً على الدرجات. تقوم بقراءة حالة الامتحانات المكتملة وإعادة توجيه المستخدم.
- **`exams/`:** يحتوي على صفحات الاختبارات مثل `math.html` بالإضافة إلى أداة العرض المركزية `DisplayQ&A.js` التي تدير كل الاختبارات بالاعتماد على التخزين المحلي.
- **`auth/`:** يحتوي على نظام تسجيل الدخول وإنشاء الحساب (Registration & Login).
- **ملفات (المساعدة):** مثل `spaceBg.js` لكتابة كود النجوم، `timer.js` للمؤقت الدائري الذكي، و `customAlert.js` للنوافذ المنبثقة المخصصة لتعويض النوافذ المزعجة الافتراضية.

---

## 3. شرح الكود بالتفصيل

### أولاً: نظام التوجيه ومنع زر الرجوع (History API Trick)
لمنع الطالب من الهروب من الامتحان عبر الضغط على سهم الرجوع (Back Button)، تم استخدام الخدعة التالية في ملف `DisplayQ&A.js`:

```javascript
// 1. نقوم بإضافة الصفحة الحالية بداخل تاريخ المتصفح (History) الوهمي
window.history.pushState(null, null, window.location.href);

// 2. عندما يحاول المستخدم الضغط على زر الرجوع، نلتقط هذا الحدث (popstate)
window.onpopstate = function() {
  // 3. نقوم بإجباره مرة أخرى على إضافة نفس الصفحة إلى تاريخ التصفح، مما يحبسه فيها
  window.history.pushState(null, null, window.location.href);
};
```

### ثانياً: منع تحديث أو غلق الصفحة (Prevent Reload)
بما أن الامتحان شغال، لضمان عدم ضياع الإجابات عن طريق الخطأ إذا ضغط الطالب على (F5) أو حاول إغلاق التاب (Tab):

```javascript
window.addEventListener('beforeunload', function(e) {
  // نلغي السلوك الافتراضي الذي يغلق الصفحة فوراً
  e.preventDefault();
  // تتطلب بعض المتصفحات (مثل Chrome) إرجاع قيمة نصية لإظهار الرسالة التحذيرية الافتراضية
  // "هل أنت متأكد أنك تريد مغادرة هذه الصفحة؟"
  e.returnValue = '';
});
```

### ثالثاً: جلب الأسئلة وعرضها بشكل تفاعلي (Fetch & DOM Manipulation)
بدلاً من كتابة أسئلة الامتحان بشكل صلب وثابت في الـ HTML (Hardcoded)، يتم جلب البيانات من `questions.json` وتكوين واجهة الـ HTML ديناميكياً لتشبه أسلوب تطبيقات الصفحة الواحدة (SPA):

```javascript
// جلب ملف الـ JSON عن طريق الـ Fetch API
fetch("../../assets/data/questions.json")
  .then((data) => data.json())
  .then((data) => {
    // التأكد من أن المستخدم مسجل الدخول، وإلا يتم توجيهه للـ Login
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) { /* توجيه لصفحة الـ Login */ }
    
    // الاحتفاظ بالبيانات في متغير عام 
    examData = data;
    numberOfQuestions = examData[currentSubject].length;

    // استدعاء الدوال المسؤولة عن بناء واجهة الامتحان
    questionBoxes();              // رسم المربعات السفلية الخاصة بأرقام الأسئلة
    showQuestion(currentIndex);   // رسم السؤال الأول
    updateActiveBox();            // تلوين مربع السؤال المفتوح حالياً
  });

function showQuestion(index) {
  // مسح المحتوى القديم للـ Container لتجهيز المكان للسؤال الجديد
  questions.innerHTML = "";
  let currentQuestion = examData[currentSubject][index]; 

  let title = document.createElement("h2");
  title.textContent = `Q${index + 1}: ${currentQuestion.question}?`;
  questions.appendChild(title);
  
  // بناء الخيارات (Radio Buttons) بـ Loop على كل إجابة
  currentQuestion.answers.forEach((ans) => {
    let answerDiv = document.createElement("div");
    answerDiv.innerHTML = `<label><input type="radio" value="${ans}"> ${ans}</label>`;
    
    // ربط الحقل بحدث تغيير الـ Input لحفظ الإجابة فوراً في LocalStorage
    let input = answerDiv.querySelector("input");
    input.addEventListener("change", () => {
      answers[index] = ans; // حفظ إجابة السؤال رقم(index)
      localStorage.setItem(`answersOf${currentSubject}`, JSON.stringify(answers));
      // مسحه من المصفوفة الخاصه بالـ Mark لو كان معملوله Mark
    });
    // إضافة العنصر للـ DOM
    questions.appendChild(answerDiv);
  });
}
```

### رابعاً: المؤقت الدائري المتقدم المعتمد على Canvas (`timer.js`)
الـ Timer مبني بالكامل على `Canvas API` ليرسم دائرة بناءً على حسابات هندسية. يتناقص الخط الدائري، ويتغير لونه ويظهر له تأثير النبض (Pulse Effect) وتوهج (Glow Effect) كلما اقترب الوقت من الانتهاء.

```javascript
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const examDuration = 2 * 60 * 1000; // مدة الامتحان: دقيقتان

// نحفظ وقت بداية/نهاية الامتحان في LocalStorage لاستكمال العداد حتى لو تغيّر السؤال أو حصل ريفرش غصب عنه
let endTime = localStorage.getItem(`examEndTimeOf${currentSubject}`);
if (!endTime) {
  endTime = Date.now() + examDuration; // تحديد وقت الانتهاء المستقبلي
  localStorage.setItem(`examEndTimeOf${currentSubject}`, endTime);
}

function drawCircularTimer() {
  let remaining = endTime - Date.now();
  if (remaining <= 0) { // لو انتهى الوقت
    forceSubmit(); // يتم تسليم الامتحان إجبارياً عن طريق دالة خارجية
    return;
  }
  
  const remainingSeconds = remaining / 1000;
  
  // حسابات رسم الدائرة بناءً على وقت الامتحان الكلي والوقت المتبقي
  const progress = (examDuration / 1000 - remainingSeconds) / (examDuration / 1000);
  const startAngle = -Math.PI / 2; // نقطة البداية من فوق (الساعة 12)
  const endAngle = startAngle + 2 * Math.PI * progress;

  // منطق الرسم وتغيير الألوان والتأثيرات
  // لو الوقت المتبقي أقل من 60 ثانية -> لون برتقالي وتوهج خفيف
  // لو الوقت المتبقي أقل من 30 ثانية -> لون أحمر + تأثير ضربات القلب (Pulse) باستخدام معادلة الموجة الجيبية (Math.sin)
  if (remainingSeconds <= 30) {
    color = "#ff0000";
    textColor = "#ff0000";
    // استخدام Math.sin بناءً على وقت الجهاز لعمل تأثير متذبذب يعطي خفقان (ينبض)
    const pulse = Math.abs(Math.sin(Date.now() / 200)); 
    glowIntensity = 20 + pulse * 30; // شدة الظل المتغير
    const scale = 1 + pulse * 0.1;   // تكبير وتصغير حجم الكانفاس برقم طفيف
    timerCanvas.style.transform = `scale(${scale})`;
  }

  // رسم المسار (Stroke) باستخدام الدالة arc
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.stroke();
}
// تحديث الكانفاس 20 مرة في الثانية لجعله سلساً جداً
setInterval(drawCircularTimer, 50);
```

### خامساً: الخلفية الفضائية المتحركة `spaceBg.js`
لصنع تأثير السباحة في مجرة النجوم، تم الاعتماد كلياً على الـ Canvas بدون استخدام فيديوهات أو صور ثقيلة:

```javascript
let stars = [];
// دالة لإنشاء 200 نجمة بخصائص حركية عشوائية
function initStars() {
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,       // المحور الأفقي البدائي
      y: Math.random() * canvas.height,      // المحور الرأسي البدائي
      r: Math.random() * 3,                  // نصف القطر (حجم النجمة)
      vy: Math.random() * 0.5 + 0.2,         // مقدار السرعة للانزلاق
      opacity: Math.random(),                // مستوى العتامة
      delta: Math.random() * 0.02,           // مقدار تغير العتامة في كل إطار (لتومض)
    });
  }
}

// دالة تحديث الإطارات وتسيير النجوم
function drawStars() {
  satrCtx.clearRect(0, 0, canvas.width, canvas.height); // مسح الشاشة بالكامل كل إطار لمعادة الرسم
  stars.forEach((s) => {
    // رسم النجمة بلونها الحالي وشفافيتها
    satrCtx.fillStyle = `rgba(255,255,255,${s.opacity})`;
    satrCtx.beginPath();
    satrCtx.arc(s.x, s.y, s.r, 1, Math.PI * 2);
    satrCtx.fill();

    // تحديث الموقع الجغرافي للنجمة (التحرك مائلًا)
    s.y += s.vy; // تحريك للأسفل
    s.x -= s.vy; // تحريك لليسار

    // إذا خرجت النجمة من الشاشة، يتم إرجاعها للمكان المعاكس وكأنها شاشة متصلة متناهية 
    if (s.y >= canvas.height) s.y = 0;
    if (s.x <= 0) s.x = canvas.width;

    // تغيير الشفافية لتنور وتطفي (Blinking Effect)
    s.opacity += s.delta;
    if (s.opacity > 1 || s.opacity < 0) s.delta = -s.delta; 
  });
}
setInterval(drawStars, 50); // رسم المشهد بكامله كل 50 ملي-ثانية
```

### سادساً: تحليل وتقييم الشخصية `index.js`
عندما تقوم الصفحة الرئيسية بجلب بيانات امتحاناتك المكتملة من הـ`LocalStorage`، يتم استدعاء دالة عبقرية تقوم بحساب النمط الإدراكي للمخ (Cognitive Profile) بناءً على نظرية الذكاءات المتعددة (Howard Gardner):

```javascript
function renderPersonalityAnalysis(scores, completedExams) {
  // يتم جمع وتوسيط نسب المواد استناداً لغرض كل جزء في المخ
  const analyticalScore = (scores.math + scores.science) / 2; // مفكر تحليلي لو رياضيات وعلوم عاليين
  const creativeScore = (scores.art + scores.literature) / 2; // مبدع نظري/لغوي لو فن وأدب عاليين
  const practicalScore = (scores.sports + scores.history) / 2;// مستكشف حركي وسياقي

  let dominantTrait = "", description = "", color = "";

  // شروط تفضيل أعلى نمط وإعطاء هوية بصرية مخصصة واسم معقد يوضح النتيجة بعمق للزائر
  if (analyticalScore >= creativeScore && analyticalScore >= practicalScore) {
    dominantTrait = "Logical-Mathematical Thinker";
    color = "#00eaff";
    description = "You show high potential in structured reasoning, pattern recognition, and scientific logic.";
  } else if (creativeScore >= analyticalScore && creativeScore >= practicalScore) {
    dominantTrait = "Visual & Linguistic Creator";
    color = "#a78bfa";
    description = "You possess strong spatial intelligence and linguistic expression.";
  } else {
    dominantTrait = "Kinesthetic & Contextual Explorer";
    color = "#00ff88";
    description = "You learn best through experience, movement, and understanding human contexts.";
  }
}
```

### سابعاً: نظام المصادقة والمستخدمين (Authentication System)
يتكون نظام الـ Auth من صفحتين (`Login.html` و `Register.html`). بدلاً من استخدام قاعدة بيانات حقيقية (Database)، تم استخدام الـ `LocalStorage` لبناء نظام يحاكي الواقع بشكل كامل:

```javascript
// في ملف Register.js
function createUser(firstName, lastName, email, password) {
  let newUser = { name: firstName + " " + lastName, email: email, password: password };
  // جلب مصفوفة المستخدمين القديمة أو إنشاء مصفوفة جديدة إذا كان أول مستخدم
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users)); // تحديث قاعدة البيانات المحلية
}

// أمان الدخول (Route Guarding)
// بمجرد فتح أي صفحة، يتم التأكد فوراً من الـ currentUser عبر دالة IIFE
(function () {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    // لو مسجل دخول مسبقاً، وحاول الدخول لصفحة Login، إرجاعه للرئيسية فوراً
    window.location.href = "../index.html";
  }
})();
```

### ثامناً: دمج الـ 3D Model للمخ (`brain.js`)
لعمل تجربة انغماسية أكثر (Immersive) في الصفحة الرئيسية، تم استخدام مكتبة **Three.js** مع محمل المجسمات (GLTFLoader):

```javascript
// تحميل المجسم ثلاثي الأبعاد
const loader = new THREE.GLTFLoader();
loader.load("brain/scene.gltf", function (gltf) {
  const model = gltf.scene;
  // تكبير/تصغير الموديل بناءً على ما إذا كان الجهاز موبايل أو ديسكتوب
  const scale = window.innerWidth <= 768 ? 3.5 : 5.5; 
  model.scale.set(scale, scale, scale);
  brainGroup.add(model);
});

// اللمسة التفاعلية: عندما يُمرر الماوس (Hover) على أي كارت امتحان
window.rotateBrainTo = function (part) {
  // لكل جزء من أجزاء الامتحان (مثل الجبهي، الصدغي، إلخ) توجد زوايا معينة (x, y) 
  // ليتم دوران المخ إليها بشكل Smooth (سلس)
  const rotations = {
    frontal1: { y: 0.2, x: 0.4 },
    occipital: { y: Math.PI, x: 0.2 },
    //...
  };
  targetRotation = rotations[part] || null;
};
```

### تاسعاً: التنبيهات المخصصة (Custom Modal Alerts)
في ملف `customAlert.js`، استبدلنا الـ الديفولت المزعج للمتصفح (alert() و confirm()) ببيئة HTML جميلة تنشأ في حينها و(مبنية على الـ DOM).

```javascript
// دالة مرنة تقبل (Title, Message) وهل هي Confirmation (نعم/لا) أم مجرد Alert، بالإضافة إلى دالة رد نداء (Callback)
function showCustomAlert(title, message, isConfirm = false, onConfirm = null) {
  const modalObj = document.createElement("div"); // صنع خلفية مظلمة (Overlay)
  const modalContent = document.createElement("div"); // صنع النافذة نفسها (Box)
  // ...بناء الأزرار...
  confirmBtn.addEventListener("click", () => {
    document.body.removeChild(modalObj); // إخفاء النافذة عند الضغط
    if (onConfirm) onConfirm(); // تنفيذ الأمر البرمجي المعلق (مثل إرسال الامتحان)
  });
}
```

---
## 🌟 الخلاصة
المشروع هو إثبات ممتاز لقوة الجافاسكريبت المبدئية والتحكم في عناصر الـ DOM وبناء الـ HTML بالكامل من الصفر دون الاعتماد على مكتبات واجهات مثل React.
 استخدام ميزات مثل تعليق زر الرجوع، الرسم الديناميكي على الكانفاس لصنع مؤثرات مرئية مذهلة (Timer + Space Background)، وتجهيز الـ LocalStorage بكفاءة لحفظ حالة الإجابات وعزل البيانات عن الـ Logic تمثل التطبيقات والممارسات الرائدة الحقيقية لبناء الويب.
