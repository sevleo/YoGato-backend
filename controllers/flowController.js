const asyncHandler = require("express-async-handler");
const Flow = require("../models/flow");
const flow = require("../models/flow");

exports.create_flow = asyncHandler(async (req, res, next) => {
  try {
    const newFlow = new Flow({
      userId: req.body.userId,
      flowName: req.body.flowName,
      difficulty: req.body.flowDifficulty,
    });
    await newFlow.save();
    res.status(200).json({ message: "Flow added" });
  } catch (err) {
    return next(err);
  }
});

exports.flow_list = asyncHandler(async (req, res, next) => {
  const allFlows = await Flow.find({ userId: req.query.userId });
  console.log(allFlows);
  res.status(200).json({ message: allFlows });
});

exports.delete_flow = asyncHandler(async (req, res, next) => {
  await Flow.findByIdAndDelete(req.query.flowId);
  res.status(200).json({ message: "deleted successfully" });
});

exports.update_flow = asyncHandler(async (req, res, next) => {
  console.log(req);
  try {
    const editedFlowName = req.body.flowName;
    const updatedFlow = await Flow.findByIdAndUpdate(
      req.body.flowId,
      { flowName: editedFlowName },
      { new: true }
    );

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