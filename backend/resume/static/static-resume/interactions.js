// DROPDOWN AND PANEL MENU
function showPanel(query) {
    document.querySelectorAll(".sub-container").forEach(panel => {
        panel.style.display = "none"
    });

    document.getElementById(`${query}-input-panel`).style.display = "block"
    document.getElementById(`${query}-content-panel`).style.display = "block"
}

const dropdownButton = document.getElementById("dropdownButton");
const dropdown = document.querySelector(".dropdown");
const dropdownContent = document.getElementById("dropdownContent");

dropdownButton.addEventListener("click", (event) => {
    event.stopPropagation(); // prevent window click from instantly closing it
    dropdown.classList.toggle("show");
});

dropdownContent.querySelectorAll("a").forEach(option => {
    option.addEventListener("click", (e) => {
    e.preventDefault();
    showPanel(option.dataset.query);
    dropdownButton.textContent = option.dataset.value;
    dropdown.classList.remove("show"); // close menu after selection
    });
});

window.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
    }
});


// LEADERSHIP FORM TO ACCEPT USER INPUT
LEADERSHIP_FORM.addEventListener("submit", async function(event) {
        event.preventDefault(); // prevent page reload

        const formData = new FormData(LEADERSHIP_FORM);
        const response = await fetch(`{% url 'add_experience' %}?type=leadership`, {
            method: "POST",
            headers: {
                "X-CSRFToken": formData.get("csrfmiddlewaretoken")
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Experience added successfully:", data);
            LEADERSHIP_FORM.reset();
            fetch(RESET_PANEL_URL);
        } else {
            console.error("Error adding experience");
        }
    });


document.getElementById("restart-pdf").addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(RESET_PANEL_FORM);
    const response = await fetch(REFRESH_PDF_URL, {
        method: "POST",
        headers: {
            "X-CSRFToken": formData.get("csrfmiddlewaretoken")
        },
        body: formData
    })
});


document.getElementById("reset-panel-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // prevent page reload
    const formData = new FormData(RESET_PANEL_FORM);
    // Fetch POST request to your Django view
    const response = await fetch(RESET_PANEL_URL, {
        method: "POST",
        headers: {
            "X-CSRFToken": formData.get("csrfmiddlewaretoken")
        },
        body: formData
    })
});