'use strict'

const request = require('supertest')

const chai = require('chai')
chai.use(require('chai-things'))
chai.should()
const { expect } = chai
chai.use(require('chai-http'))

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')
const util = require('util')
db.allPromise = util.promisify(db.all)

const app = require('../src/app')(db)
const buildSchemas = require('../src/schemas')

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => {
            if (err) {
                return done(err)
            }
            buildSchemas(db)
            done()
        })
    })

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done)
        })
    })

    const payloads = [
        {
            start_lat: 42,
            start_long: 54,
            end_lat: 56,
            end_long: 12,
            rider_name: 'Layla Winterguard',
            driver_name: 'Johnson Watts',
            driver_vehicle: 'Jeepney'
        },
        {
            start_lat: 42,
            start_long: 54,
            end_lat: 56,
            end_long: 12,
            rider_name: 'Layla Winterguard',
            driver_name: 'Johnson Watts',
            driver_vehicle: 'Jeepney'
        },
        {
            start_lat: 42,
            start_long: 54,
            end_lat: 56,
            end_long: 12,
            rider_name: 'Layla Winterguard',
            driver_name: 'Johnson Watts',
            driver_vehicle: 'Jeepney'
        },
        {
            start_lat: 42,
            start_long: 54,
            end_lat: 56,
            end_long: 12,
            rider_name: 'Layla Winterguard',
            driver_name: 'Johnson Watts',
            driver_vehicle: 'Jeepney'
        },
        {
            start_lat: 42,
            start_long: 54,
            end_lat: 56,
            end_long: 12,
            rider_name: 'Layla Winterguard',
            driver_name: 'Johnson Watts',
            driver_vehicle: 'Jeepney'
        }
    ]
    for (const arr of payloads) {
        describe('POST /rides', () => {
            it('should return the newly-created ride', async () => {
                const res = await chai.request(app).post('/rides')
                    .set('Content-Type', 'application/json')
                    .send(arr)
                expect(res.body[0]).to.have.own.property('rideID')
                expect(res.body[0]).to.have.own.property('startLat')
                expect(res.body[0]).to.have.own.property('startLong')
                expect(res.body[0]).to.have.own.property('endLat')
                expect(res.body[0]).to.have.own.property('endLong')
                expect(res.body[0]).to.have.own.property('riderName')
                expect(res.body[0]).to.have.own.property('driverName')
                expect(res.body[0]).to.have.own.property('driverVehicle')
                expect(res.body[0]).to.have.own.property('created')
            })
        })
    }

    describe('GET /rides', () => {
        it('should return all rides', async () => {
            const res = await chai.request(app).get('/rides')
            expect(res.body[0]).to.have.own.property('rideID')
            expect(res.body[0]).to.have.own.property('startLat')
            expect(res.body[0]).to.have.own.property('startLong')
            expect(res.body[0]).to.have.own.property('endLat')
            expect(res.body[0]).to.have.own.property('endLong')
            expect(res.body[0]).to.have.own.property('riderName')
            expect(res.body[0]).to.have.own.property('driverName')
            expect(res.body[0]).to.have.own.property('driverVehicle')
            expect(res.body[0]).to.have.own.property('created')
        })
    })

    describe('GET /rides', () => {
        it('should return paginated list of rides', async () => {
            const res = await chai.request(app).get('/rides')
                .query({ pageIndex: 1, pageSize: 2 })
            expect(res.body).to.have.lengthOf(2)
        })
    })
})
