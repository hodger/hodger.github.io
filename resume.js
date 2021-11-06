'use strict';

const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;

function Resume(json) {
    const [mode, setMode] = useState("");
    const [query, setQuery] = useState("");
    
    useEffect(() => {
        if (location.search) {
            let temp = location.search.slice(1);
            const [key, value] = temp.split("=");
            setMode(key.toLowerCase());
            setQuery(decodeURI(value));
        } else {
            setMode(null); 
            setQuery(null);
        }
    });

    switch (mode) {
        case "skill":
            return e(SkillSearchResume, {json, query});
        default:
            return e(ChronologicalResume, json);
    }
}

function SkillSearchResume({json, query}) {
    const relevantJobs = () => 
        json.jobs.map(j => j.positions)
                 .flat()
                 .filter(p => p.skills && p.skills.map(s => s.toLowerCase())
                                                  .includes(query.toLowerCase()));

    const [positions, setPositions] = useState(relevantJobs());

    useEffect(() => {
        setPositions(relevantJobs());
    }, [query]);

    return e('div', {}, 
                        e(Divider, {heading: 'Matching Experience'}),
                        e(SkillChip, {skill: query}),
                        e('i', {style: 
                                    {display: "inline",
                                     cursor: "pointer"}, 
                                onClick: () => {
                                    reload('/resume');
                                }}, 'clear'),
                        positions.map((p, index) => e(JobCard, {
                            key: index,
                            title: p.title, 
                            team: p.team,
                            location: p.location,
                            start: p.start, 
                            end: p.end,
                            duties: p.duties,
                            skills: p.skills
                        }))
                    );
}

function ChronologicalResume(json) {
    return e('div', {}, 
                        e(Divider, {heading: 'Education'}),
                            json.education.map(
                                (ed, index) => 
                                    e(CompanySection,
                                        {
                                            key: index,
                                            name: ed.institution,
                                            positions: ed.credentials
                                        })
                            ),
                        e(Divider, {heading: 'Experience'}),
                            json.jobs.map(
                                (j, index) => 
                                    e(CompanySection, 
                                    {
                                        key: index, 
                                        name: j.company, 
                                        positions: j.positions
                                    }
                            )
                        )
            );
}

function ResumeHeader(props) {
    return e('div', {className: 'resume-header left-border'}, 
        e('h1', {className: "header-name"}, props.name),
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
        e('p', {}, companyStart ? companyStart + ' - ' + companyEnd : ''),
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
                    duties: p.duties,
                    skills: p.skills
                }
            )
        ),
        props.positions.length <= 1 ? '' : e('p', {onClick: () => handleChange(), className: 'show-more-button'}, 
                                            (showPrevious ? '▲ Hide ' : '▼ Show ') 
                                            + (props.positions.length - 1).toString() 
                                            + ' previous positions at '
                                            + props.name)
    );
}

function JobCard(props) {
    return e('div', {className: 'job-card left-border'},
        e('p', {className: "job-title"}, props.title),
        e('p', {className: "job-team"}, props.team),
        e(DutiesList, {duties: props.duties}),
        e(SkillList, {skills: props.skills ? props.skills : []}),
        e('p', {className: "job-subheading"}, props.location),
        props.start ? e('p', {className: "job-subheading"}, '(' + props.start + ' - ' + (props.end ? props.end : 'present') + ')')
            : ''
    )
}

function DutiesList(props) {
    return e('ul', {style: {padding: "1em", marginBottom: "0"}}, props.duties.map((duty, index) => e('li', {key: index}, duty)));
}

function SkillList(props) {
    return e('div', {}, props.skills.map((s, index) => e(SkillChip, {key: index, skill: s})));
}

function SkillChip(props) {
    const color = props.color ?? "rgba(0, 255, 220, 0.32)";
    return (e('div', 
                {
                    className: "skill-chip", 
                    style: {backgroundColor: color},
                    title: "See all '" + props.skill + "' positions",
                    onClick: () => {
                        reload("/resume?skill=" + encodeURI(props.skill));
                    }
                }, 
            props.skill));
}

const domContainer = document.querySelector('#resume');

const reload = (query) => {
    console.log("reloading...");
    window.history.replaceState(null, null, query);
    fetch("ryan.json")
        .then(response => response.json())
        .then(json => ReactDOM.render(e(Resume, json), domContainer));
}

reload();

