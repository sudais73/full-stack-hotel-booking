import multer from "multer"
import _default from "validator"
const upload = multer({storage:multer.diskStorage({})})
export default upload;


