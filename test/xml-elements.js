import { expect } from 'chai'
import { elements } from '../lib/xml-elements.js'

const xmlFilePath = './test_files/test_04 Project/.test_04.xml'
const result = elements(xmlFilePath) 

describe('Elements extracted from xml files', function() {

    describe('File Path validation', function() {
        it('Should be a .xml file', function() {
            expect(result).to.have.property('filePath')
            expect(result.filePath).to.be.a('string')
            expect(result.filePath.slice(-4)).to.match(/.xml/)
        })
    })

    describe('Name validation', function() {
        it('Should be a valid name', function() {
            expect(result).to.have.property('name')
            expect(result.name).to.be.a('string')
        })
    })

    describe('Version validation', function() {
        it('Should be a valid version of Ableton Live', function() {
            const minVersion = 10101
            const maxVersion = 13101
            const versionInt = parseInt(result.version.replace(/\./g, ''))

            expect(result).to.have.property('version')
            expect(versionInt).to.be.above(minVersion)
            expect(versionInt).to.be.below(maxVersion)
        })
    })

    describe('Root Note Conversion', function() {
        it('Should converts Root Note to its corresponding letter', function() {
            expect(result).to.have.property('scale')
            expect(result.scale).to.be.a('String')
            expect(result.scale).to.match(/^[A-G](#\/[A-G]b)?/)
        })
    })

    describe('InKey validation', function() {
        it('Should be a boolean', function() {
            expect(result).to.have.property('inKey')
            expect(result.inKey).to.be.a('boolean')
        })
    })

    describe('Time Signature validation', function() {
        it('Should be a valid Time Signature', function() {
            expect(result).to.have.property('timeSignature')
            expect(result.timeSignature).to.be.a('string')
            expect(result.timeSignature.length).to.be.above(2)
            expect(result.timeSignature.length).to.be.below(6)
            expect(result.timeSignature).to.include("/")            
        })
    })

    describe('Time Selection validation', function() {
        it('Should be a valid Time Selection', function() {
            expect(result).to.have.property('timeSelection')
            expect(result.timeSelection).to.be.a('number')
            expect(result.timeSelection).to.be.above(-1)
        })
    })

    describe('Tempo validation', function() {
        it('Should be a valid tempo', function() {
            expect(result).to.have.property('tempo')
            expect(result.tempo).to.be.a('number')
            expect(result.tempo).to.be.above(19)
            expect(result.tempo).to.be.below(1000)
        })
    })

    describe('Tracks validation', function() {
        it('Should be a valid number of tracks', function() {
            expect(result).to.have.property('tracks')
            expect(result.tracks).to.be.a('number')
            expect(result.tracks).to.be.above(-1)
        })
    })

    describe('Return tracks validation', function() {
        it('Should be a valid number of return tracks', function() {
            expect(result).to.have.property('returnTracks')
            expect(result.returnTracks).to.be.a('number')
            expect(result.returnTracks).to.be.above(-1)
        })
    })
})