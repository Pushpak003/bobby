const app = require("./app");




const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Payment Gateway API");
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
