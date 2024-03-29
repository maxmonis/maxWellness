const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../middleware/auth")
const Client = require("../models/Client")

router.get("/", auth, async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user.id }).sort({ date: -1 })
    res.json(clients)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, phone, isActive, lifts, workouts, records } = req.body
    try {
      const newClient = new Client({
        name,
        email,
        phone,
        isActive,
        lifts,
        workouts,
        records,
        user: req.user.id,
      })
      const client = await newClient.save()
      res.json(client)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

router.put("/:id", auth, async (req, res) => {
  const {
    name,
    email,
    phone,
    isActive,
    lifts,
    workoutNames,
    workouts,
    records,
  } = req.body
  const clientFields = {}
  clientFields.isActive = isActive
  if (name) clientFields.name = name
  if (email) clientFields.email = email
  if (phone) clientFields.phone = phone
  if (lifts) clientFields.lifts = lifts
  if (workoutNames) clientFields.workoutNames = workoutNames
  if (workouts) clientFields.workouts = workouts
  if (records) clientFields.records = records
  try {
    let client = await Client.findById(req.params.id)
    if (!client) return res.status(404).send("Client not found")
    if (client.user.toString() !== req.user.id) {
      return res.status(401).send("Not authorized")
    }
    client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: clientFields },
      { new: true },
    )
    res.json(client)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

router.delete("/:id", auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
    if (!client) return res.status(404).send("Client not found")
    if (client.user.toString() !== req.user.id) {
      return res.status(401).send("Not authorized")
    }
    await Client.findByIdAndRemove(req.params.id)
    res.send("Client removed")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
