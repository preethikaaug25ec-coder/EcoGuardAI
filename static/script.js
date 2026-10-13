document.addEventListener("DOMContentLoaded", function () {
    const data = window.ecoGuardData;

    // ---------------- WASTE CHART ----------------

    const canvas = document.getElementById("wasteChart");

    if (canvas && window.Chart && data) {
        const labels = data.streets.map(street => street.name);
        const values = data.streets.map(street => street.waste);

        new Chart(canvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Waste (kg)",
                    data: values,
                    backgroundColor: values.map((value, index) =>
                        index === values.indexOf(Math.max(...values))
                            ? "#176b48"
                            : "#8bd3a5"
                    ),
                    hoverBackgroundColor: "#29965d",
                    borderRadius: 6,
                    borderSkipped: false,
                    maxBarThickness: 42
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "#102d23",
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y + " kg recorded";
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: "#7f8e82",
                            font: {
                                family: "DM Sans",
                                size: 10
                            },
                            maxRotation: 0,
                            minRotation: 0,
                            autoSkip: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        border: {
                            display: false,
                            dash: [3, 4]
                        },
                        grid: {
                            color: "#edf1ed",
                            drawTicks: false
                        },
                        ticks: {
                            color: "#8b978e",
                            padding: 9,
                            font: {
                                family: "DM Sans",
                                size: 9
                            }
                        }
                    }
                }
            }
        });
    }

    // ---------------- STREET SEARCH ----------------

    const searchInput = document.getElementById("streetSearch");
    const table = document.getElementById("streetTable");
    const emptyState = document.getElementById("emptyState");

    if (searchInput && table) {
        searchInput.addEventListener("input", function () {
            const query = searchInput.value.trim().toLowerCase();
            const rows = table.querySelectorAll("tbody tr");
            let visibleCount = 0;

            rows.forEach(function (row) {
                const matches = row.textContent.toLowerCase().includes(query);

                row.hidden = !matches;

                if (matches) {
                    visibleCount++;
                }
            });

            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        });
    }

    // ---------------- EXPORT CSV ----------------

    const exportButton = document.getElementById("exportButton");

    if (exportButton && data) {
        exportButton.addEventListener("click", function () {
            const rows = [
                [
                    "Street",
                    "Waste (kg)",
                    "Organic Waste (kg)",
                    "Collection Delay (days)",
                    "Risk Score",
                    "Risk Level"
                ],
                ...data.streets.map(street => [
                    street.name,
                    street.waste,
                    street.organic,
                    street.delay,
                    street.score,
                    street.risk
                ])
            ];

            const csv = rows.map(row =>
                row.map(value =>
                    '"' + String(value).replace(/"/g, '""') + '"'
                ).join(",")
            ).join("\r\n");

            const blob = new Blob(
                ["\uFEFF" + csv],
                { type: "text/csv;charset=utf-8;" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "ecoguard-street-report.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        });
    }

    // ---------------- REFRESH DASHBOARD ----------------

    const refreshButton = document.getElementById("refreshButton");

    if (refreshButton) {
        refreshButton.addEventListener("click", function () {
            refreshButton.disabled = true;
            refreshButton.textContent = "…";
            window.location.reload();
        });
    }

    // ---------------- SIDEBAR ACTIVE STATE ----------------

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });
});