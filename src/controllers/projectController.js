const projectService = require('../services/projectService');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects();
    res.json({
      version: 'v2',
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
