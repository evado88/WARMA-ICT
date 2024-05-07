///Represents the result of a task
class TaskResult {

    ///Initializes a new task result
    constructor(succeeded, message, result) {
        this.Succeeded = succeeded;
        this.Message = message;
        this.Result = result;
    }
}

export default TaskResult;