import { xmlValidate } from "./xml-validate.js"
import { xmlExtract } from "./xml-extract.js"
import { initDB, saveToDB } from "./database.js"
import chalk from 'chalk'

export async function parse() {
    try {
        await initDB()
        await xmlValidate()
        const results = await xmlExtract()
        await saveToDB(results)
        console.log(chalk.green('Parsing completed. Results saved to database.'))
        return results
    } catch (error) {
        console.error(chalk.red('Error during parsing or saving to database:'), error)
        throw error
    }
}
