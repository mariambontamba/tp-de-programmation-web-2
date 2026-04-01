// Variables globales
let students = JSON.parse(localStorage.getItem('students')) || [];

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = document.querySelector(`#${fieldId} + .toggle-password`);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Vérification de la force du mot de passe
function checkPasswordStrength(password) {
    let strength = 0;
    const strengthDiv = document.getElementById('passwordStrength');
    
    if (password.length === 0) {
        strengthDiv.className = 'password-strength';
        strengthDiv.textContent = '';
        return;
    }
    
    // Critères de force
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    // Afficher la force
    if (strength <= 2) {
        strengthDiv.className = 'password-strength weak';
        strengthDiv.textContent = '⚠️ Mot de passe faible';
    } else if (strength === 3 || strength === 4) {
        strengthDiv.className = 'password-strength medium';
        strengthDiv.textContent = '✓ Mot de passe moyen';
    } else {
        strengthDiv.className = 'password-strength strong';
        strengthDiv.textContent = '✓ Mot de passe fort';
    }
}

// Validation des champs
function validateField(field, value) {
    const errorSpan = document.getElementById(`${field}Error`);
    
    switch(field) {
        case 'firstName':
        case 'lastName':
            if (!value.trim()) {
                errorSpan.textContent = 'Ce champ est requis';
                return false;
            }
            if (value.trim().length < 2) {
                errorSpan.textContent = 'Minimum 2 caractères';
                return false;
            }
            errorSpan.textContent = '';
            return true;
            
        case 'birthDate':
            if (!value) {
                errorSpan.textContent = 'La date de naissance est requise';
                return false;
            }
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (age < 16 || (age === 16 && monthDiff < 0)) {
                errorSpan.textContent = 'Vous devez avoir au moins 16 ans';
                return false;
            }
            if (age > 100) {
                errorSpan.textContent = 'Veuillez entrer une date valide';
                return false;
            }
            errorSpan.textContent = '';
            return true;
            
        case 'gender':
            if (!value) {
                errorSpan.textContent = 'Veuillez sélectionner votre genre';
                return false;
            }
            errorSpan.textContent = '';
            return true;
            
        case 'email':
            const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            if (!value) {
                errorSpan.textContent = 'L\'email est requis';
                return false;
            }
            if (!emailRegex.test(value)) {
                errorSpan.textContent = 'Email invalide';
                return false;
            }
            // Vérifier si l'email existe déjà
            if (students.some(s => s.email === value)) {
                errorSpan.textContent = 'Cet email est déjà utilisé';
                return false;
            }
            errorSpan.textContent = '';
            return true;
            
        case 'phone':
            const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
            if (!value) {
                errorSpan.textContent = 'Le numéro de téléphone est requis';
                return false;
            }
            if (!phoneRegex.test(value) || value.replace(/[^0-9]/g, '').length < 10) {
                errorSpan.textContent = 'Numéro de téléphone invalide';
                return false;
            }
            errorSpan.textContent = '';
            return true;
            
        case 'studentId':
            if (!value.trim()) {
                errorSpan.textContent = 'Le matricule est requis';
                return false;
            }
            if (students.some(s => s.studentId === value)) {
                errorSpan.textContent = 'Ce matricule existe déjà';
                return false;
            }
            errorSpan.textContent = '';
            return true;
            
        case 'level':
            if (!value) {
                errorSpan.textContent = 'Veuillez sélectionner votre niveau';
                return false;
            }
            errorSpan.textContent = '';
            return true;
            
        case 'faculty':
            if (!value.trim()) {
                errorSpan.textContent = 'Ce champ est requis';
                return false;
            }
            if (value.trim().length < 2) {
                errorSpan.textContent = 'Minimum 2 caractères';
                return false;
            }
            errorSpan.textContent = '';
            return true;
            
        default:
            return true;
    }
}

// Validation du mot de passe
function validatePassword(password, confirmPassword) {
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmPasswordError');
    let isValid = true;
    
    if (!password) {
        passwordError.textContent = 'Le mot de passe est requis';
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = 'Le mot de passe doit contenir au moins 6 caractères';
        isValid = false;
    } else {
        passwordError.textContent = '';
    }
    
    if (password !== confirmPassword) {
        confirmError.textContent = 'Les mots de passe ne correspondent pas';
        isValid = false;
    } else {
        confirmError.textContent = '';
    }
    
    return isValid;
}

// Afficher un message
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 5000);
}

// Réinitialiser le formulaire
function resetForm() {
    if (confirm('Voulez-vous vraiment réinitialiser tous les champs ?')) {
        document.getElementById('registrationForm').reset();
        // Effacer les messages d'erreur
        document.querySelectorAll('.error-message').forEach(span => span.textContent = '');
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.classList.remove('error');
        });
        document.getElementById('passwordStrength').className = 'password-strength';
        document.getElementById('passwordStrength').textContent = '';
        showMessage('Formulaire réinitialisé', 'success');
    }
}

// Sauvegarder les données dans localStorage
function saveStudentData(formData) {
    const student = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        gender: formData.gender,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        studentId: formData.studentId,
        level: formData.level,
        faculty: formData.faculty,
        newsletter: formData.newsletter,
        registrationDate: new Date().toISOString()
    };
    
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    return student;
}

// Gestionnaire d'événements pour les champs en temps réel
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter des écouteurs d'événements pour la validation en temps réel
    const fields = ['firstName', 'lastName', 'birthDate', 'gender', 'email', 'phone', 
                    'studentId', 'level', 'faculty', 'specialty', 'university'];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('blur', function() {
                validateField(field, this.value);
                if (!this.value) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
            
            element.addEventListener('input', function() {
                this.classList.remove('error');
                const errorSpan = document.getElementById(`${field}Error`);
                if (errorSpan) errorSpan.textContent = '';
            });
        }
    });
    
    // Validation du mot de passe en temps réel
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    password.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        validatePassword(this.value, confirmPassword.value);
    });
    
    confirmPassword.addEventListener('input', function() {
        validatePassword(password.value, this.value);
    });
    
    // Ajouter l'année minimum pour la date de naissance
    const birthDateInput = document.getElementById('birthDate');
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    
    birthDateInput.max = maxDate.toISOString().split('T')[0];
    birthDateInput.min = minDate.toISOString().split('T')[0];
});

// Gestion de la soumission du formulaire
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer toutes les valeurs
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        studentId: document.getElementById('studentId').value,
        level: document.getElementById('level').value,
        faculty: document.getElementById('faculty').value,
        password: document.getElementById('password').value,
        newsletter: document.getElementById('newsletter').checked,
        terms: document.getElementById('terms').checked
    };
    
    // Valider tous les champs
    let isValid = true;
    const fieldsToValidate = ['firstName', 'lastName', 'birthDate', 'gender', 'email', 
                              'phone', 'studentId', 'level', 'faculty'];
    
    fieldsToValidate.forEach(field => {
        if (!validateField(field, formData[field])) {
            isValid = false;
            const element = document.getElementById(field);
            element.classList.add('error');
        }
    });
    
    // Valider le mot de passe
    if (!validatePassword(formData.password, document.getElementById('confirmPassword').value)) {
        isValid = false;
    }
    
    // Vérifier les conditions d'utilisation
    if (!formData.terms) {
        document.getElementById('termsError').textContent = 'Vous devez accepter les conditions d\'utilisation';
        isValid = false;
    } else {
        document.getElementById('termsError').textContent = '';
    }
    
    if (isValid) {
        // Simuler un chargement
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Inscription en cours...';
        submitBtn.classList.add('loading');
        
        setTimeout(() => {
            // Sauvegarder les données
            const student = saveStudentData(formData);
            
            // Afficher le succès
            showMessage(`Inscription réussie ! Bienvenue ${formData.firstName} ${formData.lastName}`, 'success');
            
            // Réinitialiser le formulaire
            setTimeout(() => {
                resetForm();
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
                
                // Rediriger vers la page de connexion après 2 secondes
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }, 1000);
        }, 1500);
    } else {
        showMessage('Veuillez corriger les erreurs dans le formulaire', 'error');
        
        // Faire défiler jusqu'au premier champ en erreur
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Empêcher la soumission avec Entrée dans certains cas
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.type !== 'submit') {
            e.preventDefault();
        }
    });
});
