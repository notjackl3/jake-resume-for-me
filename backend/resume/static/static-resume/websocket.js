const socket = new WebSocket(
    "ws://" + window.location.host + "/ws/pdf-preview/"
);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.event === "pdf_ready") {
        document.getElementById("pdfPreview").src = data.url;
    }
    else if (data.event == "reset_leadership_panel") {
        const experiencesData = data.minor_experiences_data;
        createLeadershipContainer(experiencesData)
        
    }
};

function createLeadershipContainer(experiencesData) {
    const container = document.getElementById("leadership-container");
        container.innerHTML = "";

        experiencesData.forEach(exp => {
            const contentWrapper = document.createElement("div");
            contentWrapper.className = "content-wrapper";

            const buttonWrapper = document.createElement("div");
            buttonWrapper.className = "button-wrapper";

            const addButton = document.createElement("button");
            addButton.type = "button";
            if (exp.included) {
                addButton.textContent = "Remove from PDF";
                addButton.onclick = () => removeFromPDF(exp.id, "leadership");
            } else {
                addButton.textContent = "Add to PDF";
                addButton.onclick = () => addToPDF(exp.id, "leadership");
            }

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Apply edits";
            editButton.onclick = () => editItem(exp.id, "leadership");

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteItem(exp.id, "leadership");

            const contentDiv = document.createElement("div");
            contentDiv.className = "experience-content";
            contentDiv.id = `experience-${exp.id}`
            contentDiv.dataset.id = exp.id;
            contentDiv.dataset.name = exp.name;
            contentDiv.dataset.organisation = exp.organisation;
            contentDiv.dataset.date = exp.date;
            contentDiv.dataset.location = exp.location;

            contentDiv.innerHTML = `
                <h3 class="content-label">Position name</h3>
                <div class="editable-field" data-field="name" contenteditable="true">${exp.name}</div>
                
                <h3 class="content-label">Organisation</h3>
                <div class="editable-field" data-field="organisation" contenteditable="true">${exp.organisation}</div>
                
                <h3 class="content-label">Date start/end</h3>
                <div class="editable-field" data-field="date" contenteditable="true">${exp.date}</div>
                
                <h3 class="content-label">Location</h3>
                <div class="editable-field" data-field="location" contenteditable="true">${exp.location}</div>
                
                <h3 class="content-label">Description</h3>
            `;

            const descriptionsDiv = document.createElement("div");
            descriptionsDiv.id = `descriptions-${exp.id}`;
            exp.descriptions.forEach((desc, index) => {
                const description = document.createElement("div");
                description.classList.add("description", "editable-field");
                description.dataset.id = desc[0];
                description.contentEditable = true;
                description.innerText = desc[1]

                descriptionsDiv.appendChild(description);
            });
            contentDiv.appendChild(descriptionsDiv);
            
            buttonWrapper.appendChild(addButton);
            buttonWrapper.appendChild(editButton);
            buttonWrapper.appendChild(deleteButton);
            
            contentWrapper.appendChild(buttonWrapper);
            contentWrapper.appendChild(contentDiv);
            
            container.appendChild(contentWrapper);
        });
}