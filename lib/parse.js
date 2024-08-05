import { xmlValidate } from "./xml-validate.js"
import { xmlExtract } from "./xml-extract.js"
import { initDB, saveToDB, getFromDB } from "./database.js"
import chalk from 'chalk'

export async function parse() {
    try {
        await initDB()
        await xmlValidate()

        const results = await xmlExtract()        
        const existingData = await getFromDB()        
        const combinedResults = [...existingData, ...results]
        
        await saveToDB(combinedResults)
        
        return combinedResults
    } catch (error) {
        console.error(chalk.red('Error during parsing or saving to database:'), error)
        throw error
    }
}