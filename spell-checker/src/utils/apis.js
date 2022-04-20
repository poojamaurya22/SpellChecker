import { API_KEY } from "../constants";

export const checkText = async (textToCheck) => {
    try {
        const response = await fetch(`https://api.textgears.com/spelling?key=${API_KEY}&text=${encodeURIComponent(textToCheck)}&language=en-US`);
        const responseJson = await response.json();
        return responseJson.response;
    } catch (error) {
        console.log(error);
    }
}