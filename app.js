let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

function saveJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

function getStatus(job) {

    const today = new Date();

    if (job.applicationDate) {
        return "green";
    }

    if (job.deadline) {

        const deadline = new Date(job.deadline);

        if (deadline < today) {
            return "red";
        }
    }

    return "yellow";
}

function addCandidate() {

    const job = {
        id: Date.now(),

        employer: employer.value,
        position: position.value,
        grade: grade.value,

        location: location.value,
        source: source.value,

        deadline: deadline.value,
        applicationDate: applicationDate.value,

        preInterview: preInterview.value,
        writtenTest: writtenTest.value,
        interviewDate: interviewDate.value,

        jobLink: jobLink.value,

        result: result.value,

        notes: notes.value
    };

    jobs.push(job);

    saveJobs();
    renderJobs();

    document.querySelectorAll("input, textarea").forEach(el => {
        el.value = "";
    });

    result.selectedIndex = 0;
}

function deleteJob(id) {

    jobs = jobs.filter(job => job.id !== id);

    saveJobs();
    renderJobs();
}

function renderJobs() {

    const container = document.getElementById("cardsContainer");

    container.innerHTML = "";

    jobs.forEach(job => {

        const color = getStatus(job);

        container.innerHTML += `
        <div class="card">

            <div class="card-header">

                <div class="status-dot ${color}"></div>

                <div class="card-title">
                    ${job.employer} • ${job.position} • ${job.grade}
                </div>

            </div>

            <div class="line">📅 Limite : ${job.deadline || "-"}</div>
            <div class="line">📨 Candidature : ${job.applicationDate || "-"}</div>

            <div class="line">📞 Pré-entretien : ${job.preInterview || "-"}</div>
            <div class="line">✍️ Test écrit : ${job.writtenTest || "-"}</div>
            <div class="line">🎙️ Entretien : ${job.interviewDate || "-"}</div>

            <div class="line">📍 ${job.location || "-"}</div>
            <div class="line">🔍 ${job.source || "-"}</div>

            <div class="line">✅ Résultat : ${job.result}</div>

            <div class="line">${job.notes || ""}</div>

            <button
            class="delete-btn"
            onclick="deleteJob(${job.id})">
            Supprimer
            </button>

        </div>
        `;
    });

    updateStats();
}

function updateStats() {

    document.getElementById("totalCount").textContent =
        jobs.length;

    document.getElementById("sentCount").textContent =
        jobs.filter(j => j.applicationDate).length;

    document.getElementById("interviewCount").textContent =
        jobs.filter(j => j.interviewDate).length;

    document.getElementById("offerCount").textContent =
        jobs.filter(j =>
            j.result === "Offre reçue" ||
            j.result === "Offre acceptée"
        ).length;
}

function exportData() {

    const blob = new Blob(
        [JSON.stringify(jobs, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "jobtracker-v3.json";

    link.click();
}

function importData(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        jobs = JSON.parse(e.target.result);

        saveJobs();
        renderJobs();
    };

    reader.readAsText(file);
}

renderJobs();
