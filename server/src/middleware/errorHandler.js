export function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, req, res, next) {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server" });
}
