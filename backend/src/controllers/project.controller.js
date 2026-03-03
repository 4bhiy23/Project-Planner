import { asyncHandler } from "../middleware/AsyncHandler.js";
import { ProjectMember } from "../models/projectMemberModel.js";
import { Project } from "../models/projectModel.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getMyProjects = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const projects = await ProjectMember.aggregate([
        {
            $match: {
                userID: userId
            }
        },
        {
            $lookup: {
                from: "projects",
                localField: "projectID",
                foreignField: "_id",
                as: "projectDetails"
            }
        },
        {
            $unwind: "$projectDetails"
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "User's project fetched"))
})

const getProjectByID = asyncHandler(async (req, res) => {
    const { projectID } = req.params
    if (!projectID) throw new ApiError(400, "Project ID not provided")

    const project = await Project.findById(projectID)
    if (!project) throw new ApiError(404, "Project not found")

    const hasAccess =
        project.owner.toString() === req.user._id.toString() ||
        await ProjectMember.exists({
            projectID,
            userID: req.user._id
        });

    if (!hasAccess) {
        throw new ApiError(403, "Not authorized to view this project");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project fetched"))
})

export {
    getMyProjects,
    getProjectByID
}