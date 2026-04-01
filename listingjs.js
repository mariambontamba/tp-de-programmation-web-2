// Variables globales
let students = [];
let currentSort = { field: 'date', order: 'desc' };
let currentView = 'grid';
let currentPage = 1;
let itemsPerPage = 12;
let currentFilters = {
    search: '',
    level: '',
    faculty: ''
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupEventListeners();
    updateStatistics();
    renderStudents();
    populateFacultyFilter();
});

// Charger les étudiants depuis localStorage
function loadStudents() {
    const stored = localStorage.getItem('students');
    if (stored) {
        students = JSON.parse(stored);
        // Trier par date d'inscription (plus récent d'abord)
        students.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    } else {
        // Données de démonstration
        students = getDemoData();
        saveToLocalStorage();
    }
}

// Données de démonstration
function getDemoData() {
    return [
        {
            id: 1,
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@email.com',
            phone: '+33 6 12 34 56 78',
            studentId: 'ETU-2024-0001',
            level: 'master1',
            faculty: 'Informatique',
            specialty: 'Développement Web',
            university: 'Université de Technologie',
            registrationDate: '2024-01-15T10:30:00.000Z',
            newsletter: true
        },
        {
            id: 2,
            firstName: 'Marie',
            lastName: 'Martin',
            email: 'marie.martin@email.com',
            phone: '+33 6 23 45 67 89',
            studentId: 'ETU-2024-0002',
            level: 'licence3',
            faculty: 'Mathématiques',
            specialty: 'Mathématiques Appliquées',
            university: 'Université des Sciences',
            registrationDate: '2024-01-20T14:15:00.000Z',
            newsletter: false
        },
        {
            id: 3,
            firstName: 'Thomas',
            lastName: 'Bernard',
            email: 'thomas.bernard@email.com',
            phone: '+33 6 34 56 78 90',
            studentId: 'ETU-2024-0003',
            level: 'licence2',
            faculty: 'Informatique',
            specialty: 'Intelligence Artificielle',
            university: 'Université de Technologie',
            registrationDate: '2024-02-01T09:45:00.000Z',
            newsletter: true
        }
    ];
}

// Sauvegarder dans localStorage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Mettre à jour les statistiques
function updateStatistics() {
    document.getElementById('totalStudents').textContent = students.length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = students.filter(s => {
        const regDate = new Date(s.registrationDate);
        return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
    }).length;
    document.getElementById('newThisMonth').textContent = newThisMonth;
    
    document.getElementById('activeStudents').textContent = students.length;
}

// Remplir le filtre des facultés
function populateFacultyFilter() {
    const faculties = [...new Set(students.map(s => s.faculty))];
    const facultyFilter = document.getElementById('facultyFilter');
    faculties.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty;
        option.textContent = faculty;
        facultyFilter.appendChild(option);
    });
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Recherche
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        currentPage = 1;
        renderStudents();
    });
    
    // Filtres
    document.getElementById('levelFilter').addEventListener('change', (e) => {
        currentFilters.level = e.target.value;
        currentPage = 1;
        renderStudents();
    });
    
    document.getElementById('facultyFilter').addEventListener('change', (e) => {
        currentFilters.faculty = e.target.value;
        currentPage = 1;
        renderStudents();
    });
    
    // Réinitialisation des filtres
    document.getElementById('resetFilters').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('levelFilter').value = '';
        document.getElementById('facultyFilter').value = '';
        currentFilters = { search: '', level: '', faculty: '' };
        currentPage = 1;
        renderStudents();
    });
    
    // Boutons de tri
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.dataset.sort;
            if (currentSort.field === field) {
                currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.field = field;
                currentSort.order = 'asc';
            }
            renderStudents();
            updateSortButtons();
        });
    });
    
    // Changement de vue
    document.getElementById('gridViewBtn').addEventListener('click', () => {
        currentView = 'grid';
        document.getElementById('studentsContainer').className = 'students-container grid-view';
        document.getElementById('gridViewBtn').classList.add('active');
        document.getElementById('listViewBtn').classList.remove('active');
        renderStudents();
    });
    
    document.getElementById('listViewBtn').addEventListener('click', () => {
        currentView = 'list';
        document.getElementById('studentsContainer').className = 'students-container list-view';
        document.getElementById('listViewBtn').classList.add('active');
        document.getElementById('gridViewBtn').classList.remove('active');
        renderStudents();
    });
    
    // Export CSV
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    
    // Impression
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    
    // Fermeture des modals
    document.querySelectorAll('.close, .close-delete, .modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('close') || e.target.classList.contains('close-delete')) {
                document.getElementById('studentModal').style.display = 'none';
                document.getElementById('deleteModal').style.display = 'none';
            }
        });
    });
}

// Mettre à jour l'affichage des boutons de tri
function updateSortButtons() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active', 'asc', 'desc');
        if (btn.dataset.sort === currentSort.field) {
            btn.classList.add('active', currentSort.order);
        }
    });
}

// Filtrer les étudiants
function filterStudents() {
    return students.filter(student => {
        const matchSearch = !currentFilters.search || 
            student.firstName.toLowerCase().includes(currentFilters.search) ||
            student.lastName.toLowerCase().includes(currentFilters.search) ||
            student.email.toLowerCase().includes(currentFilters.search) ||
            student.studentId.toLowerCase().includes(currentFilters.search);
        
        const matchLevel = !currentFilters.level || student.level === currentFilters.level;
        const matchFaculty = !currentFilters.faculty || student.faculty === currentFilters.faculty;
        
        return matchSearch && matchLevel && matchFaculty;
    });
}

// Trier les étudiants
function sortStudents(filteredStudents) {
    return [...filteredStudents].sort((a, b) => {
        let aVal, bVal;
        
        switch(currentSort.field) {
            case 'name':
                aVal = `${a.lastName} ${a.firstName}`;
                bVal = `${b.lastName} ${b.firstName}`;
                break;
            case 'date':
                aVal = new Date(a.registrationDate);
                bVal = new Date(b.registrationDate);
                break;
            case 'level':
                const levelOrder = { 'licence1': 1, 'licence2': 2, 'licence3': 3, 'master1': 4, 'master2': 5, 'doctorat': 6 };
                aVal = levelOrder[a.level] || 0;
                bVal = levelOrder[b.level] || 0;
                break;
            case 'studentId':
                aVal = a.studentId;
                bVal = b.studentId;
                break;
            default:
                return 0;
        }
        
        if (aVal < bVal) return currentSort.order === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSort.order === 'asc' ? 1 : -1;
        return 0;
    });
}

// Pagination
function paginateStudents(sortedStudents) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedStudents.slice(start, end);
}

// Rendre les étudiants
function renderStudents() {
    const filtered = filterStudents();
    const sorted = sortStudents(filtered);
    const paginated = paginateStudents(sorted);
    const container = document.getElementById('studentsContainer');
    
    if (paginated.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-graduate"></i>
                <h3>Aucun étudiant trouvé</h3>
                <p>Aucun étudiant ne correspond à vos critères de recherche</p>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    if (currentView === 'grid') {
        container.innerHTML = paginated.map(student => createGridCard(student)).join('');
    } else {
        container.innerHTML = paginated.map(student => createListCard(student)).join('');
    }
    
    renderPagination(sorted.length);
    attachCardEvents();
}

// Créer une carte en mode grille
function createGridCard(student) {
    const levelName = getLevelName(student.level);
    const date = new Date(student.registrationDate).toLocaleDateString('fr-FR');
    
    return `
        <div class="student-card" data-id="${student.id}">
            <div class="card-header">
                <h3>${student.firstName} ${student.lastName}</h3>
                <div class="student-id">${student.studentId}</div>
                <div class="card-badge">${levelName}</div>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <i class="fas fa-envelope"></i>
                    <span>${student.email}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-phone"></i>
                    <span>${student.phone}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-university"></i>
                    <span>${student.university}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-graduation-cap"></i>
                    <span>${student.specialty}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-calendar"></i>
                    <span>Inscrit le ${date}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-view" onclick="viewStudent(${student.id})">
                    <i class="fas fa-eye"></i> Détails
                </button>
                <button class="btn-delete" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `;
}

// Créer une carte en mode liste
function createListCard(student) {
    const levelName = getLevelName(student.level);
    const date = new Date(student.registrationDate).toLocaleDateString('fr-FR');
    
    return `
        <div class="student-card" data-id="${student.id}">
            <div class="card-header">
                <h3>${student.firstName} ${student.lastName}</h3>
                <div class="student-id">${student.studentId}</div>
                <div class="card-badge">${levelName}</div>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <i class="fas fa-envelope"></i>
                    <span>${student.email}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-phone"></i>
                    <span>${student.phone}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-university"></i>
                    <span>${student.faculty}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-view" onclick="viewStudent(${student.id})">
                    <i class="fas fa-eye"></i> Détails
                </button>
                <button class="btn-delete" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `;
}

// Obtenir le nom du niveau
function getLevelName(level) {
    const levels = {
        'licence1': 'Licence 1',
        'licence2': 'Licence 2',
        'licence3': 'Licence 3',
        'master1': 'Master 1',
        'master2': 'Master 2',
        'doctorat': 'Doctorat'
    };
    return levels[level] || level;
}

// Attacher les événements aux cartes
function attachCardEvents() {
    // Les événements sont déjà attachés via onclick dans les boutons
}

// Rendre la pagination
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationDiv = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let html = '';
    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>«</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<button disabled>...</button>`;
        }
    }
    
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>»</button>`;
    paginationDiv.innerHTML = html;
}

// Changer de page
function changePage(page) {
    currentPage = page;
    renderStudents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Voir les détails d'un étudiant
function viewStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    const modal = document.getElementById('studentModal');
    const detailsDiv = document.getElementById('studentDetails');
    
    const levelName = getLevelName(student.level);
    const date = new Date(student.registrationDate).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    detailsDiv.innerHTML = `
        <div class="student-detail-row">
            <div class="student-detail-label">Nom complet :</div>
            <div class="student-detail-value">${student.firstName} ${student.lastName}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Matricule :</div>
            <div class="student-detail-value">${student.studentId}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Email :</div>
            <div class="student-detail-value">${student.email}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Téléphone :</div>
            <div class="student-detail-value">${student.phone}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Université :</div>
            <div class="student-detail-value">${student.university}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Faculté :</div>
            <div class="student-detail-value">${student.faculty}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Spécialité :</div>
            <div class="student-detail-value">${student.specialty}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Niveau :</div>
            <div class="student-detail-value">${levelName}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Date d'inscription :</div>
            <div class="student-detail-value">${date}</div>
        </div>
        <div class="student-detail-row">
            <div class="student-detail-label">Newsletter :</div>
            <div class="student-detail-value">${student.newsletter ? 'Oui' : 'Non'}</div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Supprimer un étudiant
let studentToDelete = null;

function deleteStudent(id) {
    studentToDelete = id;
    const student = students.find(s => s.id === id);
    if (student) {
        document.querySelector('#deleteModal .student-name').textContent = 
            `"${student.firstName} ${student.lastName}" (${student.studentId})`;
        document.getElementById('deleteModal').style.display = 'block';
    }
}

// Confirmer la suppression
document.getElementById('confirmDelete')?.addEventListener('click', () => {
    if (studentToDelete) {
        students = students.filter(s => s.id !== studentToDelete);
        saveToLocalStorage();
        updateStatistics();
        renderStudents();
        document.getElementById('deleteModal').style.display = 'none';
        studentToDelete = null;
        
        // Afficher un message de succès
        showToast('Étudiant supprimé avec succès');
    }
});

document.getElementById('cancelDelete')?.addEventListener('click', () => {
    document.getElementById('deleteModal').style.display = 'none';
    studentToDelete = null;
});

// Exporter en CSV
function exportToCSV() {
    const filtered = filterStudents();
    if (filtered.length === 0) {
        alert('Aucun étudiant à exporter');
        return;
    }
    
    const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Matricule', 'Niveau', 'Faculté', 'Spécialité', 'Université', "Date d'inscription"];
    const csvRows = [headers];
    
    filtered.forEach(student => {
        const row = [
            student.id,
            student.firstName,
            student.lastName,
            student.email,
            student.phone,
            student.studentId,
            getLevelName(student.level),
            student.faculty,
            student.specialty,
            student.university,
            new Date(student.registrationDate).toLocaleDateString('fr-FR')
        ];
        csvRows.push(row.map(cell => `"${cell}"`).join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `etudiants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revo

