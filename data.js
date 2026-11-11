'use strict';
window.COURSE = {
  words: [
    // id, Russian, transliteration, English, topic, note
    ['w01','привет','privet','hi / hello','Basics','Informal greeting'],
    ['w02','здравствуйте','zdravstvuyte','hello (formal)','Basics','Polite greeting'],
    ['w03','пока','poka','bye','Basics','Informal farewell'],
    ['w04','спасибо','spasibo','thank you','Basics','The unstressed о sounds like а'],
    ['w05','пожалуйста','pozhaluysta','please / you’re welcome','Basics','Useful in both situations'],
    ['w06','да','da','yes','Basics',''],
    ['w07','нет','net','no','Basics',''],
    ['w08','извините','izvinite','excuse me / sorry','Basics','Polite form'],
    ['w09','хорошо','khorosho','good / okay','Basics',''],
    ['w10','плохо','plokho','bad / badly','Basics',''],
    ['w11','я','ya','I','Pronouns',''],
    ['w12','ты','ty','you (informal)','Pronouns','One person you know'],
    ['w13','вы','vy','you (formal / plural)','Pronouns','Polite or multiple people'],
    ['w14','он','on','he','Pronouns',''],
    ['w15','она','ona','she','Pronouns',''],
    ['w16','оно','ono','it','Pronouns',''],
    ['w17','мы','my','we','Pronouns',''],
    ['w18','они','oni','they','Pronouns',''],
    ['w19','кто','kto','who','Questions',''],
    ['w20','что','chto','what','Questions','Often pronounced shto'],
    ['w21','где','gde','where','Questions',''],
    ['w22','как','kak','how','Questions',''],
    ['w23','почему','pochemu','why','Questions',''],
    ['w24','когда','kogda','when','Questions',''],
    ['w25','дом','dom','house / home','Everyday','Masculine noun'],
    ['w26','школа','shkola','school','Everyday','Feminine noun'],
    ['w27','работа','rabota','work / job','Everyday','Feminine noun'],
    ['w28','книга','kniga','book','Everyday','Feminine noun'],
    ['w29','кошка','koshka','cat','Everyday','Feminine noun'],
    ['w30','друг','drug','friend (male)','Everyday','Masculine noun'],
    ['w31','подруга','podruga','friend (female)','Everyday','Feminine noun'],
    ['w32','учительница','uchitelnitsa','teacher (female)','Everyday','Feminine occupation'],
    ['w33','девочка','devochka','girl','Everyday','Feminine noun'],
    ['w34','принцесса','printsessa','princess','Everyday','Feminine noun'],
    ['w35','вода','voda','water','Food & drink','Feminine noun'],
    ['w36','чай','chay','tea','Food & drink','Masculine noun'],
    ['w37','кофе','kofe','coffee','Food & drink','Usually masculine'],
    ['w38','хлеб','khleb','bread','Food & drink','Masculine noun'],
    ['w39','молоко','moloko','milk','Food & drink','Neuter noun'],
    ['w40','суп','sup','soup','Food & drink','Masculine noun'],
    ['w41','один','odin','one (masculine)','Numbers','Changes with noun gender'],
    ['w42','два','dva','two (masculine / neuter)','Numbers','Feminine: две'],
    ['w43','три','tri','three','Numbers',''],
    ['w44','четыре','chetyre','four','Numbers',''],
    ['w45','пять','pyat','five','Numbers',''],
    ['w46','шесть','shest','six','Numbers',''],
    ['w47','семь','sem','seven','Numbers',''],
    ['w48','восемь','vosem','eight','Numbers',''],
    ['w49','девять','devyat','nine','Numbers',''],
    ['w50','десять','desyat','ten','Numbers',''],
    ['w51','любить','lyubit','to love / like','Verbs','Infinitive'],
    ['w52','говорить','govorit','to speak','Verbs','Infinitive'],
    ['w53','читать','chitat','to read','Verbs','Infinitive'],
    ['w54','писать','pisat','to write','Verbs','Infinitive'],
    ['w55','знать','znat','to know','Verbs','Infinitive'],
    ['w56','хотеть','khotet','to want','Verbs','Infinitive'],
    ['w57','понимать','ponimat','to understand','Verbs','Infinitive'],
    ['w58','учиться','uchitsya','to study / learn','Verbs','Infinitive'],
    ['w59','сегодня','segodnya','today','Time',''],
    ['w60','завтра','zavtra','tomorrow','Time',''],
    ['w61','вчера','vchera','yesterday','Time',''],
    ['w62','сейчас','seychas','now','Time',''],
    ['w63','утро','utro','morning','Time','Neuter noun'],
    ['w64','вечер','vecher','evening','Time','Masculine noun'],
    ['w65','красивый','krasivyy','beautiful (masculine)','Adjectives','Feminine: красивая'],
    ['w66','новый','novyy','new (masculine)','Adjectives','Feminine: новая'],
    ['w67','маленький','malenkiy','small (masculine)','Adjectives','Feminine: маленькая'],
    ['w68','большой','bolshoy','big (masculine)','Adjectives','Feminine: большая'],
    ['w69','русский','russkiy','Russian (masculine)','Adjectives','Feminine: русская'],
    ['w70','интересный','interesnyy','interesting (masculine)','Adjectives','Feminine: интересная']
  ].map(([id,ru,latin,en,topic,note])=>({id,ru,latin,en,topic,note})),
  units: [
    {id:'u1',name:'First words',subtitle:'Get comfortable with the language',colour:'lilac',lessons:['l1','l2','l3']},
    {id:'u2',name:'A little about me',subtitle:'Introduce yourself and ask questions',colour:'pink',lessons:['l4','l5','l6']},
    {id:'u3',name:'Make your own sentences',subtitle:'Grow from words into ideas',colour:'mint',lessons:['l7','l8','l9']},
    {id:'u4',name:'Everyday Russian',subtitle:'Use it in the real world',colour:'peach',lessons:['l10','l11','l12']}
  ],
  lessons: [
    {id:'l1',unit:'u1',title:'Meet the alphabet',duration:25,skill:'Reading',intro:'Russian uses Cyrillic. Some letters look familiar and sound familiar, some are sneaky, and some are completely new. Learn the sound rather than memorising an English approximation.',sections:[
      {heading:'Friendly faces',body:'А а (a), М м (m), О о (o), Т т (t), К к (k) look a lot like their English counterparts. Start by sounding out мама (mama) and кот (kot).'},
      {heading:'The tricksters',body:'В в sounds like v, Н н sounds like n, Р р sounds like r, С с sounds like s, У у sounds like oo, Х х sounds like kh. Try reading нос (nose) and рука (hand).'},
      {heading:'New friends',body:'Ж ж = zh, Ч ч = ch, Ш ш = sh, Щ щ = shch, Ы ы is a distinct vowel, Ю ю = yu and Я я = ya. Ь (soft sign) and Ъ (hard sign) affect pronunciation rather than representing their own independent sounds.'}
    ],examples:[['мама','mum / mama'],['кот','cat'],['нос','nose'],['рука','hand']],task:'Write the alphabet letters you keep confusing, then read five Russian words aloud.',tip:'There are 33 letters. You do not need to master them all in a day.'},
    {id:'l2',unit:'u1',title:'Hello, goodbye!',duration:20,skill:'Speaking',intro:'Start with the words you can use right away. Russian has informal and polite greetings.',sections:[
      {heading:'Say hello',body:'Привет! is a casual hello. Здравствуйте! is polite or formal. You can use either depending on whom you are greeting.'},
      {heading:'Be lovely and polite',body:'Спасибо means thank you; пожалуйста means please or you’re welcome; пока is a casual goodbye.'}
    ],examples:[['Привет!','Hi!'],['Как дела?','How are things?'],['Хорошо, спасибо!','Good, thanks!'],['Пока!','Bye!']],task:'Say a four-line greeting aloud without looking at the English.',tip:'Как дела? is a handy informal check-in. No need to translate each word literally.'},
    {id:'l3',unit:'u1',title:'I, you, she, we',duration:20,skill:'Grammar',intro:'Personal pronouns unlock a surprising number of sentences.',sections:[
      {heading:'Meet the pronouns',body:'Я = I, ты = you (informal), вы = you (polite or plural), он = he, она = she, оно = it, мы = we, они = they.'},
      {heading:'A special shortcut',body:'In the present tense, Russian normally leaves out the word “am / is / are” when you say what somebody is. Я учительница means “I am a teacher” — no extra word needed.'}
    ],examples:[['Я учительница.','I am a teacher. (female)'],['Она студентка.','She is a student.'],['Мы друзья.','We are friends.'],['Я Иззи.','I am Izzy.']],task:'Write three “I am …” sentences using я. Say them aloud.',tip:'Russian uses forms that may vary by gender for some nouns, adjectives and past-tense verbs.'},
    {id:'l4',unit:'u2',title:'My name is…',duration:20,skill:'Speaking',intro:'Learn the most natural way to tell someone your name and ask theirs.',sections:[
      {heading:'Introduce yourself',body:'Меня зовут Иззи literally uses a different construction than English “I am called Izzy.” Treat меня зовут as a useful ready-made chunk.'},
      {heading:'Ask a question',body:'Как тебя зовут? is the informal version of “What is your name?” Как вас зовут? is polite.'}
    ],examples:[['Меня зовут Иззи.','My name is Izzy.'],['Как тебя зовут?','What’s your name? (informal)'],['Очень приятно!','Nice to meet you!'],['Я из Англии.','I’m from England.']],task:'Write a tiny introduction: your name, where you’re from, and one thing you are.',tip:'Use capital letters for names; the pronunciation of Иззи is close to “Izzy”.'},
    {id:'l5',unit:'u2',title:'People and things',duration:25,skill:'Vocabulary',intro:'Nouns have grammatical gender. The ending is often a useful clue.',sections:[
      {heading:'Three genders',body:'Many masculine nouns end in a consonant (дом), feminine nouns in -а or -я (книга), and neuter nouns in -о or -е (окно). These are patterns, not exception-free rules.'},
      {heading:'A few familiar faces',body:'друг = male friend, подруга = female friend, учительница = female teacher, школа = school.'}
    ],examples:[['Это мой дом.','This is my house.'],['Это моя книга.','This is my book.'],['Это моё окно.','This is my window.'],['Это моя подруга.','This is my female friend.']],task:'Pick ten nouns from the Words page and sort them by gender.',tip:'Words ending in -ь may be masculine or feminine; learn their gender alongside the word.'},
    {id:'l6',unit:'u2',title:'Ask the right question',duration:20,skill:'Grammar',intro:'A few question words can help you understand the shape of almost any conversation.',sections:[
      {heading:'The essentials',body:'кто = who, что = what, где = where, как = how, когда = when, почему = why.'},
      {heading:'Intonation helps',body:'Yes/no questions can use the same word order as statements. Your voice often signals the question.'}
    ],examples:[['Кто это?','Who is this?'],['Что это?','What is this?'],['Где школа?','Where is the school?'],['Как дела?','How are you?']],task:'Ask three different questions in Russian. Answer one of them.',tip:'Что is often pronounced closer to “shto” than “chto”.'},
    {id:'l7',unit:'u3',title:'Verbs in the present',duration:30,skill:'Grammar',intro:'Russian verbs change endings based on who does the action. Begin with a single useful pattern.',sections:[
      {heading:'Start with читать',body:'The infinitive читать means “to read.” In the present tense: я читаю (I read), ты читаешь (you read), он/она читает (he/she reads), мы читаем (we read), вы читаете (you read), они читают (they read).'},
      {heading:'One little sentence',body:'Я читаю книгу means “I am reading a book.” Notice that книга becomes книгу because it is the object. Cases are a later lesson; for now, learn this as a phrase.'}
    ],examples:[['Я читаю.','I read / I am reading.'],['Ты читаешь?','Do you read?'],['Она читает.','She reads.'],['Мы читаем.','We read.']],task:'Say the six читать forms aloud, then make two sentences.',tip:'Not all verbs follow this exact pattern. Learn verbs as families.'},
    {id:'l8',unit:'u3',title:'Describing the world',duration:25,skill:'Grammar',intro:'Adjectives generally match their nouns in gender, number and case.',sections:[
      {heading:'Spot the endings',body:'With a common adjective like новый (new): новый дом (masculine), новая книга (feminine), новое окно (neuter), новые книги (plural).'},
      {heading:'Put it together',body:'In a simple nominative phrase, an adjective normally comes before the noun.'}
    ],examples:[['новый дом','a new house'],['новая книга','a new book'],['новое окно','a new window'],['красивые кошки','beautiful cats']],task:'Describe a book, a house and a window using a different adjective each time.',tip:'Agreement gets more involved with cases; these examples are the simplest forms.'},
    {id:'l9',unit:'u3',title:'Likes and wants',duration:25,skill:'Speaking',intro:'Tell the world what you like — or what you want to do.',sections:[
      {heading:'I like…',body:'Я люблю can mean “I love” or “I like”, depending on context. Я люблю музыку = I like music. Я люблю читать = I like reading.'},
      {heading:'I want…',body:'Я хочу = I want. Add a verb infinitive after it: Я хочу учиться = I want to study.'}
    ],examples:[['Я люблю музыку.','I like music.'],['Я люблю читать.','I like reading.'],['Я хочу чай.','I want tea.'],['Я хочу говорить по-русски.','I want to speak Russian.']],task:'Write five sentences about things you like or want to learn.',tip:'Я хочу is the first-person present-tense form of хотеть.'},
    {id:'l10',unit:'u4',title:'At the café',duration:25,skill:'Speaking',intro:'You can survive a very small café interaction with just a few useful phrases.',sections:[
      {heading:'Ask politely',body:'Можно…? is useful for asking “May I have…?” You can say Можно чай, пожалуйста? The case and phrasing may change in fuller requests, but this simple version is understood.'},
      {heading:'Ready to pay',body:'Счёт, пожалуйста. = The bill, please. Спасибо большое! = Thank you very much!'}
    ],examples:[['Можно чай, пожалуйста?','May I have tea, please?'],['Один кофе, пожалуйста.','One coffee, please.'],['Счёт, пожалуйста.','The bill, please.'],['Спасибо большое!','Thank you very much!']],task:'Roleplay ordering one drink, thanking someone and asking for the bill.',tip:'Coffee is usually grammatically masculine in standard Russian.'},
    {id:'l11',unit:'u4',title:'Time and plans',duration:20,skill:'Vocabulary',intro:'Connect the present to the days around it.',sections:[
      {heading:'Key time words',body:'сегодня = today; завтра = tomorrow; вчера = yesterday; сейчас = now; утром = in the morning; вечером = in the evening.'},
      {heading:'Simple plans',body:'Я читаю сегодня = I am reading today. Завтра я работаю = Tomorrow I am working. Russian often uses the present tense to talk about scheduled near-future activities.'}
    ],examples:[['Сегодня я учусь.','Today I am studying.'],['Завтра я работаю.','Tomorrow I’m working.'],['Сейчас я читаю.','Right now I’m reading.'],['До завтра!','See you tomorrow!']],task:'Write two sentences about today and one about tomorrow.',tip:'Утром and вечером are forms used for “in the morning / evening”.'},
    {id:'l12',unit:'u4',title:'Your first conversation',duration:30,skill:'Speaking',intro:'You already know enough to have a tiny, genuine exchange. Put the pieces together.',sections:[
      {heading:'The dialogue',body:'A: Привет! Как тебя зовут? B: Привет! Меня зовут Иззи. А тебя? A: Меня зовут Маша. Очень приятно! B: Мне тоже!'},
      {heading:'Make it yours',body:'Add how you are, what you do, or what you like. The goal is confidence and retrieval, not perfect grammar.'}
    ],examples:[['Как тебя зовут?','What’s your name?'],['Меня зовут Иззи.','My name is Izzy.'],['Я учительница.','I’m a teacher.'],['Я люблю музыку.','I love music.']],task:'Write an eight-line conversation, read both parts aloud, then mark this lesson complete.',tip:'Speaking slowly with words you know is much better than waiting for perfection.'}
  ],
  grammar: [
    {id:'g1',title:'The alphabet',tag:'Start here',summary:'33 Cyrillic letters. Some familiar, some very deceptive.',rule:'Remember the “false friends”: В = v, Н = n, Р = r, С = s, У = u, Х = kh.',examples:[['кот','cat'],['нос','nose'],['мама','mum']]},
    {id:'g2',title:'No present-tense “am”',tag:'Sentences',summary:'A handy shortcut when saying what somebody is.',rule:'In the present tense, Russian usually omits the verb “to be” in noun/adjective statements: Я учительница = I am a teacher.',examples:[['Я студентка.','I am a student (female).'],['Она дома.','She is at home.']]},
    {id:'g3',title:'Noun gender',tag:'Nouns',summary:'Masculine, feminine and neuter.',rule:'Often: consonant → masculine; -а/-я → feminine; -о/-е → neuter. Words in -ь need to be learned individually.',examples:[['дом','house (m.)'],['книга','book (f.)'],['окно','window (n.)']]},
    {id:'g4',title:'Personal pronouns',tag:'Sentences',summary:'I, you, she, he, we and they.',rule:'я, ты, он, она, оно, мы, вы, они. Ты is familiar; вы is polite or plural.',examples:[['Я учусь.','I study.'],['Мы читаем.','We read.']]},
    {id:'g5',title:'Adjective agreement',tag:'Nouns',summary:'Adjectives change to match the word they describe.',rule:'A typical nominative pattern is новый / новая / новое / новые for masculine / feminine / neuter / plural.',examples:[['новый дом','new house'],['новая книга','new book'],['новое окно','new window']]},
    {id:'g6',title:'Present-tense verbs',tag:'Verbs',summary:'Who does the action affects the ending.',rule:'Example читать: читаю, читаешь, читает, читаем, читаете, читают. Other verbs can use different patterns.',examples:[['Я читаю.','I read.'],['Она читает.','She reads.']]},
    {id:'g7',title:'Question words',tag:'Sentences',summary:'Make a question with one little word.',rule:'кто = who; что = what; где = where; как = how; когда = when; почему = why.',examples:[['Где школа?','Where is the school?'],['Что это?','What is this?']]},
    {id:'g8',title:'Cases: first look',tag:'Next step',summary:'Why Russian words change their endings.',rule:'Russian has six grammatical cases. For example, книга is “a book” as a subject, but Я читаю книгу uses книгу as a direct object. Learn common phrases before trying to memorise every ending.',examples:[['Это книга.','This is a book.'],['Я читаю книгу.','I am reading a book.']]} 
  ],
  prompts: [
    'Introduce yourself in Russian. Try “Меня зовут…”',
    'Write three things you like. Start with “Я люблю…”',
    'How is your day going? Use any Russian you know.',
    'Describe your room or an object near you.',
    'Write a two-person greeting dialogue.',
    'What do you want to learn? Try “Я хочу…”',
    'Write about what you are doing today.'
  ]
};
