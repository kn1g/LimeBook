document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#csvTable tbody');
    const searchFields = [
        document.getElementById('searchCode'),
        document.getElementById('searchYear'),
        document.getElementById('searchCI'),
        document.getElementById('searchHP'),
        document.getElementById('searchEquipment'),
        document.getElementById('searchAutomobile')
    ];
    const sortArrows = document.querySelectorAll('.sort-arrow');
    let rows = [];
    let originalData = [];
    let sortOrder = Array(searchFields.length).fill('asc');

    function loadCSV() {
        fetch('motorCodeDB.csv')
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');
                lines.shift(); // remove header line

                rows = lines.map(line => {
                    const columns = line.split(';');
                    return `<tr>
                        <td>${columns[0]}</td>
                        <td>${columns[1]}</td>
                        <td>${columns[2]}</td>
                        <td>${columns[3]}</td>
                        <td>${columns[4]}</td>
                        <td>${columns[5]}</td>
                    </tr>`;
                });

                originalData = [...rows];
                renderTable(rows);
            })
            .catch(error => console.error('Error fetching CSV:', error));
    }

    function renderTable(rows) {
        tableBody.innerHTML = rows.join('');
    }

    function filterTable() {
        const filterValues = searchFields.map(input => input.value.toUpperCase());
        const filteredRows = originalData.filter(row => {
            return filterValues.every((value, index) => {
                const cellText = row.split('<td>')[index + 1].split('</td>')[0].toUpperCase();
                return cellText.includes(value);
            });
        });
        rows = filteredRows;
        renderTable(filteredRows);
    }

    function sortTable(n) {
        const isAsc = sortOrder[n] === 'asc';
        sortOrder[n] = isAsc ? 'desc' : 'asc';

        rows.sort((a, b) => {
            const cellA = a.split('<td>')[n + 1].split('</td>')[0];
            const cellB = b.split('<td>')[n + 1].split('</td>')[0];

            if (!isNaN(cellA) && !isNaN(cellB)) {
                return isAsc ? cellA - cellB : cellB - cellA;
            }

            return isAsc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        renderTable(rows);
    }

    searchFields.forEach(input => input.addEventListener('input', filterTable));
    sortArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            sortTable(parseInt(this.getAttribute('data-index')));
        });
    });

    loadCSV();
});
