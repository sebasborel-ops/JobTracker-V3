let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

let editId = null;

document.addEventListener("DOMContentLoaded", () => {

    showTodayDate();

    initializeDateFields();

    renderJobs();

});

function showTodayDate() {

    const today = new Date();

    const text = today.toLocaleDateString(
        "fr-FR",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

    document.getElementById("todayDate").textContent = text;
}

function initializeDateFields() {

    const year = new Date().getFullYear();

    [
        "deadlineYear",
        "applicationYear",
        "preYear",
        "testYear",
        "interviewYear"
    ].forEach(id => {

        const el = document.getElementById(id);

        if (el) {
            el.value = year;
        }
    });

    autoJump("deadlineDay", "deadlineMonth");
    autoJump("deadlineMonth", "deadlineYear");

    autoJump("applicationDay", "applicationMonth");
    autoJump("applicationMonth", "applicationYear");

    autoJump("preDay", "preMonth");
    autoJump("preMonth", "preYear");

    autoJump("testDay", "testMonth");
    autoJump("testMonth", "testYear");

    autoJump("interviewDay", "interviewMonth");
    autoJump("interviewMonth", "interviewYear");
}

function autoJump(current, next) {

    const currentField =
        document.getElementById(current);

    if (!currentField) return;

    currentField.addEventListener("input", () => {

        if (currentField.value.length >= 2) {

            const nextField =
                document.getElementById(next);

            if (nextField) {
                nextField.focus();
            }
        }
    });
}

function saveJobs() {

    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );
}

function buildDate(prefix) {

    const day =
        document.getElementById(prefix + "Day")?.value || "";

    const month =
        document.getElementById(prefix + "Month")?.value || "";

    const year =
        document.getElementById(prefix + "Year")?.value || "";

    if (!day || !month || !year) {
        return "";
    }

    return `${day}/${month}/${year}`;
}

function getStatus(job) {

    if (job.applicationDate) {
        return "green";
    }

    return "yellow";
}

function clearForm() {

    document.getElementById("employer").value = "";
    document.getElementById("position").value = "";
    document.getElementById("grade").value = "";
    document.getElementById("location").value = "";
    document.getElementById("source").value = "";
    document.getElementById("jobLink").value = "";
    document.getElementById("notes").value = "";

    document.getElementById("result").selectedIndex = 0;

    editId = null;

    document.getElementById("saveBtn").textContent =
        "Ajouter";
}

function addCandidate() {

    const employer =
        document.getElementById("employer").value.trim();

    const position =
        document.getElementById("position").value.trim();

    if (!employer) {

        alert("Employeur obligatoire");
        return;
    }

    if (!position) {

        alert("Poste obligatoire");
        return;
    }

    const job = {

        id: editId || Date.now(),

        employer,

        position,

        grade:
            document.getElementById("grade").value,

        location:
            document.getElementById("location").value,

        source:
            document.getElementById("source").value,

        jobLink:
            document.getElementById("jobLink").value,

        deadline:
            buildDate("deadline"),

        applicationDate:
            buildDate("application"),

        preInterview:
            buildDate("pre"),

        writtenTest:
            buildDate("test"),

        interviewDate:
            buildDate("interview"),

        result:
            document.getElementById("result").value,

        notes:
            document.getElementById("notes").value
    };

    if (editId) {

        jobs = jobs.map(item =>
            item.id === editId ? job : item
        );

    } else {

        jobs.push(job);
    }

    saveJobs();

    clearForm();

    renderJobs();
}

function editJob(id) {

    const job =
        jobs.find(j => j.id === id);

    if (!job) return;

    editId = id;

    document.getElementById("employer").value =
        job.employer || "";

    document.getElementById("position").value =
        job.position || "";

    document.getElementById("grade").value =
        job.grade || "";

    document.getElementById("location").value =
        job.location || "";

    document.getElementById("source").value =
        job.source || "";

    document.getElementById("jobLink").value =
        job.jobLink || "";

    document.getElementById("result").value =
        job.result || "En attente";

    document.getElementById("notes").value =
        job.notes || "";

    document.getElementById("saveBtn").textContent =
        "Enregistrer";
}

function deleteJob(id) {

    if (!confirm("Supprimer cette candidature ?")) {
        return;
    }

    jobs =
        jobs.filter(job => job.id !== id);

    saveJobs();

    renderJobs();
}

function renderJobs() {

    const container =
        document.getElementById("cardsContainer");

    if (!container) return;

    const search =
        document.getElementById("searchInput")
            ?.value
            .toLowerCase() || "";

    container.innerHTML = "";

    jobs
        .filter(job => {

            const text =
                (
                    job.employer +
                    " " +
                    job.position +
                    " " +
                    job.grade
                ).toLowerCase();

            return text.includes(search);
        })
        .forEach(job => {

            const color =
                getStatus(job);

            container.innerHTML += `

            <div class="card">

                <div class="card-header">

                    <div class="status-dot ${color}"></div>

                    <div class="card-title">
                        ${job.employer}
                        •
                        ${job.position}
                        •
                        ${job.grade || "-"}
                    </div>

                </div>

                <div class="line">
                    📍 ${job.location || "-"}
                </div>

                <div class="line">
                    📅 Limite : ${job.deadline || "-"}
                </div>

                <div class="line">
                    📨 Envoi : ${job.applicationDate || "-"}
                </div>

                <div class="line">
                    📞 Pré-entretien : ${job.preInterview || "-"}
                </div>

                <div class="line">
                    ✍️ Test écrit : ${job.writtenTest || "-"}
                </div>

                <div class="line">
                    🎙️ Entretien : ${job.interviewDate || "-"}
                </div>

                <div class="line">
                    ✅ ${job.result}
                </div>

                <div class="card-actions">

                    <button
                        class="edit-btn"
                        onclick="editJob(${job.id})">

                        Modifier

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteJob(${job.id})">

                        Supprimer

                    </button>

                </div>

            </div>

            `;
        });

    updateStats();
}

function updateStats() {

    document.getElementById("totalCount").textContent =
        jobs.length;

    document.getElementById("sentCount").textContent =
        jobs.filter(j =>
            j.applicationDate
        ).length;

    document.getElementById("interviewCount").textContent =
        jobs.filter(j =>
            j.interviewDate
        ).length;

    document.getElementById("offerCount").textContent =
        jobs.filter(j =>
            j.result === "Offre reçue" ||
            j.result === "Offre acceptée"
        ).length;
}

function exportData() {

    const blob = new Blob(
        [JSON.stringify(jobs, null, 2)],
        {
            type: "application/json"
        }
    );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "jobtracker-v3.json";

    link.click();
}

function importData(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload = function(e) {

        jobs =
            JSON.parse(e.target.result);

        saveJobs();

        renderJobs();
    };

    reader.readAsText(file);
}
