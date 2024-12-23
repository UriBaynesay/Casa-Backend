const userService = require("./user.service")
const logger = require("../../services/logger.service")
const authService = require("../auth/auth.service")

async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.userId)
    res.json(user)
  } catch (err) {
    logger.error("Failed to get user", err)
    res.status(500).send({ err: "Failed to get user" })
  }
}

async function getUsers(req, res) {
  try {
    const users = await userService.query()
    res.json(users)
  } catch (err) {
    logger.error("Failed to get users", err)
    res.status(500).send({ err: "Failed to get users" })
  }
}

async function deleteUser(req, res) {
  try {
    await userService.remove(req.params.userId)
    res.send({ msg: "Deleted successfully" })
  } catch (err) {
    logger.error("Failed to delete user", err)
    res.status(500).send({ err: "Failed to delete user" })
  }
}

async function updateUser(req, res) {
  const loggedInUser = authService.validateToken(req.cookies.loginToken)
  if (loggedInUser._id !== req.params.userId)
    return res.status(500).send({err: "Failed to update user, not autherized to update the requested user"})
  try {
    const updatedFields = req.body
    await userService.update(loggedInUser._id, updatedFields)
    res.send("Updated succesfully")
  } catch (err) {
    logger.error("Failed to update user", err)
    res.status(500).send({ err: "Failed to update user" })
  }
}

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
}
