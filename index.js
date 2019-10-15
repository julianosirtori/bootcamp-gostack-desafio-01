const express = require('express');

const server = express();

const projects = [];
let numberRequests = 0;

server.use(express.json());

// middleware para verefica se o projetos existe no array 'projects'
function checkProjectExists(req, res, next){
    const {id} = req.params;
    const project = projects.find(project => project.id == id);

    if (!project) {
        return res.status(400).json({ error: 'Project not found' });
    }
    req.project = project;

    return next();
}

function countRequests(req, res, next){
    numberRequests++;
    console.log(`Request number: ${numberRequests}`);
    return next();
}

// middleware para vereficar se o projects é valido para adicionar no array 
function checkProjectValid(req, res, next){
    req.project = req.body;
    if(!req.project.id){
        res.status(400).json({error: 'Id is required'});    
     }
     if(!req.project.title){
        res.status(400).json({error: 'Title is required'});    
     }
     if(!req.project.tasks){
        res.status(400).json({ error: 'Task is required'});    
     }
      
    return next();

}

server.post('/projects', checkProjectValid, countRequests, (req, res, next) => {
     projects.push(req.project);
     return res.redirect('/projects');
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, countRequests, (req, res) => {
    const {title} = req.body;
    
    req.project.title = title;

    return res.json(req.project);
});

server.get('/projects/:id', checkProjectExists, countRequests, (req, res) => {    
    return res.json(req.project);
});

server.delete('/projects/:id', checkProjectExists, countRequests, (req, res) => {
    const {id} = req.params;

    const index = projects.findIndex(project => project.id == id);

    projects.splice(index, 1);
    return res.sendStatus(200);
});

server.post('/projects/:id/tasks', checkProjectExists, countRequests, (req, res) => {
    const {title} = req.body;
    req.project.tasks.push(title);
    return res.json(req.project);
});

server.listen(3000)