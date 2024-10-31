import axios from "axios";

export const validateUser = async() => {
  try {
    const url = "http://localhost:9000/api/v1/validator/validate";
    const result = await axios.post(url);
    return result;

  }catch(err) {
    console.log("something went wrog here !");
    throw err;
  }
}