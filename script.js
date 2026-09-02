/* =========================================
   CONFLUENCE '26 — script.js
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. MOBILE NAVIGATION
     ========================================= */

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Close mobile menu after clicking a link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.textContent = "☰";
      navToggle.setAttribute("aria-expanded", "false");
    });
  });


  /* =========================================
     2. COUNTDOWN TIMER
     ========================================= */

  // Festival starts March 12, 2027 at 9:00 AM.
  // Change this date if your actual fest date is different.
  const festivalDate = new Date("March 12, 2027 09:00:00").getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  function updateCountdown() {
    const now = Date.now();
    const distance = festivalDate - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
      (distance / (1000 * 60)) % 60
    );
    const seconds = Math.floor(
      (distance / 1000) % 60
    );

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* =========================================
     3. SCROLL REVEAL ANIMATION
     ========================================= */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");

          // Stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  /* =========================================
     4. ANIMATED STAT COUNTERS
     ========================================= */

  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(element) {
    const target = Number(element.dataset.count);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";

    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        easedProgress * target
      );

      element.textContent =
        prefix + currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent =
          prefix + target + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });


  /* =========================================
     5. EVENT FILTER
     ========================================= */

  const filterButtons =
    document.querySelectorAll(".filter-btn");

  const eventCards =
    document.querySelectorAll(".event-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      // Remove active state
      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const selectedFilter =
        button.dataset.filter;

      eventCards.forEach(card => {
        const category =
          card.dataset.category;

        if (
          selectedFilter === "all" ||
          category === selectedFilter
        ) {
          card.classList.remove("hidden");

          // Re-trigger animation
          card.style.animation = "none";
          card.offsetHeight;
          card.style.animation =
            "fadeUp 0.5s ease both";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });


  /* =========================================
     6. SCHEDULE DATA
     ========================================= */

  const schedule = {
    1: [
      {
        time: "09:00 AM",
        event: "Opening Ceremony",
        location: "Main Auditorium"
      },
      {
        time: "11:00 AM",
        event: "HackNight Begins",
        location: "Innovation Lab"
      },
      {
        time: "02:00 PM",
        event: "Bot Arena Qualifiers",
        location: "Sports Complex"
      },
      {
        time: "06:00 PM",
        event: "Campus Music Jam",
        location: "Main Stage"
      }
    ],

    2: [
      {
        time: "10:00 AM",
        event: "Tech Talks",
        location: "Seminar Hall"
      },
      {
        time: "01:00 PM",
        event: "Open Mic Circuit",
        location: "Amphitheatre"
      },
      {
        time: "03:00 PM",
        event: "Bot Arena Finals",
        location: "Sports Complex"
      },
      {
        time: "07:00 PM",
        event: "Battle of Bands",
        location: "Main Stage"
      }
    ],

    3: [
      {
        time: "10:00 AM",
        event: "Startup Pitch",
        location: "Innovation Lab"
      },
      {
        time: "01:00 PM",
        event: "Rhythm Wars",
        location: "Main Stage"
      },
      {
        time: "04:00 PM",
        event: "Prize Distribution",
        location: "Main Auditorium"
      },
      {
        time: "07:00 PM",
        event: "Closing Ceremony",
        location: "Main Stage"
      }
    ]
  };


  /* =========================================
     7. RENDER SCHEDULE
     ========================================= */

  const dayTabs =
    document.querySelectorAll(".day-btn");

  const dayList =
    document.getElementById("dayList");

  function renderSchedule(day) {
    dayList.innerHTML = "";

    schedule[day].forEach(item => {

      const li = document.createElement("li");

      const time = document.createElement("time");
      time.textContent = item.time;

      const content = document.createElement("div");

      const title = document.createElement("strong");
      title.textContent = item.event;

      const location = document.createElement("span");
      location.textContent = ` · ${item.location}`;
      location.style.color = "var(--ink-dim)";
      location.style.fontSize = "0.85rem";

      content.appendChild(title);
      content.appendChild(location);

      li.appendChild(time);
      li.appendChild(content);

      dayList.appendChild(li);
    });
  }

  // Initial schedule
  renderSchedule(1);

  dayTabs.forEach(button => {
    button.addEventListener("click", () => {

      dayTabs.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const selectedDay = button.dataset.day;

      renderSchedule(selectedDay);
    });
  });


  /* =========================================
     8. REGISTRATION FORM VALIDATION
     ========================================= */

  const form =
    document.getElementById("regForm");

  const nameInput =
    document.getElementById("name");

  const emailInput =
    document.getElementById("email");

  const deptInput =
    document.getElementById("dept");

  const formStatus =
    document.getElementById("formStatus");


  function showError(id, message) {
    document.getElementById(id).textContent =
      message;
  }


  function clearErrors() {
    document.getElementById("err-name").textContent = "";
    document.getElementById("err-email").textContent = "";
    document.getElementById("err-dept").textContent = "";
    formStatus.textContent = "";
  }


  form.addEventListener("submit", event => {

    event.preventDefault();

    clearErrors();

    let valid = true;

    const name =
      nameInput.value.trim();

    const email =
      emailInput.value.trim();

    const department =
      deptInput.value.trim();


    // Name validation
    if (name.length < 2) {
      showError(
        "err-name",
        "Please enter your full name."
      );

      valid = false;
    }


    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showError(
        "err-email",
        "Please enter a valid college email."
      );

      valid = false;
    }


    // Department validation
    if (department.length < 2) {
      showError(
        "err-dept",
        "Please enter your department."
      );

      valid = false;
    }


    if (!valid) {
      return;
    }


    /* Successful registration */

    const selectedTrack =
      document.getElementById("track").value;

    formStatus.textContent =
      `Registration confirmed for ${name}! Track: ${selectedTrack}.`;

    formStatus.style.color =
      "var(--accent)";

    // Reset form after successful submission
    form.reset();
  });


  /* =========================================
     9. INPUT INTERACTION
     ========================================= */

  const inputs =
    document.querySelectorAll(
      ".field input, .field select"
    );

  inputs.forEach(input => {

    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      input.parentElement.classList.remove("focused");
    });

  });


  /* =========================================
     10. NAVBAR SCROLL EFFECT
     ========================================= */

  const nav =
    document.getElementById("nav");

  window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

  });


  /* =========================================
     11. ACTIVE NAV LINK
     ========================================= */

  const sections =
    document.querySelectorAll("section[id]");

  const navigationLinks =
    document.querySelectorAll(".nav-links a");

  const sectionObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            navigationLinks.forEach(link => {
              link.classList.remove("current");
            });

            const activeLink =
              document.querySelector(
                `.nav-links a[href="#${entry.target.id}"]`
              );

            if (activeLink) {
              activeLink.classList.add("current");
            }
          }

        });

      },
      {
        threshold: 0.35
      }
    );

  sections.forEach(section => {
    sectionObserver.observe(section);
  });


  /* =========================================
     12. ESC KEY CLOSES MOBILE MENU
     ========================================= */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      navLinks.classList.remove("open");
      navToggle.textContent = "☰";
      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

});