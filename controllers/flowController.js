const asyncHandler = require("express-async-handler");
const Flow = require("../models/flow");
const flow = require("../models/flow");

exports.create_flow = asyncHandler(async (req, res, next) => {
  try {
    const existingFlow = await Flow.find({
      flowName: req.body.flowName,
      userId: req.body.userId,
    });
    if (existingFlow.length > 0) {
      return res
        .status(409)
        .json({ message: "Flow with this name already exists" });
    }

    const newFlow = new Flow({
      userId: req.body.userId,
      flowName: req.body.flowName,
      flowData: req.body.flowData,
      creationDate: new Date(),
    });
    await newFlow.save();

    res.status(200).json({ message: newFlow });
  } catch (err) {
    return next(err);
  }
});

exports.flow_list = asyncHandler(async (req, res, next) => {
  const allFlows = await Flow.find({ userId: req.query.userId });
  res.status(200).json({ message: allFlows });
});

exports.get_flow = asyncHandler(async (req, res, next) => {
  const flow = await Flow.findOne({ _id: req.query.flowId });
  res.status(200).json({ message: flow });
});

exports.delete_flow = asyncHandler(async (req, res, next) => {
  await Flow.findByIdAndDelete(req.query.flowId);
  res.status(200).json({ message: "deleted successfully" });
});

exports.update_flow = asyncHandler(async (req, res, next) => {
  try {
    const existingFlow = await Flow.find({
      flowName: req.body.flowName,
      userId: req.body.userId,
      _id: { $ne: req.body.flowId },
    });
    if (existingFlow.length > 0) {
      return res
        .status(409)
        .json({ message: "Flow with this name already exists" });
    }

    const editedFlowName = req.body.flowName;
    const editedFlowData = req.body.flowData;

    let updatedFlow;

    if (editedFlowName) {
      updatedFlow = await Flow.findByIdAndUpdate(req.body.flowId, {
        flowName: editedFlowName,
        flowData: { ...editedFlowData, flowName: editedFlowName },
      });
    }
    if (editedFlowData) {
      updatedFlow = await Flow.findByIdAndUpdate(req.body.flowId, {
        flowData: { ...editedFlowData, flowName: editedFlowName },
      });
    }

    if (!updatedFlow) {
      return res.status(404).json({ message: "Flow not found" });
    }

    res
      .status(200)
      .json({ message: "Flow updated successfully", flow: updatedFlow });
  } catch (err) {
    console.error("Error updating flow:", err);
    return next(err);
  }
});
