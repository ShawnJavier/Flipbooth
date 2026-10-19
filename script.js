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
   
const SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyna6ewiDjXiGTGH2kBTSd-F0v2GlVCdlEFIkOdXUktHK4lxAiMNz-zVh6KcBznMp5lNA/exec";

document.getElementById("cform").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = this;
    const submitButton = form.querySelector(".btn-submit");
    const successMessage = document.getElementById("fsuc");

    document.body.classList.add("show-errors");

    let valid = true;

    document.querySelectorAll(".fg").forEach(fg => {
        fg.classList.remove("error");
    });

    form.querySelectorAll("input, select, textarea").forEach(el => {
        if (!el.checkValidity()) {
            valid = false;
            const group = el.closest(".fg");
            if (group) group.classList.add("error");
        }
    });

    if (!valid) {
        form.classList.remove("shake");
        void form.offsetWidth;
        form.classList.add("shake");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    // Format the event date for your existing EmailJS templates.
    const dateValue = document.getElementById("ed").value;
    const formattedDateInput =
        document.getElementById("formattedEventDate");

    if (dateValue && formattedDateInput) {
        const parts = dateValue.split("-");
        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        formattedDateInput.value = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        }).replace(",", "");
    }

    // Send the inquiry to Google Sheets.
    const sheetPromise = fetch(SHEETS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            first_name: document.getElementById("fn").value,
            last_name: document.getElementById("ln").value,
            email: document.getElementById("em").value,
            event_type: document.getElementById("et").value,
            event_date: dateValue,
            event_time: document.getElementById("eventTime").value,
            suburb: document.getElementById("suburb").value,
            package: document.getElementById("pk").value,
            message: document.getElementById("ms").value
        })
    }).catch(error => {
        console.error("Google Sheets request failed:", error);
    });

    try {
        // Keep your first existing email.
        await emailjs.sendForm(
            "service_hswhai5",
            "template_thwvyh7",
            form
        );

        // Keep your second existing email.
        await emailjs.sendForm(
            "service_hswhai5",
            "template_w33suou",
            form
        );

        await sheetPromise;

        submitButton.style.display = "none";
        successMessage.style.display = "block";

    } catch (error) {
        console.error("EmailJS error:", error);

        submitButton.disabled = false;
        submitButton.textContent = "Send Enquiry →";

        alert("Something went wrong sending your enquiry. Please try again.");
    }
});


     /* Format event date for EmailJS */
document.getElementById("cform").addEventListener("submit", function() {
    const dateInput = document.getElementById("ed");
    const formattedDateInput = document.getElementById("formattedEventDate");

    if (dateInput.value && formattedDateInput) {
        const parts = dateInput.value.split("-");
        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        formattedDateInput.value =
            date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            }).replace(",", "");
    }
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

