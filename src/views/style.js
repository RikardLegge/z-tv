module.exports.centerH = {
  padding: "0 10px",
  textAlign: "center",
};
module.exports.center = {
  padding: "0 10px",
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};
module.exports.box = {
  padding: "20px",
  textAlign: "center",
};
module.exports.layer = {
  display: "flex",
  flexDirection: "column"
};
module.exports.overlay = {
  ...module.exports.layer,
  position: "absolute",
  bottom: "0",
  left: "0",
  top: "0",
  right: "0",
};
module.exports.paper = (show=true)=>({
  opacity: show ? 1 : 0,
  position: "absolute",
  bottom: "0",
  left: "0",
  margin: "20px",
  Width: 300 + "px",
  minHeight: "60px",
  transition: "opacity 0.3s ease"
});

module.exports.white = {
  background: "rgba(255, 255, 255, 0.95",
  color: "black",
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
