const express = require('express'); 
const server = express();

server.use(express.json());
var totalReq = 0;
const projects = [];

//MIDDLEWARE GLOBAL
server.use((req,res, next) => {
  console.time('Request');
  totalReq++;
  console.log(`Método: ${req.method}; URL: ${req.url}; Total Requisições: ${totalReq}`);
  next();
  console.timeEnd('Request');
})

//MIDDLEWARE LOCAL
function checkIdProjectExists(req, res, next)  {
  const index = projects.findIndex(x => x.id === req.params.id);
  if (index === -1) {
    return res.status(400).json( { error: 'Project Does Not Exists'});
  }
  return next();
}

function checkIdProjectAlreadyExists(req, res, next)  {
  const index = projects.findIndex(x => x.id === req.body.id);
  if (index !== -1) {
    return res.status(400).json( { error: 'ID Project Already Exists'});
  }
  return next();
}

function TotalProjects(req, res, next)  {
  if (projects.length === 0) {
    return res.status(400).json( { error: 'Have No Projects'});
  }
  return next();
}

//GET ALL PROJECTS
server.get('/projects', TotalProjects, (req, res) => {
  return res.json(projects);
})

//POST NEW PROJECT WITH EMPTY TASK
server.post('/projects', checkIdProjectAlreadyExists, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  projects.push({"id": id, "title": title, "tasks": []});
  return res.json(projects);
})

//READ 1 PROJECT
server.get('/projects/:id', TotalProjects, checkIdProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(x => x.id === id);
  return res.json(projects[index]);
}) 

//POST TASK
server.post('/projects/:id/tasks', checkIdProjectExists, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  const index = projects.findIndex(x => x.id === id);
  projects[index].tasks.push(task);
  return res.json(projects);
})

//PUT TO CHANGE A TITLE OF A PROJECT
server.put('/projects/:id', checkIdProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(x => x.id === id);
  projects[index].title = title;
  return res.json(projects);
})

//DELETE PROJECT BY ID
server.delete('/projects/:id', checkIdProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(x => x.id === id);
  projects.splice(index, 1);
  return res.send();
})

server.listen(2000);