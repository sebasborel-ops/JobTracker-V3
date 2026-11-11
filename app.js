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

    try {

        const employer = document.getElementById("employer").value.trim();
        const position = document.getElementById("position").value.trim();

        if (!employer) {
            alert("Employeur obligatoire");
            return;
        }

        if (!position) {
            alert("Poste obligatoire");
            return;
        }

        const job = {
            id: Date.now(),

            employer: employer,
            position: position,

            grade: document.getElementById("grade").value,
            location: document.getElementById("location").value,
            source: document.getElementById("source").value,

            deadline: document.getElementById("deadline").value,

            applicationDate:
                document.getElementById("applicationDate").value,

            preInterview:
                document.getElementById("preInterview").value,

            writtenTest:
                document.getElementById("writtenTest").value,

            interviewDate:
                document.getElementById("interviewDate").value,

            jobLink:
                document.getElementById("jobLink").value,

            result:
                document.getElementById("result").value,

            notes:
                document.getElementById("notes").value
        };

        jobs.push(job);

        saveJobs();

        clearForm();

        renderJobs();

        console.log("Candidature ajoutée :", job);

    } catch (error) {

        alert(
            "Erreur JavaScript : " +
            error.message
        );

        console.error(error);
    }
}

function clearForm() {

    document.getElementById("employer").value = "";
    document.getElementById("position").value = "";
    document.getElementById("grade").value = "";
    document.getElementById("location").value = "";
    document.getElementById("source").value = "";

    document.getElementById("deadline").value = "";
    document.getElementById("applicationDate").value = "";
    document.getElementById("preInterview").value = "";
    document.getElementById("writtenTest").value = "";
    document.getElementById("interviewDate").value = "";

    document.getElementById("jobLink").value = "";
    document.getElementById("notes").value = "";

    document.getElementById("result").selectedIndex = 0;
}

function deleteJob(id) {

    if (!confirm("Supprimer cette candidature ?")) {
        return;
    }

    jobs = jobs.filter(job => job.id !== id);

    saveJobs();

    renderJobs();
}

function renderJobs() {

    const container =
        document.getElementById("cardsContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    jobs.forEach(job => {

        const color = getStatus(job);

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

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
                📅 Limite :
                ${job.deadline || "-"}
            </div>

            <div class="line">
                📨 Candidature :
                ${job.applicationDate || "-"}
            </div>

            <div class="line">
                📞 Pré-entretien :
                ${job.preInterview || "-"}
            </div>

            <div class="line">
                ✍️ Test :
                ${job.writtenTest || "-"}
            </div>

            <div class="line">
                🎙️ Entretien :
                ${job.interviewDate || "-"}
            </div>

            <div class="line">
                ✅ ${job.result}
            </div>

            <div class="card-actions">

                <button
                    class="delete-btn"
                    onclick="deleteJob(${job.id})">
                    Supprimer
                </button>

            </div>

        `;

        container.appendChild(card);
    });

    updateStats();
}

function updateStats() {

    const total =
        document.getElementById("totalCount");

    const sent =
        document.getElementById("sentCount");

    const interview =
        document.getElementById("interviewCount");

    const offer =
        document.getElementById("offerCount");

    if (total) {
        total.textContent = jobs.length;
    }

    if (sent) {

        sent.textContent =
            jobs.filter(
                j => j.applicationDate
            ).length;
    }

    if (interview) {

        interview.textContent =
            jobs.filter(
                j => j.interviewDate
            ).length;
    }

    if (offer) {

        offer.textContent =
            jobs.filter(
                j =>
                    j.result === "Offre reçue" ||
                    j.result === "Offre acceptée"
            ).length;
    }
}

function exportData() {

    const blob = new Blob(
        [JSON.stringify(jobs, null, 2)],
        { type: "application/json" }
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
            JSON.parse(
                e.target.result
            );

        saveJobs();

        renderJobs();
    };

    reader.readAsText(file);
}

renderJobs();
