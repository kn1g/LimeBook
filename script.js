document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#csvTable tbody');
    const filterInput = document.getElementById('filterInput');
    let rows = [];

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

                renderTable(rows);
            })
            .catch(error => console.error('Error fetching CSV:', error));
    }

    function renderTable(rows) {
        tableBody.innerHTML = rows.join('');
    }

    function filterTable() {
        const filterValue = filterInput.value.toUpperCase();
        const filteredRows = rows.filter(row => row.toUpperCase().includes(filterValue));
        renderTable(filteredRows);
    }

    function sortTable(n) {
        let rowsArray = Array.from(tableBody.rows);
        const isAsc = tableBody.getAttribute('data-sort-order') !== 'asc';
        tableBody.setAttribute('data-sort-order', isAsc ? 'asc' : 'desc');

        rowsArray.sort((a, b) => {
            const cellA = a.cells[n].innerText;
            const cellB = b.cells[n].innerText;

            if (!isNaN(cellA) && !isNaN(cellB)) {
                return isAsc ? cellA - cellB : cellB - cellA;
            }

            return isAsc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        renderTable(rowsArray.map(row => row.outerHTML));
    }

    filterInput.addEventListener('input', filterTable);
    loadCSV();
});
