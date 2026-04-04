const LEADERBOARD_REFRESH = 30000;

$(document).ready(function() {
    updateYourSchoolDisplay([]);
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
const script = "https://script.google.com/macros/s/AKfycbwYlrgMp2qSG6DwVPGhHrN0ityn7-nvMtda3ZvVeJNJH6UVjBGQ5e19WyJ808VMEKupNg/exec"
const url = "https://script.google.com/macros/s/AKfycbz9iZOxW_LUhyWiWalrqMnVYC0UGj9PEqaYl_BLeHON7GPmMhDa4e_aL-Kbsv6fO9iPXw/exec"

function populateStates() {
    const stateSelect = $('#stateSelect')
    // stateSelect.innerHTML = '<option value="">Choose a State...</option>';

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
        const response = await fetch(`${script}?action=getCities&state=${encodeURIComponent(stateSelect)}`);
        const cities = await response.json();

        citySelect.empty().append('<option value="">Search for a City...</option>');

        cities.forEach(city => {
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

    schoolSelect.empty().append('<option>Loading schools...</option>')

    try {
        const response = await fetch(`${script}?action=getSchools&state=${encodeURIComponent(stateSelect)}&city=${encodeURIComponent(citySelect)}`);
        const schools = await response.json();

        schoolSelect.empty().append('<option value="">Search for a school...</option>');

        schools.forEach(school => {
            schoolSelect.append(new Option(school, school));
        })
        schoolSelect.trigger('change');
        schoolSelect.prop('disabled', false);
    } catch(error) {
        console.error("Fetch failed:" + error)
        schoolSelect.empty().append('<option>Error loading cities</option>')
    }
}

$(document).on('click', '#submitSchool', function(e) {
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

    $('#schoolModal').hide(); 
    updateYourSchoolDisplay();

});

async function loadLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');

    if (!leaderboardBody) {
        console.error("Target div 'leaderboard-body' not found in HTML");
        return;
    }

    // leaderboardBody.innerHTML = "<div class='white tc pa3 f6'>Loading leaderboard...</div>";
    try {
        const response = await fetch(`${url}?action=getLeaderboard`);
        const data = await response.json();
        leaderboardBody.innerHTML = ""; 

        data.forEach((school, index) => {
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
                    <div class="w-60 f5 ${rank === 1 ? 'orange' : 'white'}">${school.name}</div>
                    <div class="w-20 tr f5 ${rank === 1 ? 'b orange' : 'white'}">${school.seconds.toLocaleString()}</div>
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
            $('#displaySchoolPoints').text(schoolInList.seconds.toLocaleString());
        } else {
            $('#displaySchoolPoints').text("0");
        }
        
        displayDiv.removeClass('dn').fadeIn();
    } else {
        displayDiv.addClass('dn');
    }
}

$(document).on('click', '#closeModal', function() {
    $('#schoolModal').addClass('dn').hide();
    updateYourSchoolDisplay();
});