import * as fs from 'fs'
import * as path from 'path'
import { XMLParser } from "fast-xml-parser"
import { xmlValidate } from "./xml-validate.js"

const xmlFilePath = process.argv[2]

export function parse(xml) {
    // return xmlValidate()

    function extract(xml) {
        const xmlFile = fs.readFileSync(xml, 'utf-8')

        const options = {
            ignoreAttributes: false
        }

        const parser = new XMLParser(options)
        const json = parser.parse(xmlFile)

        console.log(`First Track:`, json.Ableton.LiveSet.Tracks.MidiTrack)
    }

    extract(xml)
}

parse(xmlFilePath)
