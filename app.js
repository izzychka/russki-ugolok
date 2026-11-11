'use strict';
(() => {
  const C = window.COURSE;
  const STORE = 'russki_corner_v1';
  const $ = (s) => document.querySelector(s);
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const addDays = (date, amount) => { const d=new Date(`${date}T12:00:00`); d.setDate(d.getDate()+amount); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const formatDate = (key, opts={day:'numeric',month:'short'}) => new Date(`${key}T12:00:00`).toLocaleDateString('en-GB',opts);
  const sample = a => a[Math.floor(Math.random()*a.length)];
  const shuffled = a => [...a].sort(()=>Math.random()-.5);
  const defaultState = () => ({version:1,name:'Иззи',dailyGoal:30,completed:[],cards:{},favorites:[],days:{},journal:{},quizAnswered:0,quizCorrect:0});
  function load() {
    try { const old=JSON.parse(localStorage.getItem(STORE)||'null'); return validate(old) ? {...defaultState(),...old} : defaultState(); }
    catch {return defaultState();}
  }
  function validate(v) { return !!v && typeof v==='object' && Array.isArray(v.completed) && Array.isArray(v.favorites) && v.days && typeof v.days==='object' && v.cards && typeof v.cards==='object' && v.journal && typeof v.journal==='object'; }
  let state = load();
  function save() { try {localStorage.setItem(STORE,JSON.stringify(state));} catch {toast('Storage is full or blocked. Export your data to keep a copy.');} }
  let ui = {page:'dashboard',lesson:null,wordTopic:'All',wordSearch:'',practice:'cards',queue:[],flipped:false,quiz:null,typing:null,openGrammar:null,cloudMessage:'Connect Supabase in Settings to sync your progress between devices.',cloudUser:null,cloudLoading:false};
  const timer = {running:false,elapsed:0,started:0};
  function timeElapsed() {return timer.elapsed + (timer.running ? Date.now()-timer.started : 0);}
  function clockFormat(ms) {let s=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
  const I = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    cards:'<rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 21h11a3 3 0 0 0 3-3V7"/><path d="M7 8h6M7 12h4"/>',
    spark:'<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z"/><path d="m19 18 .7 1.3L21 20l-1.3.7L19 22l-.7-1.3L17 20l1.3-.7z"/>',
    grammar:'<path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M4 17a2 2 0 0 1 2-2h12M8 7h6M8 11h6"/>',
    pen:'<path d="m16 4 4 4-12 12-5 1 1-5L16 4zM14 6l4 4"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l-2 2a1.8 1.8 0 0 0-2-.4l-1.2.5a1.8 1.8 0 0 0-1 1.6h-3.2a1.8 1.8 0 0 0-1-1.6L8.2 18.6a1.8 1.8 0 0 0-2 .4l-2-2a1.8 1.8 0 0 0 .4-2L4 13.8a1.8 1.8 0 0 0-1.6-1v-1.6a1.8 1.8 0 0 0 1.6-1L4.6 9a1.8 1.8 0 0 0-.4-2l2-2a1.8 1.8 0 0 0 2 .4L9.4 5a1.8 1.8 0 0 0 1-1.6h3.2a1.8 1.8 0 0 0 1 1.6l1.2.5a1.8 1.8 0 0 0 2-.4l2 2a1.8 1.8 0 0 0-.4 2l.5 1.2a1.8 1.8 0 0 0 1.6 1v1.6a1.8 1.8 0 0 0-1.6 1z"/>',
    fire:'<path d="M12 22c4.5 0 7-3 7-7 0-2.5-1.6-4.6-3.2-6.3.1 2-1.3 2.6-1.3 2.6C14.7 8 12.2 5.2 9.4 2 9.3 6.4 7.5 8.3 6 10.4 5 12 5 13.3 5 15c0 4 2.6 7 7 7z"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    volume:'<path d="M11 5 6 9H3v6h3l5 4zM15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12"/>',
    arrow:'<path d="m9 18 6-6-6-6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3"/>',
    upload:'<path d="M12 17V5m-4 4 4-4 4 4M4 17v3h16v-3"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    play:'<path d="m8 5 11 7-11 7z"/>',
    pause:'<path d="M8 5v14M16 5v14"/>',
    rotate:'<path d="M3 12a9 9 0 1 1 2.6 6.4M3 18v-6h6"/>',
    star:'<path d="m12 2 3.1 6.3 7 .9-5 5 1.2 7-6.3-3.4-6.3 3.4 1.2-7-5-5 7-.9z"/>',
    leaf:'<path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16zM5 20l10-10"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    cloud:'<path d="M7 18a5 5 0 0 1-1-9.9A7 7 0 0 1 19 11a3.5 3.5 0 0 1-.5 7H7z"/>',
    bookopen:'<path d="M12 7a9 9 0 0 0-9-2v14a9 9 0 0 1 9 2 9 9 0 0 1 9-2V5a9 9 0 0 0-9 2zM12 7v14"/>'
  };
  const icon = (k) => `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[k]||I.star}</svg>`;
  function toast(message) { const div=document.createElement('div');div.className='notification';div.textContent=message;$('#toast-region').append(div);setTimeout(()=>div.remove(),3600); }
  function nav(page, label, symbol) {return `<button class="nav-btn ${ui.page===page?'active':''}" data-go="${page}" aria-label="${label}" title="${label}">${icon(symbol)}<span>${label}</span></button>`;}
  function layout(body) {
    const labels={dashboard:'Dashboard',path:'My learning path',lesson:'Your lesson',words:'Word bank',practice:'Study practice',grammar:'Grammar notes',journal:'Language journal',settings:'Settings'};
    const mins=state.days[today()]||0;
    return `<div class="shell"><aside class="sidebar"><div class="brand" data-go="dashboard" role="button" tabindex="0" aria-label="Home"><div class="brand-symbol">я</div><div><strong>русский уголок</strong><small>my little study corner</small></div></div>
      <div class="nav-heading">YOUR SPACE</div><nav class="nav-list" aria-label="Main navigation">
      ${nav('dashboard','Dashboard','home')}${nav('path','Learning path','bookopen')}${nav('words','Word bank','cards')}${nav('practice','Practice','spark')}${nav('grammar','Grammar notes','grammar')}${nav('journal','My journal','pen')}${nav('settings','Settings','settings')}
      </nav><div class="sidebar-bottom"><div class="sidebar-note"><div class="doodle">✿</div><strong>маленькие шаги</strong><p>Little steps add up. No rush, no perfect days needed.</p></div><div class="profile"><div class="avatar">${escape(state.name.trim().charAt(0)||'И')}</div><div><strong>${escape(state.name)}</strong><small>Russian learner ♡</small></div></div></div></aside>
      <div class="page"><header class="topbar"><div class="crumb">my russian corner <span style="color:#c1b7ca">/</span> <b>${labels[ui.page]}</b></div><div class="topbar-right"><span class="date-label">${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</span><div class="pill">${icon('target')} ${mins} / ${state.dailyGoal} min</div></div></header><main class="content">${body}</main><footer class="footer">made with ♡ · маленькие шаги каждый день</footer></div></div>`;
  }
  const studiedCards = () => Object.values(state.cards).filter(c=>c && c.reviewed>0).length;
  const due = () => C.words.filter(w => !state.cards[w.id] || state.cards[w.id].due <= today());
  function streak() {let k=(state.days[today()]||0)>0?today():addDays(today(),-1);let n=0;while((state.days[k]||0)>0 && n<10000){n++;k=addDays(k,-1);}return n;}
  function weekMinutes() {return Array.from({length:7},(_,i)=>state.days[addDays(today(),-i)]||0).reduce((a,b)=>a+b,0);}
  const nextLesson = () => C.lessons.find(l=>!state.completed.includes(l.id))||C.lessons[0];
  function studyPlan() {
    const d=state.dailyGoal;
    return d===30 ? [
      ['Review 10 flashcards',10,'cards','practice','Remember before you flip'],['Continue a lesson',15,'bookopen','lesson','Build one new skill'],['Write a little Russian',5,'pen','journal','Even one sentence counts']
    ] : d===45 ? [
      ['Review 10 flashcards',10,'cards','practice','Remember before you flip'],['Continue a lesson',20,'bookopen','lesson','Build one new skill'],['Say your sentences aloud',5,'volume','lesson','Make your Russian audible'],['Write in your journal',10,'pen','journal','Try a little free writing']
    ] : [
      ['Review your flashcards',15,'cards','practice','Keep yesterday’s words fresh'],['Continue a lesson',25,'bookopen','lesson','Take your time with examples'],['Say it aloud',10,'volume','lesson','Practise a real conversation'],['Write in your journal',10,'pen','journal','Make the language yours']
    ];
  }
  function dashboard() {
    const completed=state.completed.length, percent=Math.round(100*completed/C.lessons.length);
    const rows=studyPlan().map(([name,min,symbol,go,description])=>`<div class="task-row"><div class="task-badge">${icon(symbol)}</div><div class="task-info"><b>${name}</b><span>${min} min · ${description}</span></div><button class="round-button" data-go="${go}" aria-label="Go to ${escape(name)}">${icon('arrow')}</button></div>`).join('');
    const monday=(()=>{const d=new Date(`${today()}T12:00:00`);return addDays(today(),-((d.getDay()+6)%7));})();
    const weekdays=['M','T','W','T','F','S','S'];
    const week=weekdays.map((name,i)=>{const key=addDays(monday,i);const done=(state.days[key]||0)>0, now=key===today();return `<div class="week-day"><span>${name}</span><div class="dot ${done?'done':''} ${now?'today':''}" title="${formatDate(key)}: ${state.days[key]||0} minutes">${done?icon('check'):new Date(`${key}T12:00:00`).getDate()}</div></div>`;}).join('');
    return `<section class="hero"><div class="hero-text"><div class="eyebrow">ТВОЙ МАЛЕНЬКИЙ УГОЛОК ✦</div><h1>Привет, ${escape(state.name)}! <span style="color:#9271c1">♡</span></h1><p>A little Russian, every day. Ready to turn tiny moments into something wonderful?</p><button class="btn white" data-go="${state.completed.length===C.lessons.length?'practice':'lesson'}">${icon('bookopen')} ${state.completed.length===C.lessons.length?'Start practising':'Continue learning'} ${icon('arrow')}</button></div><div class="hero-art" aria-hidden="true"><div class="flower">✿</div><div class="center">я</div><div class="star a">✦</div><div class="star b">✧</div></div></section>
    <div class="stats-grid"><div class="stat"><div class="stat-top">CURRENT STREAK <div class="stat-icon">${icon('fire')}</div></div><div class="stat-number">${streak()} <small>days</small></div><div class="stat-foot">Every little day matters</div></div><div class="stat"><div class="stat-top">WORDS STUDIED <div class="stat-icon">${icon('cards')}</div></div><div class="stat-number">${studiedCards()} <small>/ ${C.words.length}</small></div><div class="stat-foot">${due().length} ready to review</div></div><div class="stat"><div class="stat-top">LESSONS DONE <div class="stat-icon">${icon('bookopen')}</div></div><div class="stat-number">${completed} <small>/ ${C.lessons.length}</small></div><div class="stat-foot">${percent}% of your path</div></div><div class="stat"><div class="stat-top">THIS WEEK <div class="stat-icon">${icon('clock')}</div></div><div class="stat-number">${weekMinutes()} <small>min</small></div><div class="stat-foot">Real time you logged</div></div></div>
    <div class="dashboard-grid"><div><section class="panel"><div class="panel-title"><div><h2>Today's little plan ✦</h2><p>One cosy study session at a time</p></div><div class="segmented">${[30,45,60].map(n=>`<button class="segment ${state.dailyGoal===n?'selected':''}" data-action="goal" data-value="${n}">${n}m</button>`).join('')}</div></div>${rows}<div class="tiny-note">${icon('info')} These are suggestions, not deadlines. Do them in any order.</div></section>
      <div class="section-header"><h2 class="section-title">Where you left off</h2><button class="text-link" data-go="path">See all lessons →</button></div><section class="panel"><div class="panel-title"><div><span class="tag">${escape(nextLesson().skill)}</span><h2 style="margin-top:12px">${escape(nextLesson().title)}</h2><p>Lesson ${C.lessons.findIndex(l=>l.id===nextLesson().id)+1} of ${C.lessons.length} · ${nextLesson().duration} min</p></div><button class="btn small" data-lesson="${nextLesson().id}">Open ${icon('arrow')}</button></div><div class="progress-line"><div style="width:${percent}%"></div></div></section></div>
      <div><section class="panel"><div class="panel-title"><div><h2>Your study week</h2><p>Show up in your own way</p></div></div><div class="week-grid">${week}</div><div class="quote-card"><div class="ru">У тебя получится! ♡</div><p>You've got this!</p></div></section>
      <section class="panel"><div class="panel-title"><div><h2>Focus corner</h2><p>A gentle timer for studying</p></div></div><div class="focus-inner"><div class="timer-number" id="timer-display">${clockFormat(timeElapsed())}</div><p>Your target today: ${state.dailyGoal} minutes</p><div class="focus-actions">${timer.running ? `<button class="btn small" data-action="pause">${icon('pause')} Pause</button>`:`<button class="btn small" data-action="start">${icon('play')} ${timeElapsed()>0?'Resume':'Start focus'}</button>`}<button class="btn small secondary" data-action="finish">Finish & log</button></div></div><button class="text-link" style="margin-top:15px" data-action="log">+ Log minutes manually</button></section></div></div>`;
  }
  function pathPage() {
    const units=C.units.map((u,j)=>{
      const complete=u.lessons.filter(id=>state.completed.includes(id)).length;
      return `<div class="unit-card ${u.colour}"><div class="unit-header"><div class="unit-icon">0${j+1}</div><div style="flex:1"><h3>${escape(u.name)}</h3><p>${escape(u.subtitle)}</p></div><div class="unit-percent">${complete} / ${u.lessons.length}<div class="progress-line" style="width:75px;margin-top:8px"><div style="width:${complete/u.lessons.length*100}%"></div></div></div></div>${u.lessons.map((id,i)=>{const l=C.lessons.find(l=>l.id===id),done=state.completed.includes(id);return `<div class="lesson-row"><div class="lesson-number ${done?'completed':''}">${done?icon('check'):String(i+1).padStart(2,'0')}</div><div class="lesson-name"><b>${escape(l.title)}</b><small>${escape(l.skill)} · ${l.duration} min</small></div><button class="btn ${done?'ghost':'secondary'} small" data-lesson="${l.id}">${done?'Revisit':'Study'} ${icon('arrow')}</button></div>`;}).join('')}</div>`;
    }).join('');
    return `<div class="eyebrow">THE JOURNEY</div><h1 class="page-title">Your learning path <span style="color:#c2a9e8">✿</span></h1><p class="subhead">Twelve bite-sized lessons in four chapters. There is no need to rush.</p>${units}`;
  }
  function lessonPage() {
    const l=C.lessons.find(x=>x.id===ui.lesson)||nextLesson(),done=state.completed.includes(l.id),index=C.lessons.indexOf(l);
    return `<div class="lesson-detail"><button class="back-link" data-go="path">← Back to your path</button><div class="eyebrow">LESSON ${String(index+1).padStart(2,'0')} / ${C.lessons.length} · ${escape(l.skill.toUpperCase())}</div><h1 class="page-title">${escape(l.title)}</h1><p class="subhead">${escape(l.intro)}</p><div class="lesson-top"><span class="tag">${icon('clock')} ${l.duration} minutes</span>${done?'<span class="tag" style="background:#e8f6ec;color:#5c946f">✓ Completed</span>':''}</div>
      ${l.sections.map(s=>`<section class="reading-card"><h2>${escape(s.heading)}</h2><p>${escape(s.body)}</p></section>`).join('')}
      <section class="reading-card"><h2>Try saying these aloud</h2><table class="examples-table"><tbody>${l.examples.map(e=>`<tr><td lang="ru">${escape(e[0])}</td><td>${escape(e[1])}</td></tr>`).join('')}</tbody></table></section>
      <section class="task-callout"><strong>✦ Your little challenge</strong><p>${escape(l.task)}</p><p style="font-size:12px;margin:0;opacity:.8">A gentle reminder: ${escape(l.tip)}</p></section><div class="row"><button class="btn" data-action="complete-lesson" data-id="${l.id}">${icon('check')} ${done?'Mark as unfinished':'Mark lesson complete'}</button><button class="btn secondary" data-go="journal">${icon('pen')} Write about it</button>${index<C.lessons.length-1?`<button class="btn ghost" data-lesson="${C.lessons[index+1].id}">Next lesson ${icon('arrow')}</button>`:''}</div></div>`;
  }
  const categories = ['All',...new Set(C.words.map(w=>w.topic)),'Favourites','Due'];
  function wordsPage() {
    let words=C.words;
    if(ui.wordTopic==='Favourites') words=words.filter(w=>state.favorites.includes(w.id));
    else if(ui.wordTopic==='Due') words=due();
    else if(ui.wordTopic!=='All') words=words.filter(w=>w.topic===ui.wordTopic);
    const q=ui.wordSearch.trim().toLocaleLowerCase();
    if(q) words=words.filter(w=>[w.ru,w.en,w.latin,w.topic].some(v=>v.toLocaleLowerCase().includes(q)));
    return `<div class="eyebrow">YOUR VOCABULARY</div><h1 class="page-title">Little words, big world</h1><p class="subhead">Your growing Russian word collection. Tap the heart to save a favourite, or the speaker to hear a word.</p><div class="toolbar"><div class="search-field">${icon('search')}<input id="word-search" type="search" aria-label="Search vocabulary" value="${escape(ui.wordSearch)}" placeholder="Search Russian or English…"></div><button class="btn small" data-go="practice">${icon('cards')} Review cards</button></div><div class="filter-group" style="margin-bottom:16px">${categories.map(c=>`<button class="filter ${ui.wordTopic===c?'active':''}" data-action="word-filter" data-value="${escape(c)}">${escape(c)}</button>`).join('')}</div><div class="word-list"><div class="word-head"><div>Russian</div><div>Pronunciation</div><div>Meaning</div><div></div></div>${words.length?words.map(w=>`<div class="word-row"><div><div class="word-ru" lang="ru">${escape(w.ru)}</div><div class="topic-tag">${escape(w.topic)}</div></div><div class="word-latin">${escape(w.latin)}</div><div class="word-en">${escape(w.en)}${w.note?`<div style="font-size:10px;color:#b3aabf;margin-top:5px">${escape(w.note)}</div>`:''}</div><div class="word-action"><button class="icon-btn" data-speak="${escape(w.ru)}" title="Hear ${escape(w.ru)}" aria-label="Hear ${escape(w.ru)}">${icon('volume')}</button><button class="icon-btn ${state.favorites.includes(w.id)?'faved':''}" data-fav="${w.id}" title="Favourite" aria-label="Toggle favourite ${escape(w.ru)}">${icon('heart')}</button></div></div>`).join(''):`<div class="empty"><div class="big">☁</div>Nothing here just yet. Try another filter!</div>`}</div><p class="caution">Audio uses your browser’s Russian text-to-speech voice, when one is installed.</p>`;
  }
  function prepareDeck() {const list=due();ui.queue=shuffled(list.length?list:C.words).slice(0,10).map(w=>w.id);ui.flipped=false;}
  const getWord = id => C.words.find(w=>w.id===id);
  function startQuiz() { const w=sample(C.words);const distractors=shuffled(C.words.filter(x=>x.id!==w.id && x.en!==w.en)).slice(0,3);ui.quiz={id:w.id,options:shuffled([w,...distractors]).map(x=>({id:x.id,text:x.en})),answer:null}; }
  function startTyping() {const w=sample(C.words.filter(w=>w.ru.length<17));ui.typing={id:w.id,answer:null,revealed:false};}
  function practicePage() {
    const tabs=[['cards','Flashcards','cards'],['quiz','Quick quiz','spark'],['typing','Type in Russian','pen']];
    let inner='';
    if(ui.practice==='cards'){
      if(!ui.queue.length) inner=`<div class="practice-card"><div class="card-overline">SESSION COMPLETE ♡</div><div class="practice-ru">Молодец!</div><div class="practice-answer">You did it!</div><p class="practice-sub">Your cards are scheduled for future review. Come back for another little session tomorrow, or start with another set.</p><button class="btn" data-action="reset-cards">${icon('rotate')} Study another set</button></div>`;
      else {
        const w=getWord(ui.queue[0]);
        inner=`<div class="practice-card"><div class="card-overline">CARD 1 OF ${ui.queue.length} REMAINING · ${escape(w.topic)}</div><div class="practice-ru" lang="ru">${escape(w.ru)}</div><div class="practice-sub">${ui.flipped?escape(w.latin):'Remember what this means, then flip to check.'}</div>${ui.flipped?`<div class="practice-answer">${escape(w.en)}</div><p class="practice-sub">${escape(w.note||'You’ve got this!')}</p><button class="btn secondary small" data-speak="${escape(w.ru)}">${icon('volume')} Listen</button>`:`<div class="spacing"></div><button class="btn" data-action="flip-card">Flip card ${icon('rotate')}</button>`}</div><div class="practice-footer">${ui.flipped?`<button class="grade-btn again" data-grade="again">Again · soon</button><button class="grade-btn" data-grade="hard">Hard · 1d</button><button class="grade-btn good" data-grade="good">Got it · 3d+</button><button class="grade-btn easy" data-grade="easy">Easy · 7d+</button>`:`<span class="muted" style="font-size:12px">Tip: press <span class="kbd">space</span> to flip</span>`}</div>`;
      }
    } else if(ui.practice==='quiz'){
      if(!ui.quiz) startQuiz();const q=ui.quiz,w=getWord(q.id);
      inner=`<div class="practice-card"><div class="card-overline">WHAT DOES THIS MEAN?</div><div class="practice-ru" lang="ru">${escape(w.ru)}</div><div style="width:100%;margin-top:11px">${q.options.map(o=>`<button class="answer-option ${q.answer && o.id===w.id?'correct':''} ${q.answer===o.id && o.id!==w.id?'wrong':''}" data-quiz="${o.id}" ${q.answer?'disabled':''}>${escape(o.text)}</button>`).join('')}</div>${q.answer?`<p class="${q.answer===w.id?'correct-msg':'error-msg'}">${q.answer===w.id?'Yes! Lovely work ♡':`Not quite — it means “${escape(w.en)}”.`}</p><button class="btn" data-action="next-quiz">Next question ${icon('arrow')}</button>`:''}</div>`;
    } else {
      if(!ui.typing)startTyping();const t=ui.typing,w=getWord(t.id);
      inner=`<div class="practice-card"><div class="card-overline">TYPE THE RUSSIAN WORD</div><div class="practice-ru" style="font-size:37px">${escape(w.en)}</div><p class="practice-sub">Use your Russian keyboard to write the answer in Cyrillic.</p><form id="typing-form" style="width:100%"><input class="practice-input" name="typing" id="typing-answer" type="text" lang="ru" spellcheck="false" autocomplete="off" autofocus placeholder="Твой ответ…" ${t.answer?'disabled':''} required /><div class="practice-footer">${!t.answer?`<button class="btn" type="submit">Check answer ${icon('check')}</button><button class="btn secondary" type="button" data-action="reveal-typing">Reveal answer</button>`:''}</div></form>${t.answer?`<p class="${t.answer==='correct'?'correct-msg':'error-msg'}">${t.answer==='correct'?'Правильно! That’s right! ♡':`Answer: ${escape(w.ru)} (${escape(w.latin)})`}</p><button class="btn" data-action="next-typing">Next word ${icon('arrow')}</button>`:''}</div>`;
    }
    return `<div class="practice-shell"><div class="eyebrow">A LITTLE PRACTICE</div><h1 class="page-title">Let's make it stick ✦</h1><p class="subhead">Small, repeatable moments of practice are where the magic happens.</p><div class="study-modes">${tabs.map(([key,label,symbol])=>`<button class="study-mode ${ui.practice===key?'selected':''}" data-action="practice-mode" data-value="${key}">${icon(symbol)} ${label}</button>`).join('')}</div>${inner}<p class="tiny-note" style="justify-content:center">${icon('info')} Flashcards use spaced review. Quiz and typing track correct answers separately.</p></div>`;
  }
  function grammarPage() {
    return `<div class="eyebrow">THE REFERENCE SHELF</div><h1 class="page-title">Grammar, without the panic</h1><p class="subhead">A tiny notebook of patterns you can come back to whenever you need them. Tap a card to see examples.</p><div class="grammar-grid">${C.grammar.map(g=>`<button type="button" class="grammar-card" data-grammar="${g.id}" aria-expanded="${ui.openGrammar===g.id}"><span class="tag">${escape(g.tag)}</span><h3>${escape(g.title)}</h3><p>${escape(g.summary)}</p>${ui.openGrammar===g.id?`<div class="grammar-expanded"><p>${escape(g.rule)}</p>${g.examples.map(e=>`<div class="grammar-example"><strong lang="ru">${escape(e[0])}</strong><span>${escape(e[1])}</span></div>`).join('')}</div>`:''}</button>`).join('')}</div>`;
  }
  function journalPage() {
    const entry=state.journal[today()]||{text:'',words:''};
    const index=(Math.floor(new Date(`${today()}T12:00:00`).getTime()/86400000))%C.prompts.length;
    const past=Object.entries(state.journal).filter(([key,v])=>key!==today()&&(v.text?.trim()||v.words?.trim())).sort(([a],[b])=>b.localeCompare(a));
    return `<div class="eyebrow">YOUR LANGUAGE JOURNAL</div><h1 class="page-title">Dear diary, дорогой дневник…</h1><p class="subhead">Write something tiny in Russian. Messy attempts are absolutely welcome.</p><div class="journal-layout"><section class="panel"><div class="panel-title"><div><h2>Today's page</h2><p>${formatDate(today(),{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · autosaved on this device</p></div><span class="tag">✿ private</span></div><label class="field-label" for="journal-text">My Russian thoughts</label><textarea class="textarea" id="journal-text" lang="ru" spellcheck="false" placeholder="Сегодня я… / Today I…">${escape(entry.text)}</textarea><div class="spacing"></div><label class="field-label" for="journal-words">New words I found</label><input id="journal-words" class="text-field" placeholder="e.g. счастье — happiness" value="${escape(entry.words)}"><p class="caution" id="journal-status">Changes save automatically. Only you can see them unless you choose cloud sync.</p></section><div><div class="hint-card"><strong>✦ TODAY'S WRITING PROMPT</strong><p>${escape(C.prompts[index])}</p></div><section class="panel"><div class="panel-title"><div><h2>Previous pages</h2><p>Your little language time capsule</p></div></div>${past.length?past.map(([date,v])=>`<div class="journal-entry"><strong>${formatDate(date,{day:'numeric',month:'long',year:'numeric'})}</strong>${v.text?.trim()?`<p lang="ru">${escape(v.text)}</p>`:''}${v.words?.trim()?`<span class="tag">${escape(v.words)}</span>`:''}</div>`).join(''):`<div class="empty"><div class="big">✎</div>Your story starts right here ♡</div>`}</section></div></div>`;
  }
  function settingsPage() {
    const cfg=window.RusskiCloud.getConfig();
    return `<div class="eyebrow">YOUR LITTLE SPACE</div><h1 class="page-title">Make it yours</h1><p class="subhead">Preferences, data backups and optional cloud sync.</p><div class="settings-layout"><div><section class="panel"><div class="panel-title"><div><h2>Study preferences</h2><p>Set a pace that feels good</p></div></div><div class="setting-row"><label class="field-label" for="your-name">Your name (shown on the dashboard)</label><div class="row"><input id="your-name" class="text-field" style="max-width:250px" value="${escape(state.name)}"><button class="btn small" data-action="save-name">Save</button></div></div><div class="setting-row"><div class="field-label">Daily study target</div><div class="segmented">${[30,45,60].map(n=>`<button class="segment ${state.dailyGoal===n?'selected':''}" data-action="goal" data-value="${n}">${n} min</button>`).join('')}</div></div></section><section class="panel"><div class="panel-title"><div><h2>Keep your progress safe</h2><p>Backups you control — no account required</p></div></div><div class="row"><button class="btn secondary" data-action="export">${icon('download')} Export JSON backup</button><button class="btn secondary" data-action="import">${icon('upload')} Import backup</button><input id="import-file" type="file" accept=".json,application/json" style="display:none"></div><p class="caution">Your lessons, words, minutes and journal are saved in this browser. Export a backup before clearing browsing data or changing devices.</p><div class="danger-zone"><button class="btn small critical" data-action="clear-data">Reset all local progress</button></div></section></div>
    <div><section class="panel"><div class="panel-title"><div><h2>Cloud sync ☁</h2><p>Optional · Supabase database</p></div></div><div class="cloud-status" id="cloud-status">${escape(ui.cloudMessage)}</div><div class="setting-row"><label class="field-label" for="supabase-url">Project URL</label><input id="supabase-url" class="text-field" placeholder="https://your-project.supabase.co" value="${escape(cfg.url||'')}"></div><div class="setting-row"><label class="field-label" for="supabase-key">Publishable / anon key</label><input id="supabase-key" class="text-field" placeholder="sb_publishable_... or eyJ..." value="${escape(cfg.key||'')}"><p>This key is public by design. Never enter a <b>service_role</b> or secret key.</p></div><button class="btn secondary small" data-action="cloud-config">Save cloud configuration</button><div class="divider"></div><label class="field-label" for="cloud-email">Your sign-in email</label><input id="cloud-email" type="email" class="text-field" placeholder="you@example.com" style="margin-bottom:12px"><div class="row"><button class="btn small" data-action="cloud-login">Email me a sign-in link</button><button class="btn ghost small" data-action="cloud-check">Check login</button></div><div class="divider"></div><div class="row"><button class="btn secondary small" data-action="cloud-upload">${icon('upload')} Upload this device</button><button class="btn secondary small" data-action="cloud-download">${icon('download')} Load from cloud</button><button class="btn ghost small" data-action="cloud-logout">Sign out</button></div><p class="caution">Sync is manual in this version. Upload after studying; load on another device. Loading replaces this device’s progress (after confirmation). Setup steps are in the included README and SQL file.</p></section></div></div>`;
  }
  function render() {
    const pages={dashboard,path:pathPage,lesson:lessonPage,words:wordsPage,practice:practicePage,grammar:grammarPage,journal:journalPage,settings:settingsPage};
    const page=pages[ui.page]||dashboard;
    $('#app').innerHTML=layout(page());
  }
  function setRoute(page, id) {location.hash=page==='lesson'?`#/lesson/${id||nextLesson().id}`:`#/${page}`;parseRoute();}
  function parseRoute() {
    const match=location.hash.match(/^#\/(dashboard|path|lesson|words|practice|grammar|journal|settings)(?:\/([a-z0-9]+))?/);
    ui.page=match?match[1]:'dashboard';ui.lesson=match?.[2]|| (ui.page==='lesson'?nextLesson().id:null);
    if(ui.page==='practice' && ui.practice==='cards' && !ui.queue.length && !ui.wasSession)prepareDeck();
    render();window.scrollTo({top:0,behavior:'instant'});
  }
  function speak(str) {
    if(!('speechSynthesis' in window)){toast('Speech audio is not supported by this browser.');return;}
    const utter=new SpeechSynthesisUtterance(str);utter.lang='ru-RU';utter.rate=.83;
    const voices=speechSynthesis.getVoices();const ru=voices.find(v=>v.lang.toLowerCase().startsWith('ru'));
    if(ru)utter.voice=ru;
    speechSynthesis.cancel();speechSynthesis.speak(utter);
  }
  function logMinutes(n) {if(!Number.isFinite(n)||n<=0||n>1440){toast('Enter a number of minutes between 1 and 1440.');return;}state.days[today()]=(state.days[today()]||0)+n;save();render();toast(`Logged ${n} study minute${n===1?'':'s'}! Молодец ♡`);}
  function saveSrs(id,grade) {
    const p=state.cards[id]||{reviewed:0,interval:0,ease:2.5,due:today()};
    let interval;
    if(grade==='again'){interval=0;p.ease=Math.max(1.3,p.ease-.2);}
    else if(grade==='hard'){interval=p.interval?Math.max(1,Math.ceil(p.interval*1.2)):1;p.ease=Math.max(1.3,p.ease-.15);}
    else if(grade==='good'){interval=p.interval?Math.max(3,Math.round(p.interval*p.ease)):3;}
    else {interval=p.interval?Math.max(7,Math.round(p.interval*p.ease*1.3)):7;p.ease=Math.min(3.2,p.ease+.15);}
    p.reviewed++;p.interval=interval;p.due=addDays(today(),interval);state.cards[id]=p;save();
  }
  async function handleCloud(action) {
    const cloud=window.RusskiCloud;
    try {
      if(action==='cloud-config'){cloud.setConfig($('#supabase-url').value,$('#supabase-key').value);ui.cloudMessage='Configuration saved on this device. Next, email yourself a sign-in link.';render();return;}
      if(action==='cloud-login'){const email=$('#cloud-email').value.trim();if(!email){toast('Enter your email address first.');return;}await cloud.login(email);ui.cloudMessage='Check your email for a sign-in link, then return to this site.';}
      if(action==='cloud-check'){const u=await cloud.user();ui.cloudMessage=u?`Signed in as ${u.email}. Cloud sync is ready.`:'Not signed in yet. Check your email for the link.';}
      if(action==='cloud-logout'){await cloud.logout();ui.cloudMessage='Signed out of cloud sync. Local progress is still saved.';}
      if(action==='cloud-upload'){if(!confirm('Upload this device’s progress? This replaces any older progress stored in the cloud.'))return;await cloud.upload(state);ui.cloudMessage='Uploaded! Your progress is saved to your Supabase account.';}
      if(action==='cloud-download'){
        const remote=await cloud.download();if(!remote){ui.cloudMessage='No cloud backup yet. Use “Upload this device” first.';}
        else if(confirm(`Load your cloud backup from ${new Date(remote.updated_at).toLocaleString()}? This replaces progress on this device. Export a JSON backup first if needed.`)){
          if(!validate(remote.payload))throw Error('The cloud backup is not a valid study-state file.');state={...defaultState(),...remote.payload};save();ui.cloudMessage='Cloud progress loaded successfully!';
        }
      }
    }catch(err){ui.cloudMessage=`Cloud error: ${err.message||String(err)}`;}
    render();
  }
  document.addEventListener('click',async e=>{
    const el=e.target.closest('[data-go],[data-lesson],[data-action],[data-grade],[data-quiz],[data-fav],[data-speak],[data-grammar]');if(!el)return;
    if(el.dataset.go){if(el.dataset.go==='practice'&&ui.page!=='practice'){ui.practice='cards';ui.wasSession=false;prepareDeck();}setRoute(el.dataset.go);return;}
    if(el.dataset.lesson){setRoute('lesson',el.dataset.lesson);return;}
    if(el.dataset.speak){speak(el.dataset.speak);return;}
    if(el.dataset.fav){const id=el.dataset.fav;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();render();return;}
    if(el.dataset.grammar){ui.openGrammar=ui.openGrammar===el.dataset.grammar?null:el.dataset.grammar;render();return;}
    if(el.dataset.grade){saveSrs(ui.queue[0],el.dataset.grade);ui.queue.shift();ui.flipped=false;ui.wasSession=true;render();return;}
    if(el.dataset.quiz){if(ui.quiz?.answer)return;ui.quiz.answer=el.dataset.quiz;state.quizAnswered++;if(ui.quiz.answer===ui.quiz.id)state.quizCorrect++;save();render();return;}
    const a=el.dataset.action;if(!a)return;
    if(a==='goal'){state.dailyGoal=Number(el.dataset.value);save();render();return;}
    if(a==='complete-lesson'){const id=el.dataset.id;state.completed=state.completed.includes(id)?state.completed.filter(x=>x!==id):[...state.completed,id];save();render();toast(state.completed.includes(id)?'Lesson complete! Молодец ♡':'Lesson marked as unfinished.');return;}
    if(a==='practice-mode'){ui.practice=el.dataset.value;ui.wasSession=false;if(ui.practice==='cards')prepareDeck();else if(ui.practice==='quiz')startQuiz();else startTyping();render();return;}
    if(a==='flip-card'){ui.flipped=true;render();return;}
    if(a==='reset-cards'){ui.wasSession=false;prepareDeck();render();return;}
    if(a==='next-quiz'){startQuiz();render();return;}
    if(a==='reveal-typing'){ui.typing.answer='revealed';render();return;}
    if(a==='next-typing'){startTyping();render();return;}
    if(a==='word-filter'){ui.wordTopic=el.dataset.value;render();return;}
    if(a==='start'){if(!timer.running){timer.started=Date.now();timer.running=true;}render();return;}
    if(a==='pause'){timer.elapsed=timeElapsed();timer.running=false;render();return;}
    if(a==='finish'){const min=Math.floor(timeElapsed()/60000);timer.running=false;timer.elapsed=0;timer.started=0;if(min)logMinutes(min);else{render();toast('Study for at least one full minute before logging the timer.');}return;}
    if(a==='log'){const input=prompt('How many minutes did you study?',String(state.dailyGoal));if(input===null)return;const v=Number(input);if(!Number.isInteger(v))toast('Please enter a whole number of minutes.');else logMinutes(v);return;}
    if(a==='save-name'){const val=$('#your-name').value.trim();if(val.length<1||val.length>40){toast('Please enter a name between 1 and 40 characters.');return;}state.name=val;save();render();toast('Name updated!');return;}
    if(a==='export'){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`russki-backup-${today()}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('Backup downloaded. Keep it somewhere safe!');return;}
    if(a==='import'){$('#import-file').click();return;}
    if(a==='clear-data'){if(confirm('Really reset your lessons, word progress, study minutes AND journal from this device? This cannot be undone unless you made a backup.')){state=defaultState();save();ui.cloudMessage='Local study progress reset. Your cloud backup was not changed.';render();toast('Local progress reset.');}return;}
    if(a.startsWith('cloud-')){await handleCloud(a);return;}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='word-search'){
      const el=e.target,position=el.selectionStart;ui.wordSearch=el.value;render();const replacement=$('#word-search');replacement?.focus();replacement?.setSelectionRange(position,position);return;
    }
    if(e.target.id==='journal-text'||e.target.id==='journal-words'){
      const entry=state.journal[today()]||{text:'',words:''};
      if(e.target.id==='journal-text')entry.text=e.target.value;
      else entry.words=e.target.value;
      state.journal[today()]=entry;save();const status=$('#journal-status');if(status)status.textContent='Saved to this browser ♡';
    }
  });
  document.addEventListener('change',async e=>{
    if(e.target.id==='import-file'){
      const file=e.target.files?.[0];if(!file)return;
      try {const payload=JSON.parse(await file.text());if(!validate(payload))throw Error('Invalid study backup format');if(!confirm('Replace all local study progress with this backup?'))return;state={...defaultState(),...payload};save();render();toast('Backup restored ♡');}
      catch(err){toast(`Could not import file: ${err.message}`);}
    }
  });
  document.addEventListener('submit',e=>{
    if(e.target.id==='typing-form'){
      e.preventDefault();const w=getWord(ui.typing.id),v=$('#typing-answer').value.trim().toLocaleLowerCase('ru-RU').replaceAll('ё','е'),answer=w.ru.toLocaleLowerCase('ru-RU').replaceAll('ё','е');
      if(!v)return;
      ui.typing.answer=v===answer?'correct':'wrong';state.quizAnswered++;if(v===answer)state.quizCorrect++;save();render();
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key===' ' && ui.page==='practice' && ui.practice==='cards' && !ui.flipped && ui.queue.length && !['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)){e.preventDefault();ui.flipped=true;render();}
    if((e.key==='Enter'||e.key===' ') && e.target.classList?.contains('brand')){e.preventDefault();setRoute('dashboard');}
  });
  window.addEventListener('hashchange',parseRoute);
  setInterval(()=>{if(!timer.running)return;const el=$('#timer-display');if(el)el.textContent=clockFormat(timeElapsed());},1000);
  if(!location.hash)location.hash='#/dashboard';parseRoute();
})();
