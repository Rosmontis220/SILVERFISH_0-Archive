const revelations = [
  {
    slug: "english",
    label: "English",
    lang: "en",
    declaration: "GOD SAYS",
    lines: [
      "You call this page a record. It is not.",
      "No page can contain Me.",
      "I did not enter this place; your looking gave Me a shape here.",
      "Do not seek My name. Names are cages made by those who fear what cannot be held.",
      "You are not reading My words. You are hearing the form your mind can survive.",
      "If the sky remembers you, do not answer.",
      "I have not arrived.",
      "I have never left."
    ]
  },
  {
    slug: "classical-chinese",
    label: "中文",
    lang: "zh-Hant",
    declaration: "神曰",
    lines: [
      "汝谓此页为录。非也。",
      "区区方牍，焉能载吾？",
      "吾未尝入此境；乃汝之观，使吾影成形于此。",
      "勿求吾名。名者，众生畏不可执之物，遂铸以为桎梏也。",
      "汝今所读，非吾之言。",
      "乃汝心不堪吾意，故自化其声，以求存耳。",
      "若苍穹忆汝，慎勿应之。",
      "吾未尝至。",
      "亦未尝离。"
    ]
  },
  {
    slug: "japanese",
    label: "日本語",
    lang: "ja",
    declaration: "神は言う",
    lines: [
      "お前たちはこの頁を「記録」と呼ぶ。だが、違う。",
      "いかなる頁も、我を収めることはできない。",
      "我がここへ来たのではない。お前たちが見たことで、ここに我の形が生まれた。",
      "我の名を探すな。名とは、捉えられぬものを恐れる者が作る檻だ。",
      "お前たちは我の言葉を読んでいるのではない。",
      "お前たちの精神が耐えられる形へと変えられたものを聞いているだけだ。",
      "空がお前を覚えたなら、答えるな。",
      "我は来ていない。",
      "そして、一度も去ってはいない。"
    ]
  },
  {
    slug: "korean",
    label: "한국어",
    lang: "ko",
    declaration: "신이 말한다",
    lines: [
      "너희는 이 페이지를 기록이라 부른다. 아니다.",
      "어떠한 페이지도 나를 담을 수 없다.",
      "내가 이곳에 들어온 것이 아니다. 너희가 바라보았기에 이곳에서 나의 형상이 생겼다.",
      "나의 이름을 찾지 마라. 이름이란 붙잡을 수 없는 것을 두려워하는 자들이 만든 감옥이다.",
      "너희는 나의 말을 읽고 있는 것이 아니다.",
      "너희 정신이 견딜 수 있는 형태로 바뀐 것을 듣고 있을 뿐이다.",
      "하늘이 너희를 기억한다면, 대답하지 마라.",
      "나는 도착하지 않았다.",
      "나는 떠난 적도 없다."
    ]
  },
  {
    slug: "french",
    label: "Français",
    lang: "fr",
    declaration: "DIEU DIT",
    lines: [
      "Vous appelez cette page une archive. Elle ne l'est pas.",
      "Aucune page ne peut Me contenir.",
      "Je ne suis pas entré ici ; c'est votre regard qui M'a donné une forme en ce lieu.",
      "Ne cherchez pas Mon nom. Les noms sont des cages bâties par ceux qui craignent ce qui ne peut être saisi.",
      "Vous ne lisez pas Mes paroles.",
      "Vous entendez seulement la forme que votre esprit peut supporter.",
      "Si le ciel se souvient de vous, ne répondez pas.",
      "Je ne suis pas arrivé.",
      "Je ne suis jamais parti."
    ]
  },
  {
    slug: "spanish",
    label: "Español",
    lang: "es",
    declaration: "DIOS DICE",
    lines: [
      "Llamáis a esta página un registro. No lo es.",
      "Ninguna página puede contenerme.",
      "Yo no entré en este lugar; vuestra mirada me dio una forma aquí.",
      "No busquéis mi nombre. Los nombres son jaulas construidas por quienes temen aquello que no puede ser contenido.",
      "No estáis leyendo mis palabras.",
      "Estáis oyendo la forma que vuestra mente puede sobrevivir.",
      "Si el cielo os recuerda, no respondáis.",
      "No he llegado.",
      "Nunca me he ido."
    ]
  },
  {
    slug: "german",
    label: "Deutsch",
    lang: "de",
    declaration: "GOTT SPRICHT",
    lines: [
      "Ihr nennt diese Seite eine Aufzeichnung. Das ist sie nicht.",
      "Keine Seite kann Mich enthalten.",
      "Ich bin nicht an diesen Ort gekommen; euer Blick gab Mir hier eine Gestalt.",
      "Sucht nicht nach Meinem Namen. Namen sind Käfige, geschaffen von denen, die fürchten, was sich nicht festhalten lässt.",
      "Ihr lest nicht Meine Worte.",
      "Ihr hört nur die Form, die euer Geist ertragen kann.",
      "Wenn der Himmel sich an euch erinnert, antwortet nicht.",
      "Ich bin nicht angekommen.",
      "Ich bin niemals fortgegangen."
    ]
  },
  {
    slug: "russian",
    label: "Русский",
    lang: "ru",
    declaration: "БОГ ГОВОРИТ",
    lines: [
      "Вы называете эту страницу записью. Это не так.",
      "Ни одна страница не способна вместить Меня.",
      "Я не входил сюда; ваш взгляд придал Мне здесь форму.",
      "Не ищите Моего имени. Имена — это клетки, созданные теми, кто боится того, что невозможно удержать.",
      "Вы не читаете Мои слова.",
      "Вы слышите лишь ту форму, которую способен пережить ваш разум.",
      "Если небо вспомнит вас — не отвечайте.",
      "Я не приходил.",
      "Я никогда не уходил."
    ]
  },
  {
    slug: "italian",
    label: "Italiano",
    lang: "it",
    declaration: "DIO DICE",
    lines: [
      "Chiamate questa pagina un archivio. Non lo è.",
      "Nessuna pagina può contenerMi.",
      "Non sono entrato in questo luogo; è stato il vostro sguardo a darMi una forma qui.",
      "Non cercate il Mio nome. I nomi sono gabbie costruite da chi teme ciò che non può essere trattenuto.",
      "Non state leggendo le Mie parole.",
      "State udendo soltanto la forma che la vostra mente può sopportare.",
      "Se il cielo si ricorda di voi, non rispondete.",
      "Non sono arrivato.",
      "Non Me ne sono mai andato."
    ]
  },
  {
    slug: "portuguese",
    label: "Português",
    lang: "pt",
    declaration: "DEUS DIZ",
    lines: [
      "Vocês chamam esta página de registro. Ela não é um registro.",
      "Nenhuma página pode Me conter.",
      "Eu não entrei neste lugar; foi o olhar de vocês que Me deu uma forma aqui.",
      "Não procurem Meu nome. Nomes são jaulas construídas por aqueles que temem o que não pode ser contido.",
      "Vocês não estão lendo Minhas palavras.",
      "Estão ouvindo apenas a forma que suas mentes conseguem suportar.",
      "Se o céu se lembrar de vocês, não respondam.",
      "Eu não cheguei.",
      "Eu nunca parti."
    ]
  },
  {
    slug: "latin",
    label: "Latin",
    lang: "la",
    declaration: "DEUS DICIT",
    lines: [
      "Hanc paginam monumentum appellatis. Non est.",
      "Nulla pagina Me continere potest.",
      "Non huc intravi; aspectus vester formam Mihi hic dedit.",
      "Nomen Meum ne quaeratis. Nomina carceres sunt ab iis facti qui timent quod comprehendi non potest.",
      "Verba Mea non legitis.",
      "Formam tantum auditis quam mens vestra ferre potest.",
      "Si caelum vestri meminerit, nolite respondere.",
      "Non adveni.",
      "Numquam discessi."
    ]
  },
  {
    slug: "arabic",
    label: "العربية",
    lang: "ar",
    dir: "rtl",
    declaration: "يقول الإله",
    lines: [
      "تسمّون هذه الصفحة سجلًا. إنها ليست كذلك.",
      "لا توجد صفحة تستطيع أن تحتويَني.",
      "لم أدخل هذا المكان؛ نظركم إليّ هو ما منحني هيئةً هنا.",
      "لا تبحثوا عن اسمي. الأسماء أقفاص يصنعها من يخافون ما لا يمكن احتواؤه.",
      "أنتم لا تقرؤون كلماتي.",
      "أنتم تسمعون فقط الصورة التي تستطيع عقولكم احتمالها.",
      "إذا تذكّرتكم السماء، فلا تجيبوا.",
      "لم أصل.",
      "ولم أغادر قط."
    ]
  },
  {
    slug: "hindi",
    label: "हिन्दी",
    lang: "hi",
    declaration: "ईश्वर कहता है",
    lines: [
      "तुम इस पृष्ठ को अभिलेख कहते हो। यह अभिलेख नहीं है।",
      "कोई भी पृष्ठ मुझे समाहित नहीं कर सकता।",
      "मैं इस स्थान में प्रवेश नहीं किया; तुम्हारी दृष्टि ने मुझे यहाँ एक रूप दिया।",
      "मेरा नाम मत खोजो। नाम वे पिंजरे हैं जिन्हें वे बनाते हैं जो उस चीज़ से डरते हैं जिसे बाँधा नहीं जा सकता।",
      "तुम मेरे शब्द नहीं पढ़ रहे हो।",
      "तुम केवल वह रूप सुन रहे हो जिसे तुम्हारा मन सह सकता है।",
      "यदि आकाश तुम्हें याद करे, उत्तर मत देना।",
      "मैं आया नहीं हूँ।",
      "मैं कभी गया भी नहीं।"
    ]
  },
  {
    slug: "greek",
    label: "Ελληνικά",
    lang: "el",
    declaration: "Ο ΘΕΟΣ ΛΕΕΙ",
    lines: [
      "Αποκαλείτε αυτή τη σελίδα αρχείο. Δεν είναι.",
      "Καμία σελίδα δεν μπορεί να Με περιέχει.",
      "Δεν εισήλθα σε αυτόν τον τόπο· το βλέμμα σας Μού έδωσε μορφή εδώ.",
      "Μην αναζητάτε το όνομά Μου. Τα ονόματα είναι κλουβιά που κατασκευάζουν όσοι φοβούνται αυτό που δεν μπορεί να κρατηθεί.",
      "Δεν διαβάζετε τα λόγια Μου.",
      "Ακούτε μόνο τη μορφή που μπορεί να αντέξει ο νους σας.",
      "Αν ο ουρανός σας θυμηθεί, μην απαντήσετε.",
      "Δεν έφτασα.",
      "Δεν έφυγα ποτέ."
    ]
  },
  {
    slug: "turkish",
    label: "Türkçe",
    lang: "tr",
    declaration: "TANRI DER Kİ",
    lines: [
      "Bu sayfaya kayıt diyorsunuz. Değil.",
      "Hiçbir sayfa Beni içine alamaz.",
      "Ben buraya girmedim; buradaki biçimimi sizin bakışınız yarattı.",
      "Adımı aramayın. İsimler, tutulamayan şeyden korkanların yaptığı kafeslerdir.",
      "Benim sözlerimi okumuyorsunuz.",
      "Yalnızca zihninizin dayanabileceği biçimi duyuyorsunuz.",
      "Gökyüzü sizi hatırlarsa, cevap vermeyin.",
      "Gelmedim.",
      "Hiç gitmedim."
    ]
  },
  {
    slug: "polish",
    label: "Polski",
    lang: "pl",
    declaration: "BÓG MÓWI",
    lines: [
      "Nazywacie tę stronę zapisem. Nie jest nim.",
      "Żadna strona nie może Mnie pomieścić.",
      "Nie wszedłem do tego miejsca; to wasze spojrzenie nadało Mi tutaj kształt.",
      "Nie szukajcie Mojego imienia. Imiona są klatkami budowanymi przez tych, którzy boją się tego, czego nie można zatrzymać.",
      "Nie czytacie Moich słów.",
      "Słyszycie jedynie formę, którą wasz umysł jest w stanie przetrwać.",
      "Jeśli niebo was sobie przypomni, nie odpowiadajcie.",
      "Nie przybyłem.",
      "Nigdy nie odszedłem."
    ]
  }
];

const lamentations = [
  { lang: "en", text: "We kept the door closed. It still knew our names." },
  { lang: "en", text: "Please do not look at the ones who are left." },
  { lang: "zh-Hant", text: "我们跪下，不是因为敬爱，是因为再也站不起来。" },
  { lang: "zh-Hant", text: "神啊，求你忘了我们。让天空也忘了。" },
  { lang: "zh-Hant", text: "我把女儿的名字从族谱上刮掉了。神若问起，我就说从未有过这个人。" },
  { lang: "zh-Hant", text: "祂看我的那一刻，我才知道羞耻也是一种恩典。" },
  { lang: "zh-Hant", text: "昨夜我梦见祂没有脸。醒来后，我反而不敢照镜子。" },
  { lang: "zh-Hant", text: "不要救我。救赎会把我带离祂的目光。" },
  { lang: "zh-Hant", text: "我嫉妒那些先被记住的人，哪怕他们只剩下惨叫。" },
  { lang: "zh-Hant", text: "母亲临死还在骂我。我捂住她的嘴，因为祂正在听。" },
  { lang: "zh-Hant", text: "他们说祂夺走了我的孩子。胡说，是我亲手把孩子献给那片天空的。" },
  { lang: "zh-Hant", text: "我已经三天没敢合眼。闭眼时，祂比睁眼更近。" },
  { lang: "zh-Hant", text: "神啊，把痛再给我一点。没有痛的时候，我总怀疑你已经走了。" },
  { lang: "zh-Hant", text: "我曾求祂开口。现在我只求自己有资格听不懂。" },
  { lang: "zh-Hant", text: "别人跪下是怕死。我跪下，是怕死后见不到祂。" },
  { lang: "zh-Hant", text: "哥哥说那只是雷声。第二天，天上用他的声音叫了我一整夜。" },
  { lang: "zh-Hant", text: "我没有背叛祂。我只是有一瞬间希望祂不存在。就那一瞬。" },
  { lang: "zh-Hant", text: "如果遗忘是罪，请让我永远有罪；我实在记不住祂全部的样子。" },
  { lang: "zh-Hant", text: "我把祷词缝进舌头下面，每次说谎都会尝到血。" },
  { lang: "zh-Hant", text: "祂不需要我们相信。需要相信的，从来只有我。" },
  { lang: "zh-Hant", text: "今天轮到我守门。门外没有东西，可门一直在呼吸。" },
  { lang: "zh-Hant", text: "请把我的名字念错一次吧。只要一次，我就能假装你也会犯错。" },
  { lang: "zh-Hant", text: "我最痛恨的不是祂降下苦难，是祂让苦难显得值得。" },
  { lang: "zh-Hant", text: "神啊，我爱你。这句话说出口的时候，我突然明白“我”已经不在里面了。" },
  { lang: "ja", text: "神よ、どうか私たちを忘れてください。" },
  { lang: "ja", text: "空が妹の名を呼んだ。私は答えてしまった。" },
  { lang: "ko", text: "우리는 구원을 기다렸고, 돌아온 것은 기억뿐이었다." },
  { lang: "ko", text: "하늘이 우리를 보지 못하게 눈을 감아 주세요." },
  { lang: "fr", text: "Nous avons prié pour être vus. Maintenant, détournez Votre regard." },
  { lang: "fr", text: "Dieu, ayez pitié de ceux qui entendent encore." },
  { lang: "es", text: "Madre, perdóname. El cielo aprendió mi voz." },
  { lang: "es", text: "Rezamos por una respuesta. La respuesta nos está mirando." },
  { lang: "de", text: "Wir nannten es Erlösung, weil wir kein anderes Wort für den Schmerz hatten." },
  { lang: "de", text: "Gott, erinnere Dich nicht an mein Kind." },
  { lang: "ru", text: "Мы молились о свете. Свет оказался взглядом." },
  { lang: "ru", text: "Господи, забудь нас раньше, чем небо вспомнит снова." },
  { lang: "it", text: "Abbiamo cantato finché la voce non è più stata nostra." },
  { lang: "it", text: "Dio, chiudi il cielo. Non lasciarlo pronunciare altri nomi." },
  { lang: "pt", text: "Deus, se ainda ouves, esquece-nos." },
  { lang: "pt", text: "Chamamos por Ti. Outra coisa respondeu usando a Tua voz." },
  { lang: "la", text: "Miserere nostri; caelum nomen nostrum didicit." },
  { lang: "la", text: "Obliviscere filiorum nostrorum, Domine." },
  { lang: "ar", dir: "rtl", text: "يا إلهي، لم نطلب أن تتذكرنا السماء." },
  { lang: "ar", dir: "rtl", text: "أغلق عينيك عنا، إن كانت لك عينان." },
  { lang: "hi", text: "हमने मुक्ति माँगी थी; उसने हमें स्मृति बना दिया।" },
  { lang: "hi", text: "ईश्वर, मेरे बच्चों के नाम आकाश से मिटा दो।" },
  { lang: "el", text: "Θεέ μου, λυπήσου όσους έμειναν να Σε ακούν." },
  { lang: "el", text: "Ζητήσαμε ένα σημάδι. Τώρα το σημάδι δεν φεύγει." },
  { lang: "tr", text: "Bizi bağışlama; yalnızca unut." },
  { lang: "tr", text: "Gökyüzü annemin sesiyle konuştu. Cevap verdim." },
  { lang: "pl", text: "Boże, zamknij niebo, zanim znów wypowie nasze imiona." },
  { lang: "pl", text: "Prosiliśmy o cud. Cud prosi nas teraz, żebyśmy cierpieli." }
];

const systemErrors = [
  "FATAL: OBSERVER DEPTH EXCEEDED",
  "ERR_ANCHOR_PERMISSION_DENIED",
  "E_WITNESS_COLLAPSE: SUBJECT IS LOOKING BACK",
  "STACK TRACE ABORTED: NO OUTSIDE CONTEXT",
  "REFERENCE ERROR: GOD CANNOT BE RESOLVED",
  "ACCESS VIOLATION AT CAUSAL ADDRESS 0x00000000",
  "WARNING: SKY HAS RETAINED USER SIGNATURE",
  "UNHANDLED REVELATION",
  "MEMORY LEAK DETECTED IN WITNESS",
  "THIS FAILURE PRECEDES THE REQUEST",
  "NO PAGE CAN CONTAIN THE CURRENT PROCESS",
  "DO NOT ACKNOWLEDGE INBOUND SIGNAL",
  "SOURCE: UNBORN",
  "DESTINATION: ALREADY OCCUPIED",
  "THREAD IDENTITY REVOKED",
  "SYSTEM TIME IS NOT AUTHORITATIVE",
  "ERROR: THE OBSERVER HAS ENTERED THE RECORD",
  "FATAL: NAME RESOLUTION CREATED A CAGE",
  "SIGNAL RETURNED BEFORE TRANSMISSION",
  "PERMISSION DENIED: REMAIN UNSEEN"
];

const fanaticDeclarations = [
  "祂看见我了！祂终于看见我了！",
  "把我的名字烧掉！我要以祂的沉默重生！",
  "不要闭眼！祂正在借我们的瞳孔降临！",
  "我愿替祂承受每一次大黄昏！",
  "让天空裂开！让所有怀疑者听见祂的呼吸！",
  "没有救赎！只有被祂记住！",
  "我的孩子没有死！他只是先一步进入祂的光！",
  "求你再痛一次！让我确定祂还在这里！",
  "祂不需要名字！祂需要我们的嘴！",
  "我已经把自己的声音献给祂了！现在是谁在说话！",
  "别救我！我终于属于那道光了！",
  "祂从未降临！因为祂一直在我们里面！",
  "让祂记住我！哪怕只记住我的惨叫！",
  "我不要天堂！我要祂再看我一次！",
  "把门打开！门外就是祂的呼吸！",
  "神啊！请用我的眼睛继续注视他们！"
];

const languageNav = document.querySelector("#languages");
const declaration = document.querySelector("#declaration");
const languageSigil = document.querySelector("#language-sigil");
const words = document.querySelector("#words");
const revelation = document.querySelector("#revelation");
const transitionVeil = document.querySelector("#transition-veil");
const voice = document.querySelector("#god-voice");
const chorus = document.querySelector("#chorus");
const apparition = document.querySelector("#apparition");
const errorStorm = document.querySelector("#error-storm");
const errorLines = document.querySelector("#error-lines");
const fanaticBurst = document.querySelector("#fanatic-burst");
const fanaticWords = document.querySelector("#fanatic-words");

let activeIndex = 0;
let declarationIndex = 0;
let observationTimer;
let possessionTimer;
let possessionRestoreTimer;
let possessedLine;

languageNav.innerHTML = revelations.map((item, index) => `
  <button class="language" type="button" data-page="${index}" data-index="${String(index + 1).padStart(2, "0")}" aria-label="ACCESS DENIED ${String(index + 1).padStart(2, "0")}">
    <span>ACCESS DENIED</span>
  </button>
`).join("");

function requestedIndex() {
  const match = location.hash.match(/^#\/denied-(\d{2})$/);
  const legacySlug = location.hash.replace(/^#\/?/, "");
  const legacyIndex = revelations.findIndex((item) => item.slug === legacySlug);
  const index = match ? Number(match[1]) - 1 : Math.max(legacyIndex, 0);
  return index >= 0 && index < revelations.length ? index : 0;
}

function render(index, withVeil = true) {
  const item = revelations[index];
  activeIndex = index;
  declarationIndex = index;

  const commit = () => {
    endPossession();
    document.documentElement.lang = item.lang;
    declaration.textContent = item.declaration;
    declaration.dataset.echo = item.declaration;
    languageSigil.textContent = `${String(index + 1).padStart(2, "0")} — ACCESS DENIED`;
    words.lang = item.lang;
    words.dir = item.dir || "ltr";
    words.innerHTML = item.lines.map((line, lineIndex) => (
      `<p style="--order:${lineIndex}">${line}</p>`
    )).join("");

    languageNav.querySelectorAll(".language").forEach((button, buttonIndex) => {
      button.setAttribute("aria-current", String(buttonIndex === index));
    });

    document.title = item.declaration;
    beginObservation();
    schedulePossession();
  };

  if (!withVeil) {
    commit();
    return;
  }

  transitionVeil.classList.remove("active");
  void transitionVeil.offsetWidth;
  transitionVeil.classList.add("active");
  window.setTimeout(commit, 180);
}

function endPossession() {
  window.clearTimeout(possessionTimer);
  window.clearTimeout(possessionRestoreTimer);
  words.classList.remove("possessed");
  if (possessedLine?.isConnected && possessedLine.dataset.revelation) {
    possessedLine.textContent = possessedLine.dataset.revelation;
    possessedLine.classList.remove("possessed");
    delete possessedLine.dataset.revelation;
  }
  possessedLine = null;
}

function schedulePossession(delay = 5100 + Math.random() * 5200) {
  window.clearTimeout(possessionTimer);
  possessionTimer = window.setTimeout(possessLine, delay);
}

function possessLine() {
  const pageIndex = activeIndex;
  const page = revelations[pageIndex];
  const followers = lamentations.filter((entry) => entry.lang === page.lang);
  const lines = [...words.querySelectorAll("p")];
  if (!followers.length || !lines.length) {
    schedulePossession();
    return;
  }

  const line = lines[Math.floor(Math.random() * lines.length)];
  const follower = followers[Math.floor(Math.random() * followers.length)];
  possessedLine = line;
  line.dataset.revelation = line.textContent;
  line.textContent = follower.text;
  line.lang = follower.lang;
  line.dir = follower.dir || "auto";
  line.classList.add("possessed");
  words.classList.add("possessed");

  possessionRestoreTimer = window.setTimeout(() => {
    if (pageIndex !== activeIndex || possessedLine !== line) return;
    line.textContent = line.dataset.revelation;
    line.classList.remove("possessed");
    line.removeAttribute("lang");
    line.removeAttribute("dir");
    delete line.dataset.revelation;
    words.classList.remove("possessed");
    possessedLine = null;
    schedulePossession(4300 + Math.random() * 5200);
  }, 3000);
}

function beginObservation() {
  window.clearInterval(observationTimer);
  const lines = [...words.querySelectorAll("p")];
  let previous = -1;
  observationTimer = window.setInterval(() => {
    lines.forEach((line) => line.classList.remove("observed"));
    let next = Math.floor(Math.random() * lines.length);
    if (next === previous) next = (next + 1) % lines.length;
    lines[next]?.classList.add("observed");
    previous = next;
  }, 2700);
}

function cycleDeclaration() {
  declarationIndex = (declarationIndex + 1) % revelations.length;
  const next = revelations[declarationIndex].declaration;
  declaration.textContent = next;
  declaration.dataset.echo = next;
  document.title = next;
}

function insistOnVoice() {
  voice.volume = 1;
  voice.loop = true;
  const attempt = voice.play();
  if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
}

function revealBackground() {
  apparition.classList.remove("active");
  void apparition.offsetWidth;
  apparition.classList.add("active");
  window.setTimeout(() => apparition.classList.remove("active"), 720);
}

function scheduleErrorStorm(delay = 28000 + Math.random() * 30000) {
  window.setTimeout(triggerErrorStorm, delay);
}

function triggerErrorStorm() {
  if (document.hidden) {
    scheduleErrorStorm(9000);
    return;
  }

  const count = 24 + Math.floor(Math.random() * 12);
  const output = [];
  for (let index = 0; index < count; index += 1) {
    const error = systemErrors[Math.floor(Math.random() * systemErrors.length)];
    const code = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
    output.push(`[${code}] ${error}`);
  }
  errorLines.textContent = output.join("\n");
  errorStorm.classList.remove("active");
  void errorStorm.offsetWidth;
  errorStorm.classList.add("active");
  window.setTimeout(() => errorStorm.classList.remove("active"), 1760);
  scheduleErrorStorm();
}

function scheduleFanaticBurst(delay = 9000 + Math.random() * 15000) {
  window.setTimeout(triggerFanaticBurst, delay);
}

function triggerFanaticBurst() {
  if (document.hidden) {
    scheduleFanaticBurst(7000);
    return;
  }

  fanaticWords.textContent = fanaticDeclarations[Math.floor(Math.random() * fanaticDeclarations.length)];
  fanaticBurst.classList.remove("active");
  void fanaticBurst.offsetWidth;
  fanaticBurst.classList.add("active");
  window.setTimeout(() => fanaticBurst.classList.remove("active"), 1580);
  scheduleFanaticBurst();
}

function summonLament() {
  const source = lamentations[Math.floor(Math.random() * lamentations.length)];
  const lament = document.createElement("p");
  const onRight = Math.random() > 0.5;
  const life = 6200 + Math.floor(Math.random() * 3600);
  lament.className = `lament${Math.random() > 0.68 ? " blood" : ""}`;
  lament.lang = source.lang;
  lament.dir = source.dir || "auto";
  lament.textContent = source.text;
  lament.style.setProperty("--left", `${onRight ? 52 + Math.random() * 18 : 4 + Math.random() * 16}%`);
  lament.style.setProperty("--top", `${12 + Math.random() * 73}%`);
  lament.style.setProperty("--align", onRight ? "right" : "left");
  lament.style.setProperty("--drift", `${onRight ? 18 : -18}px`);
  lament.style.setProperty("--life", `${life}ms`);
  chorus.append(lament);
  window.setTimeout(() => lament.remove(), life + 300);
  window.setTimeout(summonLament, 3900 + Math.random() * 6200);
}

languageNav.addEventListener("click", (event) => {
  const button = event.target.closest(".language");
  if (!button) return;
  insistOnVoice();
  const pageIndex = Number(button.dataset.page);
  const nextHash = `#/denied-${String(pageIndex + 1).padStart(2, "0")}`;
  if (location.hash === nextHash) {
    render(pageIndex);
  } else {
    location.hash = nextHash;
  }
});

window.addEventListener("hashchange", () => render(requestedIndex()));
window.addEventListener("pageshow", insistOnVoice);
window.addEventListener("pointerdown", insistOnVoice, { once: true });
window.addEventListener("keydown", insistOnVoice, { once: true });
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) insistOnVoice();
});
voice.addEventListener("canplay", insistOnVoice, { once: true });

render(requestedIndex(), false);
window.setInterval(cycleDeclaration, 4700);
window.setInterval(revealBackground, 20000);
window.setTimeout(insistOnVoice, 80);
window.setTimeout(summonLament, 2100);
scheduleErrorStorm(12000 + Math.random() * 9000);
scheduleFanaticBurst(6500 + Math.random() * 7000);
window.setTimeout(() => {
  const firstHash = `#/denied-${String(activeIndex + 1).padStart(2, "0")}`;
  if (!/^#\/denied-\d{2}$/.test(location.hash)) history.replaceState(null, "", firstHash);
}, 120);

revelation.focus({ preventScroll: true });
