export default {
  headers: {
    Authorization: `Basic ${localStorage.getItem("token")}`,
  },
}