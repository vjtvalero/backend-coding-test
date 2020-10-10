'use strict'

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const validate = require('./validate')

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'))

    app.post('/rides', jsonParser, (req, res) => {
        const startLatitude = Number(req.body.start_lat)
        const startLongitude = Number(req.body.start_long)
        const endLatitude = Number(req.body.end_lat)
        const endLongitude = Number(req.body.end_long)
        const riderName = req.body.rider_name
        const driverName = req.body.driver_name
        const driverVehicle = req.body.driver_vehicle

        const validationRules = [
            {
                condition: (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180),
                field: 'lat',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            },
            {
                condition: (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180),
                field: 'long', 
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            },
            {
                condition: (typeof riderName !== 'string' || riderName.length < 1),
                field: 'rider',
                message: 'Rider name must be a non empty string'
            },
            {
                condition: (typeof driverName !== 'string' || driverName.length < 1),
                field: 'driver',
                message: 'Driver name must be a non empty string'
            },
            {
                condition: (typeof driverVehicle !== 'string' || driverVehicle.length < 1),
                field: 'vehicle',
                message: 'Vehicle name must be a non empty string'
            }
        ]

        const { isValid, response } = validate(validationRules)
        if (!isValid) {
            return res.send(response)
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle]

        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                })
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    })
                }

                res.send(rows)
            })
        })
    })

    app.get('/rides', (req, res) => {
        db.all('SELECT * FROM Rides', function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                })
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                })
            }

            res.send(rows)
        })
    })

    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                })
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                })
            }

            res.send(rows)
        })
    })

    return app
}
