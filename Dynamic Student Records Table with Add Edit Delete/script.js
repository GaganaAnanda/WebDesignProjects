document.addEventListener("DOMContentLoaded", function () {

    let addRecord = function () {
        try {
            let table = document.getElementById('tab');
            let tbody = table.querySelector('tbody');

            // Get existing student numbers
            let studentNumbers = Array.from(tbody.querySelectorAll('td:nth-child(2)'))
                .map(td => parseInt(td.textContent.replace(/\D/g, '')))
                .sort((a, b) => a - b);

            // Find the first missing number
            let nextNumber = 1;
            for (let num of studentNumbers) {
                if (num === nextNumber) {
                    nextNumber++;
                } else {
                    break;
                }
            }

            // Create new row
            let newRow = document.createElement('tr');

            let newCheckboxCell = document.createElement('td');
            newCheckboxCell.innerHTML = '<input type="checkbox" onclick="onClickCheckbox(this)"><br><img src="arrows.png" alt="arrow" class="image">';

            let newStudentCell = document.createElement('td');
            newStudentCell.textContent = `Student ${nextNumber}`;

            let newAdvisorCell = document.createElement('td');
            newAdvisorCell.textContent = `Teacher ${nextNumber}`;

            let newAwardCell = document.createElement('td');
            newAwardCell.textContent = "Approved";

            let newSemesterCell = document.createElement('td');
            newSemesterCell.textContent = "Fall";

            let newTypeCell = document.createElement('td');
            newTypeCell.textContent = "TA";

            let newBudgetCell = document.createElement('td');
            newBudgetCell.textContent = "3568";

            let newPercentageCell = document.createElement('td');
            newPercentageCell.textContent = "100%";

            // Append all cells
            newRow.appendChild(newCheckboxCell);
            newRow.appendChild(newStudentCell);
            newRow.appendChild(newAdvisorCell);
            newRow.appendChild(newAwardCell);
            newRow.appendChild(newSemesterCell);
            newRow.appendChild(newTypeCell);
            newRow.appendChild(newBudgetCell);
            newRow.appendChild(newPercentageCell);

            tbody.appendChild(newRow);

            // Sort rows by student number
            let rows = Array.from(tbody.querySelectorAll("tr"));
            rows.sort((a, b) => {
                let numA = parseInt(a.children[1].textContent.replace(/\D/g, ""));
                let numB = parseInt(b.children[1].textContent.replace(/\D/g, ""));
                return numA - numB;
            });
            rows.forEach(r => tbody.appendChild(r));

            alert(`Student ${nextNumber} Record added successfully`);
        } catch {
            alert("Error: Failed to add student record!");
        }
    };

    window.addRecord = addRecord;

    window.onClickCheckbox = function (checkbox) {
        let selectedRow = checkbox.closest('tr');
        let color = checkbox.checked ? 'yellow' : 'white';

        let table = document.getElementById('tab');
        let thead = table.querySelector('thead tr');

        // Add DELETE and EDIT headers if checked
        if (checkbox.checked) {
            if (!thead.querySelector('.delete-header')) {
                let deleteHeader = document.createElement('th');
                deleteHeader.textContent = 'DELETE';
                deleteHeader.className = 'delete-header';
                thead.appendChild(deleteHeader);

                let editHeader = document.createElement('th');
                editHeader.textContent = 'EDIT';
                editHeader.className = 'edit-header';
                thead.appendChild(editHeader);
            }

            // Add DELETE button if not present
            if (!selectedRow.querySelector('.delete-btn')) {
                let deleteCell = document.createElement('td');
                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';
                deleteBtn.onclick = function () {
                    let studentName = selectedRow.children[1].textContent;
                    selectedRow.remove();
                    alert(`${studentName} Record deleted successfully`);

                    // Remove headers if no rows left with buttons
                    if (document.querySelectorAll('#tab tbody input[type="checkbox"]:checked').length === 0) {
                        thead.querySelector('.delete-header')?.remove();
                        thead.querySelector('.edit-header')?.remove();
                    }

                    updateSubmitButton();
                };
                deleteCell.appendChild(deleteBtn);
                selectedRow.appendChild(deleteCell);

                // Add EDIT button
                let editCell = document.createElement('td');
                let editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.className = 'edit-btn';
                editBtn.onclick = function () {
                    let studentName = selectedRow.children[1].textContent;
                    let userInput = prompt(`Edit details of ${studentName}`, "");
                    if (userInput !== null && userInput.trim() !== "") {
                        alert(`${studentName} data updated successfully`);
                    }
                };
                editCell.appendChild(editBtn);
                selectedRow.appendChild(editCell);
            }
        } else {
            // Remove DELETE and EDIT buttons if unchecked
            selectedRow.querySelectorAll('.delete-btn, .edit-btn').forEach(btn => {
                btn.closest('td').remove();
            });

            // Remove headers if no rows checked
            if (document.querySelectorAll('#tab tbody input[type="checkbox"]:checked').length === 0) {
                thead.querySelector('.delete-header')?.remove();
                thead.querySelector('.edit-header')?.remove();
            }
        }

        // Apply background color
        selectedRow.querySelectorAll('td').forEach(td => {
            td.style.backgroundColor = color;
        });

        updateSubmitButton();
    }

    function updateSubmitButton() {
        let submitBtn = document.getElementById('submitbtn');
        let anyChecked = document.querySelectorAll('#tab tbody input[type="checkbox"]:checked').length > 0;
        submitBtn.disabled = !anyChecked;
        submitBtn.style.backgroundColor = anyChecked ? 'orange' : 'gray';
    }

    // Green arrow functionality to toggle
    document.getElementById('tab').addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('image')) {
            let row = event.target.closest('tr');
            row.classList.toggle('expanded');

            if (row.classList.contains('expanded')) {
                if (!row.nextElementSibling || !row.nextElementSibling.classList.contains('details')) {
                    let detailsRow = document.createElement('tr');
                    detailsRow.className = 'details';

                    let detailsCell = document.createElement('td');
                    detailsCell.colSpan = row.children.length;
                    detailsCell.style.textAlign = "left";
                    detailsCell.style.padding = "5px";

                    let studentName = row.children[1].textContent;
                    let awardType = row.children[5].textContent;
                    let semester = row.children[4].textContent;
                    let awardStatus = row.children[3].textContent;

                    let awardDetails = "Honor Student";
                    let comments = "Outstanding";

                    detailsCell.innerHTML = `
                    <strong>${studentName} Details:</strong><br>
                    Award Details: ${awardDetails}<br>
                    ${semester} (${awardType})<br>
                    Comments: ${comments}<br>
                    Award Status: ${awardStatus}
                    `;

                    detailsRow.appendChild(detailsCell);
                    row.parentNode.insertBefore(detailsRow, row.nextSibling);
                }
            } else {
                if (row.nextElementSibling && row.nextElementSibling.classList.contains('details')) {
                    row.nextElementSibling.remove();
                }
            }
        }
    });

});
