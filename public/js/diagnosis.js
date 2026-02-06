
// Diagnosis Form Logic

function toggleFocus(value) {
    const personalSection = document.getElementById('section-personal');
    const businessSection = document.getElementById('section-business');

    // Animate transition using GSAP if available, else standard display toggle
    const hideSection = (section) => {
        section.style.display = 'none';
        // Reset required attributes to avoid blocking submission
        toggleRequired(section, false);
    };

    const showSection = (section) => {
        section.style.display = 'block';
        section.style.opacity = 0;
        gsap.to(section, { opacity: 1, duration: 0.5, ease: "power2.out" });
        // Enable required attributes
        toggleRequired(section, true);
    };

    if (value === 'Marca Personal') {
        hideSection(businessSection);
        showSection(personalSection);
    } else if (value === 'Negocio Establecido') {
        hideSection(personalSection);
        showSection(businessSection);
    }
}

function toggleRequired(section, isRequired) {
    const inputs = section.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (isRequired) {
            input.setAttribute('required', 'true');
        } else {
            input.removeAttribute('required');
        }
    });
}

// Form Submission
document.getElementById('diagnosisForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('formStatus');

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';
    statusMsg.style.opacity = '0';

    // Gather Data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/submit-diagnosis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Success
            statusMsg.innerText = '¡Recibido! Estaré revisando tu diagnóstico pronto.';
            statusMsg.style.color = 'green';
            statusMsg.style.opacity = '1';
            submitBtn.innerText = 'Enviado';
            this.reset();
        } else {
            throw new Error('Error en el envío');
        }
    } catch (error) {
        console.error('Submission Error:', error);
        statusMsg.innerText = 'Hubo un error al enviar. Por favor intenta de nuevo o contáctame por Instagram.';
        statusMsg.style.color = 'red';
        statusMsg.style.opacity = '1';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar Diagnóstico y Generar Estrategia →';
    }
});
