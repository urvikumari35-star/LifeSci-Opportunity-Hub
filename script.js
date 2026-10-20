// ============================================
// LifeSci Internship Hub
// Main JavaScript
// ============================================


// --------------------------------------------
// 1. GLOBAL DATA
// --------------------------------------------

let allOpportunities = [];

let selectedCountry = "All";


// --------------------------------------------
// 2. GET HTML ELEMENTS
// --------------------------------------------

const opportunitiesGrid =
    document.getElementById("opportunitiesGrid");

const searchInput =
    document.getElementById("searchInput");

const audienceFilter =
    document.getElementById("audienceFilter");

const typeFilter =
    document.getElementById("typeFilter");

const accessFilter =
    document.getElementById("accessFilter");

const fundingFilter =
    document.getElementById("fundingFilter");

const statusFilter =
    document.getElementById("statusFilter");

const verifiedFilter =
    document.getElementById("verifiedFilter");

const resultsCount =
    document.getElementById("resultsCount");

const clearFilters =
    document.getElementById("clearFilters");

const resetSearch =
    document.getElementById("resetSearch");

const countryGrid =
    document.getElementById("countryGrid");

const noResults =
    document.getElementById("noResults");

const activeFilterMessage =
    document.getElementById("activeFilterMessage");

const heroOpportunityCount =
    document.getElementById("heroOpportunityCount");

const heroCountryCount =
    document.getElementById("heroCountryCount");


// --------------------------------------------
// 3. LOAD JSON DATABASE
// --------------------------------------------

fetch("Data/opportunities.json")

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Could not load opportunities.json"
            );
        }

        return response.json();

    })

    .then(data => {

        allOpportunities = data;

        updateHeroStats();

        createFilterOptions();

        createCountryCards();

        displayOpportunities();

    })

    .catch(error => {

        console.error(
            "Could not load opportunities:",
            error
        );

        opportunitiesGrid.innerHTML = `
            <div class="no-results">
                <h3>Unable to load opportunities</h3>
                <p>
                    Please make sure
                    <strong>opportunities.json</strong>
                    is in the same folder as
                    <strong>index.html</strong>.
                </p>
            </div>
        `;

    });


// --------------------------------------------
// 4. HERO STATISTICS
// --------------------------------------------

function updateHeroStats() {

    if (heroOpportunityCount) {

        heroOpportunityCount.textContent =
            allOpportunities.length;

    }


    const countries = [
        ...new Set(
            allOpportunities
                .map(opportunity => opportunity.country)
                .filter(Boolean)
        )
    ];


    if (heroCountryCount) {

        heroCountryCount.textContent =
            countries.length;

    }

}


// --------------------------------------------
// 5. CREATE FILTER OPTIONS
// --------------------------------------------

function createFilterOptions() {

    createSelectOptions(
        audienceFilter,
        getUniqueArrayValues("audience")
    );


    createSelectOptions(
        typeFilter,
        getUniqueArrayValues("type")
    );


    createSelectOptions(
        accessFilter,
        getUniqueArrayValues("access")
    );


    createSelectOptions(
        fundingFilter,
        getUniqueArrayValues("funding")
    );


    createSelectOptions(
        statusFilter,
        getUniqueArrayValues("status")
    );

}


// --------------------------------------------
// 6. GET UNIQUE VALUES
// --------------------------------------------

function getUniqueArrayValues(field) {

    const values = [];

    allOpportunities.forEach(opportunity => {

        const value = opportunity[field];

        if (Array.isArray(value)) {

            value.forEach(item => {

                if (item && !values.includes(item)) {
                    values.push(item);
                }

            });

        }

        else if (value && !values.includes(value)) {

            values.push(value);

        }

    });


    return values.sort();

}


// --------------------------------------------
// 7. ADD OPTIONS TO SELECT
// --------------------------------------------

function createSelectOptions(selectElement, values) {

    if (!selectElement) {
        return;
    }


    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;

        option.textContent = value;

        selectElement.appendChild(option);

    });

}


// --------------------------------------------
// 8. CREATE COUNTRY CARDS
// --------------------------------------------

function createCountryCards() {

    if (!countryGrid) {
        return;
    }


    const countries = [
        ...new Set(
            allOpportunities
                .map(opportunity => opportunity.country)
                .filter(Boolean)
        )
    ].sort();


    countryGrid.innerHTML = "";


    // ALL COUNTRIES CARD

    const allCard =
        document.createElement("button");

    allCard.type = "button";

    allCard.className =
        "country-card active";

    allCard.dataset.country = "All";

    allCard.innerHTML = `
        <span class="country-card-icon">🌍</span>

        <span class="country-card-name">
            All countries
        </span>

        <span class="country-card-count">
            ${allOpportunities.length} opportunities
        </span>
    `;


    allCard.addEventListener(
        "click",
        function () {

            selectedCountry = "All";

            updateCountryCards();

            displayOpportunities();

            scrollToOpportunities();

        }
    );


    countryGrid.appendChild(allCard);


    // INDIVIDUAL COUNTRIES

    countries.forEach(country => {

        const count =
            allOpportunities.filter(
                opportunity =>
                    opportunity.country === country
            ).length;


        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "country-card";

        card.dataset.country =
            country;


        card.innerHTML = `
            <span class="country-card-icon">
                ${getCountryIcon(country)}
            </span>

            <span class="country-card-name">
                ${escapeHTML(country)}
            </span>

            <span class="country-card-count">
                ${count} ${count === 1 ? "opportunity" : "opportunities"}
            </span>
        `;


        card.addEventListener(
            "click",
            function () {

                selectedCountry = country;

                updateCountryCards();

                displayOpportunities();

                scrollToOpportunities();

            }
        );


        countryGrid.appendChild(card);

    });

}


// --------------------------------------------
// 9. COUNTRY ICONS
// --------------------------------------------

function getCountryIcon(country) {

    const icons = {

        "India": "🇮🇳",

        "Japan": "🇯🇵",

        "Taiwan": "🇹🇼",

        "Singapore": "🇸🇬",

        "South Korea": "🇰🇷",

        "China": "🇨🇳",

        "Saudi Arabia": "🇸🇦",

        "Thailand": "🇹🇭",

        "Malaysia": "🇲🇾",

        "Poland": "🇵🇱",

        "Czech Republic": "🇨🇿",

        "Belgium": "🇧🇪",

        "Finland": "🇫🇮",

        "Austria": "🇦🇹",

        "Switzerland": "🇨🇭",

        "Spain": "🇪🇸",

        "Germany": "🇩🇪",

        "Türkiye": "🇹🇷",

        "Turkey": "🇹🇷"

    };


    return icons[country] || "🌐";

}


// --------------------------------------------
// 10. UPDATE ACTIVE COUNTRY
// --------------------------------------------

function updateCountryCards() {

    const cards =
        document.querySelectorAll(
            ".country-card"
        );


    cards.forEach(card => {

        card.classList.remove("active");


        if (
            card.dataset.country ===
            selectedCountry
        ) {

            card.classList.add("active");

        }

    });

}


// --------------------------------------------
// 11. DISPLAY OPPORTUNITIES
// --------------------------------------------

function displayOpportunities() {

    if (!opportunitiesGrid) {
        return;
    }


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedAudience =
        audienceFilter
            ? audienceFilter.value
            : "all";


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "all";


    const selectedAccess =
        accessFilter
            ? accessFilter.value
            : "all";


    const selectedFunding =
        fundingFilter
            ? fundingFilter.value
            : "all";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const onlyVerified =
        verifiedFilter
            ? verifiedFilter.checked
            : false;


    const filteredOpportunities =
        allOpportunities.filter(
            opportunity => {

                // COUNTRY

                const matchesCountry =
                    selectedCountry === "All" ||
                    opportunity.country ===
                        selectedCountry;


                // SEARCH

                const searchableText = [

                    opportunity.name,

                    opportunity.institution,

                    opportunity.country,

                    opportunity.type,

                    opportunity.funding,

                    opportunity.access,

                    opportunity.eligibility

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    searchableText.includes(
                        searchTerm
                    );


                // AUDIENCE

                const matchesAudience =
                    selectedAudience === "all" ||
                    (
                        Array.isArray(
                            opportunity.audience
                        ) &&
                        opportunity.audience.includes(
                            selectedAudience
                        )
                    );


                // TYPE

                const matchesType =
                    selectedType === "all" ||
                    opportunity.type ===
                        selectedType;


                // ACCESS

                const matchesAccess =
                    selectedAccess === "all" ||
                    opportunity.access ===
                        selectedAccess;


                // FUNDING

                const matchesFunding =
                    selectedFunding === "all" ||
                    opportunity.funding ===
                        selectedFunding;


                // STATUS

                const matchesStatus =
                    selectedStatus === "all" ||
                    opportunity.status ===
                        selectedStatus;


                // VERIFIED

                const matchesVerified =
                    !onlyVerified ||
                    opportunity.verified === true;


                return (
                    matchesCountry &&
                    matchesSearch &&
                    matchesAudience &&
                    matchesType &&
                    matchesAccess &&
                    matchesFunding &&
                    matchesStatus &&
                    matchesVerified
                );

            }
        );


    renderResults(
        filteredOpportunities
    );


    updateResultsCount(
        filteredOpportunities.length
    );


    updateActiveFilterMessage();

}


// --------------------------------------------
// 12. RENDER RESULTS
// --------------------------------------------

function renderResults(opportunities) {

    opportunitiesGrid.innerHTML = "";


    if (noResults) {
        noResults.hidden =
            opportunities.length !== 0;
    }


    if (opportunities.length === 0) {

        return;

    }


    opportunities.forEach(
        opportunity => {

            const card =
                createOpportunityCard(
                    opportunity
                );


            opportunitiesGrid.appendChild(
                card
            );

        }
    );

}


// --------------------------------------------
// 13. CREATE OPPORTUNITY CARD
// --------------------------------------------

function createOpportunityCard(
    opportunity
) {

    const article =
        document.createElement("article");


    article.className =
        "opportunity-card";


    const audienceText =
        Array.isArray(
            opportunity.audience
        )
            ? opportunity.audience.join(", ")
            : opportunity.audience || "Not specified";


    const verifiedBadge =
        opportunity.verified === true
            ? `
                <span class="verified-badge">
                    ✓ Verified
                </span>
              `
            : "";


    const statusClass =
        getStatusClass(
            opportunity.status
        );


    const officialURL =
        isSafeURL(
            opportunity.officialUrl
        )
            ? opportunity.officialUrl
            : "#";


    article.innerHTML = `

        <div class="card-top">

            <span class="country-tag">
                ${getCountryIcon(
                    opportunity.country
                )}
                ${escapeHTML(
                    opportunity.country || "International"
                )}
            </span>

            <span class="type-tag">
                ${escapeHTML(
                    opportunity.type || "Opportunity"
                )}
            </span>

            ${verifiedBadge}

        </div>


        <h3>
            ${escapeHTML(
                opportunity.name
            )}
        </h3>


        <p class="institution">
            ${escapeHTML(
                opportunity.institution ||
                "Institution not specified"
            )}
        </p>


        <div class="status-row">

            <span class="status-badge ${statusClass}">
                ${escapeHTML(
                    opportunity.status ||
                    "Status unknown"
                )}
            </span>

        </div>


        <div class="details">

            <p>
                <strong>Audience</strong>
                ${escapeHTML(
                    audienceText
                )}
            </p>


            <p>
                <strong>Funding</strong>
                ${escapeHTML(
                    opportunity.funding ||
                    "Not specified"
                )}
            </p>


            <p>
                <strong>Duration</strong>
                ${escapeHTML(
                    opportunity.duration ||
                    "Not specified"
                )}
            </p>


            <p>
                <strong>Deadline</strong>
                ${escapeHTML(
                    opportunity.deadline ||
                    "Not specified"
                )}
            </p>


            <p>
                <strong>Application route</strong>
                ${escapeHTML(
                    opportunity.access ||
                    "Not specified"
                )}
            </p>


            <p>
                <strong>Eligibility</strong>
                ${escapeHTML(
                    opportunity.eligibility ||
                    "Check official source"
                )}
            </p>

        </div>


        <a
            class="apply-button"
            href="${officialURL}"
            target="_blank"
            rel="noopener noreferrer"
        >
            View official opportunity →
        </a>

    `;


    return article;

}


// --------------------------------------------
// 14. STATUS CSS CLASS
// --------------------------------------------

function getStatusClass(status) {

    if (!status) {
        return "status-unknown";
    }


    const value =
        status.toLowerCase();


    if (value.includes("open")) {
        return "status-open";
    }


    if (value.includes("upcoming")) {
        return "status-upcoming";
    }


    if (value.includes("closed")) {
        return "status-closed";
    }


    if (value.includes("rolling")) {
        return "status-rolling";
    }


    if (value.includes("project")) {
        return "status-project";
    }


    return "status-unknown";

}


// --------------------------------------------
// 15. RESULTS COUNT
// --------------------------------------------

function updateResultsCount(count) {

    if (!resultsCount) {
        return;
    }


    resultsCount.textContent =
        `${count} ${
            count === 1
                ? "opportunity"
                : "opportunities"
        }`;

}


// --------------------------------------------
// 16. ACTIVE FILTER MESSAGE
// --------------------------------------------

function updateActiveFilterMessage() {

    if (!activeFilterMessage) {
        return;
    }


    const activeFilters = [];


    if (selectedCountry !== "All") {

        activeFilters.push(
            selectedCountry
        );

    }


    if (
        audienceFilter &&
        audienceFilter.value !== "all"
    ) {

        activeFilters.push(
            audienceFilter.value
        );

    }


    if (
        typeFilter &&
        typeFilter.value !== "all"
    ) {

        activeFilters.push(
            typeFilter.value
        );

    }


    if (
        accessFilter &&
        accessFilter.value !== "all"
    ) {

        activeFilters.push(
            accessFilter.value
        );

    }


    if (
        fundingFilter &&
        fundingFilter.value !== "all"
    ) {

        activeFilters.push(
            fundingFilter.value
        );

    }


    if (
        statusFilter &&
        statusFilter.value !== "all"
    ) {

        activeFilters.push(
            statusFilter.value
        );

    }


    if (
        verifiedFilter &&
        verifiedFilter.checked
    ) {

        activeFilters.push(
            "Verified only"
        );

    }


    if (activeFilters.length === 0) {

        activeFilterMessage.textContent = "";

        return;

    }


    activeFilterMessage.textContent =
        `Active filters: ${activeFilters.join(", ")}`;

}


// --------------------------------------------
// 17. SEARCH EVENT
// --------------------------------------------

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayOpportunities
    );

}


// --------------------------------------------
// 18. FILTER EVENTS
// --------------------------------------------

[
    audienceFilter,
    typeFilter,
    accessFilter,
    fundingFilter,
    statusFilter
].forEach(filter => {

    if (filter) {

        filter.addEventListener(
            "change",
            displayOpportunities
        );

    }

});


// --------------------------------------------
// 19. VERIFIED FILTER
// --------------------------------------------

if (verifiedFilter) {

    verifiedFilter.addEventListener(
        "change",
        displayOpportunities
    );

}


// --------------------------------------------
// 20. CLEAR FILTERS
// --------------------------------------------

if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        resetAllFilters
    );

}


if (resetSearch) {

    resetSearch.addEventListener(
        "click",
        resetAllFilters
    );

}


// --------------------------------------------
// 21. RESET EVERYTHING
// --------------------------------------------

function resetAllFilters() {

    selectedCountry = "All";


    if (searchInput) {
        searchInput.value = "";
    }


    if (audienceFilter) {
        audienceFilter.value = "all";
    }


    if (typeFilter) {
        typeFilter.value = "all";
    }


    if (accessFilter) {
        accessFilter.value = "all";
    }


    if (fundingFilter) {
        fundingFilter.value = "all";
    }


    if (statusFilter) {
        statusFilter.value = "all";
    }


    if (verifiedFilter) {
        verifiedFilter.checked = false;
    }


    updateCountryCards();

    displayOpportunities();

}


// --------------------------------------------
// 22. SCROLL TO OPPORTUNITIES
// --------------------------------------------

function scrollToOpportunities() {

    const section =
        document.getElementById(
            "opportunities"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// --------------------------------------------
// 23. SECURITY / HTML ESCAPING
// --------------------------------------------

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// --------------------------------------------
// 24. CHECK OFFICIAL URL
// --------------------------------------------

function isSafeURL(url) {

    if (!url) {
        return false;
    }


    try {

        const parsedURL =
            new URL(url);


        return (
            parsedURL.protocol === "http:" ||
            parsedURL.protocol === "https:"
        );

    }

    catch (error) {

        return false;

    }

}