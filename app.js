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

        employer: document.getElementById("employer").value,
        position: document.getElementById("position").value,
        grade: document.getElementById("grade").value,

        location: document.getElementById("location").value,
        source: document.getElementById("source").value,

        deadline: document.getElementById("deadline").value,
        applicationDate: document.getElementById("applicationDate").value,

        preInterview: document.getElementById("preInterview").value,
        writtenTest: document.getElementById("writtenTest").value,
        interviewDate: document.getElementById("interviewDate").value,

        jobLink: document.getElementById("jobLink").value,

        result: document.getElementById("result").value,

        notes: document.getElementById("notes").value
    };

    jobs.push(job);

    saveJobs();
    renderJobs();

    clearForm();
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
    
