
const form = document.getElementById("student-form");
const studentList = document.getElementById("student-list");
const searchInput = document.getElementById("search-input");
const submitButton = form.querySelector('button[type="submit"]');

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingIndex = null;


function displayStudents() {
    studentList.innerHTML = "";
     document.getElementById("student-count").textContent = students.length;
    const searchText = searchInput.value.toLowerCase().trim();

    students.forEach(function(student, index) {
        const matchesSearch =
            student.name.toLowerCase().includes(searchText) ||
            student.roll.toLowerCase().includes(searchText) ||
            student.email.toLowerCase().includes(searchText);

        if (!matchesSearch) {
            return;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td>
                <button type="button" class="edit-btn">Edit</button>
                <button type="button" class="delete-btn">Delete</button>
            </td>
        `;

        row.cells[0].textContent = student.name;
        row.cells[1].textContent = student.roll;
        row.cells[2].textContent = student.email;

        row.querySelector(".edit-btn").addEventListener("click", function() {
            document.getElementById("name").value = student.name;
            document.getElementById("roll").value = student.roll;
            document.getElementById("email").value = student.email;

            editingIndex = index;
            submitButton.textContent = "Update Student";
        });

        row.querySelector(".delete-btn").addEventListener("click", function() {
            students.splice(index, 1);

            if (editingIndex === index) {
                resetForm();
            } else if (editingIndex !== null && editingIndex > index) {
                editingIndex--;
            }

            saveStudents();
        });

        studentList.appendChild(row);
    });
}


function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}

function resetForm() {
    form.reset();
    editingIndex = null;
    submitButton.textContent = "Add Student";
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
const roll = document.getElementById("roll").value.trim();

const duplicateExists = students.some(function(existingStudent, index) {
    return existingStudent.roll.toLowerCase() === roll.toLowerCase()
        && index !== editingIndex;
});

if (duplicateExists) {
    alert("This roll number already exists! Please enter a unique roll number.");
    return;
}

    const student = {
    name: document.getElementById("name").value.trim(),
    roll: roll,
    email: document.getElementById("email").value.trim()
};

    if (editingIndex === null) {
        students.push(student);
    } else {
        students[editingIndex] = student;
    }

   const message = document.getElementById("message");

const action = editingIndex === null ? "added" : "updated";

saveStudents();
resetForm();

message.textContent = "Student " + action + " successfully!";
message.className = "success";
});

displayStudents();
searchInput.addEventListener("input", displayStudents);
