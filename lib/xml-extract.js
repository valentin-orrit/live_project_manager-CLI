import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import { XMLParser } from "fast-xml-parser"
import { findXMLFiles } from './xml-utils.js'
import { log } from './logger.js'

export function xmlExtract() {
    return new Promise((resolve, reject) => {
        const directoryPath = process.argv[3]

        function parseXMLFile(xmlFilePath) {
            try {
                const xmlFile = fs.readFileSync(xmlFilePath, 'utf-8')
                const options = {
                    ignoreAttributes: false,
                    ignoreDeclaration: true,
                    ignorePiTags: true,
                }
                const parser = new XMLParser(options)
                const output = parser.parse(xmlFile)
                const ableton = output.Ableton.LiveSet

                const result = {
                    filePath: xmlFilePath,
                    name: path.basename(xmlFilePath),
                    version: output.Ableton['@_Creator'],
                    scale: ableton.ScaleInformation,
                    inKey: ableton.InKey,
                    timeSelection: ableton.TimeSelection.AnchorTime,
                    tempo: ableton.MasterTrack.DeviceChain.Mixer.Tempo.Manual,
                    tracks: ableton.Tracks.MidiTrack.length + ableton.Tracks.AudioTrack.length,
                    returnTracks: ableton.Tracks.ReturnTrack.length,
                    groove: ableton.GroovePool.Grooves,
                }

                log(`Parsed ${xmlFilePath}`)
                return result
            } catch (err) {
                console.error(chalk.red(`Failed to parse the file: ${xmlFilePath}`), err)
                return null
            }
        }

        if (!fs.existsSync(directoryPath)) {
            reject(new Error(`The path ${directoryPath} does not exist.`))
            return
        }

        const stats = fs.statSync(directoryPath)
        if (!stats.isDirectory()) {
            reject(new Error(`${directoryPath} is not a directory.`))
            return
        }

        const xmlFiles = findXMLFiles(directoryPath)

        if (xmlFiles.length === 0) {
            console.log(chalk.yellow(`No XML files found in directory: ${directoryPath}`))
            resolve([])
            return
        }

        const results = xmlFiles.map(parseXMLFile).filter(result => result !== null)
        resolve(results)
    })
}