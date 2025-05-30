export const formatDateTime = (isoString) => {
    try {
        // Check if the input is a valid string
        if (!isoString || typeof isoString !== "string") {
            throw new Error("Invalid input: Expected a valid ISO date string");
        }

        // Parse the input string into a Date object
        const date = new Date(isoString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date: The input string is not a valid date");
        }

        // Format the time (12-hour format with AM/PM)
        const time = date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        // Extract the date in YYYY-MM-DD format
        const formattedDate = date.toISOString().split("T")[0];

        // Return the combined formatted string
        return `${time} ${formattedDate}`;
    } catch (error) {
        console.error("Error formatting date and time:", error.message);
        return "Invalid date/time"; // Return a fallback value for invalid inputs
    }
};