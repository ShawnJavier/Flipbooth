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

       const submitButton = document.querySelector(".btn-submit");
        submitButton.disabled = true;
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

    /* reveal fallback */
  (function () {
    var els = document.querySelectorAll('.rev');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('vis'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  })();


  const suburbInput = document.getElementById("suburb");
const suggestionsBox = document.getElementById("suburbOptions");

let suburbs = [];


/* Load South Australian suburb/postcode data */

fetch("https://raw.githubusercontent.com/schappim/australian-postcodes/master/data/by-state/SA.csv")
    .then(response => response.text())
    .then(csv => {

        const rows = parseCSV(csv);

        rows.slice(1).forEach(row => {

            const postcode = row[0]?.trim();
            const suburb = row[1]?.trim();
            const state = row[2]?.trim();
            const category = row[5]?.trim();

            if (
                state === "SA" &&
                category === "Delivery Area" &&
                postcode &&
                suburb
            ) {

                suburbs.push({
                    suburb: formatSuburb(suburb),
                    postcode: postcode
                });

            }

        });

        /* Sort alphabetically */

        suburbs.sort((a, b) =>
            a.suburb.localeCompare(b.suburb)
        );

    })
    .catch(error => {
        console.error("Unable to load suburb data:", error);
    });



/* Format suburb names */

function formatSuburb(name) {

    return name
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());

}



/* Simple CSV parser */

function parseCSV(text) {

    const rows = [];

    let row = [];
    let value = "";
    let quotes = false;

    for (let i = 0; i < text.length; i++) {

        const char = text[i];
        const next = text[i + 1];

        if (char === '"' && quotes && next === '"') {

            value += '"';
            i++;

        }

        else if (char === '"') {

            quotes = !quotes;

        }

        else if (char === "," && !quotes) {

            row.push(value);
            value = "";

        }

        else if (
            (char === "\n" || char === "\r") &&
            !quotes
        ) {

            if (char === "\r" && next === "\n") {
                i++;
            }

            row.push(value);

            if (row.length > 1) {
                rows.push(row);
            }

            row = [];
            value = "";

        }

        else {

            value += char;

        }

    }

    if (value || row.length) {

        row.push(value);

        if (row.length > 1) {
            rows.push(row);
        }

    }

    return rows;

}



/* Search suburbs */

suburbInput.addEventListener("input", function() {

    const search = this.value
        .toLowerCase()
        .trim();

    suggestionsBox.innerHTML = "";

    if (!search) {

        suggestionsBox.style.display = "none";
        return;

    }


    const matches = suburbs
        .filter(item =>
            `${item.suburb} ${item.postcode}`
                .toLowerCase()
                .includes(search)
        )
        .slice(0, 10);


    if (!matches.length) {

        suggestionsBox.style.display = "none";
        return;

    }


    matches.forEach(item => {

        const option =
            document.createElement("div");

        option.className = "suburb-option";

        option.innerHTML =
            `<strong>${item.suburb}</strong>
             <span>— ${item.postcode}</span>`;


        option.addEventListener("click", function() {

            suburbInput.value =
                `${item.suburb} — ${item.postcode}`;

            suggestionsBox.style.display = "none";

        });


        suggestionsBox.appendChild(option);

    });


    suggestionsBox.style.display = "block";

});



/* Close suggestions when clicking elsewhere */

document.addEventListener("click", function(event) {

    if (!event.target.closest("#form-group")) {

        suggestionsBox.style.display = "none";

    }

});
// feedback carousel
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector(".testi-grid");
  const prev = document.querySelector(".testi-prev");
  const next = document.querySelector(".testi-next");

  if (!grid || !prev || !next) return;

  function scrollAmount() {
    const card = grid.querySelector(".tcard");

    if (!card) return 0;

    const gap = parseFloat(getComputedStyle(grid).gap) || 0;

    return card.offsetWidth + gap;
  }

  next.addEventListener("click", function () {
    grid.scrollBy({
      left: scrollAmount(),
      behavior: "smooth"
    });
  });

  prev.addEventListener("click", function () {
    grid.scrollBy({
      left: -scrollAmount(),
      behavior: "smooth"
    });
  });
});