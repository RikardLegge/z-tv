module.exports.fill = {
  position: "absolute",
  bottom: "0",
  left: "0",
  top: "0",
  right: "0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
module.exports.center = {
  margin: "0 10px",
  textAlign: "center",
};
module.exports.gray = {
  background: "rgba(150, 150, 150, 0.95",
  color: "white",
};
module.exports.green = {
  background: "rgba(0, 180, 0, 0.95",
  color: "white",
};
module.exports.red = {
  background: "rgba(180, 0, 0, 0.95",
  color: "white",
};
module.exports.orange = {
  background: "rgba(255, 165, 0, 0.95",
  color: "white",
};
module.exports.paper = (show=true)=>({
  opacity: show ? 1 : 0,
  position: "absolute",
  bottom: "0",
  left: "0",
  margin: "20px",
  Width: 300 + "px",
  minHeight: "60px",
  transition: "opacity 1s ease"
});