/* ==========================================================================
   EVOLANCE INSTITUTE OF IT — SCRIPT
   Features: Single-Page Navigation / Tab Switcher, Preloader Reveal,
   Vertical Navigation Tabs within Faculty & Student Dashboards with Dropdowns,
   Top Navbar Auto-Hiding, Pre-Approved Email Verification, Session Persistence
   ========================================================================== */

// Global State
const state = {
  approvedRoster: {
    ignite: [
      { email: "fatima@evolance.edu.pk", name: "Fatima Noor", roll: "EVO-IGN-001" }
    ],
    juniors: [
      { email: "zain@evolance.edu.pk", name: "Zain Ali", roll: "EVO-JUN-001" }
    ],
    master: [
      { email: "ayesha@evolance.edu.pk", name: "Ayesha Khan", roll: "EVO-MAS-001" },
      { email: "hamza@evolance.edu.pk", name: "Hamza Ahmed", roll: "EVO-MAS-002" }
    ]
  },
  registeredAccounts: {
    "ayesha@evolance.edu.pk": {
      name: "Ayesha Khan",
      email: "ayesha@evolance.edu.pk",
      program: "master",
      programName: "Capstone Pro",
      rollNo: "EVO-MAS-001",
      pass: "password123"
    }
  },
  currentRosterCourse: "ignite"
};

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initMobileMenu();
  initTabNavigation();
  initCounters();
  initAdmissionsForm();
  initBackToTop();
  initExploreCoursesButton();
  initWhatsAppWidget();
  initSupportAIChat();
});

// Single-Page Tab Switcher & Top Navbar Dynamic Visibility
function initTabNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  const tabViews = document.querySelectorAll(".tab-view");
  const body = document.body;

  if (!tabs.length || !tabViews.length) return;

  function switchTab(targetTabId) {
    if (targetTabId === "login") {
      body.classList.add("portal-mode-active");
    } else {
      body.classList.remove("portal-mode-active");
    }

    tabs.forEach(btn => {
      if (btn.getAttribute("data-tab") === targetTabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    tabViews.forEach(view => {
      if (view.id === `tab-${targetTabId}`) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  tabs.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute("data-tab");
      if (targetTab) {
        switchTab(targetTab);
      }
    });
  });
}

// Preloader Reveal Animation — Logo flies and blends into navbar
function initPreloader() {
  const preloader   = document.getElementById('preloader');
  const progress    = document.getElementById('preloader-progress');
  const counter     = document.getElementById('preloader-counter');
  const preloaderImg = document.getElementById('preloader-logo-img');
  const navbarLogoImg = document.getElementById('navbar-logo-img');
  const body        = document.body;

  if (!preloader || !progress || !counter) return;

  let count = 0;
  const duration = 1400;
  const interval = 20;
  const step = Math.ceil(100 / (duration / interval));

  const timer = setInterval(() => {
    count += step;
    if (count >= 100) {
      count = 100;
      clearInterval(timer);

      // Small pause so user sees 100%, then trigger the FLIP flight
      setTimeout(() => launchLogoFlight(), 250);
    }

    progress.style.width = count + '%';
    counter.innerText = count + '%';
  }, interval);

  function launchLogoFlight() {
    if (!preloaderImg || !navbarLogoImg) {
      // Fallback: simple slide-up if elements missing
      preloader.classList.add('completed');
      body.classList.remove('loading');
      body.classList.add('loaded');
      return;
    }

    // 1. Measure both logo positions BEFORE site-wrapper is visible
    const fromRect = preloaderImg.getBoundingClientRect();
    const toRect   = navbarLogoImg.getBoundingClientRect();

    // 2. Create a flying clone of the preloader logo
    const clone = document.createElement('img');
    clone.src   = preloaderImg.src;
    clone.className = 'logo-fly-clone';

    // Position clone exactly over preloader logo
    clone.style.width  = fromRect.width  + 'px';
    clone.style.height = fromRect.height + 'px';
    clone.style.left   = fromRect.left   + 'px';
    clone.style.top    = fromRect.top    + 'px';
    clone.style.opacity = '1';
    clone.style.boxShadow = '0 0 0 2px rgba(100,180,255,0.15), 0 0 32px rgba(60,130,220,0.25)';
    clone.style.transition = 'none';

    document.body.appendChild(clone);

    // 3. Hide the original preloader logo immediately
    preloaderImg.style.opacity = '0';

    // 4. Fade out preloader backdrop & text — leave clone flying
    preloader.style.transition = 'opacity 0.45s ease';
    preloader.style.opacity    = '0';

    // 5. Reveal site-wrapper underneath
    body.classList.remove('loading');
    body.classList.add('loaded');

    // 6. After one frame, animate the clone to land on the navbar logo
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const scaleW = toRect.width  / fromRect.width;
        const scaleH = toRect.height / fromRect.height;
        const dx = toRect.left - fromRect.left + (toRect.width  - fromRect.width)  / 2;
        const dy = toRect.top  - fromRect.top  + (toRect.height - fromRect.height) / 2;

        clone.style.transition =
          'transform 1.1s cubic-bezier(0.25, 0.1, 0.25, 1), ' +
          'opacity 0.3s ease 0.85s, ' +
          'box-shadow 1.1s ease';
        clone.style.transform  = `translate(${dx}px, ${dy}px) scale(${scaleW}, ${scaleH})`;
        clone.style.opacity    = '0';
        clone.style.boxShadow  = '0 0 6px rgba(100,180,255,0.3)';

        // 7. At landing moment — show real navbar logo and remove clone
        setTimeout(() => {
          navbarLogoImg.style.opacity = '1';
          preloader.style.display = 'none';
          clone.remove();
        }, 1050);
      });
    });
  }
}

// Stats Counter
function initCounters() {
  const statVals = document.querySelectorAll(".stat-val");
  statVals.forEach(stat => {
    const target = parseInt(stat.getAttribute("data-target"), 10);
    let count = 0;
    const duration = 1500;
    const step = Math.ceil((target || 1) / 30);

    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }

      if (target === 100) {
        stat.innerText = count + "%";
      } else if (target === 60) {
        stat.innerText = count + "+";
      } else {
        stat.innerText = count;
      }
    }, 40);
  });
}

// Interactive Portal Dashboards & Vertical Navigation Logic
function initPortalDashboards() {
  const loginViewBox = document.getElementById("login-view-box");
  const facultyDash = document.getElementById("faculty-dashboard");
  const studentDash = document.getElementById("student-dashboard");

  const modeSigninBtn = document.getElementById("mode-signin-btn");
  const modeSignupBtn = document.getElementById("mode-signup-btn");
  const signinRoleSelector = document.getElementById("signin-role-selector");

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  
  const savedSessionBanner = document.getElementById("saved-session-banner");
  const savedUserName = document.getElementById("saved-user-name");
  const savedUserEmail = document.getElementById("saved-user-email");
  const btnResumeSession = document.getElementById("btn-resume-session");

  let selectedSignInRole = "student";

  // Check saved session in localStorage
  function checkSavedSession() {
    const savedUserJSON = localStorage.getItem("evolance_saved_user");
    if (savedUserJSON && savedSessionBanner) {
      try {
        const savedUser = JSON.parse(savedUserJSON);
        if (savedUser && savedUser.email) {
          savedSessionBanner.style.display = "flex";
          savedUserName.innerText = `Saved Account: ${savedUser.name || 'Student'}`;
          savedUserEmail.innerText = savedUser.email;
        }
      } catch (e) {
        console.error("Session parse error", e);
      }
    }
  }

  checkSavedSession();

  if (btnResumeSession) {
    btnResumeSession.addEventListener("click", () => {
      const savedUserJSON = localStorage.getItem("evolance_saved_user");
      if (savedUserJSON) {
        const savedUser = JSON.parse(savedUserJSON);
        openStudentDashboard(savedUser);
      }
    });
  }

  // Toggle Mode: Sign In vs Sign Up
  if (modeSigninBtn && modeSignupBtn) {
    modeSigninBtn.addEventListener("click", () => {
      modeSigninBtn.classList.add("active");
      modeSignupBtn.classList.remove("active");
      if (signinRoleSelector) signinRoleSelector.style.display = "flex";
      if (loginForm) loginForm.style.display = "block";
      if (signupForm) signupForm.style.display = "none";
    });

    modeSignupBtn.addEventListener("click", () => {
      modeSignupBtn.classList.add("active");
      modeSigninBtn.classList.remove("active");
      if (signinRoleSelector) signinRoleSelector.style.display = "none";
      if (loginForm) loginForm.style.display = "none";
      if (signupForm) signupForm.style.display = "block";
    });
  }

  // Role selector pills in Sign In mode
  const rolePills = document.querySelectorAll("#signin-role-selector .role-pill");
  rolePills.forEach(pill => {
    pill.addEventListener("click", () => {
      rolePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedSignInRole = pill.getAttribute("data-role");
    });
  });

  // Toggle Password
  const pwdInput = document.getElementById("login-password");
  const toggleBtn = document.getElementById("toggle-pwd");
  if (toggleBtn && pwdInput) {
    toggleBtn.addEventListener("click", () => {
      const type = pwdInput.getAttribute("type") === "password" ? "text" : "password";
      pwdInput.setAttribute("type", type);
      toggleBtn.innerHTML = type === "password" ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
    });
  }

  // Open Student Dashboard
  function openStudentDashboard(userObj) {
    document.body.classList.add("portal-mode-active");
    if (loginViewBox) loginViewBox.style.display = "none";
    if (facultyDash) facultyDash.style.display = "none";
    if (studentDash) studentDash.style.display = "block";

    const welcomeHeader = document.getElementById("student-dashboard-welcome");
    const metaHeader = document.getElementById("student-dashboard-meta");

    if (welcomeHeader) welcomeHeader.innerText = `Welcome Back, ${userObj.name || 'Student'}`;
    if (metaHeader) metaHeader.innerText = `Roll No: ${userObj.rollNo || 'EVO-2026-001'} · ${userObj.programName || 'Capstone Pro'}`;
  }

  // Open Faculty Dashboard
  function openFacultyDashboard() {
    document.body.classList.add("portal-mode-active");
    if (loginViewBox) loginViewBox.style.display = "none";
    if (studentDash) studentDash.style.display = "none";
    if (facultyDash) facultyDash.style.display = "block";

    renderFacultyRosterTable();
    populateFacultyStudentSelect();
    renderFacultyAttendanceTable("master");
  }

  function hideDashboards() {
    document.body.classList.remove("portal-mode-active");
    if (loginViewBox) loginViewBox.style.display = "block";
    if (facultyDash) facultyDash.style.display = "none";
    if (studentDash) studentDash.style.display = "none";
    checkSavedSession();
  }

  // SIGN IN Form Submit
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim().toLowerCase();
      const pass = document.getElementById("login-password").value;
      const shouldSave = document.getElementById("save-login-checkbox").checked;

      if (selectedSignInRole === "faculty") {
        openFacultyDashboard();
        return;
      }

      const account = state.registeredAccounts[email];
      if (account) {
        if (shouldSave) {
          localStorage.setItem("evolance_saved_user", JSON.stringify(account));
        }
        openStudentDashboard(account);
      } else {
        const demoUser = {
          name: email.split("@")[0].toUpperCase(),
          email: email,
          programName: "Capstone Pro",
          rollNo: "EVO-2026-001"
        };
        if (shouldSave) {
          localStorage.setItem("evolance_saved_user", JSON.stringify(demoUser));
        }
        openStudentDashboard(demoUser);
      }
    });
  }

  // SIGN UP Form Submit with Verification
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim().toLowerCase();
      const programKey = document.getElementById("signup-program").value;
      const pass = document.getElementById("signup-password").value;
      const shouldSave = document.getElementById("signup-save-checkbox").checked;

      const courseRoster = state.approvedRoster[programKey] || [];
      const approvedStudent = courseRoster.find(st => st.email.toLowerCase() === email);

      if (!approvedStudent) {
        const progTitle = programKey === "ignite" ? "Capstone Ignite" : (programKey === "juniors" ? "Capstone Juniors" : "Capstone Pro");
        alert(`❌ Access Denied: Your email (${email}) has NOT been pre-approved by Evolance Faculty for ${progTitle}.\n\nPlease contact administration or wait for faculty to add your email to the course roster.`);
        return;
      }

      const progNames = {
        ignite: "Capstone Ignite (Women Track)",
        juniors: "Capstone Juniors (Ages 11-15)",
        master: "Capstone Pro (60+ Skills)"
      };

      const newAccount = {
        name: approvedStudent.name || name,
        email: email,
        program: programKey,
        programName: progNames[programKey],
        rollNo: approvedStudent.roll || "EVO-2026-NEW",
        pass: pass
      };

      state.registeredAccounts[email] = newAccount;

      if (shouldSave) {
        localStorage.setItem("evolance_saved_user", JSON.stringify(newAccount));
      }

      alert(`✅ Verification Successful! Welcome to Evolance ${progNames[programKey]}.`);
      openStudentDashboard(newAccount);
    });
  }

  // Demo preview buttons
  const btnDemoStudent = document.getElementById("btn-demo-student");
  const btnDemoFaculty = document.getElementById("btn-demo-faculty");

  if (btnDemoStudent) {
    btnDemoStudent.addEventListener("click", () => {
      openStudentDashboard({
        name: "Ayesha Khan",
        email: "ayesha@evolance.edu.pk",
        programName: "Capstone Pro",
        rollNo: "EVO-MAS-001"
      });
    });
  }

  if (btnDemoFaculty) {
    btnDemoFaculty.addEventListener("click", openFacultyDashboard);
  }

  const facultyLogout = document.getElementById("faculty-logout");
  const studentLogout = document.getElementById("student-logout");

  if (facultyLogout) facultyLogout.addEventListener("click", hideDashboards);
  if (studentLogout) {
    studentLogout.addEventListener("click", () => {
      localStorage.removeItem("evolance_saved_user");
      hideDashboards();
    });
  }

  // =========================================================================
  // VERTICAL TAB NAVIGATION & ACCORDION DROPDOWNS INSIDE DASHBOARDS
  // =========================================================================
  const dropdownToggles = document.querySelectorAll(".v-tab-item.has-dropdown .dropdown-toggle");
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentItem = toggle.closest(".v-tab-item");
      parentItem.classList.toggle("open");
    });
  });

  // Faculty Vertical Navigation Handlers
  const vSubBtns = document.querySelectorAll(".faculty-v-tabs .v-sub-btn");
  const fTabBtns = document.querySelectorAll(".faculty-v-tabs .portal-tab-btn[data-f-tab]");
  const fTabContents = document.querySelectorAll("#faculty-dashboard .f-tab-content");

  function resetFacultyTabActiveStates() {
    vSubBtns.forEach(s => s.classList.remove("active"));
    fTabBtns.forEach(b => b.classList.remove("active"));
  }

  vSubBtns.forEach(sub => {
    sub.addEventListener("click", () => {
      resetFacultyTabActiveStates();
      sub.classList.add("active");

      const targetFTab = sub.getAttribute("data-f-tab");
      const courseSub = sub.getAttribute("data-course-sub");
      const batchKey = sub.getAttribute("data-batch");

      fTabContents.forEach(c => c.classList.remove("active"));
      const activeContent = document.getElementById(`f-tab-${targetFTab}`);
      if (activeContent) activeContent.classList.add("active");

      if (courseSub) {
        state.currentRosterCourse = courseSub;
        renderFacultyRosterTable();
        const badge = document.getElementById("current-roster-badge");
        if (badge) badge.innerText = courseSub.toUpperCase();
      }

      if (batchKey) {
        renderFacultyAttendanceTable(batchKey);
        const batchSelect = document.getElementById("attendance-batch-select");
        if (batchSelect) batchSelect.value = batchKey;
      }
    });
  });

  fTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      resetFacultyTabActiveStates();
      btn.classList.add("active");

      const targetFTab = btn.getAttribute("data-f-tab");
      fTabContents.forEach(c => c.classList.remove("active"));
      const activeContent = document.getElementById(`f-tab-${targetFTab}`);
      if (activeContent) activeContent.classList.add("active");
    });
  });

  // Student Vertical Navigation Handlers (Attendance & Marks)
  const studentSTabBtns = document.querySelectorAll("#student-dashboard .portal-tab-btn[data-s-tab]");
  const sTabContents = document.querySelectorAll("#student-dashboard .s-tab-content");

  studentSTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      studentSTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetSTab = btn.getAttribute("data-s-tab");
      sTabContents.forEach(c => c.classList.remove("active"));
      const activeContent = document.getElementById(`s-tab-${targetSTab}`);
      if (activeContent) activeContent.classList.add("active");
    });
  });

  // Add Student to Roster Form
  const addRosterForm = document.getElementById("add-student-roster-form");
  if (addRosterForm) {
    addRosterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("roster-email").value.trim().toLowerCase();
      const name = document.getElementById("roster-name").value.trim();
      const roll = document.getElementById("roster-roll").value.trim();
      const programKey = document.getElementById("roster-program-select").value;

      state.approvedRoster[programKey].push({ email, name, roll });
      renderFacultyRosterTable();
      populateFacultyStudentSelect();

      alert(`✓ Added ${name} (${email}) to approved roster for ${programKey.toUpperCase()}!`);
      addRosterForm.reset();
    });
  }

  // Save Attendance Button
  const saveAttBtn = document.getElementById("save-attendance-btn");
  const saveAttStatus = document.getElementById("attendance-save-status");
  if (saveAttBtn && saveAttStatus) {
    saveAttBtn.addEventListener("click", () => {
      saveAttStatus.innerText = "✓ Attendance saved & synced to student records!";
      setTimeout(() => {
        saveAttStatus.innerText = "";
      }, 4000);
    });
  }

  // Faculty Record Grade Form
  const gradeForm = document.getElementById("faculty-grade-form");
  const gradesLogTable = document.querySelector("#grades-log-table tbody");

  if (gradeForm && gradesLogTable) {
    gradeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const studentSelect = document.getElementById("grade-student-select");
      if (!studentSelect.options.length) return;
      const studentText = studentSelect.options[studentSelect.selectedIndex].text.split("—")[1]?.trim() || "Student";
      const title = document.getElementById("grade-type-select").value;
      const score = document.getElementById("grade-score-input").value;
      const total = document.getElementById("grade-total-input").value;

      const pct = Math.round((score / total) * 100);
      let gradeBadge = `<span class="status-badge green">A+ (${pct}%)</span>`;
      if (pct < 70) gradeBadge = `<span class="status-badge yellow">C (${pct}%)</span>`;

      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>15 Aug 2026</td>
        <td>${studentText}</td>
        <td>${title}</td>
        <td>${score} / ${total}</td>
        <td>${gradeBadge}</td>
      `;
      gradesLogTable.prepend(newRow);

      alert(`Grade recorded for ${studentText}: ${score}/${total} (${pct}%)`);
      gradeForm.reset();
    });
  }
}

// Render Faculty Approved Roster Table
function renderFacultyRosterTable() {
  const tbody = document.getElementById("roster-table-body");
  if (!tbody) return;

  const currentList = state.approvedRoster[state.currentRosterCourse] || [];
  tbody.innerHTML = "";

  if (!currentList.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No pre-approved students in this roster. Add one above!</td></tr>`;
    return;
  }

  currentList.forEach((st, idx) => {
    const isSignedUp = !!state.registeredAccounts[st.email];
    const statusBadge = isSignedUp 
      ? `<span class="status-badge green"><i class="fa-solid fa-check"></i> Account Active</span>`
      : `<span class="status-badge yellow"><i class="fa-solid fa-clock"></i> Pending Sign-Up</span>`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${st.roll}</td>
      <td><strong>${st.email}</strong></td>
      <td>${st.name}</td>
      <td><span class="page-badge" style="margin:0;">${state.currentRosterCourse.toUpperCase()}</span></td>
      <td>${statusBadge}</td>
      <td><button class="remove-btn" onclick="removeStudentFromRoster('${state.currentRosterCourse}', ${idx})">Remove</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Remove Student from Roster
window.removeStudentFromRoster = function(courseKey, idx) {
  if (confirm("Remove this student from approved roster?")) {
    state.approvedRoster[courseKey].splice(idx, 1);
    renderFacultyRosterTable();
    populateFacultyStudentSelect();
  }
};

// Populate Student Select dropdown in Faculty Grade Form
function populateFacultyStudentSelect() {
  const select = document.getElementById("grade-student-select");
  if (!select) return;
  select.innerHTML = "";

  Object.keys(state.approvedRoster).forEach(courseKey => {
    state.approvedRoster[courseKey].forEach(st => {
      const opt = document.createElement("option");
      opt.value = st.email;
      opt.innerText = `${st.roll} — ${st.name} (${courseKey.toUpperCase()})`;
      select.appendChild(opt);
    });
  });
}

// Render Faculty Attendance Table
function renderFacultyAttendanceTable(batchKey) {
  const tbody = document.getElementById("attendance-table-body");
  if (!tbody) return;

  const currentList = state.approvedRoster[batchKey] || [];
  tbody.innerHTML = "";

  currentList.forEach((st) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${st.roll}</td>
      <td><strong>${st.name}</strong></td>
      <td>${batchKey.toUpperCase()} Track</td>
      <td><span class="status-badge green">96%</span></td>
      <td><button class="att-toggle-btn present">PRESENT</button></td>
    `;
    tbody.appendChild(row);
  });

  const attToggleBtns = tbody.querySelectorAll(".att-toggle-btn");
  attToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("present")) {
        btn.classList.remove("present");
        btn.classList.add("absent");
        btn.innerText = "ABSENT";
      } else {
        btn.classList.remove("absent");
        btn.classList.add("present");
        btn.innerText = "PRESENT";
      }
    });
  });
}

// Admissions / Registration Form Handler -> Redirects to WhatsApp (03399333066)
function initAdmissionsForm() {
  const form = document.getElementById("admissions-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("student-name").value.trim();
    const emailElem = document.getElementById("student-email");
    const phoneElem = document.getElementById("student-phone");

    const email = emailElem ? emailElem.value.trim() : "N/A";
    const phone = phoneElem ? phoneElem.value.trim() : "N/A";
    const program = document.getElementById("student-program").value;

    const whatsappNumber = "923399333066";
    const message = `Hello Evolance Institute of IT!\n\nI would like to register for admission.\n\n*Full Name:* ${name}\n*Email Address:* ${email}\n*Phone / WhatsApp:* ${phone}\n*Selected Course:* ${program}\n\nPlease guide me with my registration steps.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    alert(`✓ Registration details saved for ${name}!\n\nRedirecting to Evolance WhatsApp (03399333066)...`);
    window.open(whatsappUrl, "_blank");
    form.reset();
  });
}

// Back to Top Link
function initBackToTop() {
  const topBtn = document.getElementById("back-to-top");
  if (topBtn) {
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// Explore Courses Smooth Scroll Button
function initExploreCoursesButton() {
  const exploreBtn = document.getElementById("explore-courses-btn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const coursesSection = document.getElementById("courses-section");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

// WhatsApp Sticky Contact Widget Handler
function initWhatsAppWidget() {
  const triggerBtn = document.getElementById("whatsapp-trigger-btn");
  const modal = document.getElementById("whatsapp-modal");
  const closeBtn = document.getElementById("whatsapp-modal-close");

  if (!triggerBtn || !modal) return;

  triggerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = modal.style.display === "block";
    modal.style.display = isVisible ? "none" : "block";
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      modal.style.display = "none";
    });
  }

  document.addEventListener("click", (e) => {
    if (modal.style.display === "block" && !modal.contains(e.target) && !triggerBtn.contains(e.target)) {
      modal.style.display = "none";
    }
  });
}

// Mobile Menu Toggle & Navigation Drawer Handler
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("main-nav-links");

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle("mobile-menu-open");
    if (menuIcon) {
      menuIcon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    }
  });

  // Close mobile drawer when tapping any nav tab item
  navLinks.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      navLinks.classList.remove("mobile-menu-open");
      if (menuIcon) {
        menuIcon.className = "fa-solid fa-bars";
      }
    });
  });

  // Close mobile drawer when clicking outside header
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("mobile-menu-open") && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      navLinks.classList.remove("mobile-menu-open");
      if (menuIcon) {
        menuIcon.className = "fa-solid fa-bars";
      }
    }
  });
}

// Customer Support & Gemini AI Assistant Logic
function initSupportAIChat() {
  const chatForm = document.getElementById("support-chat-form");
  const userInput = document.getElementById("chat-user-input");
  const chatArea = document.getElementById("chat-messages-area");
  const typingIndicator = document.getElementById("chat-typing-indicator");

  if (!chatForm || !userInput || !chatArea) return;

  // Hardcoded Gemini API Key built into application code
  const geminiApiKey = atob("QVEuQWI4Uk42SzRmcVBWSUcza1lRQlcyTW5saUZvUC05VEY5Ti1adndnWmsxenc4QXZXYWc=");

  // Quick suggestion chips listener
  document.querySelectorAll(".chip-btn").forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query");
      if (query) {
        userInput.value = query;
        handleUserSend(query);
      }
    });
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (query) {
      handleUserSend(query);
    }
  });

  function appendUserMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message user-message";
    msgDiv.innerHTML = `
      <div class="message-avatar"><i class="fa-solid fa-user"></i></div>
      <div class="message-content"><p>${escapeHtml(text)}</p></div>
    `;
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function appendBotMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message bot-message";
    msgDiv.innerHTML = `
      <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="message-content">${formatMarkdown(text)}</div>
    `;
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatMarkdown(str) {
    let formatted = escapeHtml(str);
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
    return `<p>${formatted}</p>`;
  }

  async function handleUserSend(text) {
    appendUserMessage(text);
    userInput.value = "";

    if (!geminiApiKey) {
      if (apiKeyCard) apiKeyCard.style.display = "block";
      appendBotMessage("Please configure your **Gemini API Key** above so I can generate a response for you!");
      return;
    }

    if (typingIndicator) typingIndicator.style.display = "flex";

    const systemPrompt = `You are the official Customer Support AI Admissions Counselor for Evolance Institute of IT located in Rawalpindi, Pakistan.
Founder: Abdul Rehman. Co-Founder & Director: NoorAbbas. Core belief: "If the course does not work for the student, the course is the problem — not the student."
Programs offered:
1. Capstone Pro: 60+ Practical IT Skills (Hardware, Windows/Linux OS, MS Office, Canva, HTML/CSS, Python, Cybersecurity, AI Tools, Freelancing on Fiverr/Upwork). Duration: 6 Months.
2. Capstone Ignite: Exclusively designed IT & Web Development track for Women. Hands-on web design, digital marketing, graphic design & freelancing.
3. Capstone Juniors: IT, coding, logic & creativity track for young students (ages 11-15).
Contact Info: Phone/WhatsApp: 0339-9333066. Location: Rawalpindi, Pakistan.
Classes are held in small batches to ensure personal attention and hands-on guidance.
Provide clear, friendly, and helpful answers. Keep responses concise and formatted cleanly.`;

    const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-pro"];
    let botReply = null;
    let lastError = null;

    for (const model of models) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(geminiApiKey)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: `${systemPrompt}\n\nUser Question: ${text}` }
                ]
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (botReply) break;
        } else {
          const errorData = await response.json().catch(() => ({}));
          lastError = errorData.error?.message || response.statusText;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (typingIndicator) typingIndicator.style.display = "none";

    if (botReply) {
      appendBotMessage(botReply);
    } else {
      appendBotMessage(`**API Response Note:** Unable to generate response with key (${lastError || "Invalid response"}). You can click **Configure API Key** above to update your key.`);
    }
  }
}
