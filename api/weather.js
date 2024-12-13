export default async function handler(req, res) {
    const { lat, lon } = req.query;

    // Replace with your OpenWeatherMap API key
    const apiKey = "b336ff4414f706c284a0effd00bd60ab";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}
