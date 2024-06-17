let currentPatientIndex = 0;
let currentPostureIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadPatientData();
});

function loadPatientData() {
    const patient = patients[currentPatientIndex];
    const posture = patient.postures[currentPostureIndex];

    document.querySelector('h1').innerText = `Steadi-Three Patient Evaluation: ${patient.name}`;
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = '';

    const postureTitle = document.createElement('h2');
    postureTitle.innerText = posture.title;
    videoContainer.appendChild(postureTitle);

    const videoGroupRow = document.createElement('div');
    videoGroupRow.className = 'video-group-row';
    posture.videos.forEach((video, index) => {
        const videoSection = document.createElement('div');
        videoSection.className = 'video-section';
        
        const img = document.createElement('img');
        img.src = video;
        img.alt = `${patient.name} Video ${index + 1}`;
        img.className = 'video-gif';
        videoSection.appendChild(img);

        const ratingScale = document.createElement('div');
        ratingScale.className = 'rating-scale';
        for (let i = 0; i <= 4; i++) {
            const input = document.createElement('input');
            input.type = 'radio';
            input.id = `video${currentPatientIndex}-${currentPostureIndex}-${index}-${i}`;
            input.name = `video${currentPatientIndex}_${currentPostureIndex}_${index}`;
            input.value = i;

            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.innerText = i;

            ratingScale.appendChild(input);
            ratingScale.appendChild(label);
        }
        videoSection.appendChild(ratingScale);
        videoGroupRow.appendChild(videoSection);
    });

    videoContainer.appendChild(videoGroupRow);
}

function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add patientName to the data
    data.patientName = patients[currentPatientIndex].name;

    // Send data to Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbwVPzbW55liCtMB9e2P54uC-BJYfjhdooFZIp7WqHX4Rk6R1F_V7i9vjkN2sGoWqWsejA/exec', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'text/plain',
        },
    }).then(response => response.json()).then(result => {
        if (result.status === 'success') {
            // Load next posture or next patient
            currentPostureIndex++;
            if (currentPostureIndex >= patients[currentPatientIndex].postures.length) {
                currentPostureIndex = 0;
                currentPatientIndex++;
                if (currentPatientIndex >= patients.length) {
                    alert('Thank you for your submissions!');
                    window.close();
                    return;
                }
            }
            loadPatientData();
        } else {
            alert('There was an error submitting your ratings. Please try again.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your ratings. Please try again.');
    });
}
