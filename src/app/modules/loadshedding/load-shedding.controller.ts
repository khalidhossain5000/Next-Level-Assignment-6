import { catchAsync } from "../../utils/catchAsync";
import { LoadSheddingService } from "./load-shedding.service";

const createLoadShedding = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body

    const userId=req.user?.userId

    const result = await LoadSheddingService.createLoadSheddingScheduleInDb(payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Unexpected Outage created successfully",
        data: result,
    });
});




export const LoadSheddingController = {
createLoadShedding
}