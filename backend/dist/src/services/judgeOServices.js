import axios from "axios";
const executeCode = async (code, languageId) => {
    console.log(code + " " + languageId);
    const response = await axios.post("http://localhost:2358/submissions?base64_encoded=false&wait=false", {
        source_code: code,
        language_id: languageId
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(response.data);
    return {
        stdout: response.data.stdout,
        stderr: response.data.stderr,
        compile_output: response.data.compile_output,
        time: response.data.time,
        memory: response.data.memory
    };
};
export default executeCode;
//# sourceMappingURL=judgeOServices.js.map