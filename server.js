const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Setup view engine (EJS)
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Route for home page
app.get('/', async (req, res) => {
    try {
        const githubUsername = 'MaxerRed';  // Replace with GitHub username
        const githubData = await axios.get(`https://api.github.com/users/${githubUsername}`);
        const repoData = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);

        // Calculating statistics
        const stars = repoData.data.reduce((acc, repo) => acc + repo.stargazers_count, 0);  // Total stars
        const forks = repoData.data.reduce((acc, repo) => acc + repo.forks_count, 0);  // Total forks
        const openIssues = repoData.data.reduce((acc, repo) => acc + repo.open_issues_count, 0);  // Total open issues
        const pullRequestsMerged = repoData.data.filter(repo => repo.pulls_merged).length;  // Pull requests merged
        const contributions = githubData.data.public_repos;  // Total public repos (you can refine this to get commits data)
        
        // Getting unique languages used
        const languages = repoData.data
        .map(repo => repo.language)  // Get the language of each repository
        .filter((value, index, self) => {
            // Filter out empty values and non-relevant languages (e.g., HTML, CSS)
            return value && self.indexOf(value) === index && !['HTML', 'CSS', 'PHP'].includes(value);
        });  // Unique languages (excluding HTML, CSS, PHP)



        res.render('index', {
            githubData: githubData.data,
            name: "MaxerRed",
            title: "Red's DevQuest",
            skills: {
                programmingLanguages: ['Python', 'Java', 'C', 'C++', 'Lua', 'Bash', 'Assembly', 'JavaScript'],
                frameworksAndLibraries: ['React.js', 'Express', 'Flask', 'Node.js'],
                webTechnologies: ['HTML', 'CSS', 'PHP'],
                versionControl: ['Git'],
                other: ['Deep Understand of Computer Science']
            },
            experience: [
                { company: 'Freelance', role: 'Developer', duration: '4 years' }
            ],
            certifications: [
                { title: 'CS50\'s Intro to Computer Science', institution: 'Harvard University', year: 2023 },
                { title: 'CS50\'s Intro to Technology', institution: 'Harvard University', year: 2023 },
                { title: 'CS50\'s Intro to Cybersecurity', institution: 'Harvard University', year: 2023 }
            ],
            stars: stars,
            forks: forks,
            openIssues: openIssues,
            pullRequestsMerged: pullRequestsMerged,
            contributions: contributions,
            languages: languages
        });

    } catch (error) {
        console.log(error);
        res.send('Error fetching GitHub data.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
