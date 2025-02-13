import {  useState, useEffect } from "react";
import { getProjectWithMembers } from "../redux/apiCall";
import { CircularProgress, Card, CardContent, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
const ExistingProjects = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const projectWithMembers = useSelector((state) => state.projectWithMembers.projectWithMembers);

  useEffect(()=>{
    getProjectWithMembers(dispatch);
  }, [])
 

  const userList = useSelector((state) => state.userList.userList);
 console.log('sdfsdfsdf')

  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const isLoading = projectWithMembers === null;


  console.log("Project with members state:", projectWithMembers);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US");
  };

  const groupedProjects = projectWithMembers?.reduce((result, project) => {
    const existingProject = result.find((p) => p.projectId === project.projectId);
    if (existingProject) {
      existingProject.members.push({
        username: project.username,
        email: project.email,
      });
    } else {
      result.push({
        projectId: project.projectId,
        projectName: project.projectName,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        urgency: project.urgency,
        category: project.category,
        status: project.status,
        members: [
          {
            username: project.username,
            email: project.email,
          },
        ],
      });
    }
    return result;
  }, []);

  const handleViewMembers = (projectId) => {
    const selectedProject = groupedProjects.find((project) => project.projectId === projectId);
    setSelectedProject(selectedProject);
    setOpenDialog(true);
  };

    const handleEditProject = (projectId) => {
    const selectedProject = groupedProjects.find((project) => project.projectId === projectId);
    setSelectedProject(selectedProject);
    setOpenDialog2(true);
  };
  
  const handleCloseDialog = () => {
    setSelectedProject(null);
    setOpenDialog(false);
  };

  const handleCloseDialog2 = () => {
    setSelectedProject(null);
    setOpenDialog2(false);
  };

  const handleSave = (data) => {
    // Implement the logic to handle saving a project
    console.log("Save project data:", data);
  };

  // Validation schema for the edit project form
  const schema = yup.object().shape({
    projectName: yup.string().required("Project name is required"),
    description: yup.string().required("Description is required"),
    startDate: yup.string().required("Start date is required"),
    endDate: yup.string().required("End date is required"),
    urgency: yup.string().required("Urgency is required"),
    category: yup.string().required("Category is required"),
  });

  const { handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    handleSave(data);
    handleCloseDialog2();
  };

  // Options for status field
  const statusOptions = [
    { label: "Pending" },
    { label: "In Progress" },
    { label: "Completed" },
  ];

  // Options for urgency field
  const urgencyOptions = [
    { label: "Low" },
    { label: "Medium" },
    { label: "High" },
  ];

  // Options for category field
  const categoryOptions = [
    { label: "Category 1" },
    { label: "Category 2" },
    { label: "Category 3" },
  ];

  const handleMemberSelection = (event, value) => {
    // Implement the logic to handle selected members
    console.log("Selected members:", value);
    setSelectedProject((prevState) => ({
      ...prevState,
      members: value,
    }));
  };

  return (
    <div style={{ margin: "10px" }}>
      <Grid container spacing={2}>
        {isLoading ? (
          <Grid item xs={12} align="center">
            <CircularProgress />
          </Grid>
        ) : (
          groupedProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.projectId}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {project.projectName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    {project.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    Start Date: {formatDate(project.startDate)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    End Date: {formatDate(project.endDate)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    Urgency: {project.urgency}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    Category: {project.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    Status: {project.status}
                  </Typography>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewMembers(project.projectId)}
                      style={{ marginTop: "10px" }}
                      disableElevation // Disable button elevation to prevent focus outline
                    >
                      View Members
                    </Button>
                    <IconButton
                      style={{ padding: "2px" }}
                      color="primary"
                      onClick={() => handleEditProject(project.projectId)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      style={{ padding: "2px" }}
                      color="secondary"
                      onClick={() => handleDeleteProject(project.projectId)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {selectedProject && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle style={{ marginTop: "-10px" }}>{selectedProject.projectName}</DialogTitle>
          <DialogTitle style={{ marginTop: "-35px", fontSize: "15px" }}>Assigned Members</DialogTitle>
          <hr style={{ width: "90%", marginTop: "-13px", marginBottom: "-16px" }} />
          <DialogContent>
            <DialogContentText>
              {selectedProject.members.map((member) => (
                <Typography key={member.email}>
                  Username: {member.username}
                  <br />
                  Email: {member.email}
                  <hr />
                </Typography>
              ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </DialogActions>
        </Dialog>
      )}

      {selectedProject && (
        <Dialog open={openDialog2} onClose={handleCloseDialog2}>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Project Name */}
              <TextField
                label="Project Name"
                value={selectedProject.projectName}
                onChange={(e) => setSelectedProject((prevState) => ({ ...prevState, projectName: e.target.value }))}
                fullWidth
                margin="normal"
                error={!!errors.projectName}
                helperText={errors.projectName?.message}
              />

              {/* Description */}
              <TextField
                label="Description"
                value={selectedProject.description}
                onChange={(e) => setSelectedProject((prevState) => ({ ...prevState, description: e.target.value }))}
                fullWidth
                margin="normal"
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              {/* Start Date */}
              <TextField
                label="Start Date"
                value={formatDate(selectedProject.startDate)}
                onChange={(e) => setSelectedProject((prevState) => ({ ...prevState, startDate: e.target.value }))}
                fullWidth
                margin="normal"
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />

              {/* End Date */}
              <TextField
                label="End Date"
                value={formatDate(selectedProject.endDate)}
                onChange={(e) => setSelectedProject((prevState) => ({ ...prevState, endDate: e.target.value }))}
                fullWidth
                margin="normal"
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />

              {/* Status */}
              <Autocomplete
                value={{ label: selectedProject.status }}
                onChange={(event, newValue) => setSelectedProject((prevState) => ({ ...prevState, status: newValue?.label }))}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                options={statusOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Status" fullWidth error={!!errors.status} helperText={errors.status?.message} />
                )}
              />

              {/* Urgency */}
              <Autocomplete
                value={{ label: selectedProject.urgency }}
                onChange={(event, newValue) => setSelectedProject((prevState) => ({ ...prevState, urgency: newValue?.label }))}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                options={urgencyOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Urgency" fullWidth error={!!errors.urgency} helperText={errors.urgency?.message} />
                )}
              />

              {/* Category */}
              <Autocomplete
                value={{ label: selectedProject.category }}
                onChange={(event, newValue) => setSelectedProject((prevState) => ({ ...prevState, category: newValue?.label }))}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                options={categoryOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Category" fullWidth error={!!errors.category} helperText={errors.category?.message} />
                )}
              />

              {/* Assigned Members */}
              <Autocomplete
                multiple
                options={userList}
                value={selectedProject.members}
                onChange={handleMemberSelection}
                getOptionLabel={(option) => option.username}
                isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option.username} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="Assign to Members" />}
              />

              <DialogActions>
                <Button onClick={handleCloseDialog2}>Cancel</Button>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExistingProjects;


