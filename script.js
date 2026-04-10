   (function() {
       emailjs.init("dFQ4eGmHjb9F6GYPJ");
   })();

   /* nav scroll */
   window.addEventListener('scroll', () => {
       document.getElementById('nav').classList.toggle('scrolled', scrollY > 40);
   }, {
       passive: true
   });

   /* hamburger */
   const ham = document.getElementById('ham'),
       mob = document.getElementById('mob');
   ham.addEventListener('click', () => {
       ham.classList.toggle('open');
       mob.classList.toggle('open');
       document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
   });
   document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => {
       ham.classList.remove('open');
       mob.classList.remove('open');
       document.body.style.overflow = '';
   }));

   /* reveal */
   const io = new IntersectionObserver(es => es.forEach(e => {
       if (e.isIntersecting) e.target.classList.add('vis');
   }), {
       threshold: .1
   });
   document.querySelectorAll('.rev').forEach(el => io.observe(el));



   // validation + shake
   document.getElementById("cform").addEventListener("submit", function(e) {
       e.preventDefault();

       const form = this;
       document.body.classList.add("show-errors");

       let valid = true;

       // reset old errors
       document.querySelectorAll(".fg").forEach(fg => {
           fg.classList.remove("error");
       });

       // check each field manually
       form.querySelectorAll("input, select, textarea").forEach(el => {
           if (!el.checkValidity()) {
               valid = false;
               el.closest(".fg").classList.add("error");
           }
       });

       // shake if invalid
       if (!valid) {
           form.classList.remove("shake");
           void form.offsetWidth;
           form.classList.add("shake");
           return;
       }

       // EMAILJS (unchanged)
       emailjs.sendForm(
           "service_hswhai5",
           "template_thwvyh7",
           form
       ).then(function() {

           return emailjs.sendForm(
               "service_hswhai5",
               "template_w33suou",
               form
           );

       }).then(function() {

           document.querySelector(".btn-submit").style.display = "none";
           document.getElementById("fsuc").style.display = "block";

       }).catch(function(error) {
           console.error(error);
           alert("Something went wrong. Try again.");
       });

     });