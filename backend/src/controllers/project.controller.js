import { asyncHandler } from "../middleware/AsyncHandler.js";
import { Milestone } from "../models/milestoneModel.js";
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
        },
        {
            $project: {
                projectID: 1,
                "projectDetails._id": 1,
                "projectDetails.title": 1,
                "projectDetails.description": 1,
                "projectDetails.status": 1,
                "projectDetails.endDate": 1
            }
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

const addMilestone = asyncHandler(async (req, res) => {
    const { projectID } = req.params
    if (!projectID) throw new ApiError(400, "Project ID not provided")

    const { mileStoneTitle } = req.body
    if (!mileStoneTitle) throw new ApiError(400, "Milestone's title not provided")

    const project = await Project.findById(projectID)
    if (!project) throw new ApiError(404, "Project not found")

    const mileStone = await Milestone.create({
        title: mileStoneTitle
    })

    project.milestones.push(mileStone)
    await project.save()

    return res
        .status(200)
        .json(new ApiResponse(200, mileStone, "Milestone Added"))
})

const deleteMilestone = asyncHandler(async (req, res) => {
    const { projectID, milestoneID } = req.params
    if (!projectID || !milestoneID) throw new ApiError(400, "Project or Milestone ID missing")

    const project = await Project.findById(projectID)
    if (!project) throw new ApiError(404, "Project not found")

    const milestone = await Milestone.findById(milestoneID)
    if (!milestone) throw new ApiError(404, "milestone not found")

    await milestone.deleteOne()

    await Project.updateOne(
        { _id: projectID },
        { $pull: { milestones: milestoneID } }
    );

    return res.status(200).json(new ApiResponse(200, {}, "Milestone deleted"))

})

export {
    getMyProjects,
    getProjectByID,
    addMilestone,
    deleteMilestone
}