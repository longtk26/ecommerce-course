import app from "./src/app";
import { createApiKey } from "./src/helpers/createApiKey";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
