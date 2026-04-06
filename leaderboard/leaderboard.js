const LEADERBOARD_REFRESH = 30000;

$(document).ready(function() {
    loadLeaderboard();
    
    $('#stateSelect').select2({ placeholder: "Search for a State..." });
    $('#citySelect').select2({ placeholder: "Search for a City..." });
    $('#schoolSelect').select2({ placeholder: "Search for a School..." });

    const savedUser = localStorage.getItem('userSchoolInfo');
    if (savedUser) {
        $('#schoolModal').addClass('dn').hide();
        console.log("User already selected a school.");
    } else {
        $('#schoolModal').removeClass('dn').show();
    }
    
    $('#stateSelect').on('change.select2', fetchCities);
    $('#citySelect').on('change.select2', fetchSchools);

    $(document).on('click', '#changeSchoolBtn', function() {        
        $('#stateSelect').val('').trigger('change');
        $('#citySelect').empty().append('<option value="">Choose a city...</option>').prop('disabled', true).trigger('change');
        $('#schoolSelect').empty().append('<option value="">Choose a school...</option>').prop('disabled', true).trigger('change');

        $('#schoolModal').removeClass('dn').show();
    });
    
    populateStates();
});

let schools = [];
const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
const url = "https://script.google.com/macros/s/AKfycbz9iZOxW_LUhyWiWalrqMnVYC0UGj9PEqaYl_BLeHON7GPmMhDa4e_aL-Kbsv6fO9iPXw/exec"

function populateStates() {
    const stateSelect = $('#stateSelect')

    states.forEach(state => {
        const opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        stateSelect.append(opt);
    });
    stateSelect.trigger('change')
}

async function fetchCities() {
    const stateSelect = $('#stateSelect').val();
    const citySelect = $('#citySelect');

    if (!stateSelect) return;
    
    citySelect.empty().append('<option>Loading cities...</option>');

    try {
        console.log("sending request for cities " + (new Date().getTime() % 10000));
        const response = await import(`/schools/${stateSelect}.js`);
        stateData = await response.getStateSchools();
        console.log("response received " + (new Date().getTime() % 10000));


        let citySet = new Set();
        stateData.forEach(item => {
            citySet.add(item.city)
        })
        const sortedCities = Array.from(citySet).sort();

        citySelect.empty().append('<option value="">Search for a City...</option>');

        sortedCities.forEach(city => {
            citySelect.append(new Option(city, city));
        });
        citySelect.trigger('change');
        citySelect.prop('disabled', false);

    } catch(error) {
        console.error("Fetch failed:", error);
        citySelect.empty().append('<option>Error loading cities</option>')
    }
}

async function fetchSchools() {
    const stateSelect = $('#stateSelect').val()
    const citySelect = $('#citySelect').val();
    const schoolSelect = $('#schoolSelect')

    if (!citySelect || stateData.length === 0) return;

    const schoolsInCity = stateData
    .filter(item => item.city === citySelect)
    .map(item => item.school)
    .sort();

    schoolSelect.empty().append('<option value="">Search for a school...</option>');

    schoolsInCity.forEach(school => {
        schoolSelect.append(new Option(school, school));
    })
    schoolSelect.trigger('change');
    schoolSelect.prop('disabled', false);
}

$(document).on('click', '#submitSchool', async function(e) {
    e.preventDefault(); 

    const finalState = $('#stateSelect').val();
    const finalCity = $('#citySelect').val();
    const finalSchool = $('#schoolSelect').val();

    if (!finalSchool || finalSchool === "") {
        console.log("No school selected yet.");
        alert("Please select a school!");
        return;
    }

    const userData = {
        state: finalState,
        city: finalCity,
        school: finalSchool,
        points: 0 
    };
    
    localStorage.setItem('userSchoolInfo', JSON.stringify(userData));

    $('#displaySchoolName').text(finalSchool);
    $('#displaySchoolRank').text("⏳");
    $('#displaySchoolPoints').text("⏳");
    $('#userSchoolDisplay').removeClass('dn').show();
    $('#schoolModal').hide();

    await loadLeaderboard();
});

async function loadLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');

    if (document.hidden) {
    console.log("Tab hidden. Leaderboard paused.");
    return;
    }

    if (!leaderboardBody) {
        console.error("Target div 'leaderboard-body' not found in HTML");
        return;
    }

    try {
        const response = await fetch(`${url}?action=getLeaderboard`);
        const data = await response.json();
        leaderboardBody.innerHTML = ""; 
        
        data.forEach((school, index) => {
            if (index >= 5) return; 

            const rank = index + 1;
            let rankDisplay = rank;
            let rowClass = "bg-white-05 ba b--white-10";
            let textClass = "white";

            if (rank === 1) {
                rankDisplay = "🏆";
                rowClass = "bg-white-10 shadow-4 orange";
                var style = 'style="outline: 4px inset #ff7b1a;"';
            } else if (rank === 2) {
                rankDisplay = "🥈";
            } else if (rank === 3) {
                rankDisplay = "🥉";
            } else {
                rankDisplay = `${rank}th`;
                textClass = "white";
            }

            const row = `
                <div class="flex flex-row items-center w-100 pa3 mb2 br3 grow ${rowClass}" ${rank === 1 ? style : ''}>
                    <div class="w-20 tc f4 silver">${rankDisplay}</div>
                    
                    <div class="w-60 flex flex-column items-center tc">
                        <div class="f5  ${rank === 1 ? 'orange b' : 'white'} mb1">
                            ${school.name}
                        </div>
                        <div class="f7 silver ttu tracked" style="font-size: 0.55rem; opacity: 0.8;">
                            ${school.location}
                        </div>
                    </div>
                    
                    <div class="w-20 tr f5 ${rank === 1 ? 'orange' : 'white'}">
                        ${school.minutes.toLocaleString()}
                    </div>
                </div>
            `;

            leaderboardBody.innerHTML += row;
        });
        console.log("Loaded leaderboard")
        updateYourSchoolDisplay(data);
    } catch (error) {
        console.error("Leaderboard error:", error);
        leaderboardBody.innerHTML = "<tr><td colspan='3'>Error loading leaderboard.</td></tr>";
    }
}

setInterval(loadLeaderboard, LEADERBOARD_REFRESH);

function updateYourSchoolDisplay(leaderboardData = []) {
    const savedData = localStorage.getItem('userSchoolInfo');
    const displayDiv = $('#userSchoolDisplay');

    if (savedData) {
        const userData = JSON.parse(savedData);
        
        $('#displaySchoolName').text(userData.school);
        
        const schoolInList = (leaderboardData || []).find(s => s.name === userData.school);
        
        if (schoolInList) {
            $('#displaySchoolRank').text(`#${schoolInList.rank}`);
            $('#displaySchoolPoints').text(schoolInList.minutes.toLocaleString());
        } else {
            $('#displaySchoolRank').text("N/A");
            $('#displaySchoolPoints').text("0");
        }
        displayDiv.removeClass('dn').fadeIn();

    } else {
        $('#displaySchoolRank').text("N/A");
        $('#displaySchoolPoints').text("N/A");
        $('#displaySchoolName').text("N/A");
        displayDiv.removeClass('dn').fadeIn();

    }
}

$(document).on('click', '#closeModal', function() {
    $('#schoolModal').addClass('dn').hide();
    updateYourSchoolDisplay();
    
});