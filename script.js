<script>
        // --- 1. FIREBASE CONFIG ---
        // ⚠️⚠️ هام جداً: ضع بيانات مشروعك هنا بدلاً من الأصفار ⚠️⚠️
        const firebaseConfig = {
            apiKey: "ضع_API_KEY_الخاص_بك_هنا",
            authDomain: "اسم-مشروعك.firebaseapp.com",
            projectId: "اسم-مشروعك",
            storageBucket: "اسم-مشروعك.firebasestorage.app",
            messagingSenderId: "00000000000",
            appId: "1:00000000000:web:xxxxxxxxxxxx"
        };

        // تهيئة Firebase مع التقاط الأخطاء
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            var db = firebase.firestore();
            console.log("Firebase Connected Successfully");
        } catch(e) {
            console.error("Firebase Error:", e);
            alert("خطأ في الاتصال بقاعدة البيانات! تأكد من وضع إعدادات Firebase بشكل صحيح.\n\n" + e.message);
        }

        // --- 2. GLOBAL STATE ---
        let currentUser = null;
        let lang = localStorage.getItem('lang') || 'ar';
        let regRole = 'user';
        let rateM = null;
        let uCache = [];

        // --- 3. TRANSLATIONS ---
        const tD = {
            ar: {
                menu:"القائمة", home:"الرئيسية", login:"دخول", dashboard:"لوحة التحكم", profile:"الملف",
                about:"من نحن", privacy:"السياسة", location:"مقرنا", report:"ابلاغ", logout:"خروج",
                hero_title:"غير حياتك للأفضل", start_now:"إبدأ الآن", login_btn:"دخول", no_account:"ليس لديك حساب؟",
                register:"انشاء حساب", role_user:"مستخدم", role_pro:"مختص", register_btn:"تسجيل",
                name:"الاسم", photo:"الصورة", password:"كلمة المرور", confirm_pass:"تأكيد كلمة المرور",
                pass_mismatch:"كلمات المرور غير متطابقة", reg_ok_user:"تم التسجيل بنجاح", 
                reg_ok_pro:"تم التسجيل! انتظر حتى نعالج ملفك لتصبح من عائلتنا 💙",
                wilaya:"الولاية", marital:"الحالة الاجتماعية", single:"أعزب", married:"متزوج", divorced:"مطلق",
                kids:"أولاد؟", no:"لا", yes:"نعم", cert:"الشهادة", admin_panel:"لوحة الادمن", users:"المستخدمين",
                pending:"قيد الانتظار", approvals:"التوثيق", settings:"الاعدادات", logo:"اللوغو", bg:"الخلفية",
                add_banner:"اضافة بانر", welcome:"مرحبا", total_req:"اجمالي", accepted:"مقبولة", history:"سجلي",
                available_pros:"المختصين", request:"طلب", wait:"انتظار", points:"نقاطي", incoming:"طلبات واردة",
                client:"المريض", age:"السن", gender:"الجنس", action:"اجراء", accepted_clients:"زبائن",
                phone:"الهاتف", email:"الايميل", edit_profile:"تعديل الملف", save:"حفظ", cancel:"الغاء",
                rate_pro:"تقييم", send:"ارسال", reviews:"التعليقات", desc:"الوصف", male:"ذكر", female:"أنثى",
                new_req:"جديد", total:"الاجمالي", rejected:"مرفوض", succ_title:"تم", saved_msg:"تم الحفظ",
                sent_msg:"تم الارسال", req_ok_title:"تم الطلب", req_ok_msg:"تم ارسال الطلب بنجاح",
                err_title:"خطأ", login_err:"بيانات خاطئة", ban_msg:"حسابك محظور", pend_msg:"حسابك قيد المراجعة",
                rej_msg:"تم رفض طلبك", points_manager:"تعديل النقاط", sessions:"جلسات", visits_day:"زيارات يوم", 
                visits_month:"زيارات شهر", banners:"بانرات", send_notif:"ارسال اشعار",
                no_kids: "بدون أولاد", with_kids: "بأولاد",
                about_text: "منصة تربط المرضى مع افظل اخصائي التغذية في الجزائر ، حجز جلسات أونلاين دون تعب التنقل ، برامج غذائية ، نصائح و ارشادات",
                privacy_text: "موقعنا هدفه ربط المرضى بمختصين في التغذية نحن لا نجمع معلومات ولسنا تابعيين لاي جهة نتعهد ببقاء جميع معلومات المستخدمين في سرية تامة"
            },
            fr: {
                menu:"Menu", home:"Accueil", login:"Connexion", dashboard:"Tableau de bord", profile:"Profil",
                about:"À propos", privacy:"Confidentialité", location:"Localisation", report:"Signaler", logout:"Déconnexion",
                hero_title:"Changez votre vie", start_now:"Commencer", login_btn:"Connexion", no_account:"Pas de compte?",
                register:"Inscription", role_user:"Utilisateur", role_pro:"Spécialiste", register_btn:"S'inscrire",
                name:"Nom", photo:"Photo", password:"Mot de passe", confirm_pass:"Confirmer MDP",
                pass_mismatch:"Mots de passe non identiques", reg_ok_user:"Succès", 
                reg_ok_pro:"Inscrit! Attendez l'approbation 💙",
                wilaya:"Wilaya", marital:"État civil", single:"Célibataire", married:"Marié", divorced:"Divorcé",
                kids:"Enfants?", no:"Non", yes:"Oui", cert:"Certificat", admin_panel:"Admin Panel", users:"Utilisateurs",
                pending:"En attente", approvals:"Approbations", settings:"Paramètres", logo:"Logo", bg:"Arrière-plan",
                add_banner:"Ajouter bannière", welcome:"Bienvenue", total_req:"Total", accepted:"Acceptées", history:"Historique",
                available_pros:"Spécialistes", request:"Demander", wait:"Attente", points:"Points", incoming:"Entrantes",
                client:"Patient", age:"Age", gender:"Sexe", action:"Action", accepted_clients:"Clients",
                phone:"Tél", email:"Email", edit_profile:"Modifier Profil", save:"Sauvegarder", cancel:"Annuler",
                rate_pro:"Évaluer", send:"Envoyer", reviews:"Avis", desc:"Description", male:"Homme", female:"Femme",
                new_req:"Nouvelles", total:"Total", rejected:"Rejeté", succ_title:"Fait", saved_msg:"Enregistré",
                sent_msg:"Envoyé", req_ok_title:"Succès", req_ok_msg:"Demande envoyée",
                err_title:"Erreur", login_err:"Données invalides", ban_msg:"Compte banni", pend_msg:"Compte en attente",
                rej_msg:"Demande rejetée", points_manager:"Gérer Points", sessions:"Séances", visits_day:"Visites Jour", 
                visits_month:"Visites Mois", banners:"Bannières", send_notif:"Envoyer Notif",
                no_kids: "Sans enfants", with_kids: "Avec enfants",
                about_text: "Une plateforme mettant en relation les patients avec les meilleurs nutritionnistes d’Algérie, permettant de réserver des consultations en ligne sans se déplacer, et proposant des programmes nutritionnels, des conseils et un accompagnement.",
                privacy_text: "Notre site web a pour but de mettre en relation des patients et des nutritionnistes. Nous ne collectons aucune information et ne sommes affiliés à aucune organisation. Nous nous engageons à garantir la stricte confidentialité de toutes les informations des utilisateurs"
            }
        };

        // --- 4. STARTUP LOGIC ---
        
        // Failsafe: إجبار الموقع على الفتح بعد 4 ثواني في حال وجود خطأ
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader && !loader.classList.contains('hidden')) {
                console.warn("Loader forced to hide (Timeout)");
                loader.classList.add('hidden');
            }
        }, 4000);

        window.onload = async () => {
            applyLang(); 
            
            // محاولة جلب الإعدادات
            try { loadCMS(); trackVisit(); } catch(e) { console.warn("CMS/Stats load failed:", e); }

            const uid = localStorage.getItem('uid');
            if(uid){
                try {
                    const d = await db.collection('users').doc(uid).get();
                    if(d.exists){ 
                        currentUser = {id:d.id, ...d.data()}; 
                        initApp(); 
                    } else { 
                        hideLoader(); 
                    }
                } catch(e){ 
                    console.error("User fetch error:", e); 
                    hideLoader(); 
                }
            } else { 
                hideLoader(); 
            }
        };

        function hideLoader(){
            const l = document.getElementById('loader');
            if(l) l.classList.add('hidden');
        }

        // --- بقية الدوال كما هي ---
        function switchLang(){lang=lang==='ar'?'fr':'ar';localStorage.setItem('lang',lang);location.reload();}
        function applyLang(){document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-t]').forEach(e=>e.innerText=tD[lang][e.getAttribute('data-t')]||e.innerText);document.querySelectorAll('[data-p]').forEach(e=>e.placeholder=tD[lang][e.getAttribute('data-p')]||e.placeholder);}
        function t(k){return tD[lang][k]||k;}
        function sAlert(icon,kTitle,kText){let c={icon:icon,title:t(kTitle),text:t(kText),timer:3000,showConfirmButton:false};if(kTitle==='reg_ok_pro'){c.iconHtml='<i class="fas fa-clock fa-3x" style="color:#2196F3"></i>';c.timer=5000;}Swal.fire(c);}
        function nav(id){document.querySelectorAll('main>section').forEach(s=>s.classList.add('hidden'));if(document.getElementById(id))document.getElementById(id).classList.remove('hidden');if(id==='dash-container')document.getElementById('dash-container').classList.remove('hidden');toggleSidebar(false);}
        function toggleSidebar(f){const s=document.getElementById('sidebar'),o=document.querySelector('.overlay');if(f===false){s.classList.remove('active');o.classList.remove('active')}else{s.classList.toggle('active');o.classList.toggle('active')}}
        const toBase64=f=>new Promise((r,j)=>{const rd=new FileReader();rd.readAsDataURL(f);rd.onload=()=>r(rd.result);rd.onerror=j;});
        function handleAuthBtn(){if(currentUser)logout();else nav('login');}
        function updateAuthBtn(){const b=document.getElementById('auth-btn-nav');if(currentUser){b.innerText=t('logout');b.onclick=logout;}else{b.innerText=t('login');b.onclick=()=>nav('login');}}

        function loadCMS(){
            db.collection('settings').doc('config').onSnapshot(s=>{
                if(s.exists){
                    const d=s.data(); 
                    if(d.logo)document.getElementById('nav-logo').innerHTML=`<img src="${d.logo}">`;
                    if(d.bg)document.querySelector('.hero-bg').style.backgroundImage=`url('${d.bg}')`;
                }
            });
        }
        function trackVisit(){const d=new Date().toISOString().split('T')[0];db.collection('stats').doc('visits').set({[d]:firebase.firestore.FieldValue.increment(1),[d.substring(0,7)]:firebase.firestore.FieldValue.increment(1)},{merge:true});}

        // --- AUTH ---
        function setRole(r){regRole=r;document.getElementById('role-user').className=`role-btn ${r==='user'?'active':''}`;document.getElementById('role-pro').className=`role-btn ${r==='pro'?'active':''}`;document.getElementById('pro-fields').classList.toggle('hidden',r!=='pro');}
        function toggleKids(v){document.getElementById('kids-div').className=(v==='Married'||v==='Divorced')?'':'hidden';}
        async function doRegister(){
            const n=document.getElementById('r-name').value,e=document.getElementById('r-email').value,p=document.getElementById('r-pass').value,p2=document.getElementById('r-pass2').value;
            if(!n||!e||!p)return sAlert('error','err_title','login_err');
            if(p!==p2)return sAlert('error','err_title','pass_mismatch');
            let d={name:n,email:e,pass:p,role:regRole,status:regRole==='user'?'active':'pending',joined:Date.now()};
            d.phone=document.getElementById('r-phone').value; d.gender=document.getElementById('r-gender').value; d.age=document.getElementById('r-age').value;
            if(regRole==='pro'){d.wilaya=document.getElementById('r-wilaya').value;d.marital=document.getElementById('r-social').value;if(d.marital!=='Single')d.kids=document.getElementById('r-kids').value;const f=document.getElementById('r-cert').files[0];if(f)d.cert=await toBase64(f); d.code='T'+Math.floor(10000+Math.random()*90000); d.lastAccepted=0; d.points=0;}
            try{await db.collection('users').add(d);sAlert(regRole==='user'?'success':'info','succ_title',regRole==='user'?'reg_ok_user':'reg_ok_pro');nav('login');}catch(x){Swal.fire('Error',x.message,'error');}
        }
        async function doLogin(){
            const e=document.getElementById('l-email').value,p=document.getElementById('l-pass').value;
            if(e==='admin'&&p==='abobob123'){currentUser={role:'admin',name:'Admin'};initApp();return;}
            const q=await db.collection('users').where('email','==',e).where('pass','==',p).get();
            if(q.empty)return sAlert('error','err_title','login_err');
            const u={id:q.docs[0].id,...q.docs[0].data()};
            if(u.status==='banned')return sAlert('error','err_title','ban_msg');
            if(u.status==='pending')return sAlert('warning','err_title','pend_msg');
            currentUser=u; localStorage.setItem('uid',u.id); initApp();
        }
        function logout(){currentUser=null;localStorage.removeItem('uid');location.reload();}

        // --- APP LOGIC ---
        function initApp(){
            hideLoader();
            document.getElementById('menu-public').classList.add('hidden');
            document.getElementById('menu-private').classList.remove('hidden');
            document.getElementById('btn-logout').classList.remove('hidden');
            document.getElementById('notif-btn').classList.remove('hidden');
            updateAuthBtn();
            if(currentUser.role==='admin')renderAdmin();else if(currentUser.role==='pro')initPro();else initUser();
            checkNotifs();
        }
        function navDash(){if(currentUser.role==='admin')renderAdmin();else if(currentUser.role==='pro')initPro();else initUser();}

        // --- USER ---
        function initUser(){
            nav('dash-container'); const c=document.getElementById('dash-container'); c.innerHTML=`<div id="u-slider" style="height:220px;border-radius:15px;overflow:hidden;margin-bottom:20px;box-shadow:var(--shadow)"></div><div class="flex" style="background:white;padding:15px;border-radius:15px;align-items:center;gap:20px;margin-bottom:20px"><img src="${currentUser.img||'https://via.placeholder.com/80'}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--primary)"><div><h2 style="margin:0">${currentUser.name}</h2><span>${t('welcome')}</span></div></div><h3 class="mb-2">${t('available_pros')}</h3><div id="pros-list" class="pro-list mb-4"></div><div class="tbl-box"><table><thead><tr><th>${t('pro')}</th><th>${t('status')}</th><th>${t('action')}</th></tr></thead><tbody id="u-hist"></tbody></table></div>`;
            loadBans('u-slider','user'); applyLang();
            db.collection('users').where('role','==','pro').where('status','==','active').onSnapshot(s=>{
                const l=document.getElementById('pros-list'); l.innerHTML="";
                let arr=[]; s.forEach(d=>arr.push({id:d.id,...d.data()}));
                arr=arr.filter(p=>(Date.now()-(p.lastAccepted||0))>3600000); 
                arr.forEach(p=>{ l.innerHTML+=`<div class="pro-item"><img src="${p.img||'https://via.placeholder.com/80'}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--primary)"><h4>${p.name}</h4><div style="color:gold" onclick="viewRev('${p.id}')">⭐ ${(p.rc?(p.rs/p.rc).toFixed(1):0)}</div><small>${p.wilaya||''}</small><button class="btn-glow mt-3" style="padding:8px 20px;font-size:0.9rem;animation:none" onclick="req('${p.id}','${p.name}')">${t('request')}</button></div>`; });
            });
            db.collection('apps').where('uid','==',currentUser.id).onSnapshot(s=>{
                const b=document.getElementById('u-hist'); b.innerHTML="";
                s.forEach(d=>{const x=d.data(); let act=`<span>${t('wait')}</span>`; if(x.status==='accepted'){act=x.rated?'✅':`<button onclick="openRate('${x.pid}','${d.id}')" style="background:gold;border:none;padding:5px;border-radius:5px">⭐</button>`;} else if(x.status==='rejected')act='❌'; b.innerHTML+=`<tr><td>${x.pName}</td><td>${t(x.status)}</td><td>${act}</td></tr>`;});
            });
        }
        async function req(pid,pnm){await db.collection('apps').add({uid:currentUser.id, uName:currentUser.name, uAge:currentUser.age, uGen:currentUser.gender, pid:pid, pName:pnm, status:'pending', date:Date.now()}); sAlert('success','req_ok_title','req_ok_msg');}

        // --- PRO ---
        function initPro(){
            nav('dash-container'); const c=document.getElementById('dash-container'); c.innerHTML=`<div id="p-slider" style="height:220px;border-radius:15px;overflow:hidden;margin-bottom:20px;box-shadow:var(--shadow)"></div><div class="flex" style="background:white;padding:20px;border-radius:15px;align-items:center;gap:20px;margin-bottom:20px"><img src="${currentUser.img||'https://via.placeholder.com/80'}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--primary)"><div style="flex:1"><h2 style="margin:0">${currentUser.name}</h2><span>Code: ${currentUser.code}</span></div><div style="text-align:center"><div style="font-size:2rem;font-weight:bold;color:var(--accent)">${currentUser.points||0}</div><small>${t('points')}</small></div></div><div class="pro-grid"><div class="pro-stat pc1"><h3 id="stat-new">0</h3><span>${t('new_req')}</span></div><div class="pro-stat pc2"><h3 id="stat-tot">0</h3><span>${t('total')}</span></div><div class="pro-stat pc3"><h3 id="stat-rej">0</h3><span>${t('rejected')}</span></div><div class="pro-stat pc4"><h3 id="stat-cli">0</h3><span>${t('accepted_clients')}</span></div></div><div class="tbl-box"><table><thead><tr><th>${t('client')}</th><th>${t('age')}</th><th>${t('gender')}</th><th>${t('action')}</th></tr></thead><tbody id="p-req"></tbody></table></div><div class="tbl-box"><table><thead><tr><th>${t('client')}</th><th>${t('phone')}</th><th>${t('email')}</th></tr></thead><tbody id="p-cli"></tbody></table></div>`;
            loadBans('p-slider','pro'); applyLang();
            db.collection('apps').where('pid','==',currentUser.id).onSnapshot(s=>{
                const r=document.getElementById('p-req'), cl=document.getElementById('p-cli'); r.innerHTML=""; cl.innerHTML=""; let st={n:0,t:0,r:0,c:0}, cSet=new Set();
                s.forEach(d=>{const x=d.data(); st.t++; if(x.status==='pending'){st.n++; r.innerHTML+=`<tr><td>${x.uName}</td><td>${x.uAge}</td><td>${t(x.uGen=='Female'?'female':'male')}</td><td><button onclick="ans('${d.id}',1)" style="color:green;border:none;background:none;font-size:1.3rem">✔</button> <button onclick="ans('${d.id}',0)" style="color:red;border:none;background:none;font-size:1.3rem">✖</button></td></tr>`;} else if(x.status==='rejected')st.r++; else if(x.status==='accepted'){if(!cSet.has(x.uid)){cSet.add(x.uid); db.collection('users').doc(x.uid).get().then(u=>{const ud=u.data(); cl.innerHTML+=`<tr><td>${ud.name}</td><td>${ud.phone}</td><td>${ud.email}</td></tr>`;});}}}
                document.getElementById('stat-new').innerText=st.n; document.getElementById('stat-tot').innerText=st.t; document.getElementById('stat-rej').innerText=st.r; document.getElementById('stat-cli').innerText=cSet.size;
            });
        }
        async function ans(aid,ok){await db.collection('apps').doc(aid).update({status:ok?'accepted':'rejected'}); if(ok)await db.collection('users').doc(currentUser.id).update({lastAccepted:Date.now()});}

        // --- ADMIN ---
        function renderAdmin(){
            nav('dash-container'); const c=document.getElementById('dash-container'); c.innerHTML=""; c.appendChild(document.getElementById('tpl-admin').content.cloneNode(true)); applyLang();
            db.collection('users').onSnapshot(s=>{document.getElementById('adm-u').innerText=s.size; document.getElementById('adm-w').innerText=s.docs.filter(d=>d.data().status==='pending').length; const tb=document.querySelector('#tbl-users tbody'), tbA=document.querySelector('#tbl-apps tbody'); tb.innerHTML=""; tbA.innerHTML=""; s.forEach(d=>{const u=d.data(); if(u.role!='admin')tb.innerHTML+=`<tr><td>${u.name}</td><td>${u.role}</td><td><button class="btn-del" onclick="delUser('${d.id}')">Del</button></td></tr>`; if(u.status==='pending')tbA.innerHTML+=`<tr><td>${u.name}</td><td>${u.cert?`<button class="btn-modern" onclick="wOpen('${u.cert}')">View</button>`:'-'}</td><td><button class="btn-modern" onclick="approve('${d.id}',1)">✔</button> <button class="btn-del" onclick="approve('${d.id}',0)">✖</button></td></tr>`;});});
            db.collection('apps').where('status','==','accepted').onSnapshot(s=>{document.getElementById('adm-s').innerText=s.size; document.getElementById('adm-c').innerText=new Set(s.docs.map(d=>d.data().uid)).size; const t=document.querySelector('#tbl-sess tbody'); t.innerHTML=""; s.forEach(d=>{const x=d.data(); t.innerHTML+=`<tr><td>${x.uName}</td><td>${x.pName}</td><td>${new Date(x.date).toLocaleDateString()}</td></tr>`;});});
            db.collection('stats').doc('visits').onSnapshot(d=>{if(d.exists){const dt=d.data(),k=new Date().toISOString().split('T')[0];document.getElementById('adm-vd').innerText=dt[k]||0;document.getElementById('adm-vm').innerText=dt[k.substring(0,7)]||0;}});
            db.collection('reports').onSnapshot(s=>{document.getElementById('adm-r').innerText=s.size; const t=document.querySelector('#tbl-reps tbody'); t.innerHTML=""; s.forEach(d=>{const r=d.data(); t.innerHTML+=`<tr><td>${r.name}</td><td>${r.email}</td><td>${r.desc}</td><td><button class="btn-del" onclick="delRep('${d.id}')">Del</button></td></tr>`;});});
            db.collection('banners').onSnapshot(s=>{document.getElementById('adm-b').innerText=s.size; const l=document.getElementById('ban-list'); l.innerHTML=""; s.forEach(d=>l.innerHTML+=`<div style="display:flex;justify-content:space-between;padding:5px;border-bottom:1px solid #eee"><img src="${d.data().img}" width="50"><button class="btn-del" onclick="delBan('${d.id}')">Del</button></div>`);});
        }
        function showAdm(id){document.querySelectorAll('[id^="adm-view-"]').forEach(e=>e.classList.add('hidden'));document.getElementById('adm-view-'+id).classList.remove('hidden');}
        
        async function updLogo(){const f=document.getElementById('adm-logo').files[0]; if(f){const b=await toBase64(f); db.collection('settings').doc('config').set({logo:b},{merge:true}); sAlert('success','succ_title','saved_msg');}}
        async function delLogo(){await db.collection('settings').doc('config').update({logo:firebase.firestore.FieldValue.delete()}); sAlert('success','succ_title','saved_msg');}
        async function updBg(){const f=document.getElementById('adm-bg').files[0]; if(f){const b=await toBase64(f); db.collection('settings').doc('config').set({bg:b},{merge:true}); sAlert('success','succ_title','saved_msg');}}
        async function delBg(){await db.collection('settings').doc('config').update({bg:firebase.firestore.FieldValue.delete()}); sAlert('success','succ_title','saved_msg');}
        async function addBan(){const f=document.getElementById('ban-img').files[0], l=document.getElementById('ban-link').value, r=document.getElementById('ban-role').value; if(f){const b=await toBase64(f); await db.collection('banners').add({img:b,link:l,target:r}); sAlert('success','succ_title','saved_msg');}}
        async function delBan(id){await db.collection('banners').doc(id).delete();}
        async function setPts(){const c=document.getElementById('pt-code').value,v=parseInt(document.getElementById('pt-val').value); const s=await db.collection('users').where('code','==',c).get(); if(!s.empty){await db.collection('users').doc(s.docs[0].id).update({points:v}); sAlert('success','succ_title','saved_msg');}else Swal.fire('Error','Code not found','error');}
        async function delUser(id){if(confirm('Delete?'))await db.collection('users').doc(id).delete();}
        async function approve(id,ok){await db.collection('users').doc(id).update({status:ok?'active':'rejected'});}
        async function delRep(id){await db.collection('reports').doc(id).delete();}
        async function sndNot(){const a=document.getElementById('nt-ar').value,f=document.getElementById('nt-fr').value,t=document.getElementById('nt-tar').value;await db.collection('notifs').add({ar:a,fr:f,target:t,date:Date.now()});sAlert('success','succ_title','sent_msg');}
        function wOpen(u){const w=window.open();w.document.write(`<img src="${u}" style="max-width:100%">`);}
        function filterUsers(v){const t=document.querySelector('#tbl-users tbody');const rows=t.getElementsByTagName('tr');for(let i=0;i<rows.length;i++){const n=rows[i].getElementsByTagName('td')[0];if(n){rows[i].style.display=n.innerHTML.toLowerCase().indexOf(v.toLowerCase())>-1?'':'none';}}}

        function checkNotifs(){const r=currentUser.role=='admin'?'admin':currentUser.role; db.collection('notifs').where('target','in',['all',r]).onSnapshot(s=>{let c=0;s.forEach(d=>{if(!localStorage.getItem('rn_'+d.id))c++});const b=document.getElementById('notif-badge');b.innerText=c;b.style.display=c>0?'block':'none';});}
        function showNotifs(){const r=currentUser.role=='admin'?'admin':currentUser.role; db.collection('notifs').where('target','in',['all',r]).get().then(s=>{let h="";s.forEach(d=>{localStorage.setItem('rn_'+d.id,'1');h+=`<div style="padding:10px;border-bottom:1px solid #eee">${lang=='ar'?d.data().ar:d.data().fr}</div>`});document.getElementById('inf-t').innerText=t('report');document.getElementById('inf-c').innerHTML=h||"Empty";document.getElementById('mod-info').style.display='flex';document.getElementById('notif-badge').style.display='none';});}
        async function loadBans(eid,r){db.collection('banners').where('target','in',['all',r]).onSnapshot(s=>{const e=document.getElementById(eid);e.innerHTML="";s.forEach((d,i)=>e.innerHTML+=`<img src="${d.data().img}" style="width:100%;height:100%;object-fit:cover;display:${i==0?'block':'none'}" onclick="window.open('${d.data().link||'#'}')">`);if(s.size>1){let x=0;setInterval(()=>{const m=e.querySelectorAll('img');m.forEach(z=>z.style.display='none');x=(x+1)%m.length;m[x].style.display='block';},4000);}});}
        function openProfile(){document.getElementById('ped-name').value=currentUser.name;document.getElementById('mod-profile').style.display='flex';}
        async function saveProf(){const n=document.getElementById('ped-name').value,p=document.getElementById('ped-pass').value,f=document.getElementById('ped-img').files[0];let u={name:n};if(p)u.pass=p;if(f)u.img=await toBase64(f);await db.collection('users').doc(currentUser.id).update(u);currentUser={...currentUser,...u};closeMod('mod-profile');sAlert('success','succ_title','saved_msg');location.reload();}
        function openReportModal(){document.getElementById('mod-report').style.display='flex';}
        async function subRep(){const n=document.getElementById('rp-name').value,e=document.getElementById('rp-mail').value,d=document.getElementById('rp-desc').value;if(!d)return;await db.collection('reports').add({name:n,email:e,desc:d});closeMod('mod-report');sAlert('success','succ_title','sent_msg');}
        function openStatic(k){document.getElementById('inf-t').innerText=t(k);document.getElementById('inf-c').innerText=t(k+'_text');document.getElementById('mod-info').style.display='flex';}
        function openLoc(){document.getElementById('inf-t').innerText=t('location');document.getElementById('inf-c').innerHTML=`<p>Rouiba city dl lycée</p><p>رويبة حي الثانوية</p><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.433!2d3.283!3d36.737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ0JzE0LjAiTiAzwrAxNycwMC.0IkU!5e0!3m2!1sen!2sdz!4v1600000000000!5m2!1sen!2sdz" width="100%" height="250" style="border:0; margin-top:10px"></iframe><br><a href="https://maps.app.goo.gl/gkPqMuz4VGgTsrSs9" target="_blank" style="color:blue">Google Maps</a>`;document.getElementById('mod-info').style.display='flex';}
        function openRate(pid,aid){rateM={pid,aid};document.getElementById('mod-rate').style.display='flex';rate(0);}
        function rate(n){document.getElementById('rate-v').value=n;document.querySelectorAll('#star-box i').forEach((s,i)=>s.className=i<n?'fas fa-star active':'fas fa-star');}
        async function subRate(){const v=parseInt(document.getElementById('rate-v').value),c=document.getElementById('rate-c').value;if(!v)return;await db.collection('reviews').add({pid:rateM.pid,stars:v,comment:c,u:currentUser.name});const r=db.collection('users').doc(rateM.pid);await db.runTransaction(async t=>{const d=await t.get(r);const dd=d.data();t.update(r,{rc:(dd.rc||0)+1,rs:(dd.rs||0)+v})});await db.collection('apps').doc(rateM.aid).update({rated:true});closeMod('mod-rate');sAlert('success','succ_title','saved_msg');}
        function viewRev(pid){db.collection('reviews').where('pid','==',pid).get().then(s=>{let h="";s.forEach(d=>{const x=d.data();h+=`<div style="padding:10px;border-bottom:1px solid #eee;text-align:${lang=='ar'?'right':'left'}"><b>${x.u}</b> ${'⭐'.repeat(x.stars)}<br>${x.comment}</div>`});document.getElementById('inf-t').innerText=t('reviews');document.getElementById('inf-c').innerHTML=h||"No reviews";document.getElementById('mod-info').style.display='flex';});}
        function closeMod(i){document.getElementById(i).style.display='none';}
    </script>
</body>
</html>
