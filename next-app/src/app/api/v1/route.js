import axios from "axios";

import axios from "axios";
import { redirect } from "next/dist/server/api-utils";

export async function GET(req) {
    try {
        const springResponse = await axios.get("http://spring-app:9999/api/test/redirect", {
            maxRedirects: 0, // Spring의 리다이렉트를 추적하지 않음
            validateStatus: (status) => status >= 200 && status < 400,
        });

        const location = springResponse.headers.location;

        if (location) {
            redirect(location)
            return new Response(null, {
                status: 302,
                headers: {
                    Location: location,
                },
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Redirect failed: No Location header" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error("Error during redirect:", error);
        return new Response(
            JSON.stringify({ message: "Error during redirect" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}



export async function POST(req) {
    const serverUrl = process.env.API_SERVER_URL
        ? `http://${process.env.API_SERVER_URL}`
        : "http://localhost:8765";

    try {
        const formData = await req.formData();
        const response = await axios.post(`${serverUrl}/api/post`, formData);

        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error submitting post:", error);
        return new Response(
            JSON.stringify({ message: "Error submitting post" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

