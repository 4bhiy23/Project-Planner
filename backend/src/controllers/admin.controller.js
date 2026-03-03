import { asyncHandler } from "../middleware/AsyncHandler.js";
import { ProjectMember } from "../models/projectMemberModel.js";
import { Project } from "../models/projectModel.js";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find()
    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Fetched all projects"))
})

const createProject = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, status, projectLeadID } = req.body
    if (!title || !description || !startDate || !endDate || !status) {
        throw new ApiError(400, "Fill all the requirements to create project properly")
    }

    const projectLead = await User.findById(projectLeadID)
    if (!projectLead) {
        throw new ApiError(404, "User not found")
    }

    const newProject = await Project.create({
        title,
        description,
        startDate,
        endDate,
        status,
        owner: req.user?._id
    })

    await ProjectMember.create({
        userID: projectLeadID,
        projectID: newProject._id,
        role: "lead"
    })

    const projectWithOwner = await Project.findById(newProject._id)
        .populate("owner", "name email")
        .lean();

    return res
        .status(201)
        .json(new ApiResponse(201, projectWithOwner, "Project created successfully"))
})

// TODO: add multiple devs at once
const addMembers = asyncHandler(async (req, res) => {
    const { projectID, memberID } = req.body
    if (!projectID) throw new ApiError(400, "Project ID not provided")
    if (!memberID) throw new ApiError(400, "Member ID not provided")

    // Check if project exists
    const project = await Project.findById(projectID);
    if (!project) throw new ApiError(404, "Project not found");

    // Check if member exists
    const user = await User.findById(memberID);
    if (!user) throw new ApiError(404, "User not found");

    // Prevent duplicate membership
    const existing = await ProjectMember.findOne({ projectID, userID: memberID });
    if (existing) throw new ApiError(400, "User is already a member of this project");


    const newMembership = await ProjectMember.create({
        userID: memberID,
        projectID: projectID,
        role: "dev"
    })

    return res
        .status(201)
        .json(new ApiResponse(201, newMembership, "Member added to project"))
})

const removeProjectLead = asyncHandler(async (req, res) => {
    // TODO: remove the existing lead from the membership model and make the project the owner of the project
    const { memberID, projectID } = req.body
    if (!memberID || !projectID) throw new ApiError(400, "member or project ID missing")

    const projectLead = await ProjectMember.findOne({
        projectID,
        userID: memberID,
        role: "lead"
    });

    if (!projectLead) throw new ApiError(404, "Project Lead for this project was not found")

    await ProjectMember.deleteOne({ _id: projectLead._id });

    const project = await Project.findById(projectID)
    if (!project) throw new ApiError(404, "Project not found")

    const newLead = await ProjectMember.create({
        userID: project.owner,
        projectID,
        role: "lead"
    })
    return res
        .status(201)
        .json(new ApiResponse(201, newLead, "Project lead removed and owner assigned as the new Lead"))
})

const removeDev = asyncHandler(async (req, res) => {
    const { projectID, memberID } = req.body
    if (!projectID || !memberID) throw new ApiError(400, "Project or Member ID not provided")

    const project = await ProjectMember.findOne({
        userID: memberID,
        projectID,
        role: "dev"
    })
    if (!project) throw new ApiError(404, "Member for this project not found")
    await project.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Developer removed from this project"))
})

const deleteProject = asyncHandler(async (req, res) => {
    const { projectID } = req.params;
    if (!projectID)
        throw new ApiError(400, "Project ID not received");

    const project = await Project.findById(projectID);
    if (!project)
        throw new ApiError(404, "Project Not Found");

    await ProjectMember.deleteMany({ projectID });
    await Project.findByIdAndDelete(projectID);

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
});

export {
    getAllProjects,
    createProject,
    addMembers,
    removeProjectLead,
    removeDev,
    deleteProject
}