'use strict';

const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;

function ResumeHeader(props) {
    const [name, setName] = useState(props.name);

    return e('div', {className: 'resume-header left-border'}, 
        e('h1', {className: "header-name"}, name),
        e('h3', {className: "header-info"}, props.location + " • " + props.phone + " • " + props.email)
    );
}

function Divider(props) {
    return e('div', {},
        e('p', {className: 'divider-heading'}, props.heading),
        e('hr', {className: 'divider-line'})
    );
}

function CompanySection(props) {
    const [showPrevious, setShowPrevious] = useState(false);
    const [displayedJobs, setDisplayedJobs] = useState([props.positions[0]]);
    const [companyStart, setCompanyStart] = useState(props.positions[props.positions.length - 1].start);
    const [companyEnd, setCompanyEnd] = useState(props.positions[0].end ? props.positions[0].end : 'Present');
    
    function handleChange() {
        setShowPrevious(!showPrevious); 
        if (!showPrevious) {
            setDisplayedJobs(props.positions);
        } else {
            setDisplayedJobs([props.positions[0]])
        }
    }

    return e('div', {}, 
        e('h3', {className: 'primary-color company-section-heading'}, props.name),
        e('p', {}, companyStart + ' - ' + companyEnd),
        displayedJobs.map((p, index) => 
            e(JobCard, 
                {
                    key: index,
                    company: props.name, 
                    title: p.title, 
                    team: p.team,
                    location: p.location,
                    start: p.start, 
                    end: p.end,
                    duties: p.duties
                }
            )
        ),
        props.positions.length <= 1 ? '' : e('p', {onClick: () => handleChange(), className: 'show-more-button'}, 
                                            (showPrevious ? '▲ Hide ' : '▼ Show ') 
                                            + (props.positions.length - 1).toString() 
                                            + ' previous jobs')
    )
}

function JobCard(props) {
    return e('div', {className: 'job-card left-border'},
        e('p', {className: "job-title"}, props.title),
        e('p', {className: "job-team"}, props.team),
        e(DutiesList, {duties: props.duties}),
        e('p', {className: "job-subheading"}, props.location),
        e('p', {className: "job-subheading"}, '(' + props.start + ' - ' + (props.end ? props.end : 'present') + ')')
        //e('p', {}, props.technologies)
    )
}

function DutiesList(props) {
    return e('ul', {style: {padding: "1em", marginBottom: "0"}}, props.duties.map((duty, index) => e('li', {key: index}, duty)));
}

function Resume(json) {
    return e('div', {}, 
        e(ResumeHeader, {name: json.name, location: json.contactInfo.location, phone: json.contactInfo.phone, email: json.contactInfo.email}),
        e(Divider, {heading: 'Experience'}),
        json.jobs.map((j, index) => e(CompanySection, {key: index, name: j.company, positions: j.positions}))
    );
}


const domContainer = document.querySelector('#resume');

fetch("ryan.json")
    .then(response => response.json())
    .then(json => ReactDOM.render(e(Resume, json), domContainer));

